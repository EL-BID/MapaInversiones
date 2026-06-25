# helpers.py
"""
Módulo maestro de helpers para el grafo.

Este archivo consolida todas las funciones de helpers divididas en 4 módulos:

┌─────────────────────┬──────────────────────────────────────────────────┐
│ Módulo              │ Descripción                                      │
├─────────────────────┼──────────────────────────────────────────────────┤
│ helpers_estado.py   │ Gestión del estado del agente                    │
│                     │ - _get_*, _set_*, _init_*, _ensure_*             │
│                     │ - Manejo de SQL, análisis, rendering             │
│                     │ - User assistance state                          │
├─────────────────────┼──────────────────────────────────────────────────┤
│ helpers_texto.py    │ Procesamiento de texto                           │
│                     │ - Normalización, tokenización                    │
│                     │ - Parsing de secciones de analyzer               │
│                     │ - Constantes: STOPWORDS, FRIENDLY_FILTER_NAMES   │
├─────────────────────┼──────────────────────────────────────────────────┤
│ helpers_sql.py      │ Construcción y validación de SQL                 │
│                     │ - Filtros WHERE, scoring, validación             │
│                     │ - Manejo de errores PostgreSQL                   │
│                     │ - Constantes: SQL_RESERVED_KEYWORDS              │
├─────────────────────┼──────────────────────────────────────────────────┤
│ helpers_respuesta.py│ Construcción de respuestas                       │
│                     │ - Payloads para frontend                         │
│                     │ - Gray zone notes                                │
│                     │ - LLM rewrite de resúmenes                       │
│                     │ - User assistance builders                       │
└─────────────────────┴──────────────────────────────────────────────────┘

Uso:
    from modules.graph.helpers import _get_sql_query, _normalize_text, ...

O importar desde el módulo específico:
    from modules.graph.helpers_estado import _get_sql_query
    from modules.graph.helpers_texto import _normalize_text
"""

from __future__ import annotations

# ═══════════════════════════════════════════════════════════════════════════
# Re-exports from helpers_estado (ALL functions)
# ═══════════════════════════════════════════════════════════════════════════

from modules.graph.helpers_estado import *  # noqa: F401,F403

# ═══════════════════════════════════════════════════════════════════════════
# Re-exports from helpers_texto
# ═══════════════════════════════════════════════════════════════════════════

from modules.graph.helpers_texto import *  # noqa: F401,F403

# ═══════════════════════════════════════════════════════════════════════════
# Re-exports from helpers_sql
# ═══════════════════════════════════════════════════════════════════════════

from modules.graph.helpers_sql import *  # noqa: F401,F403

# ═══════════════════════════════════════════════════════════════════════════
# Re-exports from helpers_respuesta
# ═══════════════════════════════════════════════════════════════════════════

from modules.graph.helpers_respuesta import *  # noqa: F401,F403

# ═══════════════════════════════════════════════════════════════════════════
# Note: __all__ is now inherited from each submodule via `import *`
# Each helpers_*.py file defines its own __all__ list
# ═══════════════════════════════════════════════════════════════════════════
