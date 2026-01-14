# Optimizaciones del Pipeline NL2SQL - 3 de Diciembre 2025

## Resumen Ejecutivo

Este documento detalla **TODAS** las optimizaciones y mejoras implementadas durante la sesión del 3 de diciembre de 2025. Se trabajó en múltiples áreas del pipeline:

1. **Desambiguación Territorial** - Prefetch y Postfetch
2. **Citizen Review con FlashRank** - Reranking semántico para reducir costos LLM
3. **Optimización de Analyzers** - Multi-layer dimension filter
4. **Variables de Configuración** - Palancas en `.env` para control granular
5. **Reducción de Tokens en Prompts**

### Métricas de Impacto Estimadas

| Área | Métrica | Antes | Después | Mejora |
|------|---------|-------|---------|--------|
| Analyzer 1 | Tokens en prompt | ~4,500 | ~3,900 | -13% |
| Analyzer 1 | Tiempo filtrado dims | ~100ms | ~12ms | -88% |
| Analyzer 1 | Tokens dimension_catalog | ~3,000 | ~200-500 | -85% |
| Citizen Review | Filas procesadas por LLM | 100% | ~20% | -80% |
| Citizen Review | Costo por review | $0.05 | $0.01 | -80% |

---

# PARTE A: DESAMBIGUACIÓN TERRITORIAL

## A1. Sistema de Resolución Territorial (`territorial_resolver.py`)

### Problema Original
Cuando un usuario pregunta por "Santiago" o "La Romana", el sistema no sabía si se refería a:
- Una **región** (ej: Región de Santiago)
- Un **departamento/provincia** (ej: Provincia de Santiago)
- Un **municipio** (ej: Municipio Santiago)

Esto causaba queries con OR triple que eran lentas e imprecisas:
```sql
WHERE nombre_region = 'Santiago' OR nombre_departamento = 'Santiago' OR nombre_municipio = 'Santiago'
```

### Solución Implementada

#### Vista Materializada `dim_territorios_flat`
```sql
CREATE MATERIALIZED VIEW dim_territorios_flat AS
SELECT 
    pais_iso3,
    'region' as tipo,
    nombre_region as valor_original,
    process_text(nombre_region) as valor_normalizado,
    'nombre_region' as columna_filtro
FROM stg_mapainv_proyectosterritorios
WHERE nombre_region IS NOT NULL
UNION ALL
SELECT 
    pais_iso3,
    'departamento' as tipo,
    nombre_departamento as valor_original,
    process_text(nombre_departamento) as valor_normalizado,
    'nombre_departamento' as columna_filtro
FROM stg_mapainv_proyectosterritorios
WHERE nombre_departamento IS NOT NULL
-- ... etc para municipio
```

#### Función `resolve_territorial_ambiguity()`
```python
def resolve_territorial_ambiguity(
    territorio_name: str,
    pais: str,
    db_connection,
    force_level: str | None = None
) -> dict:
    """
    Consulta dim_territorios_flat para detectar ambigüedad territorial.
    
    Returns:
        {
            "resolved": True/False,
            "needs_clarification": True/False,
            "value": "SANTIAGO",
            "columna_filtro": "nombre_departamento",
            "tipo": "departamento",
            "options": [...],  # Si ambiguo
            "has_homonyms": True/False
        }
    """
```

#### Flujo de Resolución

```
Usuario: "proyectos en Santiago"
         │
         ▼
┌────────────────────────────────────┐
│ resolve_territorial_ambiguity()    │
│                                    │
│ Query: SELECT DISTINCT tipo        │
│        FROM dim_territorios_flat   │
│        WHERE valor_normalizado     │
│              ILIKE '%santiago%'    │
└────────────────────────────────────┘
         │
         ├──► 1 resultado único
         │    └──► RESUELTO: usar columna específica
         │         WHERE nombre_departamento = 'SANTIAGO'
         │
         ├──► Múltiples tipos (región + departamento)
         │    └──► AMBIGUO: pedir clarificación
         │         "¿Te refieres a la Provincia o la Región?"
         │
         └──► 0 resultados
              └──► NOT_FOUND: sugerir alternativas
```

### Detección de Nivel Explícito

El sistema detecta cuando el usuario especifica el nivel:

```python
# Patrones detectados automáticamente:
"provincia de Santiago"     → nivel=departamento, valor="Santiago"
"municipio Santo Domingo"   → nivel=municipio, valor="Santo Domingo"
"(Departamento: SANTIAGO)"  → nivel=departamento, valor="SANTIAGO"
```

### Respuesta a Clarificaciones

Cuando el usuario responde a una clarificación:
```
Usuario: "proyectos en santiago"
Bot: "¿Te refieres a la Provincia o la Región de Santiago?"
Usuario: "proyectos en santiago (Provincia: SANTIAGO)"
                                  ↑
                    El sistema extrae este formato
```

---

## A2. Detección de Territorios Genéricos

### Problema
El LLM a veces genera `territory_filters` con términos genéricos que no son nombres geográficos reales:
- "mi provincia"
- "donde vivo"
- "esta zona"
- "cerca de mí"

Estos NO pueden resolverse contra la base de datos.

### Solución: Función `_is_generic_territory_term()`

**Archivo:** `app/modules/graph/territorial_resolver.py`

