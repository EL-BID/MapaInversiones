"""Nodos de salida unificada para cortar el flujo de forma controlada.

Estos nodos no introducen lógica nueva; simplemente empaquetan el estado
actual en una forma que el frontend ya consume (`messages`, `response_type`,
`gray_zone_details`, etc.) y devuelven el control al grafo.
"""

from __future__ import annotations

from typing import Any, Dict

from langchain_core.messages import AIMessage
from loguru import logger

from modules.graph.state import AgentState


def _ensure_messages(state: AgentState) -> list:
    """Garantiza que siempre haya al menos un mensaje para responder."""
    msgs = state.get("messages") or []
    if msgs:
        return msgs
    # Fallback seguro si no hay contenido previo
    return [AIMessage(content="")]


def prefetch_exit(state: AgentState) -> Dict[str, Any]:
    """
    Punto de salida para rutas tempranas (moderación, social, soporte,
    irrelevante, definiciones, clarificación/gray-zone pre-SQL).
    Respeta los campos presentes y no modifica citizen_actions.
    """
    logger.info("FLOW ▸ PREFETCH_EXIT response_type={}", state.get("response_type"))
    payload: Dict[str, Any] = {
        "messages": _ensure_messages(state),
    }

    response_type = state.get("response_type") or state.get("recommended_action")
    if response_type:
        payload["response_type"] = response_type

    # Propaga asistencia/gray-zone si existen
    user_assistance = state.get("user_assistance")
    if user_assistance:
        payload["user_assistance"] = user_assistance

    gray_zone_details = state.get("gray_zone_details")
    if gray_zone_details:
        payload["gray_zone_details"] = gray_zone_details

    assistant_content_non_md = state.get("assistant_content_non_md")
    if assistant_content_non_md:
        payload["assistant_content_non_md"] = assistant_content_non_md

    return payload


# -------------------------------------------------------------------------
#  Logica de Clarificación (Interacción con usuario)
# -------------------------------------------------------------------------
from typing import List
from collections import defaultdict
from modules.utils.log_decorator import trace_node
from modules.graph.helpers_estado import (
    _get_user_assistance,
    _get_assistance_metadata,
    _increment_assistance_turn,
    _set_assistance_needed,
    _get_uncertainty_actions,
)
from modules.graph.helpers_texto import (
    MAX_CLARIFICATION_TURNS,
    _humanize_filter_column,
    _infer_topic_from_column,
)


