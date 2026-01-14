# helpers_sql.py
"""
Funciones de construcción y manipulación de SQL.

Incluye:
- Construcción de cláusulas WHERE
- Aplicación de filtros
- Validación de SQL
- Scoring de queries
- Regeneración con keywords

Todas las funciones operan sobre strings SQL o usan db para validación.
"""

from __future__ import annotations

import json
import re
import unicodedata
from contextlib import contextmanager
from typing import Any, Dict, List, Optional, Sequence, Set, Tuple

import psycopg2
from loguru import logger
from sqlalchemy import text

from modules.config import settings
from modules.utils.db_utils import prepare_sql_for_execution, execute_sql_query

# Imports locales de otros helpers
from modules.graph.helpers_texto import (
    FILTER_CONFIDENCE_THRESHOLD,
    MAX_THEME_KEYWORDS_PROMPT,
    STOPWORDS,
    _normalize_column_name,
    _normalize_text,
    _is_viable_text_token,
    _is_stoplisted_token,
    _should_use_token_exists,
    _tokens_from_phrase,
    _sanitize_keyword_tokens,
    _extract_first_json_block,
)
from modules.graph.helpers_estado import (
    _get_sql_query,
    _get_analysis_filters,
    _get_analysis_tables_list,
    _set_analysis_modules,
    _get_dimensions_catalog,
    _init_keyword_regeneration,
)
from modules.graph.state import AgentState
from modules.utils.llm_guardrails import invoke_llm_chain

# ═══════════════════════════════════════════════════════════════════════════
# Configuración desde settings
# ═══════════════════════════════════════════════════════════════════════════

REASONING_SEED = getattr(settings, "reasoning_seed", None)
REASONING_EFFORT_SQL = getattr(settings, "reasoning_effort_sql", "high")
REASONING_VERBOSITY_SQL = getattr(settings, "reasoning_verbosity_sql", "low")
REASONING_EFFORT_TEXT = getattr(settings, "reasoning_effort_text", "medium")
REASONING_VERBOSITY_TEXT = getattr(settings, "reasoning_verbosity_text", "medium")

# ═══════════════════════════════════════════════════════════════════════════
# Constantes SQL
# ═══════════════════════════════════════════════════════════════════════════

BASE_PROJECT_TABLE = "stg_mapainv_proyectosaprobadosinv"
TERRITORIAL_TABLES = {"stg_mapainv_proyectosterritorios"}
FUNDING_TABLES = {"stg_mapainv_proyectosfuentesfinanciamiento"}

SQL_RESERVED_KEYWORDS = {
    "SELECT",
    "FROM",
    "WHERE",
    "GROUP",
    "ORDER",
    "LIMIT",
    "JOIN",
    "INNER",
    "LEFT",
    "RIGHT",
    "FULL",
    "CROSS",
    "ON",
    "UNION",
    "INTERSECT",
    "EXCEPT",
    "OFFSET",
}

# Scoring constants
SCORE_OK_ROWS = 90  # ≥1 fila
SCORE_ZERO_ROWS = 85  # 0 filas (penalización leve)
SCORE_EXPLAIN_FAILED = -1  # EXPLAIN falló
COST_PENALTY_FACTOR = 5.0
MAX_COST_PENALTY = 20
TERRITORIAL_PENALTY = 150
PREVIEW_ENABLED = True
ROWS_PREVIEW = 3

# Regex para detectar literales
_LITERAL_PROCESS_TEXT_RE = re.compile(
    r"process_text\((?P<expr>[^)]+)\)\s*(?P<op>=|ILIKE)\s*(?:'%'\s*\|\|\s*)?process_text\('(?P<value>[^']+)'\)(?:\s*\|\|\s*'%')?",
    flags=re.IGNORECASE,
)
_EXCLUDED_LITERAL_COLUMNS = (
    "pais_",
    "estado_",
    "categoria",
    "clasificacion",
    "clasificación",
    "estatus",
    "fase",
    "anio",
    "año",
    "fecha",
    "mes",
    "dia",
    "ciclo",
    "etapa",
    "tipo_",
    "id_",
    "codigo",
    "código",
)
_ALLOWED_LITERAL_PREFIXES = ("p.", "t.")

SATISFIES_FILTER_PATTERN = re.compile(
    r"/\*\s*satisfies_filter:(.*?)\*/", re.IGNORECASE | re.DOTALL
)


# ═══════════════════════════════════════════════════════════════════════════
# Context Managers
# ═══════════════════════════════════════════════════════════════════════════


@contextmanager
def safe_session(db):
    """Context manager que garantiza rollback automático ante errores."""
    try:
        yield
    except Exception:
        db.rollback()
        raise
    else:
        db.rollback()


# ═══════════════════════════════════════════════════════════════════════════
# Cláusulas WHERE
# ═══════════════════════════════════════════════════════════════════════════

# Keywords que delimitan el fin del WHERE clause
_CLAUSE_BOUNDARY_KEYWORDS = [
    "GROUP BY",
    "ORDER BY",
    "LIMIT",
    "OFFSET",
    "FETCH",
    "RETURNING",
    "WINDOW",
    "UNION",
    "INTERSECT",
    "EXCEPT",
]


def _find_clause_boundary(sql: str, start: int = 0) -> int:
    """
    Encuentra límite de cláusula (ORDER BY, LIMIT, etc.) al nivel 0 de paréntesis.

    Esta función respeta la anidación de paréntesis para evitar matchear keywords
    dentro de subqueries, funciones WINDOW (OVER), o expresiones EXISTS.

    Args:
        sql: Query SQL completa
        start: Posición desde donde comenzar la búsqueda

    Returns:
        Posición del primer keyword de límite encontrado al nivel 0,
        o len(sql) si no se encuentra ninguno.
    """
    paren_depth = 0
    i = start
    sql_upper = sql.upper()
    n = len(sql)

    while i < n:
        char = sql[i]

        # Manejar strings literales (saltar contenido entre comillas)
        # PostgreSQL usa '' para escapar comillas dentro de strings
        if char == "'":
            i += 1
            while i < n:
                if sql[i] == "'":
                    # Verificar si es quote escapado ''
                    if i + 1 < n and sql[i + 1] == "'":
                        i += 2  # Saltar ambas comillas del escape
                    else:
                        break  # Fin del string
                else:
                    i += 1
            i += 1  # Saltar comilla de cierre
            continue

        if char == "(":
            paren_depth += 1
            i += 1
        elif char == ")":
            paren_depth = max(0, paren_depth - 1)
            i += 1
        elif paren_depth == 0:
            # Solo buscar keywords cuando estamos fuera de paréntesis
            remaining = sql_upper[i:]
            for kw in _CLAUSE_BOUNDARY_KEYWORDS:
                if remaining.startswith(kw):
                    # Verificar que hay whitespace antes (o estamos al inicio)
                    if i == 0 or sql[i - 1] in " \t\n\r":
                        # Verificar que hay whitespace o paréntesis después del keyword
                        after_pos = i + len(kw)
                        if after_pos >= n or sql[after_pos] in " \t\n\r(":
                            return i
            i += 1
        else:
            i += 1

    return n