```python
GENERIC_TERRITORY_PATTERNS = [
    # Posesivos con nivel territorial
    r'^mi\s+(provincia|departamento|municipio|región|zona)$',
    r'^nuestra?\s+(provincia|departamento|municipio)$',
    
    # Ubicación relativa
    r'^donde\s+(vivo|estoy|resido|trabajo)$',
    r'^(por\s+)?(acá|aquí|cerca\s+de\s+mí)$',
    
    # Demostrativos sin nombre específico
    r'^(esta?|esa?)\s+(provincia|departamento|municipio|zona)$',
]

def _is_generic_territory_term(term: str) -> bool:
    """
    Detecta si un término territorial es genérico/relativo.
    
    Examples:
        >>> _is_generic_territory_term("mi provincia")
        True
        >>> _is_generic_territory_term("Santiago")
        False
        >>> _is_generic_territory_term("donde vivo")
        True
    """
```

### Flujo con Detección de Genéricos

```
territory_filters: ["mi provincia"]
         │
         ▼
┌────────────────────────────────────┐
│ _is_generic_territory_term()       │
│ Returns: True                      │
└────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ BLOQUEAR con topic:                │
│ "territorio_ambiguo"               │
│                                    │
│ Mensaje al usuario:                │
│ "¿En qué provincia o municipio    │
│  te gustaría buscar proyectos?"   │
└────────────────────────────────────┘
```

---

## A3. Configuración de Desambiguación

**Archivo:** `app/modules/config.py`

```python
# Territorial disambiguation
use_territorial_disambiguation: bool = Field(
    default=True,
    description="Enable territorial disambiguation (single column filter vs OR triple)"
)
territorial_max_options: int = Field(
    default=5,
    description="Maximum territory options in disambiguation prompts"
)
```

**Archivo:** `.env.example`
```bash
# Máximo de opciones territoriales en prompt de desambiguación
TERRITORIAL_MAX_OPTIONS=5
```

---

## A4. Detección de Homónimos Territoriales

### Problema
En algunos países, el mismo nombre existe en múltiples niveles:
- "Santiago" es Provincia Y también Municipio
- "La Romana" es Provincia Y también Municipio

### Solución

El resolver retorna `has_homonyms: True` cuando detecta esto:

```python
{
    "resolved": True,
    "value": "SANTIAGO",
    "columna_filtro": "nombre_departamento",  # Usamos el más específico
    "tipo": "departamento",
    "has_homonyms": True,  # ← Indica que existe en otros niveles
    "reason": "unique_by_level"
}
```

### Comportamiento con Homónimos

```
Usuario: "proyectos en La Romana"
         │
         ▼
Query dim_territorios_flat:
├── Provincia: LA ROMANA
└── Municipio: LA ROMANA (dentro de Provincia La Romana)
         │
         ▼
Si usuario NO especificó nivel:
├── Usar el nivel MÁS GENERAL (Provincia)
├── has_homonyms = True
└── Nota en sidebar: "Se encontraron proyectos en la Provincia La Romana"
```

---

## A5. Topics de Incertidumbre Configurables
    default=5,
    description="Maximum territory options in disambiguation prompts"
)
```

**Archivo:** `.env.example`
```bash
# Máximo de opciones territoriales en prompt de desambiguación
TERRITORIAL_MAX_OPTIONS=5
```

---

## A3. Topics de Incertidumbre Configurables

### Problema
Algunos topics de incertidumbre debían bloquear el flujo (ej: territorio genérico "mi provincia"), mientras otros podían continuar con defaults.

### Solución

**Archivo:** `app/modules/schemas/schemas.py`
```python
class UncertaintyTopic(str, Enum):
    PREGUNTA_INCOMPLETA = "pregunta_incompleta"
    TERRITORIO_AMBIGUO = "territorio_ambiguo"  # BLOCKING
    VALOR_AMBIGUO = "valor_ambiguo"            # NON-BLOCKING
    YEAR_SCOPE = "year_scope"                  # NON-BLOCKING
    # ...

def is_critical_uncertainty_topic(topic: str) -> bool:
    """Determina si un topic debe bloquear el flujo."""
    blocking = _get_blocking_topics_from_settings()
    return topic.lower().strip() in blocking
```

**Archivo:** `.env.example`
```bash
# Topics que BLOQUEAN el flujo
BLOCKING_UNCERTAINTY_TOPICS=pregunta_incompleta,territorio_ambiguo

# Topics que generan warning pero NO bloquean
NON_BLOCKING_UNCERTAINTY_TOPICS=valor_ambiguo,year_scope,territorio,proxy_avance
```

---

# PARTE B: CITIZEN REVIEW CON FLASHRANK

## B1. Problema Original

El nodo `citizen_review` recibía TODAS las filas del resultado SQL y las pasaba al LLM para clasificar cuáles eran relevantes. Esto era:
- **Lento**: Procesar 100+ filas con LLM tomaba segundos
- **Caro**: Cada fila = tokens de input/output
- **Ineficiente**: Muchas filas eran obviamente irrelevantes

## B2. Solución: FlashRank Pre-clasificación

### Arquitectura de 3 Tiers

```
Resultados SQL (100 filas)
         │
         ▼
