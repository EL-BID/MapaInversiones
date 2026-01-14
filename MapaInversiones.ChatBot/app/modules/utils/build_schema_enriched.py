from pathlib import Path
from sqlalchemy import text, create_engine
import json
from modules.config import settings

# Conexión a la base de datos
ENGINE = create_engine(settings.postgres_conn_string)
OUT = Path(__file__).resolve().parents[2] / "database" / "schema_enriched.json"

"""
This script:
- Builds an enriched database schema by querying metadata from the PostgreSQL database.
- Extracts tables, columns, foreign keys, primary keys, and sample values.
- Saves the enriched schema as a JSON file.
- Also generates and exports three views of the schema: GLOBAL, MINIMAL, and INTERMEDIATE.
- Creates an alias guide for tables and a column-to-tables index for shared columns.
- Provides utilities to trim sample values for brevity.
"""


def _trim_samples(raw, max_items=2):
    """
    Devuelve los primeros `max_items` valores de una muestra de datos.
    """
    if raw is None:
        return raw
    if isinstance(raw, list):
        return raw[:max_items]
    parts = [p.strip() for p in str(raw).split(",")]
    return ", ".join(parts[:max_items])


def build_enriched():
    """
    Genera el esquema enriquecido completo y lo escribe en schema_enriched.json.
    """
    schema: dict[str, dict] = {}

    with ENGINE.begin() as conn:
        # 1) Obtener tablas válidas
        tables = (
            conn.execute(
                text(
                    """
            SELECT table_name,
                   table_description,
                   table_recordcount
              FROM sch_tables
             WHERE is_valid
        """
                )
            )
            .mappings()
            .all()
        )

        for t in tables:
            tbl = t["table_name"]

            # 2) Columnas de la tabla
            cols = (
                conn.execute(
                    text(
                        """
                SELECT column_name,
                       column_type,
                       column_description,
                       samples,
                       is_catalogue
                  FROM sch_columns
                 WHERE table_name = :tbl
                   AND is_valid AND is_searchable
            """
                    ),
                    {"tbl": tbl},
                )
                .mappings()
                .all()
            )

            # 3) Relaciones foráneas
            fks = (
                conn.execute(
                    text(
                        """
                SELECT target_table, source_column, target_column
                  FROM sch_relations
                 WHERE source_table = :tbl
            """
                    ),
                    {"tbl": tbl},
                )
                .mappings()
                .all()
            )

            # 4) Valores de muestra para atributos de catálogo
            values = (
                conn.execute(
                    text(
                        """
                SELECT column_name,
                       array_agg(unique_value ORDER BY unique_value)
                         FILTER (WHERE row_number <= 3) AS top_values
                  FROM (
                        SELECT column_name,
                               unique_value,
                               ROW_NUMBER() OVER (
                                 PARTITION BY column_name
                                 ORDER BY unique_value
                               ) AS row_number
                          FROM sch_values
                         WHERE table_name = :tbl
                           AND is_valid
                       ) subq
                 GROUP BY column_name
            """
                    ),
                    {"tbl": tbl},
                )
                .mappings()
                .all()
            )
            top_map = {
                v["column_name"]: v["top_values"][:2]
                for v in values
                if v.get("top_values")
            }

            # 5) Claves primarias (posiblemente compuestas)
            pk_cols = (
                conn.execute(
                    text(
                        """
                SELECT kcu.column_name
                  FROM information_schema.table_constraints tc
                  JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                   AND tc.table_schema = kcu.table_schema
                 WHERE tc.constraint_type = 'PRIMARY KEY'
                   AND tc.table_name = :tbl
            """
                    ),
                    {"tbl": tbl},
                )
                .scalars()
                .all()
            )

            # Construcción de metadatos de la tabla
            schema[tbl] = {
                "table_name": tbl,
                "description": t.get("table_description"),
                "recordcount": t.get("table_recordcount"),
                "primary_key": pk_cols,
                "columns": {
                    c["column_name"]: {
                        "type": c.get("column_type"),
                        "description": c.get("column_description"),
                        "sample_values": _trim_samples(
                            top_map.get(c["column_name"], c.get("samples"))
                        ),
                        "is_catalogue": c.get("is_catalogue"),
                    }
                    for c in cols
                },
                "foreign_keys": [
                    {
                        "column": fk.get("source_column"),
                        "referred_table": fk.get("target_table"),
                        "referred_column": fk.get("target_column"),
                    }
                    for fk in fks
                ],
            }

    # Guardar JSON enriquecido completo
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(schema, ensure_ascii=False, indent=2), encoding="utf-8")
    return OUT


# Si se ejecuta como script, construir el esquema
if __name__ == "__main__":
    path = build_enriched()
    print(f"Enriched schema written to {path}")


# ───────────────────────────────────────────────────────────────────────
# A continuación, derivamos y exportamos tres vistas del esquema para
# su uso en la generación de skeletons y de consultas SQL.
# ───────────────────────────────────────────────────────────────────────