def _append_where_condition(sql: str, condition: str) -> str:
    """Añade una condición WHERE/AND a una SQL existente."""
    if not sql or not condition:
        return sql
    sql_upper = sql.upper()
    where_pos = sql_upper.find(" WHERE ")

    # Buscar también WHERE con newline antes (común en SQL multilinea del LLM)
    if where_pos == -1:
        # Probar con diferentes tipos de whitespace antes de WHERE
        for ws in ["\nWHERE ", "\rWHERE ", "\tWHERE "]:
            pos = sql_upper.find(ws)
            if pos != -1:
                where_pos = pos
                break

    if where_pos == -1:
        insert_pos = _find_clause_boundary(sql, 0)
        before = sql[:insert_pos].rstrip()
        after = sql[insert_pos:].lstrip()
        if before:
            new_sql = f"{before} WHERE ({condition})"
        else:
            new_sql = f"WHERE ({condition})"
        if after:
            new_sql = f"{new_sql} {after}"
        return new_sql

    insert_pos = _find_clause_boundary(sql, where_pos + 1)
    before = sql[:insert_pos].rstrip()
    after = sql[insert_pos:].lstrip()
    new_sql = f"{before} AND ({condition})"
    if after:
        new_sql = f"{new_sql} {after}"
    return new_sql


# ═══════════════════════════════════════════════════════════════════════════
# Filtros Refinados
# ═══════════════════════════════════════════════════════════════════════════


def _apply_refined_filters_to_sql(
    sql: str,
    filters: Sequence[Dict[str, Any]],
    applied_ids: Set[str] | None = None,
    *,
    skip_columns: Optional[Set[str]] = None,
) -> Tuple[str, List[str]]:
    """Aplica filtros refinados a una SQL."""
    if not sql or not filters:
        return sql, []
    applied_ids = applied_ids or set()
    normalized_skip = {
        (_normalize_column_name(col) if isinstance(col, str) else None)
        for col in (skip_columns or set())
    }
    normalized_skip.discard(None)
    augmented_sql = sql
    applied_now: List[str] = []
    sql_lower = augmented_sql.lower()

    for item in filters:
        filter_id = item.get("filter_id")
        if not filter_id or filter_id in applied_ids:
            continue

        column = item.get("column")
        if not column:
            continue
        column_norm = _normalize_column_name(str(column))
        if normalized_skip and column_norm in normalized_skip:
            logger.info(
                "\n\n ---> SQL ▸ APPLY refined_filter skipped_by_catalog column={} filter_id={}",
                column,
                filter_id,
            )
            continue

        exists_clauses: List[str] = []
        if _should_use_token_exists(item):
            for token in item.get("primary_tokens") or []:
                token = str(token).strip().lower()
                if not token or not _is_viable_text_token(token):
                    continue
                safe_token = token.replace("'", "''")

                # REGLA SNIP/ID: Si la columna es un ID o código, usar igualdad estricta
                col_lower = column.lower()
                is_id_column = (
                    "id_" in col_lower or "codigo" in col_lower or "snip" in col_lower
                )

                if is_id_column:
                    # Igualdad estricta para IDs/Códigos (sin process_text)
                    clause = f"{column} = '{safe_token}'"
                else:
                    # Lógica default: ILIKE con process_text
                    clause = f"process_text({column}) ILIKE '%' || process_text('{safe_token}') || '%'"

                if clause.lower() not in sql_lower:
                    exists_clauses.append(clause)

        acronym_clauses: List[str] = []
        if item.get("include_acronyms"):
            for acr in item.get("acronyms") or []:
                acr = str(acr).strip().lower()
                if not acr:
                    continue
                safe_acr = acr.replace("'", "''")
                clause = f"process_text({column}) ILIKE '%' || process_text('{safe_acr}') || '%'"
                if clause.lower() not in sql_lower:
                    acronym_clauses.append(clause)

        if not exists_clauses and not acronym_clauses:
            continue

        if exists_clauses:
            exists_condition = (
                " AND ".join(exists_clauses)
                if len(exists_clauses) > 1
                else exists_clauses[0]
            )
        else:
            exists_condition = ""

        if acronym_clauses:
            acronym_condition = (
                " OR ".join(acronym_clauses)
                if len(acronym_clauses) > 1
                else acronym_clauses[0]
            )
        else:
            acronym_condition = ""

        if exists_condition and acronym_condition:
            final_condition = f"(({exists_condition}) OR ({acronym_condition}))"
        elif exists_condition:
            final_condition = exists_condition
        else:
            final_condition = acronym_condition

        new_sql = _append_where_condition(augmented_sql, final_condition)
        if new_sql != augmented_sql:
            augmented_sql = new_sql
            sql_lower = augmented_sql.lower()
            applied_now.append(filter_id)
            logger.info(
                f"\n\n ---> SQL ▸ APPLY refined_filter id={filter_id} column={column}"
            )

    return augmented_sql, applied_now


def _apply_catalog_equals_to_sql(
    sql: str,
    suggestions: Sequence[dict[str, Any]],
    relaxed_columns: set[str] | None = None,
    enforce_existing_columns: bool = False,
) -> tuple[str, set[str]]:
    """Aplica filtros de catálogo con igualdad exacta."""
    if not sql or not suggestions:
        return sql, set()

    relaxed = relaxed_columns or set()
    augmented_sql = sql
    applied_now: set[str] = set()
    valid_cols = None
    if enforce_existing_columns:
        valid_cols = _parse_columns_from_sql(sql)

    for item in suggestions:
        column = item.get("column")
        value = item.get("value")
        if not column or not value:
            continue

        normalized = _normalize_column_name(column)
        if normalized in relaxed:
            continue

        if enforce_existing_columns and valid_cols is not None:
            col_norm = column.lower()
            if col_norm not in valid_cols and not any(
                col_norm.endswith(f".{vc}") for vc in valid_cols
            ):
                logger.debug(
                    "SQL ▸ catalog_equals skip column_not_found col={}", column
                )
                continue

        safe_value = str(value).replace("'", "''")
        clause = f"UPPER(TRIM({column})) = UPPER(TRIM('{safe_value}'))"
        normalized_key = f"{normalized}={safe_value.lower()}"

        if normalized_key in applied_now:
            continue

        if clause.lower() in augmented_sql.lower():
            continue

        augmented_sql = _append_where_condition(augmented_sql, clause)
        applied_now.add(normalized_key)

    return augmented_sql, applied_now