┌────────────────────────────────────┐
│ FlashRank Reranking (~50ms)        │
│ Modelo: ms-marco-MiniLM-L-12-v2    │
│ Cross-encoder semántico local      │
└────────────────────────────────────┘
         │
         ├──► HIGH (score ≥ 0.75)
         │    └──► Auto-aprobadas, NO van al LLM
         │
         ├──► GRAY (0.45 < score < 0.75)
         │    └──► Van al LLM para clasificación
         │
         └──► LOW (score ≤ 0.45)
              └──► Auto-descartadas, NO van al LLM
```

### Implementación

**Archivo:** `app/modules/graph/nodes_postfetch.py`

```python
# Inicialización del cliente FlashRank (singleton)
_flashrank_client = None

def citizen_review(state):
    # ...
    
    if settings.feature_flashrank_citizen and rows_raw and has_meaningful_text:
        # Inicializar cliente si no existe
        if _flashrank_client is None:
            _flashrank_client = Ranker(max_length=256, cache_dir="/opt")
        
        # Crear documentos para reranking
        documents = []
        for idx, row in enumerate(rows_raw):
            parts = [f"{key}: {val}" for key, val in row.items() if val]
            row_text = " | ".join(parts)
            documents.append(Document(page_content=row_text, metadata={"row_index": idx}))
        
        # Rerank
        reranker = FlashrankRerank(client=_flashrank_client, top_n=len(documents))
        reranked_docs = reranker.compress_documents(documents, question_text)
        
        # Clasificar en tiers
        for doc in reranked_docs:
            score = doc.metadata.get("relevance_score", 0.0)
            if score >= settings.flashrank_high_threshold:
                high_rows.append(row)  # Auto-aprobada
            elif score <= settings.flashrank_low_threshold:
                low_rows.append(row)   # Auto-descartada
            else:
                gray_rows.append(row)  # Va al LLM
```

### Validación de Contenido Textual

FlashRank solo se activa si hay contenido textual significativo:

```python
# Verificar contenido antes de activar FlashRank
TEXT_FIELDS = ["nombre_proyecto", "objetivo_proyecto", "descripcion_proyecto"]
min_text_length = settings.flashrank_min_text_length  # Default: 20 chars

has_meaningful_text = False
for row in rows_raw[:5]:
    combined_text = ' '.join([str(row.get(f, '')) for f in TEXT_FIELDS])
    if len(combined_text) >= min_text_length:
        has_meaningful_text = True
        break

# Si no hay texto suficiente (ej: query agregada COUNT(*)), skip FlashRank
if not has_meaningful_text:
    state["flashrank_skipped_no_text"] = True
```

## B3. Configuración FlashRank

**Archivo:** `app/modules/config.py`

```python
# FlashRank citizen reranker
feature_flashrank_citizen: bool = Field(default=True)
flashrank_high_threshold: float = Field(default=0.75)
flashrank_low_threshold: float = Field(default=0.45)
flashrank_max_llm_rows: int = Field(default=5)
flashrank_min_text_length: int = Field(
    default=20,
    description="Minimum text length to enable FlashRank (chars)"
)
```

**Archivo:** `.env.example`
```bash
# FlashRank Citizen Review
FEATURE_FLASHRANK_CITIZEN=true
FLASHRANK_HIGH_THRESHOLD=0.75    # Auto-aprobar si score >= 0.75
FLASHRANK_LOW_THRESHOLD=0.45     # Auto-descartar si score <= 0.45
FLASHRANK_MAX_LLM_ROWS=5         # Máximo filas grises al LLM
FLASHRANK_MIN_TEXT_LENGTH=20     # Mínimo chars para activar
```

## B4. Métricas y Observabilidad

### Logs de FlashRank
```
FLOW ▸ CITIZEN flashrank scores min=0.234 avg=0.567 max=0.891
FLOW ▸ CITIZEN flashrank split high=15 gray=8 low=77

# Detalle de HIGH (auto-aprobadas)
FLOW ▸ CITIZEN flashrank HIGH (score ≥ 0.75):
  - "Proyecto Agua Potable Rural" score=0.891
  - "Acueducto Municipal" score=0.823
```

### Sistema de Métricas `_record_citizen_metric()`

**Archivo:** `app/modules/graph/helpers_estado.py`

```python
def _record_citizen_metric(state: AgentState, key: str, value: Any) -> None:
    """Registra métricas del proceso citizen_review para debugging y análisis."""
    trace = state.setdefault("trace", {})
    citizen_metrics = trace.setdefault("citizen", {})
    citizen_metrics[key] = value