@trace_node("request_clarification")
def request_clarification(state: AgentState):
    """Solicita datos adicionales cuando el analyzer detecta incertidumbres."""

    assistance = _get_user_assistance(state)
    metadata = _get_assistance_metadata(state)

    # ═══════════════════════════════════════════════════════════════════════════
    # FAST-PATH 0: Término territorial genérico → pedir texto libre (sin botones)
    # ═══════════════════════════════════════════════════════════════════════════
    if assistance.get("type") == "clarify_territory" or metadata.get(
        "requires_text_input"
    ):
        _increment_assistance_turn(state)
        assistance["type"] = "clarify_territory"
        assistance["moment"] = "pre_sql"
        assistance["needed"] = True

        user_input = state.get("territorial_ambiguous_input") or ""

        # Mensaje amigable pidiendo el nombre específico
        if not assistance.get("message"):
            assistance["message"] = (
                f"Para buscar proyectos en «{user_input}», necesito el nombre específico. "
                "¿Cuál es el nombre de su provincia, departamento o municipio?"
                if user_input
                else "¿Cuál es el nombre de su provincia, departamento o municipio?"
            )

        # SIN opciones de botones, el usuario responde con texto libre
        assistance["options"] = []
        metadata["targets"] = ["territory"]
        metadata["territory_options"] = []
        metadata["requires_text_input"] = True
        metadata["suggestions_available"] = False
        metadata["suggested_prompts"] = []
        metadata["non_blocking_issues"] = []
        _set_assistance_needed(state, True)

        clarification_message = AIMessage(
            content=assistance["message"],
            additional_kwargs={
                "clarification_type": "text_input",
                "topic": "territory",
            },
        )
        return {
            "messages": [clarification_message],
            "user_assistance": assistance,
            "territorial_options": [],
            "clarification": [],
            "clarification_turn": assistance.get("turn"),
            "clarification_limit": assistance.get("max_turns"),
            "response_type": "clarification",
            "stop_processing": True,
            "original_question": state.get("complete_user_question")
            or state.get("user_question")
            or "",
        }

    # ═══════════════════════════════════════════════════════════════════════════
    # FAST-PATH 1: Clarificación territorial con opciones (botones)
    # ═══════════════════════════════════════════════════════════════════════════
    territorial_options = (
        state.get("territorial_options") or metadata.get("territory_options") or []
    )
    if territorial_options:
        _increment_assistance_turn(state)
        assistance["type"] = "disambiguate"
        assistance["moment"] = "pre_sql"
        assistance["needed"] = True

        user_input = state.get("territorial_ambiguous_input") or ""
        assistance["message"] = (
            f"encuentro varias ubicaciones para «{user_input}». Selecciona la correcta."
            if user_input
            else "encuentro varias ubicaciones posibles. Selecciona la correcta para continuar."
        )

        clar_opts: list[Dict[str, Any]] = []
        for idx, opt in enumerate(territorial_options):
            tipo = opt.get("tipo") or opt.get("type") or ""
            valor_original = (
                opt.get("valor_original") or opt.get("valor") or opt.get("value")
            )
            valor_norm = (
                valor_original.strip().upper()
                if isinstance(valor_original, str)
                else valor_original
            )
            valor_display = valor_original or ""
            col = opt.get("columna_filtro") or opt.get("column")
            label = (
                f"{tipo.title()}: {valor_display}"
                if tipo and valor_display
                else (valor_display or "Opción")
            )
            clar_opts.append(
                {
                    "key": f"territory_{idx}",
                    "label": label,
                    "description": "Selecciona el territorio correcto",
                    "topic": "territory",
                    "target": "territory",
                    "column": col,
                    "value": valor_norm or valor_display,
                    "value_display": valor_display,
                    "interactive": True,
                    "source": "territory_ambiguity",
                }
            )

        # Defensa: si nada se generó pero hay opciones, crear entradas simples
        if not clar_opts and territorial_options:
            for idx, opt in enumerate(territorial_options):
                val = opt.get("valor_original") or opt.get("valor") or opt.get("value")
                col = opt.get("columna_filtro") or opt.get("column")
                clar_opts.append(
                    {
                        "key": f"territory_{idx}",
                        "label": val or "Opción",
                        "description": "Selecciona el territorio correcto",
                        "topic": "territory",
                        "column": col,
                        "value": val,
                        "source": "territory_ambiguity",
                    }
                )

        assistance["options"] = clar_opts
        metadata["targets"] = ["territory"]
        metadata["territory_options"] = territorial_options
        metadata["suggestions_available"] = False
        metadata["suggested_prompts"] = []
        metadata["non_blocking_issues"] = []
        metadata["fallback_options"] = []
        _set_assistance_needed(state, True)

        clarification_message = AIMessage(
            content=assistance["message"],
            additional_kwargs={"clarification": clar_opts},
        )
        return {
            "messages": [clarification_message],
            "user_assistance": assistance,
            "territorial_options": territorial_options,
            "clarification": clar_opts,
            "clarification_turn": assistance.get("turn"),
            "clarification_limit": assistance.get("max_turns"),
            "response_type": "clarification",
            "stop_processing": True,
            "original_question": state.get("complete_user_question")
            or state.get("user_question")
            or "",
        }

    # --- Resto del flujo de clarificación genérica ---

    current_turn = _increment_assistance_turn(state)
    max_turns = MAX_CLARIFICATION_TURNS

    targets = [t for t in (metadata.get("targets") or []) if t]
    if targets:
        metadata["targets"] = list(dict.fromkeys(targets))

    country_code = state.get("country_code", "")
    question_text = (
        state.get("complete_user_question") or state.get("user_question") or ""
    )

    moment = assistance.get("moment") or "pre_sql"
    context = moment.replace("_sql", "_fetch")

    options_seed = list(assistance.get("options") or [])
    if not options_seed:
        options_seed = list(metadata.get("fallback_options") or [])

    synonyms = list(metadata.get("synonyms") or [])
    used_filters = list(metadata.get("used_filters") or [])

    uncertainty_actions = _get_uncertainty_actions(state)
    low_conf_filters = state.get("low_confidence_filters") or []
    soft_missing_filters = state.get("soft_missing_filters") or []

    candidate_filters: list[Dict[str, Any]] = []
    if low_conf_filters:
        candidate_filters.extend(low_conf_filters)
    if soft_missing_filters:
        candidate_filters.extend(soft_missing_filters)

    topic_to_filters: dict[str, list[Dict[str, Any]]] = defaultdict(list)
    for flt in candidate_filters:
        topic = _infer_topic_from_column(flt.get("column") or "")
        topic_to_filters[topic].append(flt)

    def _as_float(value: Any, default: float = 0.0) -> float:
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    def build_analyzer_suggestions() -> list[Dict[str, Any]]:
        suggestions: list[Dict[str, Any]] = []
        for idx, item in enumerate(uncertainty_actions):
            action_text = (item.get("action") or "").strip()
            message_text = (item.get("message") or "").strip()
            if not action_text and not message_text:
                continue
            topic = (item.get("topic") or "general").lower()
            filters_for_topic = (
                topic_to_filters.get(topic) or topic_to_filters.get("general") or []
            )
            primary_filter = None
            if filters_for_topic:
                primary_filter = max(
                    filters_for_topic,
                    key=lambda f: _as_float(f.get("confidence")),
                    default=None,
                )
            column = primary_filter.get("column") if primary_filter else None
            value = primary_filter.get("value") if primary_filter else None
            confidence = (
                _as_float(primary_filter.get("confidence")) if primary_filter else None
            )
            label = action_text or message_text or "Aclarar criterio"
            description = message_text if action_text else ""
            suggestions.append(
                {
                    "key": f"uncertainty_{idx}",
                    "label": label,
                    "description": description,
                    "topic": topic,
                    "column": column,
                    "value": value,
                    "confidence": confidence,
                    "source": "analyzer_uncertainty",
                }
            )
        return suggestions

    def build_filter_suggestions(
        start_index: int, exclude_columns: set[str]
    ) -> list[Dict[str, Any]]:
        suggestions: list[Dict[str, Any]] = []
        if not candidate_filters:
            return suggestions
        filtered = [
            flt
            for flt in candidate_filters
            if (flt.get("column") or "") not in exclude_columns
        ]
        for offset, flt in enumerate(filtered[:3], start=start_index):
            column = flt.get("column")
            value = flt.get("value")
            confidence_val = None
            if flt.get("confidence") is not None:
                confidence_val = _as_float(flt.get("confidence"))
            topic = _infer_topic_from_column(column or "")
            label = f"Confirmar { _humanize_filter_column(column) }"
            detail_parts: list[str] = []
            if value:
                detail_parts.append(f"ej.: {value}")
            if confidence_val is not None:
                detail_parts.append(f"confianza {confidence_val:.2f}")
            description = ", ".join(detail_parts)
            suggestions.append(
                {
                    "key": f"filter_{offset}",
                    "label": label,
                    "description": description,
                    "topic": topic,
                    "column": column,
                    "value": value,
                    "confidence": confidence_val,
                    "source": "low_conf_filter",
                }
            )
        return suggestions

    analyzer_suggestions = build_analyzer_suggestions()
    used_columns_from_actions = {
        opt.get("column") for opt in analyzer_suggestions if opt.get("column")
    }

    filter_suggestions = build_filter_suggestions(
        len(analyzer_suggestions), used_columns_from_actions
    )

    options: List[Dict[str, Any]] = analyzer_suggestions + filter_suggestions

    if not options and not assistance.get("options"):
        logger.info("CLARIFY ▸ No options generated; skipping clarification.")
        return {"user_assistance": assistance}

    assistance["options"] = options
    _set_assistance_needed(state, True)

    # Construir mensaje informativo con tipo y opciones
    topics_set = {opt.get("topic") for opt in options if opt.get("topic")}
    topic_labels = {
        "valor_ambiguo": "el tipo de valor (monto del proyecto vs ejecutado)",
        "year_scope": "el rango de años",
        "territorio": "la ubicación geográfica",
        "territorio_ambiguo": "el territorio específico",
        "pregunta_incompleta": "información adicional",
        "pregunta_general": "más detalles",
    }

    if len(topics_set) == 1:
        topic = list(topics_set)[0]
        topic_desc = topic_labels.get(topic, "un dato adicional")
        # Buscar la primera opción con label para mostrar las alternativas
        option_labels = [opt.get("label") for opt in options if opt.get("label")]
        if option_labels:
            assistance["message"] = f"Necesito aclarar {topic_desc}:"
        else:
            assistance["message"] = f"Necesito aclarar {topic_desc}."
    else:
        assistance["message"] = "Necesito aclarar algunos datos para continuar:"

    metadata["targets"] = [opt.get("topic") for opt in options if opt.get("topic")]

    # Agregar endpoints dinámicos para cada target conocido
    # Estos permiten al frontend cargar opciones desde el backend
    from modules.graph.helpers_respuesta import CLEAR_CLARIFICATION_ENDPOINTS

    endpoints: Dict[str, str] = {}
    for target in metadata["targets"]:
        if target in CLEAR_CLARIFICATION_ENDPOINTS:
            endpoints[target] = CLEAR_CLARIFICATION_ENDPOINTS[target]
    if endpoints:
        metadata["endpoints"] = endpoints

    clarification_message = AIMessage(
        content=assistance["message"], additional_kwargs={"clarification": options}
    )

    return {
        "messages": [clarification_message],
        "user_assistance": assistance,
    }