def _apply_structured_text_filters(
    sql: str,
    filters: Sequence[Dict[str, str]],
    enforce_existing_columns: bool = False,
) -> str:
    """Aplica filtros de texto estructurado a la SQL."""
    if not sql or not filters:
        return sql
    augmented = sql
    sql_lower = augmented.lower()
    valid_cols = None
    if enforce_existing_columns:
        valid_cols = _parse_columns_from_sql(sql)
    for item in filters:
        column = item.get("column")
        value = item.get("value")
        if not column or not value:
            continue
        if enforce_existing_columns and valid_cols is not None:
            col_norm = column.lower()
            if col_norm not in valid_cols and not any(
                col_norm.endswith(f".{vc}") for vc in valid_cols
            ):
                logger.debug(
                    "SQL ▸ structured_filter skip column_not_found col={}", column
                )
                continue
        safe_value = value.replace("'", "''")
        clause = f"UPPER(TRIM({column})) = UPPER(TRIM('{safe_value}'))"
        if clause.lower() in sql_lower:
            continue
        augmented = _append_where_condition(augmented, clause)
        sql_lower = augmented.lower()
        logger.info("SQL ▸ APPLY structured_filter column={} value={}", column, value)
    return augmented


# ═══════════════════════════════════════════════════════════════════════════
# Filtros Faltantes
# ═══════════════════════════════════════════════════════════════════════════


def _extract_marker_value(block: str, key: str) -> str:
    """Extrae valor de un marcador SQL."""
    if not block:
        return ""
    pattern = re.compile(
        rf"{key}\s*=\s*(.*?)(?=\b[a-z_]+\s*=|$)", re.IGNORECASE | re.DOTALL
    )
    match = pattern.search(block)
    if not match:
        return ""
    return match.group(1).strip()


def _collect_satisfied_filter_markers(sql: str) -> list[dict[str, Any]]:
    """Recolecta marcadores de filtros satisfechos en la SQL."""
    if not sql:
        return []

    markers: list[dict[str, Any]] = []
    for block in SATISFIES_FILTER_PATTERN.findall(sql):
        column_raw = _extract_marker_value(block, "column")
        literal_raw = _extract_marker_value(block, "literal")
        normalized_column = _normalize_column_name(column_raw) if column_raw else ""
        if not normalized_column or not literal_raw:
            continue

        from modules.graph.helpers_texto import _normalize_literal_token

        literals = {
            token
            for token in (
                _normalize_literal_token(part)
                for part in re.split(r"[|,]", literal_raw)
            )
            if token
        }
        if literals:
            markers.append({"column": normalized_column, "literals": literals})
    return markers


def _is_filter_marked(
    normalized_column: str,
    literal: str,
    markers: Sequence[Dict[str, Any]],
) -> bool:
    """Verifica si un filtro está marcado como satisfecho."""
    if not normalized_column or not literal or not markers:
        return False
    for entry in markers:
        if entry.get("column") == normalized_column and literal in entry.get(
            "literals", set()
        ):
            return True
    return False


def _find_missing_filters(
    state: AgentState, sql: str
) -> Tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """Encuentra filtros faltantes en la SQL.

    FASE 1 FIX: Si resolved_territories existe, ignoramos la validación de filtros
    territoriales (nombre_departamento, nombre_region, nombre_municipio) porque
    el territorial_resolver ya se encargó de resolver la columna correcta.
    Esto evita REGENERATE innecesarios cuando el SQL Generator usa 1 columna
    específica en lugar de los 3 filtros que el ANALYZER2 genera.

    La validación usa SQL "limpio" (sin wrappers de funciones como UPPER, TRIM, etc.)
    para evitar falsos positivos de REGENERATE.
    """
    analyzer_filters = _get_analysis_filters(state) or []
    if not analyzer_filters:
        return [], []

    from modules.graph.helpers_texto import (
        _extract_search_literal,
        _strip_function_wrappers,
    )

    # FASE 1: Detectar si hay territorios resueltos para skip de validación territorial
    # resolved_territories vive dentro de analysis_obj, no directamente en state
    analysis = state.get("analysis") or {}
    resolved_territories = analysis.get("resolved_territories") or []
    has_resolved_territory = bool(resolved_territories)

    if has_resolved_territory:
        logger.debug(
            "FILTER_VALIDATION ▸ has_resolved_territory=True count={}",
            len(resolved_territories),
        )

    # Columnas territoriales que se omiten de validación si ya hay resolved_territories
    TERRITORIAL_COLUMNS = {
        "nombre_departamento",
        "nombre_region",
        "nombre_municipio",
        "t.nombre_departamento",
        "t.nombre_region",
        "t.nombre_municipio",
    }

    # Normalizar SQL quitando TODAS las funciones wrapper (UPPER, TRIM, LOWER, process_text, etc.)
    # Esto permite comparar columnas sin importar qué funciones use el LLM
    normalized_sql = _strip_function_wrappers(sql.lower())

    satisfied_markers = _collect_satisfied_filter_markers(sql)
    missing_hard: list[dict[str, Any]] = []
    missing_soft: list[dict[str, Any]] = []
    skipped_territorial: list[str] = []

    for entry in analyzer_filters:
        column_raw = entry.get("column")
        value_raw = entry.get("value")
        confidence = entry.get("confidence")
        if not column_raw or value_raw is None:
            continue

        normalized_column = _normalize_column_name(column_raw)

        # FASE 1: Skip validación de filtros territoriales si ya tenemos resolved_territories
        # El territorial_resolver ya resolvió la columna correcta, no necesitamos validar
        # los 3 filtros que el ANALYZER2 genera (solo 1 se usa en el SQL final)
        col_simple = normalized_column.split(".")[-1]
        if has_resolved_territory and col_simple in TERRITORIAL_COLUMNS:
            skipped_territorial.append(f"{normalized_column}={value_raw}")
            continue

        literal = _extract_search_literal(value_raw).lower()
        if not literal:
            continue

        if _is_filter_marked(normalized_column, literal, satisfied_markers):
            continue

        # Buscar la columna en el SQL limpio (sin funciones wrapper)
        # Solo necesitamos verificar que la columna aparezca con un operador
        patterns = [
            f"{normalized_column} =",
            f"{normalized_column} <=",
            f"{normalized_column} >=",
            f"{normalized_column} <",
            f"{normalized_column} >",
            f"{normalized_column} between",
            f"{normalized_column} ilike",
            f"{normalized_column} like",
            f"{normalized_column} in",
            # También columna sin alias
            f"{col_simple} =",
            f"{col_simple} <=",
            f"{col_simple} >=",
            f"{col_simple} <",
            f"{col_simple} >",
            f"{col_simple} between",
            f"{col_simple} ilike",
            f"{col_simple} like",
            f"{col_simple} in",
            # ILIKE con process_text (patrón correcto)
            f"process_text({normalized_column}) ilike",
            f"process_text({col_simple}) ilike",
        ]
        present = any(pattern in normalized_sql for pattern in patterns)
        if present:
            continue

        target_list = (
            missing_hard
            if (confidence or 0) >= FILTER_CONFIDENCE_THRESHOLD
            else missing_soft
        )
        target_list.append(entry)

    # FASE 1: Log de filtros territoriales omitidos
    if skipped_territorial:
        logger.info(
            "FILTER_VALIDATION ▸ skipped_territorial_filters={} (resolved_territories exists)",
            skipped_territorial,
        )

    return missing_hard, missing_soft