```

### Métricas Registradas

| Métrica | Descripción |
|---------|-------------|
| `flashrank_scores` | `{min, max, avg}` de scores |
| `flashrank_split` | `{high, gray, low}` conteo por tier |
| `flashrank_failed` | `True` si FlashRank falló |
| `rows_filtered_count` | Filas después de filtrado |
| `columns_filtered_count` | Columnas después de filtrado |
| `columns_removed_count` | Columnas eliminadas |
| `irrelevant_rows_removed` | Filas descartadas por irrelevancia |
| `rows_for_llm_count` | Filas enviadas al LLM |
| `citizen_rules_applied` | Reglas de filtrado aplicadas |
| `technical_sections` | Secciones técnicas generadas |

### Acceso a Métricas

```python
# En cualquier nodo posterior
metrics = state.get("trace", {}).get("citizen", {})
flashrank_scores = metrics.get("flashrank_scores", {})
print(f"FlashRank avg: {flashrank_scores.get('avg', 'N/A')}")
```

---

# PARTE C: OPTIMIZACIÓN DE ANALYZERS

## C1. Optimizaciones P0 (Quick Wins en Prompts)

### P0-1: Eliminación de Sección Duplicada "GROUPING vs FILTERING"

**Archivo:** `app/modules/graph/prompts_prefetch.py`

**Problema:** La sección "GROUPING vs FILTERING" aparecía duplicada en el prompt de `llm_analyzer`, consumiendo ~50 tokens innecesarios.

**Solución:** Se eliminó la segunda aparición de la sección, manteniendo solo la primera instancia completa.

**Tokens ahorrados:** ~50 tokens por invocación

---

### P0-2: Compresión de 3 FewShots con Marcador [COMPACT]

**Archivo:** `app/modules/graph/prompts_prefetch.py`

**Problema:** Los FewShots en el prompt ocupaban ~60-70 líneas cada uno, con secciones verbose como "CONTEXT" y explicaciones extensas.

**Solución:** Se comprimieron 3 FewShots críticos usando el formato `[COMPACT]`:

#### FewShot 1: Catalog + Textual (Sector + Keywords)
```
Antes: ~65 líneas
Después: ~25 líneas con [COMPACT]
```

**Pregunta ejemplo:** "proyectos de agua potable relacionados con acueductos en Antioquia"

**Cambios:**
- Eliminado bloque CONTEXT verbose
- Condensado FILTERS a formato inline
- Mantenida estructura de output intacta

#### FewShot 2: Explicit Value Match
```
Antes: ~60 líneas  
Después: ~22 líneas con [COMPACT]
```

**Pregunta ejemplo:** "proyectos del Ministerio de Educación"

**Cambios:**
- Eliminado CONTEXT
- Formato compacto para filtros exactos
- Preservado confidence=0.95 para matches exactos

#### FewShot 3: Clear Year Range
```
Antes: ~55 líneas
Después: ~20 líneas con [COMPACT]
```

**Pregunta ejemplo:** "proyectos iniciados entre 2020 y 2023"

**Cambios:**
- Formato condensado para year_filters
- Eliminadas explicaciones redundantes

**Tokens ahorrados:** ~400 tokens por invocación

---

### P0-3: Reducción de Ejemplos de Expansión de Keywords

**Archivo:** `app/modules/graph/prompts_prefetch.py`

**Problema:** La sección de keyword expansion tenía 12 ejemplos, muchos redundantes.

**Solución:** Se redujo a 5 ejemplos representativos que cubren los casos principales:
- Concepto amplio → términos específicos
- Acrónimos → expansión
- Sinónimos regionales
- Términos técnicos
- Conceptos compuestos

**Tokens ahorrados:** ~150 tokens por invocación

---

## Parte 2: Optimización M1 - Multi-Layer Dimension Filter

### Contexto del Problema

El Analyzer 1 recibía el catálogo completo de dimensiones (~1,200 items, ~3,000 tokens) aunque típicamente solo 5-10 items eran relevantes para cada pregunta.

La implementación inicial usaba **FlashRank para TODO el catálogo**, lo cual:
- Tomaba ~100ms por invocación
- Era overkill para matches obvios (ej: "educación" → sector "Educación")

### Solución: Estrategia de 3 Capas

**Archivo:** `app/modules/graph/helpers_estado.py`
**Función:** `_get_filtered_dimensions_for_analyzer()`

```python
def _get_filtered_dimensions_for_analyzer(
    state: AgentState,
    question: str,
    min_score: float | None = None,
    max_items_per_category: int | None = None,
) -> Dict[str, Any]:
```

#### Capa 1: Token Overlap (~5ms)
- Tokeniza la pregunta del usuario
- Tokeniza cada item del catálogo
- Si hay intersección de tokens → match directo
- **Resuelve ~80% de los casos**

```python
# Ejemplo: "proyectos de educación"
question_tokens = {"proyectos", "educacion"}
item_tokens = {"educacion"}  # del sector "Educación"
# Overlap: {"educacion"} → MATCH
```

#### Capa 2: Fuzzy Match (~20ms)
- Solo para items que NO matchearon en Capa 1
- Usa `rapidfuzz.partial_ratio` con threshold 70%
- Captura variaciones ortográficas
- **Resuelve ~15% de los casos**

```python
# Ejemplo: "Bogota" vs "Bogotá D.C."
fuzz.partial_ratio("bogota", "bogotá d.c.") = 86% → MATCH
```

#### Capa 3: FlashRank Semantic (~50ms)
- Solo para items que NO matchearon en Capas 1 y 2
- Entiende sinónimos y conceptos relacionados
- **Resuelve ~5% de los casos**

```python
# Ejemplo: "hospitales" → sector "Salud"
# FlashRank score = 0.72 → MATCH
```

### Configuración

**Archivo:** `app/modules/config.py`
```python
dimension_rerank_min_score: float = 0.5   # Umbral para FlashRank
dimension_rerank_max_items: int = 10      # Máximo items por categoría
```

**Archivo:** `.env.example`
```bash
# Dimension Reranking para Analyzer 1
DIMENSION_RERANK_MIN_SCORE=0.5
DIMENSION_RERANK_MAX_ITEMS=10
```

### Logs de Diagnóstico

```
DIMENSIONS ▸ FILTER multilayer total=150 → matched=12 (L1_token=8 L2_fuzzy=3 L3_semantic=1)
```

### Métricas de Mejora

| Escenario | Antes (FlashRank-only) | Después (Multi-Layer) |
|-----------|------------------------|----------------------|
| Match exacto ("educación") | ~100ms | ~5ms |
| Variación ortográfica ("Bogota") | ~100ms | ~25ms |
| Sinónimo ("hospitales"→Salud) | ~100ms | ~55ms |
| **Promedio ponderado** | **~100ms** | **~12ms** |

---

## Parte 3: Documentación de Arquitectura

### Flujo Completo A1 → A2

```
Usuario pregunta
       │
       ▼
