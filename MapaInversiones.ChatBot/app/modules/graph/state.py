from typing import Annotated, Sequence, Optional, Dict, Any, List
from typing_extensions import TypedDict, NotRequired
from sqlalchemy.orm import Session
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

# State: A shared data structure that represents the current snapshot of your application. It can be any Python type, but is typically a TypedDict or Pydantic BaseModel.
# State is a TypedDict that represents the current snapshot of your application. It is a shared data structure that is passed between nodes and edges.


# Agent State
class AgentState(TypedDict):
    # The add_messages function defines how an update should be processed
    # Default is to replace. add_messages says "append"
    # All Nodes will emit updates to the State. The add_messages function will append the messages to the existing list.
    messages: Annotated[Sequence[BaseMessage], add_messages]
    summary: str
    country_code: str
    user_question: str
    complete_user_question: str
    is_relevant: str
    is_social_interaction: str
    is_support_request: str
    has_pii: str
    documents: str
    documents_fewshots: str
    dynamic_fewshots: Optional[str]
    db: Session
    retry_count: int = 0
    source: str
    original_language_iso: str
    is_cache_hit: bool
    is_recent_cache_hit: bool
    currency_code: str
    decimal_separator: str
    is_help: bool

    # Unified Moderation Flow (PII + Prohibited Content)
    response_type: NotRequired[str]
    moderation: NotRequired[Dict[str, Any]]
    stop_processing: NotRequired[bool]

    # Semantic Pre‑Analyzer tags (singular vs. genérico + tono)
    specificity: NotRequired[str]  # "specific" | "likely_specific" | "generic"
    tone_energy: NotRequired[str]  # "low" | "medium" | "high"
    tone_abuse: NotRequired[bool]

    _trace_metrics: NotRequired[Dict[str, Any]]
    execution_start_time: NotRequired[float]

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 1: User Assistance) ✅ Completado
    # ═══════════════════════════════════════════════════════════════════
    user_assistance: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "needed": bool,                          # Reemplaza: needs_clarification
    #   "turn": int,                             # Reemplaza: clarification_turns
    #   "max_turns": int,                        # Default: 2
    #   "moment": str,                           # "pre_sql" | "post_sql_zero" | "post_sql_many"
    #   "type": str,                             # "confirm" | "disambiguate" | "expand" | "relax" | "suggest"
    #   "options": List[Dict[str, Any]],         # Reemplaza: clarification_options
    #   "metadata": {...},                       # Consolidación de metadata
    #   "payload": Dict[str, Any],               # Para session storage
    #   "message": str,                          # Mensaje construido
    # }

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 2: Analysis & Gray Zone) ✅ Completado
    # ═══════════════════════════════════════════════════════════════════
    analysis: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "raw_text": str,                         # Reemplaza: llm_analysis_text
    #   "filters": {
    #       "all": List[Dict],                   # Reemplaza: analyzer_filters
    #       "confidence_map": Dict[str, float],  # Reemplaza: analyzer_filter_confidence_map
    #       "low_confidence": List[Dict],        # Reemplaza: low_confidence_filters
    #       "soft_missing": List[Dict],          # Reemplaza: soft_missing_filters
    #       "used_columns": List[str],           # Reemplaza: used_filter_columns
    #   },
    #   "tables": {
    #       "list": List[str],                   # Reemplaza: analyzer_tables
    #       "count": int,                        # Reemplaza: analyzer_table_count (derivar de len)
    #   },
    #   "complexity": {
    #       "is_complex": bool,                  # Reemplaza: is_complex (unificar con is_complex_query)
    #       "join_count": int,                   # Reemplaza: analyzer_join_count
    #       "filter_count": int,                 # Reemplaza: analyzer_filter_count
    #       "has_groupby": bool,                 # Reemplaza: analyzer_has_groupby
    #   },
    #   "modules": {
    #       "territory": bool,                   # Reemplaza: needs_territory_module
    #       "funding": bool,                     # Reemplaza: needs_funding_module
    #   },
    #   "schema": {
    #       "minimal": str,                      # Reemplaza: schema_minimal_json
    #       "intermediate": str,                 # Reemplaza: schema_intermediate_json
    #   },
    #   "uncertainties": {
    #       "reason": str,
    #       "decision": Dict,
    #       "details": Dict,
    #       "non_mappable": List[Dict],
    #       "warnings": List[str],
    #       "actions": List[Dict],
    #   },
    #   "theme": {
    #       "strategy": Dict,
    #       "semantic_or_groups": List,          # Reemplaza: semantic_or_groups
    #   },
    # }

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 4: SQL) ✅ Completado
    # ═══════════════════════════════════════════════════════════════════
    sql: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "query": str,                          # Reemplaza: sql_query
    #   "query_raw": str,                      # Reemplaza: sql_query_raw
    #   "generation": {
    #       "candidates": List[str],           # Reemplaza: sql_candidates
    #       "scored": List,                    # Reemplaza: sql_scored_list
    #       "best_index": int,                 # Reemplaza: best_idx
    #       "rationale": str,                  # Reemplaza: llm_rationale
    #   },
    #   "execution": {
    #       "rowcount": int,                   # Reemplaza: rowcount_sql_result
    #       "more_than_limit": bool,           # Reemplaza: more_than_n_rows
    #       "error": Dict,                     # Reemplaza: sql_error_info
    #       "retry_count": int,                # Reemplaza: retry_count (moverlo aquí)
    #   },
    #   "keyword_regeneration": {
    #       "used": bool,                      # Reemplaza: used_keyword_regenerate
    #       "tokens_tried": List[str],         # Reemplaza: keyword_tokens_tried
    #       "replacements": List[Dict],        # Reemplaza: keyword_replacements
    #   },
    # }

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 4: Dimensions)
    # ═══════════════════════════════════════════════════════════════════
    dimensions: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "catalog": Dict,                       # Reemplaza: dimension_catalog
    #   "hints": {
    #       "summary": str,                    # Reemplaza: dimension_hints_summary (si existe)
    #       "catalog_subset": Dict,            # Reemplaza: dimension_hints_catalog (si existe)
    #       "vocabulary": Dict,                # Reemplaza: dimension_hints_vocabulary (si existe)
    #   },
    #   "suggestions": List[Dict],             # Reemplaza: dimension_filter_suggestions (si existe)
    # }

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 3: Rendering/Frontend) ✅ Completado
    # ═══════════════════════════════════════════════════════════════════
    rendering: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "limits": {
    #       "default": int,                    # Reemplaza: rows_limit_default
    #       "max": int,                        # Reemplaza: rows_limit_max
    #       "applied": int,                    # Reemplaza: rows_limit_applied
    #   },
    #   "frontend": {
    #       "summary": str,                    # Reemplaza: frontend_summary
    #       "table_markdown": str,             # Reemplaza: frontend_table_markdown
    #       "notes": List[str],                # Reemplaza: frontend_base_notes
    #       "warning_priority": str,           # Reemplaza: frontend_warning_priority
    #   },
    #   "citizen": {
    #       "feedback": Dict,                  # Reemplaza: citizen_feedback
    #       "actions": List[str],              # Reemplaza: citizen_actions
    #       "actions_details": Dict,           # Reemplaza: citizen_actions_details
    #       "note": str,                       # Reemplaza: citizen_note
    #       "enabled": bool,                   # Reemplaza: feature_citizen_node
    #   },
    # }

    # ═══════════════════════════════════════════════════════════════════
    # NEW CONSOLIDATED FIELDS (Phase 5: Lifecycle)
    # ═══════════════════════════════════════════════════════════════════
    lifecycle: NotRequired[Dict[str, Any]]
    # Estructura:
    # {
    #   "sql_retry_count": int,              # Reintentos de generación SQL
    #   "sql_max_retries": int,              # Límite de reintentos SQL (default: 3)
    #   "clarification_turn": int,           # Turno actual de clarificación
    #   "clarification_max": int,            # Límite de turnos (default: 2)
    #   "irrelevant_retry_count": int,       # Reintentos por filas irrelevantes
    #   "exit_reason": Optional[str],        # "success" | "max_retries" | "gray_zone" | "error"
    # }