def _has_only_catalog_filters(filters: Sequence[Dict[str, Any]]) -> bool:
    """Verifica si solo hay filtros de catálogo."""
    catalog_columns = {
        "nombresector_proyecto",
        "nombreentidadejecutora_proyecto",
        "estado_proyecto",
    }
    processed = set()
    for flt in filters or []:
        column = flt.get("column")
        if not column:
            continue
        normalized = _normalize_column_name(column)
        processed.add(normalized)
        if normalized not in catalog_columns:
            return False
    return bool(processed)


# ═══════════════════════════════════════════════════════════════════════════
# Filtrado de Schema
# ═══════════════════════════════════════════════════════════════════════════


def _filter_schema_json(schema_json_str: str, tables_to_keep: set[str]) -> str:
    """Filtra el schema JSON para mantener solo ciertas tablas."""
    try:
        data = json.loads(schema_json_str)
    except json.JSONDecodeError:
        return schema_json_str

    lower_tables = {t.lower() for t in tables_to_keep}
    filtered = {k: v for k, v in data.items() if k.lower() in lower_tables}
    if not filtered:
        filtered = {k: v for k, v in data.items() if k.lower() == BASE_PROJECT_TABLE}
        if not filtered:
            return schema_json_str

    return json.dumps(filtered, ensure_ascii=False)


def _filter_schema_json_by_columns(
    schema_json_str: str,
    tables_to_keep: set[str],
    columns_to_keep: set[str] | None = None,
) -> tuple[str, dict[str, list[str]]]:
    """
    Filtra el schema JSON para mantener solo ciertas tablas Y columnas específicas.

    Args:
        schema_json_str: JSON string del schema completo
        tables_to_keep: Set de nombres de tablas a mantener
        columns_to_keep: Set de nombres de columnas a mantener (opcional)

    Returns:
        Tuple de (schema_json_filtrado, dict con columnas encontradas por tabla)
    """
    try:
        data = json.loads(schema_json_str)
    except json.JSONDecodeError:
        return schema_json_str, {}

    lower_tables = {t.lower() for t in tables_to_keep}
    lower_columns = {c.lower().split(".")[-1] for c in (columns_to_keep or set())}

    filtered: dict = {}
    columns_found: dict[str, list[str]] = {}

    for table_name, table_meta in data.items():
        if table_name.lower() not in lower_tables:
            continue

        # Copiar metadatos de la tabla
        filtered_table = {
            "table_name": table_meta.get("table_name", table_name),
            "description": table_meta.get("description"),
            "primary_key": table_meta.get("primary_key", []),
            "foreign_keys": table_meta.get("foreign_keys", []),
        }

        # Filtrar columnas si se especificaron
        original_columns = table_meta.get("columns", {})
        if columns_to_keep and lower_columns:
            # Solo mantener las columnas especificadas
            filtered_columns = {}
            matched_cols = []
            for col_name, col_meta in original_columns.items():
                if col_name.lower() in lower_columns:
                    filtered_columns[col_name] = col_meta
                    matched_cols.append(col_name)

            # Si no encontramos ninguna columna específica, mantener todas
            if filtered_columns:
                filtered_table["columns"] = filtered_columns
                columns_found[table_name] = matched_cols
            else:
                filtered_table["columns"] = original_columns
                columns_found[table_name] = list(original_columns.keys())
        else:
            filtered_table["columns"] = original_columns
            columns_found[table_name] = list(original_columns.keys())

        filtered[table_name] = filtered_table

    if not filtered:
        # Fallback a tabla base
        for table_name, table_meta in data.items():
            if table_name.lower() == BASE_PROJECT_TABLE:
                filtered[table_name] = table_meta
                columns_found[table_name] = list(table_meta.get("columns", {}).keys())
                break
        if not filtered:
            return schema_json_str, {}

    return json.dumps(filtered, ensure_ascii=False), columns_found


def _prune_analyzer_filters(filters: Sequence[Dict[str, Any]]) -> list[Dict[str, Any]]:
    """Elimina filtros con columnas no válidas."""
    if not filters:
        return []

    from modules.graph.helpers_texto import _get_schema_column_names

    allowed_columns = _get_schema_column_names()
    cleaned: list[Dict[str, Any]] = []
    for entry in filters:
        column = _normalize_column_name(entry.get("column")) if entry else ""
        value = entry.get("value") if isinstance(entry, dict) else None
        if not column or value is None or str(value).strip() == "":
            continue
        if allowed_columns and column not in allowed_columns:
            continue
        cleaned.append(entry)
    return cleaned


# ═══════════════════════════════════════════════════════════════════════════
# Módulos y Tablas
# ═══════════════════════════════════════════════════════════════════════════


def _derive_modules_from_analyzer(state: AgentState, tables: list[str] | None = None):
    """Deriva módulos (territory, funding) desde las tablas del analyzer."""
    if tables is None:
        source_tables = _get_analysis_tables_list(state)
    else:
        source_tables = tables

    normalized_tables = {str(t).lower() for t in (source_tables or [])}
    requires_territory = "stg_mapainv_proyectosterritorios" in normalized_tables
    requires_funding = "stg_mapainv_proyectosfuentesfinanciamiento" in normalized_tables

    _set_analysis_modules(
        state,
        territory=requires_territory,
        funding=requires_funding,
    )

    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT modules (derived) territorial={} funding={} tables={}",
        requires_territory,
        requires_funding,
        sorted(normalized_tables),
    )


def _classify_filters_by_table(state: AgentState) -> Dict[str, List[Dict[str, Any]]]:
    """Clasifica los filtros del analyzer por tabla (p, t, f)."""
    from collections import defaultdict

    by_table: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    analyzer_filters = _get_analysis_filters(state) or []
    if not analyzer_filters:
        return {}

    for flt in analyzer_filters:
        if not isinstance(flt, dict):
            continue
        column = flt.get("column")
        if not column:
            continue
        normalized = _normalize_column_name(column)
        if normalized.startswith("t."):
            by_table.setdefault("t", []).append(flt)
        elif normalized.startswith("f."):
            by_table.setdefault("f", []).append(flt)
        else:
            by_table.setdefault("p", []).append(flt)
    return dict(by_table)


def _extract_base_alias(sql: str) -> str | None:
    """Extrae el alias de la tabla base de una SQL."""
    if not sql:
        return None
    pattern = re.compile(
        r"\bFROM\s+"
        + re.escape(BASE_PROJECT_TABLE)
        + r"\s+(?:AS\s+)?([a-zA-Z_][a-zA-Z0-9_]*)",
        flags=re.IGNORECASE,
    )
    match = pattern.search(sql)
    if match:
        alias = match.group(1)
        if alias and alias.upper() not in SQL_RESERVED_KEYWORDS:
            return alias
    if re.search(
        r"\bFROM\s+" + re.escape(BASE_PROJECT_TABLE) + r"\b", sql, flags=re.IGNORECASE
    ):
        return BASE_PROJECT_TABLE
    return None