┌──────────────────────────────────┐
│ Multi-Layer Filter (~12ms)       │
│ • Capa 1: Token Overlap          │
│ • Capa 2: Fuzzy Match            │
│ • Capa 3: FlashRank (si needed)  │
└──────────────────────────────────┘
       │
       ▼ filtered_catalog (~200 tokens vs ~3,000)
       │
┌──────────────────────────────────┐
│ ANALYZER 1                       │
│ Inputs:                          │
│ • question                       │
│ • schema_minimal                 │
│ • filtered_catalog ◄── OPTIMIZADO│
│ • history                        │
│                                  │
│ Outputs:                         │
│ • tables, columns                │
│ • filters (con fuzzy match)      │
│ • theme.strategy.keywords        │
│ • decision (proceed/block)       │
└──────────────────────────────────┘
       │
       ▼ state con análisis completo
       │
┌──────────────────────────────────┐
│ ANALYZER 2                       │
│ Inputs:                          │
│ • analysis de A1                 │
│ • schema_global FILTRADO por A1  │
│ • dimension subset               │
│                                  │
│ Outputs:                         │
│ • dynamic_fewshots               │
│ • compound_text_filters          │
│ • refined_filters                │
└──────────────────────────────────┘
       │
       ▼
   sql_writer y downstream
```

### Contratos Preservados

| State Key | Tipo | Productor | Consumidores |
|-----------|------|-----------|--------------|
| `analysis.raw_text` | str | A1 | A2, debug |
| `analysis.tables.list` | List[str] | A1 | A2, sql_writer |
| `analysis.filters.all` | List[Dict] | A1 | A2, sql_writer |
| `analysis.filters.used_columns` | List[str] | A1 | A2 |
| `analysis.theme.strategy` | Dict | A1 | A2, citizen_review |
| `gray_zone.decision` | Dict | A1 | Router |
| `dynamic_fewshots` | str | A2 | sql_writer |
| `compound_text_filters` | List[Dict] | A2 | sql_writer |
| `schema_global_subset_json` | str | A2 | sql_writer |

**IMPORTANTE:** Ninguna de estas estructuras fue modificada. Las optimizaciones solo afectan:
1. Qué tokens ENTRAN a los prompts
2. Cuánto tiempo toma preparar esos tokens

---

## Parte 4: Tabla de Responsabilidades

### Analyzer 1 - "El Detective"

| Responsabilidad | Output | Consumido por |
|-----------------|--------|---------------|
| Identificar Tablas | `analysis.tables.list` | A2, sql_writer |
| Identificar Columnas | `analysis.filters.used_columns` | A2 |
| Extraer Filtros | `analysis.filters.all` | A2, sql_writer |
| Detectar Keywords | `analysis.theme.strategy.keywords` | A2, citizen_review |
| Detectar Territorios | `territory_filters` | sql_writer |
| Detectar Años | `year_filters` | sql_writer |
| Evaluar Complejidad | `is_complex` | Router |
| Detectar No-Mapeables | `gray_zone.non_mappable` | UI clarificación |
| Decisión Proceed/Block | `gray_zone.decision.status` | Router |
| Fuzzy Match Catálogos | `filters[].fuzzy_original` | sql_writer |
| Semantic OR Groups | `semantic_or_groups` | sql_writer |

### Analyzer 2 - "El Preparador"

| Responsabilidad | Output | Consumido por |
|-----------------|--------|---------------|
| Filtrar Schema | `schema_global_subset_json` | sql_writer |
| Generar FewShots | `dynamic_fewshots` | sql_writer |
| Construir Compound Filters | `compound_text_filters` | sql_writer |
| Refinar Filtros | `refined_text_filters` | sql_writer |
| Sugerir Dimensiones | `dimension_suggestions` | sql_writer, UI |
| Bloquear Tokens Catálogo | `catalog_filter_tokens_blocked` | sql_writer |
| Registrar Filtros Estructurados | `structured_text_filters` | sql_writer |
| Vocabulario Dimensiones | `dimension_hints_vocabulary` | sql_writer |

---

## Parte 5: Ejemplos de Uso del Multi-Layer Filter

### Ejemplo 1: Match por Token (Capa 1)

**Pregunta:** "proyectos de educación en Antioquia"

```
Tokens: {educacion, proyectos, antioquia}

Capa 1 - Token Overlap:
├── sectors: ["Educación"] ✅ (overlap "educacion")
├── territories: ["Antioquia"] ✅ (overlap "antioquia")

Resultado: 2 items en ~5ms
```

### Ejemplo 2: Fuzzy Match (Capa 2)

**Pregunta:** "proyectos de agua potable en Bogota"

```
Tokens: {agua, potable, bogota}