# Cargar la versión completa del esquema enriquecido
_full_schema: dict[str, dict]
with open(OUT, encoding="utf-8") as f:
    _full_schema = json.load(f)

# 1) GLOBAL: cadena JSON completa
SCHEMA_JSON_GLOBAL = json.dumps(_full_schema, ensure_ascii=False)

# 2) MINIMAL: solo nombres de tabla, columnas, FKs y PKs
minimal_schema: dict[str, dict] = {}
for tbl, meta in _full_schema.items():
    minimal_schema[tbl.lower()] = {
        "table_name": tbl,
        "columns": list(meta.get("columns", {}).keys()),
        "foreign_keys": meta.get("foreign_keys", []),
        "primary_key": meta.get("primary_key", []),
    }
SCHEMA_MINIMAL_JSON = json.dumps(minimal_schema, ensure_ascii=False)

# 3) INTERMEDIATE: descripción corta y ejemplos de valores


def _trim(val, max_len=None):
    if val is None:
        return None
    if isinstance(val, list):
        return val[:2]
    s = str(val)
    return s[:max_len] + "…" if max_len and len(s) > max_len else s


INTERMEDIATE_SCHEMA: dict[str, dict] = {}
for tbl, meta in _full_schema.items():
    key = tbl.lower()
    INTERMEDIATE_SCHEMA[key] = {
        "table_name": key,
        "description": _trim(meta.get("description"), max_len=80),
        "columns": [
            {
                "name": col.lower(),
                "description": _trim(col_meta.get("description"), max_len=60),
                "sample_values": _trim(col_meta.get("sample_values")),
            }
            for col, col_meta in meta.get("columns", {}).items()
        ],
        "foreign_keys": meta.get("foreign_keys", []),
    }

INTERMEDIATE_SCHEMA_JSON = json.dumps(INTERMEDIATE_SCHEMA, ensure_ascii=False)


# ───────────────────────────────────────────────────────────────────────
# 3‑bis) ALIAS GUIDE: tabla -> alias único y estable
#         (generado automáticamente sin hard‑codeos)
# ───────────────────────────────────────────────────────────────────────
def _generate_alias_guide(tables: list[str]) -> dict[str, str]:
    """
    Genera un alias corto (1‑2 letras) para cada tabla garantizando unicidad.
    Reglas:
    1.  Se elimina el prefijo común  'stg_mapainv_'  y  'public.'  si existe.
    2.  Se toma la primera letra del nombre “limpio”.
    3.  Si ya está usada, se añade progresivamente la siguiente letra
        hasta lograr unicidad.  Ej.: p, pr, pr1 …
    4.  Los alias son *case‑insensitive*; se devuelven en minúsculas.
    """
    guide: dict[str, str] = {}
    used: set[str] = set()

    for tbl in sorted(tables):  # orden determinista
        base = tbl.lower()
        for pref in ("stg_mapainv_", "public."):
            if base.startswith(pref):
                base = base[len(pref) :]

        # estrategia incremental
        alias = base[0]
        idx = 1
        while alias in used and idx < len(base):
            alias = base[: idx + 1]
            idx += 1

        # si aún colisiona, agrega sufijo numérico
        if alias in used:
            suf = 1
            while f"{alias}{suf}" in used:
                suf += 1
            alias = f"{alias}{suf}"

        guide[tbl] = alias.lower()
        used.add(alias.lower())

    return guide


ALIAS_GUIDE: dict[str, str] = _generate_alias_guide(list(_full_schema.keys()))
ALIAS_GUIDE_JSON = json.dumps(ALIAS_GUIDE, ensure_ascii=False)

# 4) COLUMN‑INDEX: mapa columna → tablas y conjunto de columnas compartidas
# Se construye sólo una vez al importar el módulo y queda disponible
# para utilidades como validación de skeletons o corrección de alias.
from collections import defaultdict

_c2t_tmp = defaultdict(set)  # columna -> {tabla1, tabla2, ...}
for tbl, meta in _full_schema.items():
    for col in meta.get("columns", {}):
        _c2t_tmp[col.lower()].add(tbl.lower())

COLUMN_TO_TABLES: dict[str, set[str]] = {k: set(v) for k, v in _c2t_tmp.items()}
SHARED_COLUMNS: set[str] = {c for c, tbls in COLUMN_TO_TABLES.items() if len(tbls) > 1}

# Exportar estas constantes
__all__ = [
    "build_enriched",
    "SCHEMA_JSON_GLOBAL",
    "SCHEMA_MINIMAL_JSON",
    "INTERMEDIATE_SCHEMA_JSON",
    "COLUMN_TO_TABLES",
    "SHARED_COLUMNS",
    "ALIAS_GUIDE",
    "ALIAS_GUIDE_JSON",
]
# ───────────────────────────────────────────────────────────────────────
# Fin de la construcción del esquema enriquecido y sus vistas.
# ───────────────────────────────────────────────────────────────────────