def _ensure_country_filter(sql: str, country_code: str) -> str:
    """Asegura que la SQL tenga filtro de país."""
    if not sql or not country_code:
        return sql
    country_code = country_code.upper().strip()
    if re.search(r"\bpais_iso3\b", sql, re.IGNORECASE):
        logger.debug("FLOW ▸ ENSURE_COUNTRY filter_exists")
        return sql
    alias = _extract_base_alias(sql)
    if not alias:
        logger.warning(
            f"No se encontró alias o referencia a {BASE_PROJECT_TABLE} en la consulta"
        )
        return sql
    clause_pattern = re.compile(
        r"\b(GROUP\s+BY|ORDER\s+BY|LIMIT|UNION|INTERSECT|EXCEPT|OFFSET)\b",
        flags=re.IGNORECASE,
    )
    sql_core = sql.strip()
    trailing_semicolon = ""
    if sql_core.endswith(";"):
        sql_core = sql_core[:-1].rstrip()
        trailing_semicolon = ";"
    condition = f"{alias}.pais_iso3 = '{country_code}'"
    where_match = re.search(r"\bWHERE\b", sql_core, flags=re.IGNORECASE)
    if where_match:
        remainder = sql_core[where_match.end() :]
        clause_match = clause_pattern.search(remainder)
        insert_pos = (
            where_match.end() + clause_match.start() if clause_match else len(sql_core)
        )
        before = sql_core[:insert_pos]
        after = sql_core[insert_pos:]
        before_stripped = before.rstrip()
        if re.search(r"\bWHERE\b\s*$", before_stripped, flags=re.IGNORECASE):
            new_before = f"{before_stripped} {condition}"
        elif re.search(r"\b(AND|OR)\s*$", before_stripped, flags=re.IGNORECASE):
            new_before = f"{before_stripped} {condition}"
        else:
            new_before = f"{before_stripped} AND {condition}"
        after_stripped = after.lstrip()
        merged = f"{new_before}"
        if after_stripped:
            merged = f"{merged} {after_stripped}"
        return merged.strip() + trailing_semicolon
    clause_match = clause_pattern.search(sql_core)
    if clause_match:
        insert_pos = clause_match.start()
        before = sql_core[:insert_pos].rstrip()
        after = sql_core[insert_pos:].lstrip()
        new_sql = f"{before} WHERE {condition}"
        if after:
            new_sql = f"{new_sql} {after}"
        return new_sql.strip() + trailing_semicolon
    return f"{sql_core} WHERE {condition}{trailing_semicolon}".strip()


# Tablas que generan multiplicación de filas (1:N con proyectos)
MULTI_ROW_TABLES = TERRITORIAL_TABLES | FUNDING_TABLES


# ═══════════════════════════════════════════════════════════════════════════
# ISO3 Sanitization (Safety Net)
# ═══════════════════════════════════════════════════════════════════════════


def _sanitize_iso_code_sql(sql: str) -> str:
    """
    SAFETY NET:
    Detects and fixes ugly ILIKE/process_text patterns on `pais_iso3`.
    Forces `p.pais_iso3 = 'dom'` logic.

    Target Pattern:
    PROCESS_TEXT(p.pais_iso3) ILIKE '%' || PROCESS_TEXT('value') || '%'

    Replacement:
    p.pais_iso3 = 'value'
    """
    if not sql or "pais_iso3" not in sql:
        return sql

    # Pattern to catch: process_text(alias.pais_iso3) ILIKE ... 'value' ...
    # We look for the value inside the second process_text
    pattern = re.compile(
        r"process_text\s*\(\s*(?:[a-zA-Z0-9_]+\.)?pais_iso3\s*\)\s*ILIKE\s*.*?'%'\s*\|\|\s*process_text\s*\(\s*'(?P<value>[^']+)'\s*\)\s*\|\|\s*'%'.*?",
        re.IGNORECASE | re.DOTALL,
    )

    def replacer(match):
        val = match.group("value")
        return f"p.pais_iso3 = '{val}'"

    sanitized = pattern.sub(replacer, sql)
    return sanitized


def _ensure_distinct_on_multijoin(sql: str) -> str:
    """
    Asegura que el SQL tenga SELECT DISTINCT cuando hay JOINs con tablas
    que pueden multiplicar filas (territorios, financiamiento).

    Evita duplicados en resultados cuando un proyecto tiene múltiples
    territorios o fuentes de financiamiento.

    NO aplica DISTINCT cuando:
    - Ya tiene DISTINCT o DISTINCT ON
    - Tiene funciones de agregación (COUNT, SUM, AVG, etc.) con GROUP BY
    - Es una CTE (WITH ... AS)
    - Tiene subqueries complejas
    - Tiene UNION/INTERSECT/EXCEPT
    """
    if not sql:
        return sql

    sql_upper = sql.upper()
    sql_stripped = sql.strip()

    # 1) Ya tiene DISTINCT o DISTINCT ON → no hacer nada
    if re.search(r"\bSELECT\s+DISTINCT\b", sql_upper):
        logger.debug("FLOW ▸ ENSURE_DISTINCT already_has_distinct")
        return sql

    # 2) Es una CTE (WITH ... AS) → no modificar, es complejo
    if sql_stripped.upper().startswith("WITH"):
        logger.debug("FLOW ▸ ENSURE_DISTINCT skip_cte")
        return sql

    # 3) Tiene UNION/INTERSECT/EXCEPT → no modificar
    if re.search(r"\b(UNION|INTERSECT|EXCEPT)\b", sql_upper):
        logger.debug("FLOW ▸ ENSURE_DISTINCT skip_set_operation")
        return sql

    # 4) Tiene funciones de agregación → no aplicar DISTINCT
    # COUNT, SUM, AVG, etc. ya manejan duplicados internamente
    has_aggregation = re.search(r"\b(COUNT|SUM|AVG|MIN|MAX)\s*\(", sql_upper)
    if has_aggregation:
        logger.debug("FLOW ▸ ENSURE_DISTINCT skip_has_aggregation")
        return sql

    # 5) Verificar si hay JOINs con tablas multi-fila
    sql_lower = sql.lower()
    has_multijoin = any(table.lower() in sql_lower for table in MULTI_ROW_TABLES)

    if not has_multijoin:
        logger.debug("FLOW ▸ ENSURE_DISTINCT no_multijoin_tables")
        return sql

    # 6) Aplicar DISTINCT: reemplazar "SELECT " por "SELECT DISTINCT "
    # Solo al inicio del SQL, evitando subqueries
    pattern = re.compile(r"^(\s*)(SELECT)\s+", re.IGNORECASE)
    match = pattern.match(sql)

    if match:
        prefix = match.group(1) or ""
        new_sql = f"{prefix}SELECT DISTINCT {sql[match.end():]}"
        logger.info(
            "FLOW ▸ ENSURE_DISTINCT applied reason=multijoin_tables " "tables={}",
            [t for t in MULTI_ROW_TABLES if t.lower() in sql_lower],
        )
        return new_sql

    logger.debug("FLOW ▸ ENSURE_DISTINCT no_match")
    return sql


# ═══════════════════════════════════════════════════════════════════════════
# Keyword Regeneration SQL
# ═══════════════════════════════════════════════════════════════════════════