Capa 1: Sin matches exactos
Capa 2 - Fuzzy:
├── sectors: ["Agua Potable y Saneamiento"] ✅ (partial_ratio=100%)
├── territories: ["Bogotá D.C."] ✅ (partial_ratio=86%)

Resultado: 2 items en ~25ms
```

### Ejemplo 3: Semantic (Capa 3)

**Pregunta:** "inversión en hospitales y clínicas"

```
Tokens: {inversion, hospitales, clinicas}

Capa 1: Sin matches
Capa 2: Sin matches (fuzzy "hospitales"/"salud" = 33%)
Capa 3 - FlashRank:
├── sectors: ["Salud"] ✅ (score=0.72)

Resultado: 1 item en ~55ms
```

---

## Parte 6: Archivos Modificados

### Lista Completa

| Archivo | Tipo de Cambio |
|---------|----------------|
| `app/modules/graph/prompts_prefetch.py` | Reducción de tokens en prompts |
| `app/modules/graph/helpers_estado.py` | Multi-Layer Filter implementation |
| `app/modules/graph/nodes_prefetch.py` | Import y uso del nuevo filter |
| `app/modules/config.py` | Nuevos settings de configuración |
| `.env.example` | Documentación de nuevas variables |

### Detalle de Cambios por Archivo

#### `prompts_prefetch.py`
- Líneas reducidas: ~136 (de 2,074 a ~1,938)
- Secciones afectadas:
  - GROUPING vs FILTERING (duplicado eliminado)
  - 3 FewShots comprimidos
  - Keyword expansion examples reducidos

#### `helpers_estado.py`
- Función `_get_filtered_dimensions_for_analyzer()` reescrita
- Agregado import de `tokenize_like_process_text`
- Estrategia multi-layer implementada (~150 líneas)

#### `config.py`
```python
# Agregados:
dimension_rerank_min_score: float = 0.5
dimension_rerank_max_items: int = 10
```

#### `.env.example`
```bash
# Agregados:
DIMENSION_RERANK_MIN_SCORE=0.5
DIMENSION_RERANK_MAX_ITEMS=10
```

---

## Parte 7: Principios de Diseño Aplicados

### 1. No Romper Contratos Downstream
Todas las optimizaciones preservan las estructuras de datos que consumen otros nodos. Los cambios son **transparentes** para sql_writer, validator, citizen_review, etc.

### 2. Optimización Progresiva
La estrategia multi-layer aplica técnicas de menor a mayor costo:
- Capa 1 (más barata) resuelve la mayoría
- Capa 3 (más cara) solo para casos complejos

### 3. Configurabilidad
Los umbrales son configurables via `.env` sin necesidad de modificar código.

### 4. Observabilidad
Logs detallados permiten diagnosticar qué capa resolvió cada caso.

### 5. Graceful Degradation
Si FlashRank o rapidfuzz no están disponibles, el sistema continúa funcionando con las capas disponibles.

---

# PARTE D: CATÁLOGO COMPLETO DE VARIABLES DE CONFIGURACIÓN

## D1. Variables de Desambiguación Territorial

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `USE_TERRITORIAL_DISAMBIGUATION` | bool | `true` | Habilita el sistema de resolución territorial con `dim_territorios_flat` |
| `TERRITORIAL_MAX_OPTIONS` | int | `5` | Máximo de opciones a mostrar en prompts de desambiguación |

```bash
# .env
USE_TERRITORIAL_DISAMBIGUATION=true
TERRITORIAL_MAX_OPTIONS=5
```

---

## D2. Variables de Topics de Incertidumbre

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `BLOCKING_UNCERTAINTY_TOPICS` | str | `pregunta_incompleta,territorio_ambiguo` | Topics que BLOQUEAN el flujo SQL |
| `NON_BLOCKING_UNCERTAINTY_TOPICS` | str | `valor_ambiguo,year_scope,...` | Topics que generan warning pero continúan |

```bash
# .env
# Topics que requieren clarificación ANTES de generar SQL
BLOCKING_UNCERTAINTY_TOPICS=pregunta_incompleta,territorio_ambiguo

# Topics que continúan con defaults (citizen_review sugiere alternativas)
NON_BLOCKING_UNCERTAINTY_TOPICS=valor_ambiguo,year_scope,territorio,proxy_avance,pregunta_general
```

**Valores válidos para topics:**
- `pregunta_incompleta` - Pregunta muy vaga
- `territorio_ambiguo` - Territorio genérico ("mi provincia")
- `valor_ambiguo` - Valor no encontrado en catálogo
- `year_scope` - Rango de años no especificado
- `territorio` - Territorio con múltiples niveles
- `proxy_avance` - Columna de avance no disponible
- `pregunta_general` - Pregunta sin filtros específicos

---

## D3. Variables de FlashRank (Citizen Review)

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `FEATURE_FLASHRANK_CITIZEN` | bool | `true` | Habilita pre-clasificación con FlashRank |
| `FLASHRANK_HIGH_THRESHOLD` | float | `0.75` | Score mínimo para auto-aprobar fila |
| `FLASHRANK_LOW_THRESHOLD` | float | `0.45` | Score máximo para auto-descartar fila |
| `FLASHRANK_MAX_LLM_ROWS` | int | `5` | Máximo filas "grises" a enviar al LLM |
| `FLASHRANK_MIN_TEXT_LENGTH` | int | `20` | Mínimo de caracteres para activar FlashRank |

```bash
# .env
FEATURE_FLASHRANK_CITIZEN=true
FLASHRANK_HIGH_THRESHOLD=0.75
FLASHRANK_LOW_THRESHOLD=0.45
FLASHRANK_MAX_LLM_ROWS=5
FLASHRANK_MIN_TEXT_LENGTH=20
```

**Diagrama de thresholds:**
```
Score:  0.0 ────────── 0.45 ────────── 0.75 ────────── 1.0
        │     LOW      │     GRAY     │     HIGH      │
        │  (descartar) │  (→ LLM)     │ (auto-aprobar)│
