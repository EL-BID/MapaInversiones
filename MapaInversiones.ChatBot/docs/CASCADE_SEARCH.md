# Cascade Text Search - Arquitectura de Búsqueda en Cascada

## Resumen

Cuando una query no encuentra resultados con los filtros exactos de catálogo, el sistema activa una **búsqueda en cascada de 4 niveles** que va desde el matching más estricto al más permisivo.

---

## Flujo de Fases

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 0: PRE-FILTROS (Siempre activos)                          │
│  ├─ Unique Lookup (id_proyecto, codigo_snip) → EXIT si match    │
│  └─ País (pais_iso3 = 'xxx') → Obligatorio                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: CATÁLOGOS EXACTOS                                      │
│  ├─ Sector: UPPER(TRIM(nombresector)) = 'VALOR'                 │
│  ├─ Entidad: UPPER(TRIM(entidadejecutora)) = 'VALOR'            │
│  └─ Territorio: Columna específica post-desambiguación          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: DIMENSIONALES (JOINs condicionales)                    │
│  ├─ Financiador: f.organismo_financiador (si mencionado)        │
│  └─ Fechas: anio_fechainicio/anio_fechafin (rangos)             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  EJECUTAR SQL → Si rows > 0: EXIT                               │
└─────────────────────────────────────────────────────────────────┘
                              │ rows = 0
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3A: RELAJAR CATÁLOGOS                                     │
│  └─ UPPER(TRIM()) → process_text() ILIKE para catálogos         │
└─────────────────────────────────────────────────────────────────┘
                              │ rows = 0
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3B: CASCADA TEXTO LIBRE (4 niveles)                       │
│  ├─ Nivel 1: process_text(col) ILIKE process_text('term')       │
│  ├─ Nivel 2: similarity(...) > 0.5 (typos menores)              │
│  ├─ Nivel 3: similarity(...) > 0.3 (typos mayores)              │
│  └─ Nivel 4: to_tsvector @@ tsquery (FTS con stemming)          │
└─────────────────────────────────────────────────────────────────┘
                              │ rows = 0
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FASE 4: GRAY ZONE                                              │
│  └─ Mensaje explicando filtros aplicados + sugerencias          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Configuración (.env)

```bash
# ═══════════════════════════════════════════════════════════════════════════
# CASCADE SEARCH CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════

# Nivel 1: Semantic (process_text ILIKE)
SEARCH_ENABLE_SEMANTIC=True

# Nivel 2-3: Trigram fuzzy matching (pg_trgm)
SEARCH_ENABLE_TRIGRAM=True
SEARCH_TRIGRAM_THRESHOLD_HIGH=0.5    # Nivel 2: umbral estricto
SEARCH_TRIGRAM_THRESHOLD=0.3         # Nivel 3: umbral permisivo

# Nivel 4: Full-Text Search (to_tsvector @@ tsquery)
SEARCH_ENABLE_FTS=True
FTS_LANGUAGE=spanish                 # Idioma para stemming

# Control de flujo
SEARCH_CASCADE_MODE=True             # true=secuencial, false=paralelo
CATALOG_RELAX_ENABLED=True           # Relajar catálogos antes de cascada
```

---

## Archivos Involucrados

| Archivo | Responsabilidad |
|---------|-----------------|
| `config.py` | Variables de configuración |
| `helpers_sql.py` | `_build_trigram_sql()`, `_build_fts_sql()`, `_cascade_text_search()` |
| `nodes_fetch.py` | Integración en `fetch_data()` tras 0 rows |
| `docker/sql/cascade_indexes.sql` | Índices GiST y GIN para performance |
| `docker/scripts/bootstrap_db.sh` | Ejecución automática de índices al iniciar |

---

## Índices de Base de Datos

Para que la cascada funcione eficientemente, se requieren estos índices:

```sql
-- GiST para similarity() en nombre_proyecto
CREATE INDEX idx_gist_proc_nombre_proyecto 
ON stg_mapainv_proyectosaprobadosinv 
USING gist (process_text(nombre_proyecto) gist_trgm_ops);

-- GiST para similarity() en objetivo_proyecto
CREATE INDEX idx_gist_proc_objetivo_proyecto 
ON stg_mapainv_proyectosaprobadosinv 
USING gist (process_text(objetivo_proyecto) gist_trgm_ops);

-- GIN para Full-Text Search
CREATE INDEX idx_fts_proyectos 
ON stg_mapainv_proyectosaprobadosinv 
USING gin (
    to_tsvector('spanish', 
        COALESCE(nombre_proyecto, '') || ' ' || COALESCE(objetivo_proyecto, '')
    )
);
```

> **Requisito**: La función `process_text()` debe estar marcada como `IMMUTABLE`.

---

## Logs Esperados

Cuando la cascada se activa, verás logs como:

```
FLOW ▸ FETCH keyword_regen_v2_still_zero keywords=['vacunación']
CASCADE_TEXT_SEARCH: trying trigram_high
CASCADE_TEXT_SEARCH: trigram_high returned 0 rows
CASCADE_TEXT_SEARCH: trying trigram_low
🎯 CASCADE_TEXT_SEARCH success: trigram_low rows=5
🎯 FETCH cascade_text_search_success strategy=trigram_low rows=5
```

---

## Telemetría

El estado incluye `search_resolution` con información de la última estrategia usada:

```python
state["search_resolution"] = {
    "strategy_used": "trigram_low",
    "rows_found": 5,
    "keywords_searched": ["vacunación"]
}
```

---

## Ejemplo de Uso

**Query**: "proyectos de vacunación infantil"

1. **Fase 0**: País = 'dom' ✅
2. **Fase 1**: "vacunación" no matchea catálogo sector ❌
3. **Fase 2**: No hay financiador ni fechas ✅
4. **SQL**: 0 rows
5. **Fase 3B**: Cascada en "vacunación"
   - Nivel 1: `process_text ILIKE` → 0 rows
   - Nivel 2: `similarity > 0.5` → 0 rows  
   - Nivel 3: `similarity > 0.3` → 5 rows ✅
6. **Resultado**: 5 proyectos encontrados

---

## Verificaciones

### Verificar que process_text() es IMMUTABLE

```sql
SELECT proname, provolatile
FROM pg_proc
WHERE proname = 'process_text';
-- Esperado: provolatile = 'i'
```

### Si no es IMMUTABLE, cambiarlo

```sql
ALTER FUNCTION process_text(text) IMMUTABLE;
```