def _build_keyword_regeneration_sql_from_theme(
    original_sql: str,
    country_code: str = "",
    keywords: Sequence[str] | None = None,
    fields: Sequence[str] | None = None,
    allow_funding: bool = False,
    max_fields: int = 3,
    **_: Any,
) -> str:
    """
    Construye SQL con EXISTS para búsqueda de keywords en múltiples campos.
    """
    if not keywords or not original_sql:
        return original_sql

    search_fields = list(fields or [])
    if not allow_funding:
        search_fields = [
            f for f in search_fields if not str(f).strip().lower().startswith("f.")
        ]

    search_fields = search_fields[:max_fields] if max_fields > 0 else search_fields

    if not search_fields:
        search_fields = ["p.nombre_proyecto", "p.objetivo_proyecto"]

    alias = _extract_base_alias(original_sql) or "p"

    normalized_fields = []
    for field in search_fields:
        field_str = str(field).strip()
        if "." in field_str:
            normalized_fields.append(field_str)
        else:
            normalized_fields.append(f"{alias}.{field_str}")

    blocks = []
    max_keywords = MAX_THEME_KEYWORDS_PROMPT

    for token in keywords[:max_keywords]:
        token_clean = token.replace("'", "''")
        keyword_blocks = []
        for field in normalized_fields:
            # Usar ILIKE con process_text en ambos lados
            clause = f"process_text({field}) ILIKE '%' || process_text('{token_clean}') || '%'"
            keyword_blocks.append(clause)

        if keyword_blocks:
            keyword_condition = " OR ".join(
                f"({block.strip()})" for block in keyword_blocks
            )
            blocks.append(f"({keyword_condition})")

    if not blocks:
        return original_sql

    condition = " OR ".join(blocks)
    return _append_where_condition(original_sql, condition)


def _build_fallback_sql(
    country_code: str = "",
    keywords: Sequence[str] | None = None,
    fields: Sequence[str] | None = None,
    limit: int = 10,
    allow_funding: bool = False,
    max_fields: int = 3,
    **_: Any,
) -> str:
    """
    Construye un SQL de fallback simple para búsqueda por keywords.
    """
    if not keywords:
        keywords = []

    search_fields = list(fields or [])
    if not allow_funding:
        search_fields = [
            f for f in search_fields if not str(f).strip().lower().startswith("f.")
        ]

    search_fields = search_fields[:max_fields] if max_fields > 0 else search_fields

    if not search_fields:
        search_fields = ["p.nombre_proyecto", "p.objetivo_proyecto"]

    normalized_fields = []
    for field in search_fields:
        field_str = str(field).strip()
        if "." in field_str:
            normalized_fields.append(field_str)
        else:
            normalized_fields.append(f"p.{field_str}")

    keyword_clauses = []
    for keyword in keywords[:MAX_THEME_KEYWORDS_PROMPT]:
        token = keyword.replace("'", "''")
        field_clauses = []
        for field in normalized_fields:
            clause = (
                f"process_text({field}) ILIKE '%' || process_text('{token}') || '%'"
            )
            field_clauses.append(clause)

        if field_clauses:
            keyword_condition = " OR ".join(f"({clause})" for clause in field_clauses)
            keyword_clauses.append(f"({keyword_condition})")

    if not keyword_clauses:
        sql = f"SELECT DISTINCT p.id_proyecto, p.nombre_proyecto FROM {BASE_PROJECT_TABLE} p"
        if country_code:
            country_code_clean = country_code.upper().strip().replace("'", "''")
            sql += f" WHERE p.pais_iso3 = '{country_code_clean}'"
        sql += f" ORDER BY p.nombre_proyecto LIMIT {limit}"
        return sql

    where_conditions = []
    if country_code:
        country_code_clean = country_code.upper().strip().replace("'", "''")
        where_conditions.append(f"p.pais_iso3 = '{country_code_clean}'")

    keyword_condition = " OR ".join(keyword_clauses)
    where_conditions.append(f"({keyword_condition})")

    sql = (
        f"SELECT DISTINCT p.id_proyecto, p.nombre_proyecto FROM {BASE_PROJECT_TABLE} p"
    )
    if where_conditions:
        sql += " WHERE " + " AND ".join(where_conditions)
    sql += f" ORDER BY p.nombre_proyecto LIMIT {limit}"

    return sql


# ═══════════════════════════════════════════════════════════════════════════
# Error Parsing
# ═══════════════════════════════════════════════════════════════════════════


def parse_pg_error(exc: Exception) -> dict:
    """Parsea un error de PostgreSQL a estructura legible."""
    if not isinstance(exc, psycopg2.Error):
        return {}
    diag = getattr(exc, "diag", None)
    return {
        "code": exc.pgcode,
        "details": {
            "context": getattr(diag, "context", None),
            "detail": getattr(diag, "detail", None),
            "hint": getattr(diag, "hint", None),
        },
        "message": str(exc).strip(),
    }


# ═══════════════════════════════════════════════════════════════════════════
# Scoring de Queries
# ═══════════════════════════════════════════════════════════════════════════


def _prep_for_preview(sql: str) -> str:
    """
    Normalize LLM-generated SQL before EXPLAIN.
    Aplica limpieza ligera sin sqlfluff costoso.
    """
    try:
        return prepare_sql_for_execution(sql, preview=True, lint=False)
    except Exception as e:
        logger.error(f"_prep_for_preview() failed; returning raw SQL. err={e}")
        return sql


def _score_query(db, sql: str) -> tuple[int, list, str | None]:
    """
    Evalúa una SQL candidata.

    Returns: (score, preview_rows, error_message)
    """
    cleaned_sql = _prep_for_preview(sql)
    if cleaned_sql.strip() != sql.strip():
        logger.debug(f"Candidate SQL cleaned before EXPLAIN.")

    if not PREVIEW_ENABLED:
        return SCORE_ZERO_ROWS, [], None

    # EXPLAIN
    try:
        with safe_session(db):
            result = db.execute(text(f"EXPLAIN {cleaned_sql}"))
            plan_lines = [row[0] for row in result.fetchall()]
            m = re.search(r"cost=\s*[\d\.]+\.\.([\d\.]+)", plan_lines[0])
            estimated_cost = float(m.group(1)) if m else None
    except Exception as e:
        return SCORE_EXPLAIN_FAILED, [], str(e)

    # Preview execution
    try:
        with safe_session(db):
            rows_json, _, total_rows, _, _ = execute_sql_query(
                db,
                cleaned_sql,
                rows_limit_default=ROWS_PREVIEW,
                rows_limit_max=ROWS_PREVIEW,
            )
    except Exception as e:
        return SCORE_EXPLAIN_FAILED, [], str(e)

    try:
        preview = json.loads(rows_json) if isinstance(rows_json, str) else []
    except (json.JSONDecodeError, TypeError) as je:
        logger.error(f"Error parseando preview JSON: {je}")
        preview = []

    score = SCORE_OK_ROWS if total_rows else SCORE_ZERO_ROWS
    if estimated_cost is not None:
        penalty = min(estimated_cost / COST_PENALTY_FACTOR, MAX_COST_PENALTY)
        score -= penalty
    return score, preview, None