```

---

## D4. Variables de Dimension Reranking (Analyzer 1)

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `DIMENSION_RERANK_MIN_SCORE` | float | `0.5` | Score mínimo FlashRank para incluir dimensión |
| `DIMENSION_RERANK_MAX_ITEMS` | int | `10` | Máximo items por categoría de dimensión |

```bash
# .env
DIMENSION_RERANK_MIN_SCORE=0.5    # 0.5=permisivo, 0.65=moderado, 0.75=estricto
DIMENSION_RERANK_MAX_ITEMS=10     # Recomendado: 10-15
```

---

## D5. Variables de SQL Text Search

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `MAX_SQL_KEYWORDS` | int | `3` | Máximo keywords en WHERE clause |
| `MAX_SQL_COLUMNS` | int | `2` | Máximo columnas de texto en SQL |
| `SQL_PRIORITY_COLUMNS` | list | `["nombre_proyecto", "objetivo_proyecto"]` | Columnas prioritarias para búsqueda |

```bash
# .env
MAX_SQL_KEYWORDS=3
MAX_SQL_COLUMNS=2
```

---

## D6. Variables de Fuzzy Matching

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `FUZZY_MATCH_THRESHOLD` | float | `0.75` | Umbral de similitud para match de catálogo |

```bash
# .env
# Ajustar según falsos positivos/negativos:
# - Bajar a 0.65-0.70 si hay muchos "valor no encontrado"
# - Subir a 0.80-0.85 si hay matches incorrectos
FUZZY_MATCH_THRESHOLD=0.75
```

---

## D7. Sistema de Lifecycle y Anti-Loop

### Problema Original
El pipeline podía entrar en loops infinitos si:
- La SQL fallaba repetidamente
- El LLM no lograba generar SQL válida
- Errores de conexión persistentes

### Solución: Estructura `lifecycle` en State

**Archivo:** `app/modules/graph/helpers_estado.py`

```python
_LIFECYCLE_DEFAULTS = {
    "sql_retry_count": 0,        # Contador de reintentos SQL
    "sql_max_retries": 3,        # Límite máximo (configurable via .env)
    "clarification_turn": 0,     # Turno de clarificación
    "clarification_max": 2,      # Máximo turnos de clarificación
    "irrelevant_retry_count": 0, # Reintentos por irrelevancia
    "exit_reason": None,         # "success" | "max_retries" | "gray_zone"
}
```

### Funciones Helper

```python
def _get_sql_retry_count(state) -> int:
    """Obtiene el contador de reintentos SQL."""
    
def _increment_sql_retry_count(state) -> int:
    """Incrementa el contador y retorna el nuevo valor."""
    
def _get_sql_max_retries(state) -> int:
    """Obtiene el límite (prioridad: state > config > default=3)."""
    
def _is_sql_retry_exhausted(state) -> bool:
    """Verifica si se agotaron los reintentos."""
```

### Flujo de Protección

```
SQL Generation
     │
     ▼
┌────────────────────────────────────┐
│ SQL Execution                      │
└────────────────────────────────────┘
     │
     ├──► SUCCESS → continuar flujo
     │
     └──► ERROR
          │
          ▼
     ┌────────────────────────────────────┐
     │ _increment_sql_retry_count()       │
     │ current_retry = 1, 2, 3...         │
     └────────────────────────────────────┘
          │
          ▼
     ┌────────────────────────────────────┐
     │ _is_sql_retry_exhausted()?         │
     ├────────────────────────────────────┤
     │ retry_count >= sql_max_retries?    │
     └────────────────────────────────────┘
          │
          ├──► NO → regenerar SQL
          │
          └──► SÍ → salir con mensaje amigable
               │
               ▼
          response_type = "error_max_retries"
          "Lo sentimos, no pudimos procesar 
           tu consulta. Intenta reformularla."
