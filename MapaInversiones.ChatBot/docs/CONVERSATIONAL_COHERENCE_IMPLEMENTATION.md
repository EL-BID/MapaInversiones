# 🔄 Implementación de Coherencia Conversacional

## Documento Técnico Exhaustivo

**Fecha de Implementación:** Diciembre 2025  
**Objetivo:** Resolver el problema de inconsistencia conversacional ("turismo oscilante") y mejorar la experiencia de diálogo continuo.

---

## 📋 Índice

1. [Problema Original](#problema-original)
2. [Arquitectura de la Solución](#arquitectura-de-la-solución)
3. [FASE 1: Quick Wins](#fase-1-quick-wins)
4. [FASE 2: Session Memory](#fase-2-session-memory)
5. [FASE 3: Detección Contextual](#fase-3-detección-contextual)
6. [FASE 4: Búsqueda Robusta](#fase-4-búsqueda-robusta)
7. [FASE 5: Opcional](#fase-5-opcional)
8. [Flujo Completo con Ejemplos](#flujo-completo-con-ejemplos)
9. [Archivos Modificados](#archivos-modificados)
10. [Testing y Validación](#testing-y-validación)

---

## Problema Original

### El Bug del "Turismo Oscilante"

El sistema presentaba inconsistencia en consultas consecutivas sobre el mismo tema:

```
Turno 1: "proyectos de turismo"
  → Encuentra "MINISTERIO DE TURISMO" en entidades ✅
  → SQL: WHERE nombreentidadejecutora = 'MINISTERIO DE TURISMO'
  → Resultado: 3 proyectos ✅

Turno 2: "cuáles son los más importantes"
  → Re-busca "turismo" en catálogos
  → Ahora encuentra "TURISMO" como sector
  → SQL: WHERE nombresector ILIKE '%turismo%'
  → Resultado: 0 proyectos ❌

Turno 3: "muéstrame esos proyectos"
  → De nuevo busca en catálogos
  → Vuelve a encontrar entidad
  → Resultado: 3 proyectos ✅

Turno 4: "y cuánto cuestan"
  → Oscila a sector de nuevo
  → Resultado: 0 proyectos ❌
```

### Causa Raíz

1. **Sin memoria de sesión**: Cada turno era independiente
2. **Re-búsqueda en catálogos**: El LLM buscaba "turismo" cada vez sin recordar qué funcionó
3. **Anáforas no resueltas**: "esos", "ahí", "lo mismo" no se vinculaban al contexto previo
4. **Tono negativo**: Mensajes como "No encontré" frustraban al usuario

---

## Arquitectura de la Solución

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP REQUEST (Turno N)                        │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      chat_service.py                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 1. RESTORE session_memory from request.session cookie       │    │
│  │    prev_session_memory = request.session.get("session_memory")   │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         LANGGRAPH                                    │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ PREFETCH PHASE                                                  │ │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │ │
│  │  │  REWRITER   │───▶│   INBOX     │───▶│     ANALYZER        │ │ │
│  │  │             │    │ CLASSIFIER  │    │                     │ │ │
│  │  │ • Anáforas  │    │             │    │ • RULE B7           │ │ │
│  │  │ • Meta-com  │    │ • is_relevant│   │ • Session Priority  │ │ │
│  │  │ • Fewshots  │    │ • is_social │    │ • Catalog Fallback  │ │ │
│  │  │   21, 22    │    │             │    │                     │ │ │
│  │  └─────────────┘    └─────────────┘    └─────────────────────┘ │ │
│  │         ▲                                        │              │ │
│  │         │                                        │              │ │
│  │         └───── {session_memory_context} ─────────┘              │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    │                                 │
│                                    ▼                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ FETCH PHASE                                                     │ │
│  │  SQL Generation → Execution → Results                          │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                    │                                 │
│                                    ▼                                 │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │ POSTFETCH PHASE                                                 │ │
│  │  ┌───────────────────────────────────────────────────────────┐ │ │
│  │  │ IF rowcount > 0:                                          │ │ │
│  │  │   _save_success_context() → resolved_dimensions           │ │ │
│  │  │   _reset_frustration_count()                              │ │ │
│  │  │ ELSE:                                                      │ │ │
│  │  │   _increment_frustration_count()                          │ │ │
│  │  │   Progressive tone response                                │ │ │
│  │  └───────────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      chat_service.py                                 │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ 2. SAVE session_memory to request.session cookie            │    │
│  │    request.session["session_memory"] = updated_session_memory    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        HTTP RESPONSE (Turno N)                       │
│                    (Cookie con session_memory)                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## FASE 1: Quick Wins

### 1.1 Configuración en `.env`

```env
# Límite de caracteres para historial (evita tokens excesivos)
HISTORY_TRUNCATE_CHARS=1500

# Umbral de frustración para ofrecer contacto humano
FRUSTRATION_THRESHOLD=2
```

### 1.2 Configuración en `modules/config.py`

```python
# Settings class
history_truncate_chars: int = Field(
    default=1500,
    description="Maximum characters to keep in conversation history"
)
frustration_threshold: int = Field(
    default=2,
    description="Number of consecutive zero-result queries before offering human contact"
)
```

### 1.3 Tono Progresivo en `prompts_postfetch.py`

**Ubicación:** Líneas 64-80

```python
user_response_norows_prompt = """
...
### 📌 CRITICAL TONE RULES (Progressive, Never Absolute):

**❌ NEVER use absolute/harsh phrases like:**
- "No encontré", "No existe", "No hay proyectos", "No se encontraron"
- "No tenemos datos", "No existe información", "No hay registros"

**✅ ALWAYS use progressive/tentative phrases like:**
- "Parece que no hay registros exactos con esos criterios específicos..."
- "No localicé resultados con esa combinación de filtros..."
- "Los filtros aplicados parecen ser muy específicos..."
- "No encontré coincidencias exactas, pero podemos intentar..."

**✅ ALWAYS offer an alternative or next step:**
- "¿Desea que busquemos por nombre de proyecto?"
- "Podríamos intentar con criterios más amplios..."
- "¿Le gustaría ver proyectos relacionados con [tema]?"
...
"""
```

### 1.4 Igual Peso para Dimensiones

En el analyzer prompt, sector y entidad tienen igual prioridad:

```python
# En prompts_prefetch.py, el analyzer considera AMBAS dimensiones:
# - p.nombresector_proyecto
# - p.nombreentidadejecutora_proyecto
# Sin preferencia inherente por una sobre otra
```

---

## FASE 2: Session Memory

### 2.1 Estructura de Datos

**Ubicación:** `helpers_estado.py` líneas 1773-1850

```python
# Estructura de session_memory
session_memory = {
    "resolved_dimensions": {
        # Columna → {value, confidence, success_count}
        "nombreentidadejecutora_proyecto": {
            "value": "MINISTERIO DE TURISMO",
            "confidence": 0.8,
            "success_count": 1
        },
        "nombresector_proyecto": {
            "value": "EDUCACIÓN",
            "confidence": 0.9,
            "success_count": 2
        }
    },
    "last_success": {
        "filters": [
            {"column": "p.nombreentidadejecutora_proyecto", "value": "MINISTERIO DE TURISMO", "confidence": 0.8}
        ],
        "question": "proyectos de turismo",
        "rowcount": 3
    },
    "context_terms": ["turismo", "importantes", "mayor", "monto"]
}
```

### 2.2 Funciones de Session Memory

#### `_init_session_memory(state)`
```python
def _init_session_memory(state: AgentState) -> Dict[str, Any]:
    """
    Inicializa la session_memory si no existe.
    Retorna la referencia a session_memory.
    """
    _init_lifecycle(state)
    if "session_memory" not in state["lifecycle"]:
        state["lifecycle"]["session_memory"] = {
            "resolved_dimensions": {},
            "last_success": None,
            "context_terms": [],
        }
    return state["lifecycle"]["session_memory"]
```

#### `_save_resolved_dimension(state, column, value, confidence)`
```python
def _save_resolved_dimension(
    state: AgentState,
    column: str,
    value: str,
    confidence: float = 0.8
) -> None:
    """
    Guarda una dimensión resuelta exitosamente.
    Si ya existe, incrementa success_count y actualiza confidence.
    """
    session = _init_session_memory(state)
    resolved = session.setdefault("resolved_dimensions", {})
    
    col_key = column.lower().strip()
    
    if col_key in resolved:
        existing = resolved[col_key]
        existing["success_count"] = existing.get("success_count", 1) + 1
        existing["confidence"] = max(existing.get("confidence", 0), confidence)
        if value:
            existing["value"] = value
    else:
        resolved[col_key] = {
            "value": value,
            "confidence": confidence,
            "success_count": 1,
        }
```

#### `_save_success_context(state, filters, question, rowcount)`
```python
def _save_success_context(
    state: AgentState,
    filters: List[Dict[str, Any]],
    question: str,
    rowcount: int,
) -> None:
    """
    Guarda el contexto de una consulta exitosa.
    Extrae dimensiones de los filtros y las guarda.
    """
    session = _init_session_memory(state)
    
    # Guardar last_success
    session["last_success"] = {
        "filters": list(filters) if filters else [],
        "question": question,
        "rowcount": rowcount,
    }
    
    # Columnas de catálogo que queremos trackear
    CATALOG_COLUMNS = {
        "nombresector_proyecto",
        "nombreentidadejecutora_proyecto",
        "estado_proyecto",
        "nombreprovincia_proyecto",
        "nombremunicipio_proyecto",
    }
    
    for flt in (filters or []):
        col_raw = (flt.get("column") or "").strip().lower()
        # CRITICAL: Normalizar quitando prefijo de tabla (p., t., etc.)
        col = col_raw.split(".")[-1] if "." in col_raw else col_raw
        val = flt.get("value")
        conf = flt.get("confidence", 0.8)
        
        if col in CATALOG_COLUMNS and val:
            _save_resolved_dimension(state, col, str(val), conf)
    
    # Extraer términos clave de la pregunta
    _update_context_terms(state, question)
```

#### `_format_session_memory_for_prompt(state)`
```python
def _format_session_memory_for_prompt(state: AgentState) -> str:
    """
    Formatea la session_memory como texto para inyectar en el prompt del analyzer/rewriter.
    """
    resolved = _get_resolved_dimensions(state)
    last_success = _get_last_success(state)
    context_terms = _get_context_terms(state)
    
    if not resolved and not last_success and not context_terms:
        return ""
    
    parts = []
    parts.append("\n### 📌 SESSION CONTEXT (from previous successful queries):")
    
    if resolved:
        parts.append("\n**Resolved Dimensions (MUST USE THESE when user refers to same concepts):**")
        for col, data in resolved.items():
            val = data.get("value", "")
            count = data.get("success_count", 1)
            conf = data.get("confidence", 0)
            col_display = col.replace("_proyecto", "").replace("nombre", "")
            # Incluir el filtro exacto que el LLM debe emitir
            parts.append(f"  - {col_display}: \"{val}\" → EMIT: column=p.{col} | operator== | value={val}")
            parts.append(f"    (used {count}x, confidence {conf:.0%})")
    
    if context_terms:
        parts.append(f"\n**Active Context Terms:** {', '.join(context_terms)}")
    
    if last_success:
        q = last_success.get("question", "")
        rc = last_success.get("rowcount", 0)
        filters = last_success.get("filters", [])
        if q:
            parts.append(f"\n**Last Successful Query:** \"{q}\" → {rc} rows")
            if filters:
                parts.append("**Filters Used:**")
                for flt in filters:
                    col = flt.get("column", "")
                    val = flt.get("value", "")
                    if col and val:
                        parts.append(f"  - {col} = {val}")
    
    parts.append("\n**⚠️ CRITICAL INSTRUCTIONS:**")
    parts.append("1. If user uses anaphoric references (ese, esos, lo mismo, ahí, eso), USE the Resolved Dimensions above EXACTLY.")
    parts.append("2. If user mentions same topics (turismo, educación), MUST use resolved dimension values - DO NOT re-search catalogs.")
    parts.append("3. If previous turn returned data and user asks follow-up, REUSE the same filters that worked.")
    parts.append("4. NEVER say 'no data' if Resolved Dimensions show a successful filter - use it!")
    
    return "\n".join(parts)
```

### 2.3 Inyección en Prompts

#### En Rewriter (`nodes_prefetch.py` línea 1579)
```python
session_memory_context = _format_session_memory_for_prompt(state)
# ...
prompt = question_rewriter_prompt.format(
    country_code=country_code,
    history_text=history_text,
    last_question=user_question,
    current_year=current_year,
    session_memory_context=session_memory_context,  # <-- INYECTADO
)
```

#### En Analyzer (`nodes_prefetch.py` línea 1870)
```python
session_memory_context = _format_session_memory_for_prompt(state)
# ...
prompt = llm_analyzer_prompt.format(
    # ... otros parámetros ...
    session_memory_context=session_memory_context,  # <-- INYECTADO
)
```

---

## FASE 3: Detección Contextual

### 3.1 Patrones de Anáforas

**Ubicación:** `prompts_prefetch.py` líneas 385-404

```python
### Anaphoric patterns to detect and resolve:
- **Pronouns**: "ese", "esos", "esa", "esas", "esto", "estos", "estas", "aquel", "aquellos"
- **References**: "lo mismo", "el mismo", "la misma", "los mismos", "las mismas"
- **Demonstratives**: "ahí", "de ahí", "eso", "de eso", "con eso"
- **Implicit**: "también", "además", "y los otros", "los demás"

### Resolution Rules:
1. **IF session_memory_context has "Resolved Dimensions"** → Use those values to expand anaphoric references
   - Example: User says "cuánto cuestan esos" + session has "sector: TURISMO" → "cuánto cuestan los proyectos de turismo"
2. **IF session_memory_context has "Last Successful Query"** → Use it as context for meta-communication
3. **IF NO session_memory_context but history_text has context** → Fall back to history_text extraction
4. **NEVER leave anaphoric references unresolved** - always expand to explicit terms
```

### 3.2 Patrones de Meta-comunicación

**Ubicación:** `prompts_prefetch.py` líneas 390-392

```python
### Meta-communication patterns to detect:
- "tu entiendes que...", "ya sabes que...", "como te dije...", "recuerdas que..."
- "entonces muéstrame...", "ahora dame...", "con eso...", "de eso..."
- "siguiendo con...", "volviendo a...", "sobre lo anterior..."
```

### 3.3 Fewshot 21: Meta-comunicación de CONFIRMACIÓN

**Ubicación:** `prompts_prefetch.py` líneas 334-358

```python
21. **Meta-comunicación de CONFIRMACIÓN - NO generar nueva consulta (CRITICAL)**
   Historial:  
   User: cuales son los tres proyectos de turismo mas importantes del pais  
   Assistant: Los tres proyectos de turismo más importantes del país son: REHABILITACIÓN PARA EL DESARROLLO TURÍSTICO... (ordenados por valor_proyecto DESC)  
   Última pregunta: "tu entiendes que los mas importantes son los de mayor monto"

   ```json
   {{
     "question": "Confirmo que los proyectos de turismo mostrados están ordenados por mayor monto, que es el criterio de importancia."
   }}
   ```
   **NOTA CRÍTICA**: Cuando el usuario dice "tu entiendes que...", "ya sabes que...", "es decir que...", 
   "o sea que...", "entonces..." seguido de una CONFIRMACIÓN o ACLARACIÓN de lo que el bot dijo, 
   NO es una nueva consulta de datos. Es meta-comunicación conversacional. 
   El rewriter debe generar una pregunta que indique CONFIRMACIÓN, no una búsqueda nueva.
```

### 3.4 Fewshot 22: Meta-comunicación de CORRECCIÓN

**Ubicación:** `prompts_prefetch.py` líneas 359-372

```python
22. **Meta-comunicación de CORRECCIÓN - Ajustar consulta anterior (CRITICAL)**
   Historial:  
   User: muéstrame proyectos de educación  
   Assistant: Aquí están los proyectos de educación...  
   Última pregunta: "no, me refiero a los de salud"

   ```json
   {{
     "question": "Muéstrame los proyectos de salud (corrección: no educación)"
   }}
   ```
   **NOTA**: Cuando el usuario corrige ("no, me refiero a...", "no eso no, quiero..."), 
   es una corrección explícita. Usar el nuevo valor pero mantener la estructura de la consulta anterior.
```

---

## FASE 4: Búsqueda Robusta

### 4.1 RULE B7: SESSION MEMORY PREFERENCE

**Ubicación:** `prompts_prefetch.py` líneas 1970-2003

```python
## RULE B7: SESSION MEMORY PREFERENCE (Conversational Consistency)

**CRITICAL**: When `session_memory_context` contains "Resolved Dimensions", 
these represent filters that ALREADY WORKED in previous turns for the SAME conceptual topic.

**The Problem This Solves**:
- Turn 1: User asks "proyectos de turismo" → Filter by `entidadejecutora=MINISTERIO DE TURISMO` → Returns 3 projects ✅
- Turn 2: User asks "cuántos hay en turismo" → If you re-search catalogs, you might pick `sector ILIKE 'turismo'` → Returns 0 projects ❌
- The user expects CONSISTENCY - they already saw "turismo" works with the entity filter!

**SESSION MEMORY PRIORITY RULES**:
1. **If session_memory shows a resolved dimension for a concept** (e.g., "turismo" → entidadejecutora: MINISTERIO DE TURISMO):
   - PREFER that dimension over searching catalogs again
   - The user's mental model is already anchored to what worked before

2. **When to override session_memory**:
   - User explicitly changes context: "ahora quiero ver turismo POR SECTOR" (explicit override)
   - User mentions a different value: "turismo en Santiago" (adding territory, keep session dimension)

3. **Concrete Example**:
   - Session memory shows: `entidadejecutora: "MINISTERIO DE TURISMO" (used 1x, confidence 80%)`
   - User asks: "cuántos proyectos hay de turismo"
   - CORRECT: Emit filter `nombreentidadejecutora_proyecto = 'MINISTERIO DE TURISMO'`
   - WRONG: Search sector catalog for "turismo" and emit `nombresector_proyecto ILIKE '%turismo%'`

4. **Rationale**: Citizens don't care about database column names. 
   They expect "turismo" to keep working the same way throughout the conversation.
```

### 4.2 RULE 11 en Lista de Reglas

**Ubicación:** `prompts_prefetch.py` línea 2013

```python
###############################################################################
# RULES
###############################################################################
1. Use **only** names present in schema_json.
2. Prefer catalog columns (e.g., nombresector_proyecto) when relevant.
# ... reglas 3-10 ...
11. **SESSION MEMORY PRIORITY**: If session_memory_context shows a resolved dimension 
    for a concept the user mentions again, USE THAT EXACT FILTER instead of re-searching catalogs. 
    This ensures conversational consistency (see RULE B7).
```

### 4.3 Persistencia HTTP - Restore

**Ubicación:** `chat_service.py` líneas 445-455

```python
# ═══════════════════════════════════════════════════════════════════════
# SESSION MEMORY PRESERVATION: Restore from previous turn if available
# ═══════════════════════════════════════════════════════════════════════
prev_session_memory = request.session.get("session_memory")
if prev_session_memory and isinstance(prev_session_memory, dict):
    # Initialize lifecycle and inject previous session_memory
    if "lifecycle" not in inputs:
        inputs["lifecycle"] = {}
    inputs["lifecycle"]["session_memory"] = prev_session_memory
    logger.info(
        "CHAT ▸ SESSION_MEMORY restored from previous turn: resolved_dims={}, terms={}",
        len(prev_session_memory.get("resolved_dimensions", {})),
        len(prev_session_memory.get("context_terms", [])),
    )
```

### 4.4 Persistencia HTTP - Save

**Ubicación:** `chat_service.py` líneas 510-530

```python
# ═══════════════════════════════════════════════════════════════════════
# SESSION MEMORY PRESERVATION: Save for next turn
# ═══════════════════════════════════════════════════════════════════════
try:
    updated_session_memory = _get_session_memory(response_state)
    if updated_session_memory and isinstance(updated_session_memory, dict):
        # Only save if there's meaningful data
        has_data = (
            updated_session_memory.get("resolved_dimensions") or
            updated_session_memory.get("last_success") or
            updated_session_memory.get("context_terms")
        )
        if has_data:
            request.session["session_memory"] = updated_session_memory
            logger.info(
                "CHAT ▸ SESSION_MEMORY saved for next turn: resolved_dims={}, terms={}",
                len(updated_session_memory.get("resolved_dimensions", {})),
                len(updated_session_memory.get("context_terms", [])),
            )
except Exception as sm_err:
    logger.warning(f"CHAT ▸ SESSION_MEMORY save error: {sm_err}")
```

### 4.5 Persistencia en routes/chat.py (Legacy)

**Ubicación:** `routes/chat.py` líneas 893-970 (similar pattern)

```python
# Mismo patrón de restore/save para la ruta legacy
```

### 4.6 Frustration Tracking

**Ubicación:** `helpers_estado.py` líneas 1731-1769

```python
# ═══════════════════════════════════════════════════════════════════════════
# Frustration Tracking Helpers
# ═══════════════════════════════════════════════════════════════════════════

def _get_frustration_count(state: AgentState) -> int:
    """Obtiene el contador de frustración actual."""
    lifecycle = state.get("lifecycle", {})
    if lifecycle:
        return int(lifecycle.get("frustration_count", 0))
    return 0

def _increment_frustration_count(state: AgentState) -> int:
    """Incrementa el contador de frustración y lo retorna."""
    _init_lifecycle(state)
    current = _get_frustration_count(state)
    new_value = current + 1
    state["lifecycle"]["frustration_count"] = new_value
    return new_value

def _reset_frustration_count(state: AgentState) -> None:
    """Resetea el contador de frustración a 0."""
    _init_lifecycle(state)
    state["lifecycle"]["frustration_count"] = 0

def _get_frustration_threshold(state: AgentState) -> int:
    """Obtiene el umbral de frustración desde settings."""
    from modules.config import get_settings
    settings = get_settings()
    return getattr(settings, "frustration_threshold", 2)

def _should_show_human_contact(state: AgentState) -> bool:
    """Determina si se debe mostrar opción de contacto humano."""
    return _get_frustration_count(state) >= _get_frustration_threshold(state)
```

### 4.7 Uso de Frustration en nodes_postfetch.py

```python
# En _build_response_payload (línea ~520)
if no_data_payload:
    result_payload["no_data"] = no_data_payload
    result_payload["response_type"] = state.get("response_type", "no_data")
else:
    # ═══════════════════════════════════════════════════════════════
    # FRUSTRATION RESET: Consulta exitosa, reiniciar contador
    # ═══════════════════════════════════════════════════════════════
    _reset_frustration_count(state)
    logger.info("FLOW ▸ RESPONSE SUCCESS frustration_count reset to 0")
    
    # ═══════════════════════════════════════════════════════════════
    # SESSION MEMORY: Guardar contexto exitoso para turnos futuros
    # ═══════════════════════════════════════════════════════════════
    filters = _get_analysis_filters(state)
    question = state.get("complete_user_question") or state.get("user_question") or ""
    _save_success_context(state, filters, question, rowcount)

# En _build_no_data_payload
def _build_no_data_payload(state: AgentState) -> dict[str, Any]:
    # ═══════════════════════════════════════════════════════════════════
    # FRUSTRATION TRACKING: Incrementar contador de fallos consecutivos
    # ═══════════════════════════════════════════════════════════════════
    _increment_frustration_count(state)
    show_human_contact = _should_show_human_contact(state)
    frustration_count = _get_frustration_count(state)
    logger.info(
        "FLOW ▸ NO_DATA frustration_count={} show_human_contact={}",
        frustration_count,
        show_human_contact,
    )
    # ... resto de la función incluye show_human_contact en el payload
```

---

## FASE 5: Opcional

### 5.1 Intent Vector (Pendiente)

Clasificar el intent de la pregunta para mejor routing:
- `list`: Listar proyectos
- `count`: Contar proyectos
- `detail`: Ver detalle de un proyecto
- `aggregate`: Sumar valores, promedios
- `compare`: Comparar entidades/sectores

### 5.2 Orientación sin SQL (Pendiente)

Para preguntas generales que no requieren datos:
- "¿Qué es un proyecto de inversión pública?"
- "¿Cómo funciona el SNIP?"
- Respuestas explicativas sin ejecutar SQL

---

## Flujo Completo con Ejemplos

### Ejemplo 1: Conversación de Turismo (Corregida)

```
═══════════════════════════════════════════════════════════════════════════
TURNO 1
═══════════════════════════════════════════════════════════════════════════
User: "proyectos de turismo"

[REWRITER]
- session_memory_context: (vacío, primer turno)
- Output: {"question": "proyectos de turismo"}

[ANALYZER]
- Busca "turismo" en dimension_catalog
- Encuentra: "MINISTERIO DE TURISMO" en entities
- Emite: column=p.nombreentidadejecutora_proyecto | operator== | value=MINISTERIO DE TURISMO

[FETCH]
- SQL: SELECT ... WHERE nombreentidadejecutora_proyecto = 'MINISTERIO DE TURISMO'
- Resultado: 3 rows ✅

[POSTFETCH]
- _save_success_context() guarda:
  - resolved_dimensions["nombreentidadejecutora_proyecto"] = "MINISTERIO DE TURISMO"
  - context_terms = ["turismo"]
  - last_success = {filters: [...], question: "...", rowcount: 3}
- _reset_frustration_count() → 0

[HTTP RESPONSE]
- Cookie: session_memory = {...}

═══════════════════════════════════════════════════════════════════════════
TURNO 2
═══════════════════════════════════════════════════════════════════════════
User: "tu entiendes que los más importantes son los de mayor monto"

[HTTP REQUEST]
- Cookie: session_memory = {resolved_dimensions: {...}, ...}
- chat_service.py restaura session_memory

[REWRITER]
- session_memory_context:
  """
  ### 📌 SESSION CONTEXT (from previous successful queries):
  
  **Resolved Dimensions (MUST USE THESE when user refers to same concepts):**
    - entidadejecutora: "MINISTERIO DE TURISMO" → EMIT: column=p.nombreentidadejecutora_proyecto | operator== | value=MINISTERIO DE TURISMO
      (used 1x, confidence 80%)
  
  **Last Successful Query:** "proyectos de turismo" → 3 rows
  """
- Detecta meta-comunicación ("tu entiendes que...")
- Reconoce como CONFIRMACIÓN, no nueva query
- Output: {"question": "Confirmo que los proyectos de turismo están ordenados por mayor monto"}

[INBOX CLASSIFIER]
- is_relevant: "yes" (habla de proyectos)

[ANALYZER]
- Ve session_memory_context con resolved_dimensions
- RULE B7: Usa dimensión resuelta
- Emite: column=p.nombreentidadejecutora_proyecto | operator== | value=MINISTERIO DE TURISMO
- Agrega ORDER BY p.valor_proyecto DESC

[FETCH]
- SQL: SELECT ... WHERE nombreentidadejecutora_proyecto = 'MINISTERIO DE TURISMO' ORDER BY valor_proyecto DESC
- Resultado: 3 rows ✅

[POSTFETCH]
- Actualiza session_memory
- success_count para entidadejecutora → 2

═══════════════════════════════════════════════════════════════════════════
TURNO 3
═══════════════════════════════════════════════════════════════════════════
User: "y cuántos hay en total"

[REWRITER]
- session_memory_context disponible
- Output: {"question": "cuántos proyectos de turismo hay en total"}

[ANALYZER]
- RULE B7: Sigue usando entidadejecutora
- Emite: COUNT + mismo filtro

[FETCH]
- SQL: SELECT COUNT(*) WHERE nombreentidadejecutora_proyecto = 'MINISTERIO DE TURISMO'
- Resultado: 3 ✅

═══════════════════════════════════════════════════════════════════════════
```

### Ejemplo 2: Frustration Tracking

```
═══════════════════════════════════════════════════════════════════════════
TURNO 1
═══════════════════════════════════════════════════════════════════════════
User: "proyectos de blockchain en Santo Domingo"

[FETCH]
- SQL ejecuta
- Resultado: 0 rows

[POSTFETCH]
- _increment_frustration_count() → 1
- show_human_contact = False (1 < 2)
- Respuesta: "Parece que no hay proyectos con esos criterios específicos. 
              ¿Desea buscar por otro sector o tecnología?"

═══════════════════════════════════════════════════════════════════════════
TURNO 2
═══════════════════════════════════════════════════════════════════════════
User: "qué tal de inteligencia artificial"

[FETCH]
- SQL ejecuta
- Resultado: 0 rows

[POSTFETCH]
- _increment_frustration_count() → 2
- show_human_contact = True (2 >= 2)
- Respuesta: "No localicé proyectos con ese criterio específico.
              Hemos intentado varias búsquedas sin resultados exactos.
              
              Si lo prefiere, puede comunicarse con nuestro equipo de soporte 
              para asistencia personalizada: soporte@ejemplo.gob.do"

═══════════════════════════════════════════════════════════════════════════
TURNO 3
═══════════════════════════════════════════════════════════════════════════
User: "bueno, muéstrame proyectos de educación"

[FETCH]
- SQL ejecuta
- Resultado: 150 rows ✅

[POSTFETCH]
- _reset_frustration_count() → 0
- Usuario vuelve a estado normal
```

---

## Archivos Modificados

### Configuración

| Archivo | Cambios |
|---------|---------|
| `.env` | +`HISTORY_TRUNCATE_CHARS=1500`, +`FRUSTRATION_THRESHOLD=2` |
| `modules/config.py` | +`history_truncate_chars`, +`frustration_threshold` fields |

### Session Memory

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `helpers_estado.py` | 1773-1850 | +`_init_session_memory`, +`_get_session_memory`, +`_save_resolved_dimension`, +`_get_resolved_dimensions` |
| `helpers_estado.py` | 1852-1898 | +`_save_success_context` (con fix de normalización `p.` prefix) |
| `helpers_estado.py` | 1900-1943 | +`_update_context_terms`, +`_get_context_terms`, +`_get_last_success` |
| `helpers_estado.py` | 1945-1993 | +`_format_session_memory_for_prompt` (con filtro exacto para LLM) |
| `helpers_estado.py` | 1995-2005 | +`_clear_session_memory` |
| `helpers_estado.py` | 2260-2290 | +Exports en `__all__` |

### Frustration Tracking

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `helpers_estado.py` | 1731-1769 | +`_get_frustration_count`, +`_increment_frustration_count`, +`_reset_frustration_count`, +`_get_frustration_threshold`, +`_should_show_human_contact` |

### Prompts

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `prompts_prefetch.py` | 334-372 | +Fewshot 21 (meta-comunicación confirmación), +Fewshot 22 (corrección) |
| `prompts_prefetch.py` | 378 | +`{session_memory_context}` placeholder en rewriter |
| `prompts_prefetch.py` | 526-550 | +B.5 Confirmation/Acknowledgment classification |
| `prompts_prefetch.py` | 583 | +`is_confirmation` field en output schema |
| `prompts_prefetch.py` | 800-850 | +Fewshots para confirmation/meta-communication |

### Inbox Classifier & Routing

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `nodes_prefetch.py` | 167-205 | +`send_confirmation_response` nodo nuevo |
| `nodes_prefetch.py` | 886-920 | +`is_confirmation` flag extraction and handling |
| `edges.py` | 220-235 | +`is_confirmation` routing to `send_confirmation_response` |
| `nodes.py` | 21-35 | +export `send_confirmation_response` |
| `graph.py` | 8-35 | +import `send_confirmation_response` |
| `graph.py` | 62-90 | +nodo y rutas para `send_confirmation_response` |
| `prompts_prefetch.py` | 385-410 | +Anaphora & Meta-communication resolution rules |
| `prompts_prefetch.py` | 1970-2003 | +RULE B7: SESSION MEMORY PREFERENCE |
| `prompts_prefetch.py` | 2013 | +RULE 11 referencing RULE B7 |
| `prompts_prefetch.py` | 2137 | +`{session_memory_context}` placeholder en analyzer |
| `prompts_postfetch.py` | 64-80 | +CRITICAL TONE RULES (progressive, never absolute) |

### Nodes

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `nodes_prefetch.py` | 96 | +Import `_format_session_memory_for_prompt` |
| `nodes_prefetch.py` | 1579-1593 | +`session_memory_context` en rewriter call |
| `nodes_prefetch.py` | 1870-1895 | +`session_memory_context` en analyzer call |
| `nodes_postfetch.py` | 121 | +Import `_save_success_context` |
| `nodes_postfetch.py` | 516-528 | +Llamada a `_reset_frustration_count` y `_save_success_context` en éxito |
| `nodes_postfetch.py` | ~540 | +Llamada a `_increment_frustration_count` en no_data |

### HTTP Persistence

| Archivo | Ubicación | Cambios |
|---------|-----------|---------|
| `chat_service.py` | 418-428 | +Imports de session_memory functions |
| `chat_service.py` | 445-455 | +Restore session_memory from cookie |
| `chat_service.py` | 510-530 | +Save session_memory to cookie |
| `routes/chat.py` | 893-970 | +Same restore/save pattern for legacy route |

---

## Testing y Validación

### Verificación de Sintaxis

```bash
cd /Users/vladimirobellini/Documents/REPOS/ChatBot_v2
source ~/Library/Caches/pypoetry/virtualenvs/mapa-inversiones-om86B5WU-py3.11/bin/activate

python -m py_compile \
  app/modules/config.py \
  app/modules/graph/helpers_estado.py \
  app/modules/graph/nodes_prefetch.py \
  app/modules/graph/nodes_postfetch.py \
  app/modules/graph/prompts_prefetch.py \
  app/modules/graph/prompts_postfetch.py \
  app/modules/services/chat_service.py \
  app/routes/chat.py

# Output: (sin errores) ✅
```

### Verificación de Imports

```bash
cd /Users/vladimirobellini/Documents/REPOS/ChatBot_v2/app
python -c "
from modules.graph.helpers_estado import (
    _init_session_memory,
    _get_session_memory,
    _save_success_context,
    _format_session_memory_for_prompt,
    _increment_frustration_count,
    _reset_frustration_count,
    _get_frustration_count,
    _should_show_human_contact,
)
print('✅ All session_memory imports work')
"
```

### Logs a Monitorear en Producción

```
# Session Memory
CHAT ▸ SESSION_MEMORY restored from previous turn: resolved_dims=1, terms=3
CHAT ▸ SESSION_MEMORY saved for next turn: resolved_dims=2, terms=5
SESSION_MEMORY ▸ success context saved (rowcount=3, filters=1, terms=4)
SESSION_MEMORY ▸ resolved dimension saved: nombreentidadejecutora_proyecto=MINISTERIO DE TURISMO (conf=0.8)

# Frustration
FLOW ▸ NO_DATA frustration_count=1 show_human_contact=False
FLOW ▸ NO_DATA frustration_count=2 show_human_contact=True
FLOW ▸ RESPONSE SUCCESS frustration_count reset to 0
```

---

## Conclusión

La implementación de Coherencia Conversacional resuelve el problema del "turismo oscilante" mediante:

1. **Session Memory**: Persiste dimensiones resueltas entre turnos
2. **HTTP Persistence**: Cookies mantienen contexto entre requests
3. **RULE B7**: LLM prioriza dimensiones que ya funcionaron
4. **Anáforas**: Referencias como "esos", "ahí" se resuelven correctamente
5. **Meta-comunicación**: "tu entiendes que..." no genera nuevas queries
6. **Frustration Tracking**: Ofrece contacto humano tras fallos consecutivos
7. **Tono Progresivo**: Nunca "No encontré", siempre sugerencias

El sistema ahora mantiene coherencia conversacional real, donde el usuario puede tener diálogos naturales sin que el bot "olvide" lo que funcionó.

---

*Documento generado: Diciembre 2025*