# ═══════════════════════════════════════════════════════════════════════════
# Keyword Regeneration Detection
# ═══════════════════════════════════════════════════════════════════════════


def _detect_literal_filters_for_keyword_regen(sql: str) -> list[dict[str, Any]]:
    """Detecta filtros literales que podrían beneficiarse de keyword regeneration."""
    replacements: list[dict[str, Any]] = []
    if not sql:
        return replacements

    seen_keys: set[tuple[str, str]] = set()
    for match in _LITERAL_PROCESS_TEXT_RE.finditer(sql):
        expr = (match.group("expr") or "").strip()
        value = (match.group("value") or "").strip()
        operator = (match.group("op") or "=").strip().upper()
        matched_predicate = match.group(0)

        if not expr or not value:
            continue

        expr_lower = expr.lower()
        if any(excluded in expr_lower for excluded in _EXCLUDED_LITERAL_COLUMNS):
            continue

        if not expr_lower.startswith(_ALLOWED_LITERAL_PREFIXES):
            logger.info(f"FLOW ▸ TOKENIZE skip_column expr={expr} value={value}")
            continue

        tokens = _sanitize_keyword_tokens(value)
        if not tokens:
            continue

        if (
            len(tokens) == 1
            and not re.search(r"\s", value)
            and tokens[0] == value.lower()
        ):
            continue

        key = (expr_lower, value.lower())
        if key in seen_keys:
            continue
        seen_keys.add(key)

        logger.info(
            f"FLOW ▸ TOKENIZE literal_filter expr='{expr}' raw='{value}' tokens={tokens}"
        )

        replacements.append(
            {
                "column_expression": expr,
                "operator": operator,
                "original_value": value,
                "tokens": tokens,
                "matched_predicate": matched_predicate,
            }
        )

    return replacements


def _regenerate_sql_with_keyword_tokens(
    state: AgentState, replacements: list[dict[str, Any]]
) -> str | None:
    """Regenera la SQL reemplazando literales por búsqueda de keywords."""
    if not replacements:
        return None

    sql_obj = state.get("sql", {}) if isinstance(state.get("sql"), dict) else {}
    original_sql = sql_obj.get("query_raw") or _get_sql_query(state)
    if not original_sql:
        return None

    def _clean_llm_sql(sql_text: str) -> str:
        cleaned = sql_text.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```[a-zA-Z]*\s*\n?", "", cleaned)
            cleaned = re.sub(r"\n?```$", "", cleaned).strip()
        return cleaned

    from modules.graph.prompts_fetch import build_keyword_regenerate_prompt
    from modules.graph.helpers_respuesta import create_chain

    prompt_template = build_keyword_regenerate_prompt()
    chain = create_chain(
        prompt_template,
        ["original_sql", "replacements_json"],
    )

    payload = json.dumps(replacements, ensure_ascii=False, indent=2)

    new_sql: str | None = None
    try:
        response = invoke_llm_chain(
            chain,
            {
                "original_sql": original_sql,
                "replacements_json": payload,
            },
            label="helpers_sql.tokenize_sql",
        )
    except Exception as exc:
        logger.warning(f"FLOW ▸ TOKENIZE prompt_error={exc}")
    else:
        if hasattr(response, "content"):
            response = response.content
        candidate = _clean_llm_sql(str(response))
        if (
            candidate
            and "select" in candidate.lower()
            and candidate.strip() != original_sql.strip()
        ):
            logger.info("FLOW ▸ TOKENIZE prompt_success")
            new_sql = candidate

    if new_sql:
        return new_sql

    def _build_word_match_condition(expr: str, tokens: list[str]) -> str:
        parts: list[str] = []
        for token in tokens:
            safe_value = token.replace("'", "''")
            # Usar ILIKE con process_text en ambos lados
            condition = (
                f"process_text({expr}) ILIKE '%' || process_text('{safe_value}') || '%'"
            )
            parts.append(condition)
        return "(" + " OR ".join(parts) + ")"

    new_sql = original_sql
    applied = False
    for item in replacements:
        tokens = item.get("tokens") or []
        predicate = item.get("matched_predicate")
        expr = item.get("column_expression")
        if not tokens or not predicate or not expr:
            continue
        original_value = item.get("original_value")
        if original_value:
            entry = {
                "column": expr.strip(),
                "value": str(original_value).strip(),
            }
            container = state.setdefault("keyword_original_filters", [])
            if entry not in container:
                container.append(entry)
        replacement_block = _build_word_match_condition(expr, tokens)

        # Check if predicate is wrapped in parens in the SQL to avoid double wrapping or unbalanced parens
        # e.g. SQL has "(predicate)" and we replace "predicate" with "(new)" -> "((new))" (safe)
        # But if SQL has "(predicate" and we replace "predicate" -> "((new)" (unbalanced)

        # Heuristic: Try to match the predicate with surrounding parens first
        parenthesized_predicate = f"({predicate})"
        if parenthesized_predicate in new_sql:
            # Replace the whole (predicate) block with replacement_block (which is already (new))
            new_sql = new_sql.replace(parenthesized_predicate, replacement_block, 1)
            applied = True
        elif predicate in new_sql:
            new_sql = new_sql.replace(predicate, replacement_block, 1)
            applied = True

    if not applied or new_sql.strip() == original_sql.strip():
        logger.info("FLOW ▸ TOKENIZE no replacements applied")
        return None

    logger.info(f"FLOW ▸ TOKENIZE rewritten_sql={new_sql}")
    return new_sql


# ═══════════════════════════════════════════════════════════════════════════
# Utilidades
# ═══════════════════════════════════════════════════════════════════════════


def _value_is_zero_like(value: Any) -> bool:
    """Verifica si un valor es equivalente a cero o vacío."""
    if value is None:
        return True
    if isinstance(value, (int, float)):
        return float(value) == 0.0
    text = str(value).strip()
    if not text:
        return True
    lowered = text.lower()
    if lowered in {"n/a", "na", "none"}:
        return True
    normalized = lowered.replace(",", ".")
    try:
        return float(normalized) == 0.0
    except ValueError:
        return False


# ═══════════════════════════════════════════════════════════════════════════
# Cascade Text Search (4 niveles: Semantic -> Trigram High -> Trigram Low -> FTS)
# ═══════════════════════════════════════════════════════════════════════════