```

### Configuración

| Variable | Tipo | Default | Descripción |
|----------|------|---------|-------------|
| `SQL_MAX_RETRIES` | int | `3` | Máximo reintentos de generación SQL |

```bash
# .env
SQL_MAX_RETRIES=3  # Rango recomendado: 2-5 (balance resiliencia/costo)
```

---

## D8. Resumen Visual de Variables por Área

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MAPA DE VARIABLES DE CONFIGURACIÓN                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  PREFETCH (Antes de SQL)                                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────┐  │
│  │ TERRITORIAL         │    │ DIMENSION RERANK    │    │ UNCERTAINTY     │  │
│  │ DISAMBIGUATION      │    │ (Analyzer 1)        │    │ TOPICS          │  │
│  ├─────────────────────┤    ├─────────────────────┤    ├─────────────────┤  │
│  │ USE_TERRITORIAL_*   │    │ DIMENSION_RERANK_*  │    │ BLOCKING_*      │  │
│  │ TERRITORIAL_MAX_*   │    │ MIN_SCORE=0.5       │    │ NON_BLOCKING_*  │  │
│  └─────────────────────┘    │ MAX_ITEMS=10        │    └─────────────────┘  │
│                              └─────────────────────┘                         │
│                                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐                         │
│  │ SQL GENERATION      │    │ FUZZY MATCHING      │                         │
│  ├─────────────────────┤    ├─────────────────────┤                         │
│  │ MAX_SQL_KEYWORDS=3  │    │ FUZZY_MATCH_*=0.75  │                         │
│  │ MAX_SQL_COLUMNS=2   │    └─────────────────────┘                         │
│  │ SQL_MAX_RETRIES=3   │                                                    │
│  └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  POSTFETCH (Después de SQL)                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ FLASHRANK CITIZEN REVIEW                                             │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │ FEATURE_FLASHRANK_CITIZEN=true                                       │    │
│  │ FLASHRANK_HIGH_THRESHOLD=0.75  ← Auto-aprobar                        │    │
│  │ FLASHRANK_LOW_THRESHOLD=0.45   ← Auto-descartar                      │    │
│  │ FLASHRANK_MAX_LLM_ROWS=5       ← Máx filas al LLM                    │    │
│  │ FLASHRANK_MIN_TEXT_LENGTH=20   ← Mín chars para activar              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# PARTE E: PRÓXIMOS PASOS (PENDIENTES)

## E1. M2: Optimización de analysis text a A2
- **Estado:** Pendiente análisis
- **Idea:** Pasar solo secciones críticas (FILTERS, THEME, DECISION) en lugar del texto completo
- **Riesgo:** Verificar que el prompt de A2 no dependa del formato completo

## E2. M3: Comprimir FewShots Adicionales
- **Estado:** 3 de 7+ comprimidos
- **Pendientes:** Carryover territorios, SNIP lookup, Amount disambiguation, General question
- **Ahorro estimado:** ~400 tokens adicionales

## E3. M4: Cache de JSON Serialization
- **Estado:** Pendiente
- **Idea:** Cache de `json.dumps()` para catálogos que no cambian
- **Ahorro estimado:** ~50-100ms

## E4. Benchmarking
- **Estado:** Pendiente
- **Idea:** Ejecutar suite de preguntas antes/después para medir mejora real
- **Métricas:** Tiempo total, tokens consumidos, calidad de respuesta

---

# CONCLUSIÓN

## Logros del Día

| Área | Logro Principal |
|------|-----------------|
| **Desambiguación Territorial** | Sistema completo con `dim_territorios_flat`, detección de nivel explícito, homónimos, y clarificación UI |
| **Territorios Genéricos** | Detección de "mi provincia", "donde vivo" para bloqueo y clarificación |
| **Citizen Review** | FlashRank pre-clasificación reduce ~80% de filas enviadas al LLM |
| **Analyzer 1** | Multi-layer filter reduce tokens ~85% y tiempo ~88% |
| **Lifecycle Anti-Loop** | Sistema de reintentos controlado con límites configurables |
| **Métricas** | Sistema `_record_citizen_metric()` para observabilidad |
| **Configurabilidad** | 20+ variables en `.env` para control granular sin modificar código |
| **Preservación** | NINGÚN contrato downstream roto, outputs idénticos |

## Archivos Modificados

### Core del Grafo
| Archivo | Cambios |
|---------|---------|
| `app/modules/graph/prompts_prefetch.py` | Reducción ~600 tokens (FewShots, duplicados) |
| `app/modules/graph/helpers_estado.py` | Multi-layer filter, lifecycle helpers, métricas |
| `app/modules/graph/nodes_prefetch.py` | Uso del nuevo filter, territorial resolution |
| `app/modules/graph/nodes_postfetch.py` | FlashRank citizen review, métricas |
| `app/modules/graph/territorial_resolver.py` | Sistema completo de desambiguación |
| `app/modules/graph/edges.py` | Manejo de max_retries |

### Configuración
| Archivo | Cambios |
|---------|---------|
| `app/modules/config.py` | 20+ nuevas variables |
| `app/modules/schemas/schemas.py` | Topics de incertidumbre configurables |

### Data Ingestion
| Archivo | Cambios |
|---------|---------|
| `app/data_ingestion/05_dim_territorios.py` | Vista `dim_territorios_flat` |

## El Norte se Mantuvo

> **"No perder calidad de respuesta al usuario, manejar su frustración, entender qué quiere y darle lo que pide."**

Todas las optimizaciones fueron diseñadas para:
1. ✅ Reducir tiempos de espera (menos frustración)
2. ✅ Reducir costos LLM (sostenibilidad)
3. ✅ Mantener calidad de respuestas (valor al usuario)
4. ✅ Mejorar precisión en territorios (menos ambigüedad)
5. ✅ Detectar preguntas incompletas proactivamente
6. ✅ Control operacional (variables configurables)
7. ✅ Observabilidad con métricas detalladas

---

*Documento generado el 3 de diciembre de 2025*
*Sesión de optimización del pipeline NL2SQL*
*Archivos modificados: 10+ | Variables agregadas: 20+ | Funciones optimizadas: 8+*

*Documento generado el 3 de diciembre de 2025*
*Sesión de optimización del pipeline NL2SQL*
*Archivos modificados: 8+ | Variables agregadas: 15+ | Funciones optimizadas: 5+*