def _build_trigram_sql(
    keywords: Sequence[str],
    country_code: str,
    threshold: float = 0.3,
    limit: int = 20,
) -> str:
    """
    Construye SQL usando similarity() de pg_trgm para búsqueda fuzzy.

    Args:
        keywords: Lista de términos a buscar
        country_code: Código ISO3 del país
        threshold: Umbral de similitud (0.3 = permisivo, 0.5 = estricto)
        limit: Máximo de resultados
    """
    if not keywords:
        return ""

    term = " ".join(keywords[:5])
    term_clean = term.replace("'", "''")
    country_clean = country_code.upper().strip().replace("'", "''")

    return f"""
SELECT DISTINCT p.id_proyecto, p.nombre_proyecto,
       GREATEST(
           similarity(process_text(p.nombre_proyecto), process_text('{term_clean}')),
           similarity(process_text(COALESCE(p.objetivo_proyecto, '')), process_text('{term_clean}'))
       ) AS sim_score
FROM {BASE_PROJECT_TABLE} p
WHERE p.pais_iso3 = '{country_clean}'
  AND (
    similarity(process_text(p.nombre_proyecto), process_text('{term_clean}')) > {threshold}
    OR similarity(process_text(COALESCE(p.objetivo_proyecto, '')), process_text('{term_clean}')) > {threshold}
  )
ORDER BY sim_score DESC
LIMIT {limit}
""".strip()


def _build_fts_sql(
    keywords: Sequence[str],
    country_code: str,
    language: str = "spanish",
    limit: int = 20,
) -> str:
    """
    Construye SQL usando Full-Text Search con to_tsvector/plainto_tsquery.

    Permite stemming lingüístico: buscar "vacuna" encuentra "vacunación".

    Args:
        keywords: Lista de términos a buscar
        country_code: Código ISO3 del país
        language: Configuración de idioma para stemming
        limit: Máximo de resultados
    """
    if not keywords:
        return ""

    term = " ".join(keywords[:5])
    term_clean = term.replace("'", "''")
    country_clean = country_code.upper().strip().replace("'", "''")

    return f"""
SELECT DISTINCT p.id_proyecto, p.nombre_proyecto,
       ts_rank(
           to_tsvector('{language}', COALESCE(p.nombre_proyecto, '') || ' ' || COALESCE(p.objetivo_proyecto, '')),
           plainto_tsquery('{language}', '{term_clean}')
       ) AS fts_rank
FROM {BASE_PROJECT_TABLE} p
WHERE p.pais_iso3 = '{country_clean}'
  AND to_tsvector('{language}', COALESCE(p.nombre_proyecto, '') || ' ' || COALESCE(p.objetivo_proyecto, ''))
      @@ plainto_tsquery('{language}', '{term_clean}')
ORDER BY fts_rank DESC
LIMIT {limit}
""".strip()


def _cascade_text_search(
    db,
    keywords: Sequence[str],
    country_code: str,
) -> tuple[Any, int, str]:
    """
    Ejecuta búsqueda en cascada de 4 niveles para texto libre.

    Niveles:
        1. Semantic (process_text ILIKE) - ya ejecutado antes de llegar acá
        2. Trigram High (similarity > 0.5) - typos menores
        3. Trigram Low (similarity > 0.3) - typos mayores
        4. FTS (to_tsvector @@ tsquery) - stemming lingüístico

    Args:
        db: Sesión de base de datos
        keywords: Lista de términos a buscar
        country_code: Código ISO3 del país

    Returns:
        Tuple de (results_json, total_rows, strategy_used)
    """
    from modules.config import settings
    from modules.utils.db_utils import execute_sql_query

    if not keywords:
        logger.warning("CASCADE_TEXT_SEARCH: no keywords provided")
        return None, 0, "no_keywords"

    strategies: list[tuple[str, str]] = []

    # Nivel 2: Trigram High (estricto)
    if settings.search_enable_trigram:
        trigram_high_sql = _build_trigram_sql(
            keywords, country_code, threshold=settings.search_trigram_threshold_high
        )
        if trigram_high_sql:
            strategies.append(("trigram_high", trigram_high_sql))

    # Nivel 3: Trigram Low (permisivo)
    if settings.search_enable_trigram:
        trigram_low_sql = _build_trigram_sql(
            keywords, country_code, threshold=settings.search_trigram_threshold
        )
        if trigram_low_sql:
            strategies.append(("trigram_low", trigram_low_sql))

    # Nivel 4: Full-Text Search
    if settings.search_enable_fts:
        fts_sql = _build_fts_sql(keywords, country_code, language=settings.fts_language)
        if fts_sql:
            strategies.append(("fts", fts_sql))

    # Ejecutar en cascada
    for strategy_name, sql in strategies:
        try:
            logger.info(f"CASCADE_TEXT_SEARCH: trying {strategy_name}")
            results, _, total_rows, _, _ = execute_sql_query(db, sql)

            if total_rows and total_rows > 0:
                logger.info(
                    f"🎯 CASCADE_TEXT_SEARCH success: {strategy_name} rows={total_rows}"
                )
                return results, total_rows, strategy_name
            else:
                logger.info(f"CASCADE_TEXT_SEARCH: {strategy_name} returned 0 rows")

        except Exception as e:
            logger.warning(f"CASCADE_TEXT_SEARCH: {strategy_name} failed: {e}")

    logger.warning("CASCADE_TEXT_SEARCH: all strategies exhausted, 0 rows")
    return None, 0, "all_failed"


# ═══════════════════════════════════════════════════════════════════════════
# Exports
# ═══════════════════════════════════════════════════════════════════════════


__all__ = [
    # Constantes
    "REASONING_SEED",
    "REASONING_EFFORT_SQL",
    "REASONING_VERBOSITY_SQL",
    "REASONING_EFFORT_TEXT",
    "REASONING_VERBOSITY_TEXT",
    "BASE_PROJECT_TABLE",
    "TERRITORIAL_TABLES",
    "FUNDING_TABLES",
    "SQL_RESERVED_KEYWORDS",
    "SCORE_OK_ROWS",
    "SCORE_ZERO_ROWS",
    "SCORE_EXPLAIN_FAILED",
    "ROWS_PREVIEW",
    "PREVIEW_ENABLED",
    # Context managers
    "safe_session",
    # Cláusulas WHERE
    "_find_clause_boundary",
    "_append_where_condition",
    # Filtros
    "_apply_refined_filters_to_sql",
    "_apply_catalog_equals_to_sql",
    "_apply_structured_text_filters",
    "_find_missing_filters",
    "_has_only_catalog_filters",
    # Schema
    "_filter_schema_json",
    "_filter_schema_json_by_columns",
    "_prune_analyzer_filters",
    # Módulos
    "_derive_modules_from_analyzer",
    "_classify_filters_by_table",
    "_extract_base_alias",
    "_ensure_country_filter",
    "_sanitize_iso_code_sql",
    "_ensure_distinct_on_multijoin",
    # Keyword regeneration
    "_build_keyword_regeneration_sql_from_theme",
    "_build_fallback_sql",
    "_detect_literal_filters_for_keyword_regen",
    "_regenerate_sql_with_keyword_tokens",
    # Error parsing
    "parse_pg_error",
    # Scoring
    "_prep_for_preview",
    "_score_query",
    # Utilidades
    "_value_is_zero_like",
    "_collect_satisfied_filter_markers",
    "_extract_marker_value",
    "_is_filter_marked",
    # Cascade text search
    "_build_trigram_sql",
    "_build_fts_sql",
    "_cascade_text_search",
]
