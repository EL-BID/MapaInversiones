# nodes_prefetch.py
# Etapa de prefetch: contiene los nodos iniciales del grafo (saludos, soporte,
# detección de irrelevancia y bloqueos por moderación) que se ejecutan antes
# de construir consultas SQL o buscar datos.

from __future__ import annotations

import ast
import json
import re
import time
import traceback
import tiktoken
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import Any, Dict, List, Set, Union
from pydantic import ValidationError

from loguru import logger
from langchain_core.messages import AIMessage, HumanMessage
from langchain.schema import Document

from modules.config import settings
from modules.graph.state import AgentState
from modules.schemas.schemas import (
    CompleteQuestion,
    InboxClassification,
    pii_check,
)
from modules.graph.prompts_prefetch import (
    check_personal_info_prompt,
    generate_complete_question_prompt_v2,
    inbox_classifier_prompt,
    llm_analyzer_prompt,
    llm_analyzer_2_prompt,
)
from modules.tools.tools import rerank_search
from modules.utils.build_schema_enriched import (
    SCHEMA_MINIMAL_JSON,
    INTERMEDIATE_SCHEMA_JSON,
    SCHEMA_JSON_GLOBAL,
)
from modules.utils.filter_refinement import (
    build_compound_text_filters,
    dumps_compound_filters,
    sanitise_refined_filters,
    build_filter_guidance_block,
    build_default_refined_filters,
    detect_semantic_or_groups,
    TARGET_TEXT_COLUMNS,
)
from modules.utils.text_processing import tokenize_like_process_text
from modules.utils.cache_utils import get_cache_hit, get_cache_hit_sql
from modules.graph.helpers import *  # noqa: F401,F403

# Explicit imports from helpers_estado (circular import workaround)
from modules.graph.helpers_estado import (
    _reset_user_assistance,
    _init_user_assistance,
    _init_analysis,
    _get_analysis_raw_text,
    _set_analysis_raw_text,
    _get_analysis_filters,
    _set_analysis_filters,
    _get_analysis_used_columns,
    _get_analyzer_tables,
    _set_analysis_tables,
    _get_analysis_modules,
    _set_analysis_modules,
    _get_is_complex,
    _set_complexity,
    _get_user_assistance,
    _get_assistance_needed,
    _set_assistance_needed,
    _get_assistance_turn,
    _get_gray_zone_reason,
    _set_gray_zone_reason,
    _get_gray_zone_decision,
    _set_gray_zone_decision,
    _get_gray_zone_details,
    _set_gray_zone_details,
    _get_gray_zone_warnings,
    _set_gray_zone_warnings,
    _set_gray_zone_non_mappable,
    _get_uncertainty_actions,
    _set_uncertainty_actions,
    _get_dimensions_catalog,
    _ensure_dimensions_loaded,
    _get_filtered_dimensions_for_analyzer,
    _set_dimension_suggestions,
    _clear_dimension_suggestions,
    _get_theme_strategy,
    _set_theme_strategy,
    _get_semantic_or_groups,
    _set_semantic_or_groups,
    _get_blocked_catalog_tokens,
    _get_assistance_metadata,
    # Session Memory
    _format_session_memory_for_prompt,
    _get_resolved_dimensions,
    _get_session_memory,
)

# Explicit imports from helpers_texto (circular import workaround)
from modules.graph.helpers_texto import (
    _parse_analyzer_sections,
    _normalize_column_name,
    _tokens_from_phrase,
    _extract_question_phrases,
    _is_structured_text_column,
    _get_schema_column_names,
    _resolve_known_acronyms,
    _sanitize_refined_tokens,
    _scrub_stoplist_from_compound_filters,
    _fuzzy_match_from_catalog,
    _strip_function_wrappers,
)

# Explicit imports from helpers_sql (circular import workaround)
from modules.graph.helpers_sql import (
    _derive_modules_from_analyzer,
    _classify_filters_by_table,
    _filter_schema_json,
    _filter_schema_json_by_columns,
    BASE_PROJECT_TABLE,
)

# Explicit imports from helpers_respuesta (circular import workaround)
from modules.graph.helpers_respuesta import (
    _build_dimension_filter_block,
    _build_dimension_prompt_payload,
    _register_structured_text_filter,
    _suggest_dimension_filters_from_keywords,
)

# Dimension matching for additive search
from modules.graph.dimension_matcher import DimensionMatcher

# Territory resolution utilities
from modules.utils.dimension_utils import resolve_territory
from modules.utils.log_decorator import trace_node
from modules.utils.llm_guardrails import invoke_llm_chain

from constants.nodes import (
    IRRELEVANT_QUESTION_MSG,
    GREETING_MESSAGE,
    SUPPORT_RESPONSE_HND,
    SUPPORT_RESPONSE_PAN,
    SUPPORT_RESPONSE_PRY,
    SUPPORT_RESPONSE_DOM,
    SAFE_RESPONSE,
)

# ─────────────────────────────────────────────────────────────
# MODULE HELPERS
# ─────────────────────────────────────────────────────────────


def _check_hybrid_cache(q: str, country: str):
    """
    Helper para probar SQL y luego Vector según configuración.
    Usado por check_cache_raw (START) y inbox_classifier (fallback).
    """
    if not q:
        return None

    # Global Kill Switch
    if not settings.cache_enabled:
        return None

    # TIER 0: SQL Exact/Flexible
    if settings.cache_enable_postgres_search:
        info = get_cache_hit_sql(q, country)
        if info and info["is_cache_hit"]:
            logger.info(f"FLOW ▸ CACHE HIT (Tier 0 - SQL) query='{q[:50]}...'")
            return info

    # TIER 1: Vector Search
    if settings.cache_enable_vector_search:
        # Fallback a vector store
        info = get_cache_hit(q, country)
        if info and info["is_cache_hit"]:
            logger.info(f"FLOW ▸ CACHE HIT (Tier 1 - Vector) query='{q[:50]}...'")
            return info

    return None


@trace_node("check_cache_raw")
def check_cache_raw(state: AgentState):
    """
    ╔══════════════════════════════════════════════════════════════════╗
    ║                 CHECK_CACHE_RAW (ENTRY NODE)                      ║
    ║  Primer punto de contacto. Verifica si la pregunta CRUD           ║
    ║  ya tiene respuesta en cache (Tier 0 o Tier 1).                   ║
    ╚══════════════════════════════════════════════════════════════════╝
    Objetivo: Short-circuit inmediato antes de gastar tokens LLM.
    """
    raw_question = state.get("user_question", "") or ""
    country = state.get("country_code", "dom")

    logger.info(f"FLOW ▸ CHECK_CACHE_RAW START query='{raw_question[:50]}...'")

    cache_info = _check_hybrid_cache(raw_question, country)

    if cache_info and cache_info["is_cache_hit"]:
        is_recent_cache_hit = cache_info["is_recent_cache_hit"]
        src_type = cache_info.get("source", "vector")
        cache_source = f"raw_{src_type}"
        logger.info(
            f"FLOW ▸ CACHE HIT (RAW) found! Skipping LLM analysis. Source: {cache_source}"
        )

        # Poblar estado
        state["is_cache_hit"] = True
        state["is_recent_cache_hit"] = is_recent_cache_hit
        state["cache_data"] = cache_info
        state["source"] = "web"  # Default assumption if not set
        state["complete_user_question"] = raw_question  # FIX for Key Error downstream

        # Poblar estructura SQL para helpers downstream
        sql_container = state.get("sql")
        if not isinstance(sql_container, dict):
            sql_container = {}
            state["sql"] = sql_container

        sql_container["query"] = cache_info.get("sql_query")

        execution = sql_container.get("execution")
        if not isinstance(execution, dict):
            execution = {}
            sql_container["execution"] = execution

        execution["cached_results"] = cache_info.get("results")

        return {
            "is_cache_hit": True,
            "is_recent_cache_hit": is_recent_cache_hit,
            "complete_user_question": raw_question,  # FIX for Key Error downstream
            "sql": sql_container,  # FIX: Persist populated sql execution data
        }

    logger.info("FLOW ▸ CACHE MISS (RAW) -> Proceeding to Question Rewrite (LLM)")
    return {"is_cache_hit": False}


# 🔴 Definir el límite de tokens para documentos y fewshots
MAX_TOKENS_DOCUMENTS = 1200  # Ajusta según lo que permita GPT-4o Mini
MAX_TOKENS_FEWSHOTS = 1200  # Ajusta según lo que permita GPT-4o Mini


def _build_recent_history(state: AgentState, window_seconds: int) -> str:
    """
    Construye el historial de conversación reciente en formato texto (User/Assistant),
    filtrando por ventana de tiempo y eliminando preguntas regeneradas.
    """
    now_ts = time.time()
    msg_tuples: list[tuple[float, HumanMessage | AIMessage]] = []

    for m in state["messages"]:
        # Ignorar preguntas regeneradas para evitar duplicación
        additional = (
            getattr(m, "additional_kwargs", {})
            if hasattr(m, "additional_kwargs")
            else {}
        )
        if additional.get("is_regenerated"):
            continue

        ts = additional.get("timestamp")
        if ts is None or now_ts - ts <= window_seconds:
            msg_tuples.append((ts or 0, m))

    # Orden cronológico ascendente
    msg_tuples.sort(key=lambda t: t[0])

    history_lines = []
    truncate_limit = getattr(settings, "history_truncate_chars", 1500)

    for _, m in msg_tuples:
        if isinstance(m, HumanMessage):
            history_lines.append(f"User: {m.content}")
        elif isinstance(m, AIMessage):
            content = m.content
            if len(content) > truncate_limit:
                content = content[:truncate_limit] + "..."
            history_lines.append(f"Assistant: {content}")
        else:
            history_lines.append(f"Message: {m.content}")

    return "\n".join(history_lines)


def handle_irrelevant_question(state: AgentState):
    """
    Envía un mensaje indicando que la pregunta no es relevante.

    Args:
        state (dict): El estado actual.

    Returns:
        dict: El estado actualizado con la respuesta de pregunta irrelevante.
    """
    state["is_relevant"] = "no"
    return {"messages": [AIMessage(content=IRRELEVANT_QUESTION_MSG)]}


def _contains_dom_insulto(text: str) -> bool:
    if not text:
        return False
    t = text.lower()
    return any(re.search(rf"\\b{re.escape(tok)}\\b", t) for tok in _DOM_INSULTO)


def send_greeting(state: AgentState):
    """
    Envía un mensaje de saludo si es una interacción social.

    Args:
        state (dict): El estado actual.

    Returns:
        dict: El estado actualizado con el saludo.
    """
    state["is_social_interaction"] = "yes"
    return {"messages": [AIMessage(content=GREETING_MESSAGE)]}


def send_confirmation_response(state: AgentState):
    """
    Envía una respuesta de confirmación cuando el usuario valida/confirma algo.

    Este nodo maneja meta-comunicación conversacional como:
    - "tu entiendes que los más importantes son los de mayor monto"
    - "Confirmo que..."
    - "Exacto, eso es"
    - "Ok, entendido"

    NO ejecuta SQL - simplemente confirma el entendimiento mutuo.
    """
    state["is_confirmation"] = "yes"

    # Obtener la pregunta original para contexto
    question = state.get("complete_user_question") or state.get("user_question") or ""

    # Respuesta conversacional de confirmación
    confirmation_message = (
        "Entendido. La información mostrada anteriormente sigue vigente. "
        "Si desea ver otros datos, modificar los filtros o explorar otra consulta, "
        "estoy aquí para ayudarle. ¿Hay algo más que desee consultar?"
    )

    logger.info(
        "FLOW ▸ SEND_CONFIRMATION question='{}' → acknowledgment response",
        question[:50] if question else "(empty)",
    )

    return {
        "messages": [AIMessage(content=confirmation_message)],
        "response_type": "confirmation_acknowledgment",
    }


def send_support_response(state: AgentState):
    """
    Envía la información de contacto adecuada según el país.
    Si no existe información para el país elegido, muestra un
    mensaje genérico invitando a seguir consultando.
    """
    state["is_support_request"] = "yes"

    iso = (state.get("country_code") or "").lower()

    contacts_by_iso = {
        "hnd": SUPPORT_RESPONSE_HND,
        "pan": SUPPORT_RESPONSE_PAN,
        "pry": SUPPORT_RESPONSE_PRY,
        "dom": SUPPORT_RESPONSE_DOM,
    }

    content = contacts_by_iso.get(
        iso,
        (
            "Aún no contamos con datos de contacto oficiales para su país. "
            "Puede seguir explorando la información pública. "
            "Ejemplo: *¿Cuántos proyectos de educación hay en este año?*"
        ),
    )

    return {"messages": [AIMessage(content=content)]}


def moderation_reprompt(state: AgentState):
    logger.info("---MODERATION REPROMPT---")
    state["stop_processing"] = True
    return {
        "messages": [AIMessage(content=SAFE_RESPONSE)],
        "response_type": "moderation_reprompt",
        "stop_processing": True,
    }


# ══════════════════════════════════════════════════════════════════════
# Helper functions
# ══════════════════════════════════════════════════════════════════════


def perform_rerank_search(
    question,
    country_code,
    keyword_n,
    semantic_n,
    top_n,
    fewshots=False,
    all=False,
    **kwargs,
):
    """
    Envuelve la llamada a `rerank_search` para evitar repetir lógica.
    """
    return rerank_search(
        question=question,
        country_code=country_code,
        keyword_n=keyword_n,
        semantic_n=semantic_n,
        top_n=top_n,
        fewshots=fewshots,
        all=all,
        **kwargs,
    )


def count_tokens(text):
    """Cuenta los tokens usando tiktoken para GPT-4o Mini"""
    if not text:
        return 0
    try:
        enc = tiktoken.encoding_for_model("gpt-4o")  # Usa el tokenizer correcto
    except Exception:
        enc = tiktoken.get_encoding("cl100k_base")  # Fallback encoding
    return len(enc.encode(text))


def _record_trace_tokens(state: AgentState, label: str, tokens: int) -> None:
    """Acumula tokens utilizados por componente cuando el trace está habilitado."""
    if not isinstance(state, dict) or tokens is None:
        return
    trace = state.setdefault("_trace_metrics", {"nodes": [], "tokens": {}})
    tokens_map = trace.setdefault("tokens", {})
    tokens_map[label] = tokens_map.get(label, 0) + tokens


def truncate_text(text, max_tokens):
    """Trunca el texto para que no supere max_tokens"""
    enc = tiktoken.encoding_for_model("gpt-4o")
    tokens = enc.encode(text)
    truncated_tokens = tokens[:max_tokens]  # Corta el exceso
    return enc.decode(truncated_tokens)


def _prepare_document_block(
    documents: List[str], max_tokens: int, label: str, state: AgentState
) -> tuple[str, int]:
    """
    Une, cuenta y trunca una lista de snippets devolviendo el texto y los tokens usados.
    """
    if not documents:
        return "", 0

    content = "\n\n".join(documents)
    tokens = count_tokens(content)
    logger.info(f"🔢 Tokens en `{label}`: {tokens}")
    if tokens > max_tokens:
        logger.warning(f"✂️ Truncando `{label}` por exceso de tokens...")
        content = truncate_text(content, max_tokens)
        tokens = count_tokens(content)
        logger.info(f"🔢 Tokens `{label}` tras truncado: {tokens}")

    _record_trace_tokens(state, label, tokens)
    return content, tokens


def _docs_to_str(docs: Union[str, List[Document]]) -> str:
    """
    Convierte el output del vector-store a un bloque de texto plano.
    Acepta:
      • str  →   se devuelve tal cual
      • List[Document] →  se concatenan los page_content
    """
    if isinstance(docs, str):
        return docs

    # Si es lista de Document de LangChain
    try:
        return "\n\n".join(d.page_content for d in docs)  # type: ignore[attr-defined]
    except Exception:
        logger.warning("Formato de documentos no reconocido; casting a str.")
        return str(docs)


def _detect_cross_table_or_semantic(state: AgentState) -> bool:
    """
    Detecta si hay OR semánticos que cruzan diferentes tablas.

    Si un grupo OR contiene filtros de tabla 'p' Y tabla 't',
    NO podemos optimizar moviendo filtros de 't' al ON clause
    porque cambiaría la semántica del OR.

    Returns:
        True si hay OR semánticos cross-table (desactivar optimización)
        False si no hay OR cross-table (seguro optimizar)
    """
    semantic_or_groups = _get_semantic_or_groups(state)
    if not semantic_or_groups:
        return False

    for group in semantic_or_groups:
        if not isinstance(group, dict):
            continue

        # Extraer columnas del grupo
        literals = group.get("literals", [])
        if not literals:
            continue

        # Detectar tablas involucradas en este grupo OR
        tables_in_group: Set[str] = set()
        for literal in literals:
            if not isinstance(literal, dict):
                continue
            column = str(literal.get("column", "")).strip()
            if "." in column:
                table_alias = column.split(".")[0]
                tables_in_group.add(table_alias)

        # Si el grupo OR usa más de una tabla, hay cross-table
        if len(tables_in_group) > 1:
            logger.info(
                "ANALYZER2 ▸ JOIN_OPT cross_table_or_detected tables={}",
                sorted(tables_in_group),
            )
            return True

    return False


# ═══════════════════════════════════════════════════════════════════════════
# TOPIC SWITCH DETECTION - Validación en Python (determinística)
# ═══════════════════════════════════════════════════════════════════════════

# Patrones anafóricos que indican referencia a contexto previo
_ANAPHORIC_PATTERNS = [
    r"\besos?\b",
    r"\besas?\b",
    r"\bestos?\b",
    r"\bestas?\b",
    r"\bahí\b",
    r"\bde ahí\b",
    r"\beso\b",
    r"\bde eso\b",
    r"\blo mismo\b",
    r"\bla misma\b",
    r"\blos mismos\b",
    r"\blas mismas\b",
    r"\bel mismo\b",
    r"\baquel\b",
    r"\baquellos\b",
    r"\baquella\b",
    r"\baquellas\b",
    r"\btambién\b",
    r"\bademás\b",
    r"\by los otros\b",
    r"\blos demás\b",
]

# Sectores conocidos que pueden ser inyectados incorrectamente
_KNOWN_SECTOR_KEYWORDS = [
    "educación",
    "educativo",
    "educativa",
    "salud",
    "turismo",
    "transporte",
    "infraestructura",
    "vivienda",
    "agricultura",
    "ambiente",
    "energía",
    "cambio climático",
    "protección social",
    "agua",
    "saneamiento",
]


def _has_anaphoric_reference(text: str) -> bool:
    """
    Detecta si el texto contiene referencias anafóricas que indican
    que el usuario se refiere a algo del contexto previo.
    """
    text_lower = text.lower()
    for pattern in _ANAPHORIC_PATTERNS:
        if re.search(pattern, text_lower):
            return True
    return False


def _detect_topic_switch_injection(
    raw_question: str, regenerated_question: str, state: AgentState
) -> tuple[bool, str, list[str]]:
    """
    Detecta si el regenerated_question contiene conceptos inyectados
    que NO están en el raw_question (topic switch error).

    Returns:
        tuple: (is_topic_switch, safe_question, injected_concepts)
        - is_topic_switch: True si se detectó inyección indebida
        - safe_question: La pregunta limpia a usar (raw si hay inyección)
        - injected_concepts: Lista de conceptos que fueron inyectados
    """
    raw_lower = raw_question.lower().strip()
    regen_lower = regenerated_question.lower().strip()

    # Si son iguales o muy similares, no hay problema
    if raw_lower == regen_lower:
        return False, regenerated_question, []

    # Si raw_question tiene referencias anafóricas, es válido inyectar contexto
    if _has_anaphoric_reference(raw_question):
        logger.debug("TOPIC_SWITCH ▸ raw has anaphoric refs, injection allowed")
        return False, regenerated_question, []

    # Si raw_question es muy corta (< 4 palabras), puede ser un follow-up válido
    raw_words = raw_lower.split()
    if len(raw_words) < 4:
        logger.debug(
            "TOPIC_SWITCH ▸ raw is short ({} words), may be follow-up", len(raw_words)
        )
        return False, regenerated_question, []

    # Detectar conceptos de sector inyectados
    injected = []
    session_memory = state.get("lifecycle", {}).get("session_memory", {})
    resolved_dims = session_memory.get("resolved_dimensions", {})

    for dim_col, dim_data in resolved_dims.items():
        dim_value = str(dim_data.get("value", "")).lower()
        if not dim_value:
            continue

        # Verificar si el valor está en regenerated pero NO en raw
        # Usamos variaciones del valor para detectar
        value_variants = [dim_value]
        # Agregar variante sin acentos básica
        value_no_accent = (
            dim_value.replace("á", "a")
            .replace("é", "e")
            .replace("í", "i")
            .replace("ó", "o")
            .replace("ú", "u")
        )
        if value_no_accent != dim_value:
            value_variants.append(value_no_accent)

        for variant in value_variants:
            in_regen = variant in regen_lower
            in_raw = variant in raw_lower

            if in_regen and not in_raw:
                injected.append(dim_value)
                logger.warning(
                    "TOPIC_SWITCH ▸ DETECTED injected='{}' (from session_memory), in_regen={}, in_raw={}",
                    dim_value,
                    in_regen,
                    in_raw,
                )
                break

    # También verificar keywords de sector conocidos
    for sector_kw in _KNOWN_SECTOR_KEYWORDS:
        in_regen = sector_kw in regen_lower
        in_raw = sector_kw in raw_lower

        if in_regen and not in_raw and sector_kw not in [i.lower() for i in injected]:
            # Solo agregar si parece ser un filtro de sector (no parte de otra palabra)
            # Verificar que sea palabra completa
            pattern = r"\b" + re.escape(sector_kw) + r"\b"
            if re.search(pattern, regen_lower) and not re.search(pattern, raw_lower):
                injected.append(sector_kw)
                logger.warning(
                    "TOPIC_SWITCH ▸ DETECTED sector_keyword='{}' injected", sector_kw
                )

    if injected:
        logger.warning(
            "TOPIC_SWITCH ▸ BLOCKING INJECTION raw='{}' regen='{}' injected={}",
            raw_question[:100],
            regenerated_question[:100],
            injected,
        )
        # Usar la pregunta RAW como fuente de verdad
        return True, raw_question, injected

    return False, regenerated_question, []


# ─────────────────────────────────────────────────────────────
# Prefetch nodes (movidos desde nodes.py)
# ─────────────────────────────────────────────────────────────


def check_personal_info(state: AgentState):
    """
    Ejecuta el chequeo de PII y Contenido Prohibido con el prompt unificado.
    Mantiene compatibilidad hacia atrás:
      - Si el modelo sólo devuelve has_pii, actuamos como antes.
      - Si devuelve los campos extendidos, activamos el ruteo 'allow/reprompt/block'.
    """
    user_question = state.get("user_question", "") or ""
    logger.info(
        "FLOW ▸ MODERATION START question='{}'",
        user_question[:120],
    )

    chain = create_chain(
        check_personal_info_prompt,
        ["user_input"],
        schema=pii_check,  # el schema debe reflejar el contrato actual
    )

    try:
        response = invoke_llm_chain(
            chain,
            {"user_input": user_question},
            label="prefetch.check_personal_info",
        )
    except Exception as e:
        logger.warning(f"FLOW ▸ MODERATION error={e}")
        # Falla silenciosa → permitir continuar, pero dejando flags en state
        state["has_pii"] = False
        state["is_prohibited"] = False
        state["recommended_action"] = "allow"
        state["moderation"] = {"action": "allow", "note": "moderation_error"}
        logger.info("FLOW ▸ MODERATION END action=allow has_pii=False prohibited=False")
        return {"has_pii": False, "moderation": state["moderation"]}

    # Helper robusto para extraer campos
    def _safe_get(attr, default=None):
        try:
            val = getattr(response, attr, default)
        except Exception:
            val = default
        return default if val is None else val

    # Campos del schema (con defaults)
    has_pii_str = str(_safe_get("has_pii", "no")).lower()
    is_prohibited_str = str(_safe_get("is_prohibited", "no")).lower()
    recommended_action = str(
        (_safe_get("recommended_action", "allow") or "allow")
    ).lower()
    pii_types = _safe_get("pii_types", []) or []
    prohibited_findings = _safe_get("prohibited_findings", []) or []
    location_exception_applied = bool(_safe_get("location_exception_applied", False))
    rationale = _safe_get("rationale", "") or ""

    has_pii_bool = has_pii_str == "yes"
    is_prohibited_bool = is_prohibited_str == "yes"

    # Compatibilidad: si no vino 'recommended_action' válido, usar modo legacy
    if recommended_action not in {"allow", "reprompt", "block"}:
        if has_pii_bool:
            logger.info("FLOW ▸ MODERATION legacy_action=reprompt has_pii=True")
            state["has_pii"] = True
            state["is_prohibited"] = False
            state["recommended_action"] = "reprompt"
            state["moderation"] = {
                "action": "reprompt",
                "has_pii": True,
                "is_prohibited": False,
                "categories": [],
                "severity": None,
                "pii_types": pii_types,
                "location_exception_applied": location_exception_applied,
                "note": "legacy_has_pii",
            }
            return {
                "messages": [AIMessage(content=SAFE_RESPONSE)],
                "has_pii": True,
                "moderation": state["moderation"],
                "response_type": "moderation_reprompt",
                "stop_processing": True,
            }

        # Legacy allow: sin PII → continuar, dejando huella en state
        state["has_pii"] = False
        state["is_prohibited"] = False
        state["recommended_action"] = "allow"
        state["moderation"] = {"action": "allow", "note": "legacy_allow"}
        logger.info("FLOW ▸ MODERATION legacy_action=allow has_pii=False")
        return {"has_pii": False, "moderation": state["moderation"]}

    # Construir metadata de prohibiciones
    categories, severities = [], []
    try:
        for finding in prohibited_findings or []:
            cat = str(finding.get("category", "")).strip()
            sev = str(finding.get("severity", "")).strip().lower()
            if cat:
                categories.append(cat)
            if sev:
                severities.append(sev)
    except Exception:
        pass

    # Elegir severidad máxima (low < medium < high)
    order = {"low": 1, "medium": 2, "high": 3}
    max_severity = None
    if severities:
        max_severity = max(severities, key=lambda s: order.get(s, 0))

    moderation_payload = {
        "action": recommended_action,
        "has_pii": has_pii_bool,
        "is_prohibited": is_prohibited_bool,
        "categories": categories,
        "severity": max_severity,
        "pii_types": pii_types,
        "location_exception_applied": location_exception_applied,
        "note": rationale[:100],
    }

    # Persistir flags en state
    state["has_pii"] = has_pii_bool
    state["is_prohibited"] = is_prohibited_bool
    state["recommended_action"] = recommended_action
    state["moderation"] = moderation_payload

    # Ruteo según acción recomendada
    hate_filtered = (
        moderation_payload.get("content_filter_result", {})
        .get("hate", {})
        .get("filtered")
        or False
    )

    if recommended_action == "block" or hate_filtered:
        logger.info(
            "FLOW ▸ MODERATION END\n"
            "   ↳ action=block\n"
            "   ↳ has_pii={}\n"
            "   ↳ is_prohibited={}\n"
            "   ↳ is_relevant=no\n"
            "   ↳ is_social_interaction=no\n"
            "   ↳ is_support_request=no\n"
            "   ↳ is_definitions_lookup=no\n"
            "   ↳ categories={} severity={} hate_filtered={}\n"
            "   ↳ pii_types={} location_exception_applied={}",
            has_pii_bool,
            is_prohibited_bool,
            categories,
            max_severity,
            hate_filtered,
            pii_types,
            location_exception_applied,
        )
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "has_pii": has_pii_bool,
            "moderation": moderation_payload,
            "response_type": "moderation_blocked",
            "stop_processing": True,
        }

    if recommended_action == "reprompt":
        logger.info(
            "FLOW ▸ MODERATION END\n"
            "   ↳ action=reprompt\n"
            "   ↳ has_pii={}\n"
            "   ↳ is_prohibited={}\n"
            "   ↳ is_relevant=no\n"
            "   ↳ is_social_interaction=no\n"
            "   ↳ is_support_request=no\n"
            "   ↳ is_definitions_lookup=no\n"
            "   ↳ categories={} severity={}\n"
            "   ↳ pii_types={} location_exception_applied={}",
            has_pii_bool,
            is_prohibited_bool,
            categories,
            max_severity,
            pii_types,
            location_exception_applied,
        )
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "has_pii": has_pii_bool,
            "moderation": moderation_payload,
            "response_type": "moderation_reprompt",
            "stop_processing": True,
        }

    # allow
    logger.info(
        "FLOW ▸ MODERATION END\n"
        "   ↳ action=allow\n"
        "   ↳ has_pii={}\n"
        "   ↳ is_prohibited={}\n"
        "   ↳ categories={}",
        has_pii_bool,
        is_prohibited_bool,
        categories,
    )
    return {
        "has_pii": has_pii_bool,
        "moderation": moderation_payload,
    }


def inbox_classifier(state: AgentState):
    """
    ╔══════════════════════════════════════════════════════════════════╗
    ║                      INBOX_CLASSIFIER                             ║
    ║  Nodo unificado de moderación + clasificación de intención.      ║
    ║  Fusiona check_personal_info (PII + contenido prohibido)         ║
    ║  con clasificación de flags (is_relevant, is_social, is_support).║
    ╚══════════════════════════════════════════════════════════════════╝

    RESPONSABILIDADES:
    1. MODERACIÓN (SECCIÓN 1 del prompt):
       - Detecta PII (información personal identificable)
       - Detecta contenido prohibido (odio, violencia, sexual, self-harm, jailbreak, protected material)
       - Recomienda acción: allow/reprompt/block

    2. CLASIFICACIÓN (SECCIÓN 2 del prompt, solo si action=allow):
       - is_relevant: pregunta menciona objetos del dominio (obra, estado, entidad, sector, ubicación, monto, año, URL)
       - is_social_interaction: saludo, despedida, frase casual/cortesía
       - is_support_request: intención de reclamo/soporte/contacto/trámite
       - Dual-flag support: is_relevant + is_support_request pueden coexistir

    PRIORIDAD DE FLAGS (heredada de generate_complete_question):
    1. is_relevant="yes" → retrieve_documents (PRIORITY 1)
    2. is_social_interaction="yes" → send_greeting (PRIORITY 2)
    3. is_support_request="yes" → send_support_response (PRIORITY 3)
    4. Todos "no" → handle_irrelevant (PRIORITY 4)

    ENTRADA:
    - state["user_question"]: pregunta raw del usuario
    - state["conversation_history"]: historial completo (no usado aún en clasificación)

    SALIDA (modifica state):
    - has_pii, pii_types, is_prohibited, prohibited_findings, location_exception_applied
    - recommended_action, moderation dict
    - is_relevant, is_social_interaction, is_support_request (solo si action=allow)
    - messages (si block/reprompt), response_type, stop_processing (si block/reprompt)
    """
    # CRITICAL: En flujo invertido (use_unified_inbox=True), este nodo se ejecuta DESPUÉS
    # de generate_complete_question_v2, por lo que debe leer complete_user_question.
    # Si no existe (flujo legacy), usa user_question como fallback.
    # Usar siempre la pregunta reescrita para extracción territorial
    raw_question = state.get("user_question", "") or ""
    user_question = state.get("complete_user_question") or raw_question
    logger.info(
        "FLOW ▸ INBOX_CLASSIFIER START question='{}' raw='{}'",
        user_question[:120],
        raw_question[:120],
    )

    # ═══════════════════════════════════════════════════════════════
    # SHORT-CIRCUIT: Si ya hubo Cache Hit en el Entry Node
    # ═══════════════════════════════════════════════════════════════
    if state.get("is_cache_hit"):
        # logger.debug("FLOW ▸ INBOX_CLASSIFIER Passthrough (Cache)")
        # Asumimos que lo que está en cache es seguro y relevante
        return {
            "recommended_action": "allow",
            "is_relevant": "yes",  # Assume relevant if cached
            "has_pii": False,
            "is_prohibited": False,
            "is_social_interaction": "no",
            "is_support_request": "no",
            "is_definitions_lookup": "no",
            "is_confirmation": "no",
            # "is_cache_hit": True # Ya está en state
        }

    # Cortar temprano si detectamos insultos/modismos ofensivos en el input crudo
    if _contains_dom_insulto(raw_question):
        logger.info(
            "FLOW ▸ INBOX_CLASSIFIER dom_insulto_detected → safe_response raw_question='{}'",
            raw_question[:120],
        )
        state["has_pii"] = False
        state["is_prohibited"] = True
        state["recommended_action"] = "reprompt"
        state["is_relevant"] = "no"
        state["is_social_interaction"] = "no"
        state["is_support_request"] = "no"
        state["is_definitions_lookup"] = "no"
        state["stop_processing"] = True
        moderation_payload = {
            "action": "reprompt",
            "has_pii": False,
            "is_prohibited": True,
            "categories": ["abusive_language"],
            "severity": None,
            "pii_types": [],
            "location_exception_applied": False,
            "note": "dom_insulto_detected",
        }
        state["moderation"] = moderation_payload
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "has_pii": False,
            "moderation": moderation_payload,
            "is_relevant": "no",
            "is_social_interaction": "no",
            "is_support_request": "no",
            "response_type": "moderation_reprompt",
            "recommended_action": "reprompt",
            "stop_processing": True,
        }

    # Tokens de contratistas/proveedores para zona gris (se evaluarán post-moderación)
    # SOLO términos específicos que no existen en el dataset
    # NO incluir "empresa" ya que es demasiado genérico
    contractor_tokens = [
        "contratista",
        "contratistas",
        "proveedor",
        "proveedores",
        "licitación",
        "licitaciones",
    ]
    raw_lower = raw_question.lower()

    def _classifier_error_reprompt(exc: Exception):
        logger.error("FLOW ▸ INBOX_CLASSIFIER parse_error error={}", exc, exc_info=True)
        guidance = "No pude interpretar la pregunta. Por favor, redactela nuevamente indicando el país y el dato que desea consultar."
        state["has_pii"] = False
        state["is_prohibited"] = False
        state["recommended_action"] = "reprompt"
        state["is_relevant"] = "no"
        state["is_social_interaction"] = "no"
        state["is_support_request"] = "no"
        state["is_definitions_lookup"] = "no"
        moderation_payload = {
            "action": "reprompt",
            "has_pii": False,
            "is_prohibited": False,
            "categories": [],
            "severity": None,
            "pii_types": [],
            "location_exception_applied": False,
            "note": "classifier_parse_error",
        }
        state["moderation"] = moderation_payload
        state["stop_processing"] = True
        return {
            "messages": [AIMessage(content=guidance)],
            "has_pii": False,
            "moderation": moderation_payload,
            "is_relevant": "no",
            "is_social_interaction": "no",
            "is_support_request": "no",
            "response_type": "moderation_reprompt",
            "stop_processing": True,
        }

    def _coerce_to_inbox(obj: Any) -> InboxClassification:
        if isinstance(obj, InboxClassification):
            return obj
        if isinstance(obj, dict):
            return InboxClassification(**obj)
        if isinstance(obj, str):
            return InboxClassification.model_validate_json(obj)
        return InboxClassification.model_validate(obj)

    def _invoke_unstructured_fallback(reason: Exception) -> InboxClassification | None:
        try:
            logger.warning(
                "FLOW ▸ INBOX_CLASSIFIER fallback=unstructured reason={}", reason
            )
            fallback_chain = create_chain(
                inbox_classifier_prompt,
                ["user_input", "raw_input"],
                schema=None,
            )
            fallback_response = invoke_llm_chain(
                fallback_chain,
                {"user_input": user_question, "raw_input": raw_question},
                label="prefetch.inbox_classifier_fallback",
            )
            if hasattr(fallback_response, "content"):
                raw_content = fallback_response.content
            else:
                raw_content = str(fallback_response)
            logger.info(
                "\n\n --> FLOW ▸ INBOX_CLASSIFIER fallback raw_response={}",
                raw_content[:500],
            )

            json_match = re.search(r"```json\s*(\{.*?\})\s*```", raw_content, re.DOTALL)
            if json_match:
                json_str = json_match.group(1)
            else:
                json_match = re.search(r"\{.*\}", raw_content, re.DOTALL)
                if not json_match:
                    raise ValueError(
                        "No se encontró JSON en la respuesta del LLM (fallback)"
                    )
                json_str = json_match.group(0)

            json_data = json.loads(json_str)
            logger.info("FLOW ▸ INBOX_CLASSIFIER fallback parsed_json={}", json_data)
            return InboxClassification(**json_data)
        except Exception as fallback_exc:
            logger.error(
                "FLOW ▸ INBOX_CLASSIFIER fallback_failed error={}",
                fallback_exc,
                exc_info=True,
            )
            return None

    chain = create_chain(
        inbox_classifier_prompt,
        ["user_input", "raw_input"],
        schema=InboxClassification,
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # 📊 LOGGING CONVERSACIONAL: Entrada al clasificador
    # ═══════════════════════════════════════════════════════════════════════════
    logger.info(
        "\n"
        "╔══════════════════════════════════════════════════════════════════════════╗\n"
        "║  📬 INBOX_CLASSIFIER - ENTRADA AL CLASIFICADOR                           ║\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  📝 INPUTS:\n"
        "║     → raw_input: '{}'\n"
        "║     → user_input (complete): '{}'\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  🎯 Este nodo decide: is_relevant, is_social, is_support, is_confirmation║\n"
        "╚══════════════════════════════════════════════════════════════════════════╝",
        raw_question[:100] if raw_question else "(vacío)",
        user_question[:100] if user_question else "(vacío)",
    )

    structured_success = True

    try:
        chain_response = invoke_llm_chain(
            chain,
            {"user_input": user_question, "raw_input": raw_question},
            label="prefetch.inbox_classifier",
        )
    except Exception as exc:
        structured_success = False
        fallback = _invoke_unstructured_fallback(exc)
        if fallback is None:
            return _classifier_error_reprompt(exc)
        response = fallback
    else:
        structured_success = True
        try:
            response = _coerce_to_inbox(chain_response)
        except (ValidationError, ValueError, TypeError) as exc:
            structured_success = False
            fallback = _invoke_unstructured_fallback(exc)
            if fallback is None:
                return _classifier_error_reprompt(exc)
            response = fallback
        except Exception as exc:  # pragma: no cover - safety net
            structured_success = False
            fallback = _invoke_unstructured_fallback(exc)
            if fallback is None:
                return _classifier_error_reprompt(exc)
            response = fallback
    if structured_success:
        logger.info(
            "FLOW ▸ INBOX_CLASSIFIER structured_output_ok fields={}",
            list(response.model_dump().keys()),
        )
    # ═══════════════════════════════════════════════════════════════════════════
    # 📊 LOGGING CONVERSACIONAL: Resultado del clasificador
    # ═══════════════════════════════════════════════════════════════════════════
    _resp_dump = response.model_dump()
    logger.info(
        "\n"
        "╔══════════════════════════════════════════════════════════════════════════╗\n"
        "║  📬 INBOX_CLASSIFIER - RESULTADO                                         ║\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  🚦 FLAGS DE CLASIFICACIÓN:\n"
        "║     → is_relevant:          {}\n"
        "║     → is_social_interaction: {}\n"
        "║     → is_support_request:   {}\n"
        "║     → is_confirmation:      {}\n"
        "║     → is_definitions_lookup: {}\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  🛡️ MODERACIÓN:\n"
        "║     → recommended_action: {}\n"
        "║     → has_pii: {}\n"
        "║     → is_prohibited: {}\n"
        "╚══════════════════════════════════════════════════════════════════════════╝",
        _resp_dump.get("is_relevant", "?"),
        _resp_dump.get("is_social_interaction", "?"),
        _resp_dump.get("is_support_request", "?"),
        _resp_dump.get("is_confirmation", "?"),
        _resp_dump.get("is_definitions_lookup", "?"),
        _resp_dump.get("recommended_action", "?"),
        _resp_dump.get("has_pii", "?"),
        _resp_dump.get("is_prohibited", "?"),
    )
    logger.debug(
        "FLOW ▸ INBOX_CLASSIFIER structured_response={}", response.model_dump()
    )

    # Helper robusto para extraer campos
    def _safe_get(attr, default=None):
        try:
            val = getattr(response, attr, default)
        except Exception:
            val = default
        return default if val is None else val

    # ─────────────────────────────────────────────────────────────
    # SECCIÓN 1: MODERACIÓN
    # ─────────────────────────────────────────────────────────────
    has_pii_str = str(_safe_get("has_pii", "no")).lower()
    is_prohibited_str = str(_safe_get("is_prohibited", "no")).lower()
    recommended_action = str(
        (_safe_get("recommended_action", "allow") or "allow")
    ).lower()
    pii_types = _safe_get("pii_types", []) or []
    prohibited_findings = _safe_get("prohibited_findings", []) or []
    location_exception_applied = bool(_safe_get("location_exception_applied", False))
    rationale = _safe_get("rationale", "") or ""

    has_pii_bool = has_pii_str == "yes"
    is_prohibited_bool = is_prohibited_str == "yes"

    # Validar que recommended_action sea válido
    if recommended_action not in {"allow", "reprompt", "block"}:
        logger.warning(
            f"FLOW ▸ INBOX_CLASSIFIER invalid action={recommended_action}, defaulting to allow"
        )
        recommended_action = "allow"

    # Construir categorías y severidades para logging/payload
    categories = []
    severities = []
    try:
        for finding in prohibited_findings:
            cat = (
                finding.get("category")
                if isinstance(finding, dict)
                else getattr(finding, "category", None)
            )
            sev = (
                finding.get("severity")
                if isinstance(finding, dict)
                else getattr(finding, "severity", None)
            )
            if cat:
                categories.append(cat)
            if sev:
                severities.append(sev)
    except Exception:
        pass

    # Elegir severidad máxima (low < medium < high)
    order = {"low": 1, "medium": 2, "high": 3}
    max_severity = None
    if severities:
        max_severity = max(severities, key=lambda s: order.get(s, 0))

    moderation_payload = {
        "action": recommended_action,
        "has_pii": has_pii_bool,
        "is_prohibited": is_prohibited_bool,
        "categories": categories,
        "severity": max_severity,
        "pii_types": pii_types,
        "location_exception_applied": location_exception_applied,
        "note": rationale[:100],
    }

    # Persistir flags de moderación en state
    state["has_pii"] = has_pii_bool
    state["is_prohibited"] = is_prohibited_bool
    state["recommended_action"] = recommended_action
    # ─────────────────────────────────────────────────────────────
    # SECCIÓN 1.5: CACHE CHECK (Normalized / Fallback)
    # ─────────────────────────────────────────────────────────────
    # El chequeo RAW ya ocurrió en 'check_cache_raw' (Entry Node).
    # Aquí solo intentamos con la pregunta normalizada (COMPLETE QUESTION)
    # por si la reescritura del LLM corrigió la semántica (Tier 1).

    is_cache_hit = False
    is_recent_cache_hit = False
    cache_source = None
    cache_info = None

    if recommended_action == "allow":
        country = state.get("country_code", "dom")

        # Solo intentamos con COMPLETE QUESTION (si es diferente a raw)
        if user_question and user_question != raw_question:
            cache_info = _check_hybrid_cache(user_question, country)
            if cache_info:
                is_cache_hit = True
                is_recent_cache_hit = cache_info["is_recent_cache_hit"]
                src_type = cache_info.get("source", "vector")
                cache_source = f"normalized_{src_type}"
                logger.info(f"FLOW ▸ CACHE HIT (Normalized) source={src_type}")

        # Persistir resultados de cache
        if is_cache_hit:
            state["is_cache_hit"] = True
            state["is_recent_cache_hit"] = is_recent_cache_hit
            state["cache_data"] = cache_info  # legacy backup

            # ═══════════════════════════════════════════════════════════════
            # ESTADO: Poblar estructura SQL para que los helpers funciones downstream
            # helpers_estado._get_sql_cached_results y _get_sql_query
            # ═══════════════════════════════════════════════════════════════
            sql_container = state.get("sql")
            if not isinstance(sql_container, dict):
                sql_container = {}
                state["sql"] = sql_container

            # SQL Query
            sql_container["query"] = cache_info.get("sql_query")

            # Cached Results
            execution = sql_container.get("execution")
            if not isinstance(execution, dict):
                execution = {}
                sql_container["execution"] = execution

            execution["cached_results"] = cache_info.get("results")

            # ═══════════════════════════════════════════════════════════════
            # SHORT-CIRCUIT
            # ═══════════════════════════════════════════════════════════════
            # Si pegamos en normalized, también cortamos flujo.
            return {
                "is_relevant": "yes",
                "is_social_interaction": "no",
                "is_support_request": "no",
                "is_definitions_lookup": "no",
                "is_confirmation": "no",
                "has_pii": has_pii_bool,
                "moderation": moderation_payload,
                "is_cache_hit": True,
                "is_recent_cache_hit": is_recent_cache_hit,
            }

    # ─────────────────────────────────────────────────────────────
    # SECCIÓN 2: CLASIFICACIÓN DE INTENCIÓN (solo si action=allow)
    # ─────────────────────────────────────────────────────────────
    is_relevant = "no"
    is_social_interaction = "no"
    is_support_request = "no"
    is_definitions_lookup = "no"
    is_confirmation = "no"

    if recommended_action == "allow":
        # Extraer flags de clasificación directamente del LLM response
        is_relevant = str(_safe_get("is_relevant", "no")).lower()
        is_social_interaction = str(_safe_get("is_social_interaction", "no")).lower()
        is_support_request = str(_safe_get("is_support_request", "no")).lower()
        is_definitions_lookup = str(_safe_get("is_definitions_lookup", "no")).lower()
        is_confirmation = str(_safe_get("is_confirmation", "no")).lower()

        # Validar que sean "yes" o "no" (sanitización básica)
        if is_relevant not in {"yes", "no"}:
            is_relevant = "no"
        if is_social_interaction not in {"yes", "no"}:
            is_social_interaction = "no"
        if is_support_request not in {"yes", "no"}:
            is_support_request = "no"
        if is_definitions_lookup not in {"yes", "no"}:
            is_definitions_lookup = "no"
        if is_confirmation not in {"yes", "no"}:
            is_confirmation = "no"

        # ═══════════════════════════════════════════════════════════════
        # CRITICAL: Si es confirmación, forzar is_relevant="no"
        # Esto evita que una confirmación genere una nueva SQL
        # ═══════════════════════════════════════════════════════════════
        if is_confirmation == "yes":
            is_relevant = "no"
            logger.info(
                "FLOW ▸ INBOX_CLASSIFIER is_confirmation=yes → forcing is_relevant=no"
            )

    # Persistir flags de clasificación en state
    state["is_relevant"] = is_relevant
    state["is_social_interaction"] = is_social_interaction
    state["is_support_request"] = is_support_request
    state["is_definitions_lookup"] = is_definitions_lookup
    state["is_confirmation"] = is_confirmation

    # ─────────────────────────────────────────────────────────────
    # RUTEO SEGÚN MODERACIÓN
    # ─────────────────────────────────────────────────────────────
    if recommended_action == "block":
        logger.info(
            "FLOW ▸ INBOX_CLASSIFIER END\n"
            "   ↳ action=block\n"
            "   ↳ has_pii={}\n"
            "   ↳ is_prohibited={}\n"
            "   ↳ is_relevant={}\n"
            "   ↳ is_social_interaction={}\n"
            "   ↳ is_support_request={}\n"
            "   ↳ is_definitions_lookup={}\n"
            "   ↳ categories={} severity={}\n"
            "   ↳ pii_types={} location_exception_applied={}",
            has_pii_bool,
            is_prohibited_bool,
            is_relevant,
            is_social_interaction,
            is_support_request,
            is_definitions_lookup,
            categories,
            max_severity,
            pii_types,
            location_exception_applied,
        )
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "has_pii": has_pii_bool,
            "moderation": moderation_payload,
            "is_relevant": is_relevant,
            "is_social_interaction": is_social_interaction,
            "is_support_request": is_support_request,
            "response_type": "moderation_blocked",
            "stop_processing": True,
        }

    if recommended_action == "reprompt":
        logger.info(
            "FLOW ▸ INBOX_CLASSIFIER END\n"
            "   ↳ action=reprompt\n"
            "   ↳ has_pii={}\n"
            "   ↳ is_prohibited={}\n"
            "   ↳ is_relevant={}\n"
            "   ↳ is_social_interaction={}\n"
            "   ↳ is_support_request={}\n"
            "   ↳ is_definitions_lookup={}\n"
            "   ↳ categories={} severity={}\n"
            "   ↳ pii_types={} location_exception_applied={}",
            has_pii_bool,
            is_prohibited_bool,
            is_relevant,
            is_social_interaction,
            is_support_request,
            is_definitions_lookup,
            categories,
            max_severity,
            pii_types,
            location_exception_applied,
        )
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "has_pii": has_pii_bool,
            "moderation": moderation_payload,
            "is_relevant": is_relevant,
            "is_social_interaction": is_social_interaction,
            "is_support_request": is_support_request,
            "response_type": "moderation_reprompt",
            "stop_processing": True,
        }

    # ─────────────────────────────────────────────────────────────
    # ZONA GRIS CONTRATISTAS (post-moderación)
    # Solo bloquea términos específicos: contratista, proveedor, licitación
    # ─────────────────────────────────────────────────────────────
    if recommended_action == "allow" and any(
        tok in raw_lower for tok in contractor_tokens
    ):
        logger.info(
            "FLOW ▸ INBOX_CLASSIFIER contractor_intent (post-moderation) → missing_contractor_data"
        )
        note = "Este dataset solo incluye entidades públicas ejecutoras; no contiene datos de contratistas o proveedores."
        # Guardar razón en análisis y en el estado plano para el ruteo prioritario
        _set_gray_zone_reason(state, "MISSING_CONTRACTOR_DATA")
        state["gray_zone_reason"] = "MISSING_CONTRACTOR_DATA"
        _set_gray_zone_decision(
            state,
            {
                "status": "block",
                "rationale": note,
            },
        )
        _set_gray_zone_details(state, {"rationale": note})
        # Forzar flags a no relevantes para evitar rutas laterales
        state["is_relevant"] = "no"
        state["is_social_interaction"] = "no"
        state["is_support_request"] = "no"
        state["is_definitions_lookup"] = "no"
        return {
            "gray_zone_reason": "MISSING_CONTRACTOR_DATA",
            "gray_zone_details": {"rationale": note},
            "is_relevant": "no",
            "is_social_interaction": "no",
            "is_support_request": "no",
            "is_definitions_lookup": "no",
        }

    # allow → continuar pipeline, clasificación ya está en state
    logger.info(
        "FLOW ▸ INBOX_CLASSIFIER END\n"
        "   ↳ action=allow\n"
        "   ↳ has_pii={}\n"
        "   ↳ is_prohibited={}\n"
        "   ↳ is_relevant={}\n"
        "   ↳ is_social_interaction={}\n"
        "   ↳ is_support_request={}\n"
        "   ↳ is_definitions_lookup={}\n"
        "   ↳ is_confirmation={}\n"
        "   ↳ categories={}",
        has_pii_bool,
        is_prohibited_bool,
        is_relevant,
        is_social_interaction,
        is_support_request,
        is_definitions_lookup,
        is_confirmation,
        categories,
    )
    return {
        "has_pii": has_pii_bool,
        "moderation": moderation_payload,
        "is_relevant": is_relevant,
        "is_social_interaction": is_social_interaction,
        "is_support_request": is_support_request,
        "is_definitions_lookup": is_definitions_lookup,
        "is_confirmation": is_confirmation,
    }


# ═══════════════════════════════════════════════════════════════════════════
# MODISMOS ESPECÍFICOS (RD) EN MEMORIA
# ═══════════════════════════════════════════════════════════════════════════
# Curado mínimo para heurísticas (sin IO): saludos/fillers, cierres, dinero, transporte.
_DOM_SALUDOS = {
    "que lo que",
    "qué lo qué",
    "klk",
    "dime a ver",
}
_DOM_CIERRES = {"yagaloski"}
_DOM_FILLER_OK = {"tato", "ta to", "ta' to", "ta to'", "apero", "ta apero", "ta' apero"}
_DOM_DINERO = {
    "cualto",
    "cuarto",
    "cuartos",
    "chelito",
    "plata",
    "menudo",
    "pesos",
    "peso",
}
_DOM_TRANSPORTE = {"concho", "carro publico", "carro público", "guagua", "motoconcho"}
_DOM_INSULTO = {
    "carajo",
    "hijo de puta",
    "hijo e puta",
    "maldito",
    "maldita",
    "malparido",
    "pendejo",
    "pendeja",
    "imbecil",
    "imbécil",
    "idiota",
    "mierda",
    "cabron",
    "cabrón",
    "coño",
    "fuck",
    "fuck you",
}  # tono negativo / insultos comunes

# ═══════════════════════════════════════════════════════════════════════════
# LIMPIEZA DE FILLERS CONVERSACIONALES
# ═══════════════════════════════════════════════════════════════════════════
# Fillers que no aportan significado y confunden al LLM de rewrite
_CONVERSATIONAL_FILLERS = {
    # Español
    "ah",
    "oh",
    "ok",
    "okay",
    "okey",
    "bueno",
    "dale",
    "ya",
    "mmm",
    "hmm",
    "aha",
    "ajá",
    "aja",
    "eee",
    "ehh",
    "pues",
    "bien",
    "vale",
    "claro",
    "entiendo",
    "entendido",
    "perfecto",
    "genial",
    "excelente",
    "gracias",
    "muchas gracias",
    "de acuerdo",
    "está bien",
    "ok ok",
    "ah ok",
    "ah bueno",
    "ya veo",
    "ya entiendo",
    "listo",
    "sí",
    "si",
    "no",
    "nop",
    # English
    "uh",
    "um",
    "well",
    "so",
    "right",
    "i see",
    "got it",
    "alright",
    "sure",
    "yes",
    "yeah",
    "yep",
    "nope",
    "thanks",
    "thank you",
}

_FOLLOWUP_CONNECTORS = [
    " y en ",
    " y las ",
    " y los ",
    " y de ",
    " y la ",
    " y el ",
    " esas ",
    " esos ",
    " eso ",
    " este ",
    " esta ",
    " estos ",
    " estas ",
    " ahí",
    " ahi",
    " allí",
    " alli",
    " acá",
    " aca",
    " también",
    " tambien",
    " además",
    " ademas",
    " ahora ",
    " por otro lado",
]

_PRONOUN_REFERENCES = [
    "eso",
    "eso mismo",
    "esa",
    "ese",
    "esas",
    "esos",
    "esto",
    "estos",
    "estas",
    "allí",
    "alli",
    "ahí",
    "ahi",
    "allá",
    "alla",
    "acá",
    "aca",
]

_RESET_PATTERNS = [
    "en general",
    "sin filtros",
    "sin filtro",
    "en todo el país",
    "en todo el pais",
    "otro sector",
    "otro tema",
    "otra cosa",
    "por otro lado",
    "cambiando de tema",
]

_METRIC_ACTION_TOKENS = [
    "cuanto",
    "cuánt",
    "listar",
    "listado",
    "mostrar",
    "monto",
    "valor",
    "costo",
    "presupuesto",
    "ejecutado",
    "gasto",
    "inversión",
    "inversion",
    "estado",
    "avance",
    "porcentaje",
    "porciento",
    "top",
    "ranking",
    "contar",
    "conteo",
]

_TERRITORY_TOKENS = [
    "provincia",
    "municipio",
    "departamento",
    "región",
    "region",
    "país",
    "pais",
    "distrito",
    "santo domingo",
    "san juan",
    "azua",
    "pedernales",
]

_SECTOR_ENTITY_TOKENS = [
    "sector",
    "entidad",
    "ejecutora",
    "ministerio",
    "bid",
    "banco interamericano",
    "banco mundial",
    "agencia",
]


def _clean_conversational_fillers(text: str) -> str:
    """
    Elimina fillers conversacionales del inicio de la pregunta.
    Ejemplo: "ah ok, y de salud cuales hay" → "y de salud cuales hay"
    """
    if not text:
        return text

    original = text
    text = text.strip()

    # Intentar limpiar hasta 3 veces (para casos como "ah ok, bueno, y de...")
    # Extender fillers con modismos locales (saludos/cierres)
    extended_fillers = (
        _CONVERSATIONAL_FILLERS | _DOM_SALUDOS | _DOM_CIERRES | _DOM_FILLER_OK
    )

    for _ in range(3):
        cleaned = text.lower().strip()
        changed = False

        # Eliminar fillers al inicio (con o sin coma/puntuación después)
        for filler in sorted(extended_fillers, key=len, reverse=True):
            # Patrón: filler al inicio seguido de espacio, coma, o fin
            pattern = rf"^{re.escape(filler)}[\s,;:\.]*"
            if re.match(pattern, cleaned, re.IGNORECASE):
                text = re.sub(pattern, "", text, count=1, flags=re.IGNORECASE).strip()
                changed = True
                break

        if not changed:
            break

    # Si quedó vacío o solo puntuación, devolver original
    if not text or not re.search(r"\w", text):
        return original

    return text


def _normalize_temporal_reference(text: str, current_year: int) -> str:
    """Reemplaza referencias relativas a 'este año' por el año numérico."""
    if not text:
        return text
    patterns = [
        r"\beste\s+año\b",
        r"\beste\s+ano\b",
        r"\baño\s+actual\b",
        r"\bano\s+actual\b",
        r"\baño\s+en\s+curso\b",
        r"\bano\s+en\s+curso\b",
        r"\baño\s+presente\b",
        r"\bano\s+presente\b",
        r"\bthis\s+year\b",
        r"\bcurrent\s+year\b",
        r"\bpresent\s+year\b",
    ]
    normalized = text
    for pat in patterns:
        normalized = re.sub(pat, str(current_year), normalized, flags=re.IGNORECASE)
    return normalized


def _count_anchors(text: str) -> int:
    """
    Cuenta anclas útiles: métrica/acción + (año o territorio o id/snpi o sector/entidad).
    No considera palabras genéricas como "proyecto" como ancla.
    """
    if not text:
        return 0
    t = text.lower()
    has_year = bool(re.search(r"\b20\d{2}\b", t))
    has_id = bool(re.search(r"\b(id\s*:?\s*\d{3,6}|snip\s*:?\s*\d{3,6})\b", t))
    has_metric_action = any(tok in t for tok in _METRIC_ACTION_TOKENS)
    has_dom_money = any(tok in t for tok in _DOM_DINERO)
    has_territory = any(tok in t for tok in _TERRITORY_TOKENS)
    has_sector_entity = any(tok in t for tok in _SECTOR_ENTITY_TOKENS) or any(
        tok in t for tok in _DOM_TRANSPORTE
    )

    anchors = 0
    # Dom dinero sólo suma si viene acompañado de acción/métrica o de otro ancla
    if has_metric_action and (has_year or has_territory or has_id or has_sector_entity):
        anchors += 2  # cuenta doble para marcar completitud
    else:
        anchors += int(has_metric_action)
        anchors += int(has_year)
        anchors += int(has_territory)
        anchors += int(has_id)
        anchors += int(has_sector_entity)
        anchors += int(
            has_dom_money
            and (has_year or has_territory or has_sector_entity or has_metric_action)
        )
    return anchors


def _has_followup_connector(text: str) -> bool:
    if not text:
        return False
    t = f" {text.lower()} "
    return any(pat in t for pat in _FOLLOWUP_CONNECTORS)


def _has_pronoun_reference(text: str) -> bool:
    if not text:
        return False
    t = f" {text.lower()} "
    return any(f" {pat} " in t for pat in _PRONOUN_REFERENCES)


def _has_reset_pattern(text: str) -> bool:
    if not text:
        return False
    t = text.lower()
    return any(pat in t for pat in _RESET_PATTERNS)


def generate_complete_question_v2(state: AgentState):
    """
    ╔══════════════════════════════════════════════════════════════════╗
    ║            GENERATE_COMPLETE_QUESTION_V2 (SIMPLIFIED)            ║
    ║  Versión simplificada que SOLO regenera/reescribe la pregunta.  ║
    ║  Los flags de clasificación (is_relevant, is_social_interaction, ║
    ║  is_support_request) ya vienen de inbox_classifier y se leen     ║
    ║  desde state sin regenerarlos.                                   ║
    ║  Incluye una corrección ligera de typos en prefijos territoriales║
    ║  (provincia/municipio/departamento/region).                      ║
    ╚══════════════════════════════════════════════════════════════════╝

    RESPONSABILIDADES:
    1. REESCRITURA (BLOCK A completo del prompt original):
       - A.0: Greeting override
       - A.1: Follow-up continuation (con A.1-b filter reduction y A.1-c entity extraction)
       - A.2: Change of subject
       - A.3: Quantity focus (con A.3-b quantity-to-detail transition)
       - A.4-A.7: Validaciones de completitud, idioma, sin especulación, sin país

    2. CLASIFICACIÓN: **NO se realiza aquí**. Los flags ya vienen en state desde inbox_classifier:
       - state["is_relevant"]
       - state["is_social_interaction"]
       - state["is_support_request"]

    ENTRADA:
    - state["user_question"]: pregunta raw
    - state["messages"]: historial de conversación (últimos 5 min)
    - state["country_code"]: ISO-3 del país
    - state["is_relevant"], state["is_social_interaction"], state["is_support_request"]: flags YA clasificados

    SALIDA (modifica state):
    - complete_user_question: pregunta regenerada con contexto
    - messages: agrega HumanMessage con pregunta regenerada
    - Limpia flags de clarificación para nuevo turno
    - NO modifica is_relevant, is_social_interaction, is_support_request (ya vienen de inbox)
    """
    # Bloqueo temprano de insultos sin pasar por el LLM
    raw_question = state.get("user_question") or ""
    if _contains_dom_insulto(raw_question):
        logger.info(
            "FLOW ▸ REWRITE_V2 blocked_by_dom_insulto question='{}'", raw_question[:120]
        )
        state["stop_processing"] = True
        state["response_type"] = "moderation_reprompt"
        return {
            "messages": [AIMessage(content=SAFE_RESPONSE)],
            "response_type": "moderation_reprompt",
            "stop_processing": True,
        }

    # ▸ 1. Preparar historial reciente (últimos 5 min) ──────────────────
    # ═══════════════════════════════════════════════════════════════════
    # MEJORA: Ventana de 5 minutos para conservar contexto
    # Esto evita perder el hilo de la conversación en sesiones largas
    # ═══════════════════════════════════════════════════════════════════
    # Ventana configurable desde .env (default 5 min)
    recent_seconds = settings.history_window_seconds
    now_ts = time.time()

    # Preservar el turno de clarificación antes de resetear
    # (para evitar bucles infinitos de clarificación)
    previous_turn = _get_assistance_turn(state)
    # Snapshot de asistencia previa para detectar respuestas de clarificación
    assistance_snapshot = state.get("user_assistance") or {}

    # Reset flags de clarificación para un nuevo turno
    _reset_user_assistance(state, moment="pre_sql")

    # Restaurar el turno si había uno previo (continuidad de sesión de clarificación)
    if previous_turn > 0:
        state["user_assistance"]["turn"] = previous_turn
        logger.debug(f"ANALYZER1 ▸ preserved clarification turn={previous_turn}")

    state.pop("soft_missing_filters", None)
    state.pop("low_confidence_filters", None)
    state.pop("analyzer_filters", None)
    state.pop("analyzer_filter_confidence_map", None)
    state.pop("refined_analysis_text", None)
    state.pop("catalog_filter_suggestions", None)
    state.pop("catalog_filters_relaxed", None)  # legacy flag
    state.pop("catalog_filters_relaxed_columns", None)
    state.pop("catalog_filters_last_applied", None)
    state.pop("structured_text_filters", None)

    # Recolectamos historial filtrado por ventana de tiempo
    # ═══════════════════════════════════════════════════════════════════
    # MEJORA: Uso de helper centralizado para evitar duplicación
    # ═══════════════════════════════════════════════════════════════════
    history_text = _build_recent_history(state, recent_seconds)
    history_lines = history_text.split("\n") if history_text else []

    # Calcular tamaño para logging (aproximado, ya que el helper devuelve string)
    # Se cuenta por líneas para mantener métrica similar
    history_size = len(history_lines)

    # ─── Logging detallado ───────────────────────────────────────────────
    logger.debug(
        "FLOW ▸ REWRITE_V2 history_size={} window_seconds={} formatted=True",
        history_size,
        recent_seconds,
    )

    last_question_raw = state["user_question"]

    # ═══════════════════════════════════════════════════════════════════
    # LIMPIEZA DE FILLERS: Eliminar ruido conversacional antes del LLM
    # Ejemplo: "ah ok, y de salud cuales hay" → "y de salud cuales hay"
    # ═══════════════════════════════════════════════════════════════════
    last_question = _clean_conversational_fillers(last_question_raw)
    fillers_removed = last_question != last_question_raw

    # ─── Obtener año actual para normalización temporal ───────────────
    current_year = datetime.now().year

    # Corrección ligera de prefijos territoriales mal escritos (provincia/municipio/región/departamento)
    def _fix_territorial_typos(text: str) -> str:
        if not text:
            return text
        replacements = [
            (r"\bmunic\w*\b", "municipio"),
            (r"\bprovinc\w*\b", "provincia"),
            (r"\bdepartament\w*\b", "departamento"),
            (r"\bregi[oó]n?\w*\b", "region"),
        ]
        fixed = text
        for pattern, repl in replacements:
            fixed = re.sub(pattern, repl, fixed, flags=re.IGNORECASE)
        return fixed

    last_question = _fix_territorial_typos(last_question)

    # Detectar respuestas de clarificación territorial para evitar que el LLM las mezcle
    def _looks_like_territory_reply(text: str) -> bool:
        if not text:
            return False
        t = text.strip().lower()
        if t.startswith("en:") or t.startswith("en :"):
            return True
        # Respuestas cortas con prefijo territorial explícito
        if re.match(r"^(provincia|departamento|municipio|regi[oó]n)\b", t):
            return len(t.split()) <= 6
        return False

    assistance_type = (assistance_snapshot.get("type") or "").lower()
    assistance_targets = (
        assistance_snapshot.get("metadata", {}).get("targets")
        or assistance_snapshot.get("targets")
        or []
    )
    is_territory_assistance = assistance_type in {
        "clarify_territory",
        "disambiguate",
    } or any(str(t).lower() == "territory" for t in assistance_targets)
    is_territory_reply = is_territory_assistance or _looks_like_territory_reply(
        last_question_raw
    )

    if is_territory_reply:
        # Passthrough: usar la selección territorial pero PRESERVAR filtros de sesión anterior
        final_question = (last_question or last_question_raw or "").strip()

        # ═══════════════════════════════════════════════════════════════════════
        # PRESERVAR CONTEXTO DE SESIÓN: Si hay filtros previos (ej: sector=EDUCACIÓN),
        # inyectarlos en state para que el Analyzer los respete.
        # Esto ocurre cuando el usuario hace una repregunta territorial como
        # "y en santiago" después de "proyectos de educación en santo domingo"
        # ═══════════════════════════════════════════════════════════════════════
        session_memory = state.get("lifecycle", {}).get("session_memory", {})
        last_success = session_memory.get("last_success", {})
        resolved_dims = session_memory.get("resolved_dimensions", {})

        # Preservar filtros de la sesión anterior para el Analyzer
        preserved_filters = []
        if last_success.get("filters"):
            for flt in last_success["filters"]:
                col = flt.get("column", "")
                # Solo preservar filtros de contenido (sector, entidad), no país ni territorio
                if any(x in col for x in ["sector", "entidad", "estado", "fuente"]):
                    preserved_filters.append(flt)
                    logger.info(
                        "FLOW ▸ REWRITE_V2 territory_reply preserving_filter column={} value={}",
                        col,
                        flt.get("value", ""),
                    )

        # Guardar en state para que el Analyzer los use
        if preserved_filters:
            state["territory_reply_preserved_filters"] = preserved_filters
            logger.info(
                "FLOW ▸ REWRITE_V2 territory_reply context_preserved filters={}",
                len(preserved_filters),
            )

        if final_question:
            state["messages"].append(
                HumanMessage(
                    content=final_question,
                    additional_kwargs={
                        "timestamp": time.time(),
                        "is_regenerated": True,
                    },
                )
            )
        state["complete_user_question"] = final_question
        state.pop("response_type", None)
        state.pop("stop_processing", None)
        logger.info(
            "FLOW ▸ REWRITE_V2 territory_reply passthrough question='{}'",
            final_question[:200],
        )
        return {"complete_user_question": final_question}

    # ─── Cortar si no hay señal mínima (evita reescribir con historial) ─
    token_count_clean = len(re.findall(r"\w+", last_question)) if last_question else 0
    anchors_clean = _count_anchors(last_question)
    followup_clean = _has_followup_connector(last_question)
    if token_count_clean <= 1 and anchors_clean == 0 and not followup_clean:
        logger.info(
            "FLOW ▸ REWRITE_V2 short_circuit low_signal tokens={} anchors={} followup={} → pass_through",
            token_count_clean,
            anchors_clean,
            followup_clean,
        )
        final_question = (last_question or last_question_raw or "").strip()
        if final_question:
            state["messages"].append(
                HumanMessage(
                    content=final_question,
                    additional_kwargs={
                        "timestamp": time.time(),
                        "is_regenerated": True,
                    },
                )
            )
        state["complete_user_question"] = final_question
        # Limpia flags de moderación heredados para dejar decidir al inbox_classifier
        state.pop("response_type", None)
        state.pop("stop_processing", None)
        return {"complete_user_question": final_question}

    # ─── Logging INICIO ───────────────────────────────────────────────
    logger.info(
        "FLOW ▸ REWRITE_V2 START\n"
        "   ↳ country={}\n"
        "   ↳ pregunta_original='{}'\n"
        "   ↳ pregunta_limpia='{}'\n"
        "   ↳ fillers_removed={}\n"
        "   ↳ current_year={}",
        state.get("country_code"),
        last_question_raw[:200] if last_question_raw else "",
        last_question[:200] if last_question else "",
        fillers_removed,
        current_year,
    )

    # ─── Heurística previa: decidir modo de reescritura ───────────────
    anchors = _count_anchors(last_question)
    has_followup = _has_followup_connector(last_question)
    has_pronoun_ref = _has_pronoun_reference(last_question)
    has_reset = _has_reset_pattern(last_question)
    token_count = len(re.findall(r"\w+", last_question)) if last_question else 0
    only_year_or_place = bool(re.search(r"^\s*20\d{2}\s*$", last_question or "")) or (
        token_count <= 3
        and any(tok in (last_question or "").lower() for tok in _TERRITORY_TOKENS)
    )
    is_fragment = anchors <= 1 and (token_count <= 3 or only_year_or_place)
    has_and_split = " y " in (last_question.lower() if last_question else "")

    rewrite_mode = "full"
    if has_followup or has_pronoun_ref or is_fragment:
        rewrite_mode = "full"
    elif has_and_split and not has_followup and not has_pronoun_ref and not has_reset:
        rewrite_mode = "full"
    elif anchors >= 2 and not has_followup and not has_pronoun_ref:
        rewrite_mode = "normalize_only"
    elif has_reset and anchors >= 1:
        rewrite_mode = "normalize_only"
    else:
        rewrite_mode = "full"

    logger.debug(
        "FLOW ▸ REWRITE_V2 mode={} anchors={} followup={} pronoun_ref={} reset={} tokens={} fragment={} has_and_split={}",
        rewrite_mode,
        anchors,
        has_followup,
        has_pronoun_ref,
        has_reset,
        token_count,
        is_fragment,
        has_and_split,
    )

    # Modo liviano: no invocar LLM, solo normalizar temporales y devolver
    if rewrite_mode == "normalize_only":
        normalized_question = _normalize_temporal_reference(last_question, current_year)
        final_question = normalized_question.strip() or last_question
        state["messages"].append(
            HumanMessage(
                content=final_question,
                additional_kwargs={
                    "timestamp": time.time(),
                    "is_regenerated": True,
                },
            )
        )
        state["complete_user_question"] = final_question
        logger.info(
            "FLOW ▸ REWRITE_V2 END (normalize_only)\n   ↳ pregunta_regenerada='{}'",
            final_question[:200] if final_question else "",
        )
        return {"complete_user_question": final_question}

    # ▸ 2. Invocar el LLM con el prompt simplificado (solo reescritura)
    # 🧠 SESSION MEMORY: Inyectar contexto para resolver anáforas
    session_memory_context = _format_session_memory_for_prompt(state)

    # ═══════════════════════════════════════════════════════════════════════════
    # 📊 LOGGING CONVERSACIONAL: Visibilidad completa del contexto del grafo
    # ═══════════════════════════════════════════════════════════════════════════
    _sm = state.get("lifecycle", {}).get("session_memory", {})
    logger.info(
        "\n"
        "╔══════════════════════════════════════════════════════════════════════════╗\n"
        "║  🔄 GENERATE_COMPLETE_QUESTION_V2 - CONTEXTO CONVERSACIONAL              ║\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  📝 PREGUNTA ACTUAL:\n"
        "║     → raw: '{}'\n"
        "║     → limpia: '{}'\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  📜 HISTORIAL (últimos 15 min, {} turnos):\n"
        "{}\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  🧠 SESSION MEMORY (persistido entre turnos):\n"
        "║     → resolved_dimensions: {}\n"
        "║     → last_success: {}\n"
        "║     → context_terms: {}\n"
        "╠══════════════════════════════════════════════════════════════════════════╣\n"
        "║  📎 CONTEXTO INYECTADO AL LLM:\n"
        "{}\n"
        "╚══════════════════════════════════════════════════════════════════════════╝",
        last_question_raw[:100] if last_question_raw else "(vacío)",
        last_question[:100] if last_question else "(vacío)",
        history_size,
        "\n".join(
            [
                f"║     {i+1}. {line[:80]}{'...' if len(line) > 80 else ''}"
                for i, line in enumerate(history_lines[-5:])
            ]
        )
        or "║     (sin historial)",
        _sm.get("resolved_dimensions", {}),
        _sm.get("last_success", {}),
        _sm.get("context_terms", []),
        "\n".join(
            [
                f"║     {line[:80]}"
                for line in (session_memory_context or "(sin contexto)").split("\n")[:5]
            ]
        ),
    )

    chain = create_chain(
        generate_complete_question_prompt_v2,
        [
            "country_code",
            "history_text",
            "last_question",
            "current_year",
            "session_memory_context",
        ],
        schema=CompleteQuestion,
    )

    try:
        resp: CompleteQuestion = invoke_llm_chain(
            chain,
            {
                "country_code": state["country_code"],
                "history_text": history_text if settings.enable_history_context else "",
                "last_question": last_question,
                "current_year": current_year,
                "session_memory_context": (
                    session_memory_context
                    if settings.enable_session_memory_context
                    else ""
                ),
            },
            label="prefetch.complete_question",
        )
    except Exception as e:
        logger.error(
            "REWRITE_V2 ▸ LLM invoke failed fallback_to_clean question='{}' err={}",
            last_question[:200],
            e,
        )

        # Fallback: usar la versión limpia para no romper el flujo
        class _FallbackResp:
            def __init__(self, question: str):
                self.question = question

        resp = _FallbackResp(last_question or last_question_raw or "")

    # ═══════════════════════════════════════════════════════════════════
    # FALLBACK: Si el LLM devuelve la pregunta sin cambios, aplicar
    # limpieza adicional como mínimo
    # ═══════════════════════════════════════════════════════════════════
    final_question = resp.question
    if final_question.strip().lower() == last_question_raw.strip().lower():
        # El LLM no hizo nada, al menos usar la versión limpia
        final_question = last_question
        logger.warning(
            "FLOW ▸ REWRITE_V2 FALLBACK llm_unchanged=True using_cleaned_version"
        )

    # ▸ 3. Actualizar el estado global (solo pregunta, flags ya existen)
    # ═══════════════════════════════════════════════════════════════════
    # NOTA ARQUITECTURAL: Se agrega la pregunta regenerada al historial
    # con un marcador "is_regenerated" para distinguirla de preguntas raw.
    # Esto permite que turnos futuros ignoren preguntas regeneradas previas
    # y solo consideren las originales + respuestas del assistant.
    # ═══════════════════════════════════════════════════════════════════
    state["messages"].append(
        HumanMessage(
            content=final_question,
            additional_kwargs={
                "timestamp": time.time(),
                "is_regenerated": True,  # Marca para identificar preguntas regeneradas
            },
        )
    )
    state["complete_user_question"] = final_question

    # ▸ 4. Logging (solo mostrar pregunta regenerada)
    logger.info(
        "FLOW ▸ REWRITE_V2 END\n" "   ↳ pregunta_regenerada='{}'",
        final_question[:200] if final_question else "",
    )

    # ▸ 5. Retorno estándar para el grafo
    return {
        "complete_user_question": final_question,
    }


def retrieve_documents(state: AgentState):
    user_question = state.get("complete_user_question", "").strip()
    country_code = state.get("country_code", "").strip()
    use_all = True

    # Limpiar fewshots dinámicos en cada turno antes de reconstruir contexto
    state["dynamic_fewshots"] = ""

    logger.info("📥 ---CALL SEARCH TABLE DEFINITIONS---")
    logger.info(f"🧠 Pregunta del usuario: {user_question}")
    logger.info(f"🌎 País: {country_code} | use_all_documents={use_all}")

    # Inicializar valores por defecto para asegurar return
    retrieved_content = ""
    retrieved_content_fewshots = ""

    try:
        if use_all:
            logger.info(
                "🔍 Ejecutando búsqueda `all=True` para documentos combinados..."
            )
            with ThreadPoolExecutor(max_workers=2) as executor:
                future_docs = executor.submit(
                    perform_rerank_search,
                    user_question,
                    country_code,
                    12,
                    12,
                    12,
                    False,
                    True,
                )
                documents_all = future_docs.result()

            logger.info(f"📄 Documentos recuperados (ALL): {len(documents_all)}")
            retrieved_content, _ = _prepare_document_block(
                documents_all, MAX_TOKENS_DOCUMENTS, "documents", state
            )
            retrieved_content_fewshots = ""  # no se usa si `all=True`

        else:
            logger.info(
                "🔍 Ejecutando búsqueda separada para `fewshots` y `notfewshots`..."
            )
            with ThreadPoolExecutor(max_workers=2) as executor:
                future_docs = executor.submit(
                    perform_rerank_search,
                    user_question,
                    country_code,
                    8,
                    8,
                    8,
                    False,
                )
                future_fewshots = executor.submit(
                    perform_rerank_search,
                    user_question,
                    country_code,
                    5,
                    5,
                    5,
                    True,
                )

                documents = future_docs.result()
                documents_fewshots = future_fewshots.result()

            logger.info(f"📄 Documentos recuperados (NotFewShots): {len(documents)}")
            logger.info(
                f"📄 Documentos recuperados (FewShots): {len(documents_fewshots)}"
            )

            with ThreadPoolExecutor(max_workers=2) as executor:
                future_content = executor.submit(
                    _prepare_document_block,
                    documents,
                    MAX_TOKENS_DOCUMENTS,
                    "documents",
                    state,
                )
                future_fewshots_content = executor.submit(
                    _prepare_document_block,
                    documents_fewshots,
                    MAX_TOKENS_FEWSHOTS,
                    "documents_fewshots",
                    state,
                )

                retrieved_content, _ = future_content.result()
                retrieved_content_fewshots, _ = future_fewshots_content.result()

    except Exception as e:
        logger.error("🚨 Error inesperado al recuperar documentos:")
        logger.exception(e)
        retrieved_content = "ERROR EN DOCUMENTS"
        retrieved_content_fewshots = ""

    return {
        "documents": retrieved_content,
        "documents_fewshots": retrieved_content_fewshots,
    }


def llm_analyzer(state: AgentState) -> dict:
    """
    Analiza la pregunta con el LLM y devuelve **texto libre** con
    hints (campos, filtros, joins…) – sin JSON estricto.
    Además:
      • parsea secciones del analyzer,
      • construye y guarda métricas/flags en `state`,
      • detecta grupos semánticos de keywords (semantic_or_groups) a partir de los filtros.
    """
    logger.info(
        "════════ ANALYZER1 ▸ START ════════ question='{}'",
        state.get("complete_user_question", "")[:220],
    )

    question = state.get("complete_user_question", "").strip()
    raw_question = state.get("user_question", "").strip()
    current_year = datetime.now().year

    # ═══════════════════════════════════════════════════════════════════
    # 🚨 TOPIC SWITCH DETECTION - Validación en Python (determinística)
    # Si la pregunta regenerada tiene conceptos inyectados que no están
    # en la pregunta raw, usamos la raw como fuente de verdad.
    # ═══════════════════════════════════════════════════════════════════
    is_topic_switch, safe_question, injected_concepts = _detect_topic_switch_injection(
        raw_question, question, state
    )
    if is_topic_switch:
        logger.warning(
            "ANALYZER1 ▸ TOPIC_SWITCH using raw_question instead of regenerated. "
            "Injected concepts blocked: {}",
            injected_concepts,
        )
        question = safe_question
        # Actualizar el state para que los nodos siguientes también usen la pregunta corregida
        state["complete_user_question"] = safe_question
        state["topic_switch_detected"] = True
        state["topic_switch_injected"] = injected_concepts

    q_lower = question.lower()
    # Tokens específicos de contratistas/proveedores que NO existen en el dataset
    # NO incluir "empresa" ya que es demasiado genérico
    contractor_tokens = [
        "contratista",
        "contratistas",
        "proveedor",
        "proveedores",
        "licitación",
        "licitaciones",
        "contrato",
        "contratos",
        "adjudicación",
        "adjudicaciones",
    ]
    # Solo bloquea términos específicos que no existen en el dataset
    if any(tok in q_lower for tok in contractor_tokens):
        rationale = (
            "El dataset de inversión pública solo trae entidades ejecutoras, "
            "no contratistas ni proveedores."
        )
        _set_gray_zone_reason(state, "MISSING_CONTRACTOR_DATA")
        _set_gray_zone_decision(
            state,
            {
                "status": "block",
                "rationale": rationale,
                "suggested_user_prompts": [
                    "Muéstrame entidades ejecutoras con más proyectos",
                    "Quiero ver entidades ejecutoras líderes por monto",
                ],
            },
        )
        _set_gray_zone_details(
            state,
            {
                "rationale": rationale,
            },
        )
        logger.info(
            "ANALYZER1 ▸ short_circuit contractor_intent reason=MISSING_CONTRACTOR_DATA"
        )
        return {}

    # Soporte robusto si INTERMEDIATE_SCHEMA_JSON no está importado en este módulo
    # Usar esquema MINIMAL por defecto para reducir tokens; si no está, caer al intermedio.
    try:
        default_schema_json = SCHEMA_MINIMAL_JSON  # type: ignore[name-defined]
    except NameError:
        default_schema_json = state.get("schema_minimal_json") or "{}"

    schema_json = (
        state.get("schema_minimal_json")
        or state.get("schema_intermediate_json")
        or default_schema_json
    )
    documents = state.get("documents", "")
    _init_user_assistance(state)

    # Recolectamos (timestamp,msg) de los mensajes que caen en la ventana
    # Ventana configurable desde .env (default 5 min)
    recent_seconds = settings.history_window_seconds

    now_ts = time.time()

    # Recolectamos historial filtrado por ventana de tiempo (helper)
    history_text = _build_recent_history(state, recent_seconds)

    forbidden_tokens_text = ", ".join(sorted(TEXT_FILTER_TOKEN_STOPLIST)) or ""

    # 🔴 CRITICAL: Lazy-load dimensions SOLO para flujo SQL (is_relevant="yes")
    # OPTIMIZACIÓN: Evita cargar dimensions en saludos, soporte, definiciones
    is_relevant = str(state.get("is_relevant", "")).lower() == "yes"
    if is_relevant:
        _ensure_dimensions_loaded(state)
        # 🚀 OPTIMIZACIÓN M1: Filtrar dimensiones relevantes para reducir tokens
        dimension_catalog = _get_filtered_dimensions_for_analyzer(state, question)
    else:
        dimension_catalog = {}
        logger.info(
            "DIMENSIONS_SKIP ▸ is_relevant!=yes → no catalog loaded for analyzer"
        )
    dimension_catalog_text = json.dumps(dimension_catalog, ensure_ascii=False, indent=2)

    # 🧠 SESSION MEMORY: Inyectar contexto de turnos anteriores exitosos
    session_memory_context = _format_session_memory_for_prompt(state)

    # 🚨 TOPIC SWITCH DETECTION: Pasar raw_question para validar inyección indebida
    raw_question = state.get("user_question", "") or ""

    chain = create_chain(
        llm_analyzer_prompt,
        [
            "complete_user_question",
            "raw_question",
            "schema_json",
            "documents",
            "history",
            "forbidden_tokens",
            "country_code",
            "session_memory_context",
            "dimension_catalog",
            "current_year",
        ],
    )

    analysis_text = invoke_llm_chain(
        chain,
        {
            "complete_user_question": question,
            "raw_question": raw_question,
            "schema_json": schema_json,
            "documents": documents,
            "history": history_text if settings.enable_history_context else "",
            "forbidden_tokens": forbidden_tokens_text,
            "country_code": state.get("country_code", ""),
            "session_memory_context": (
                session_memory_context if settings.enable_session_memory_context else ""
            ),
            "dimension_catalog": dimension_catalog_text,
            "current_year": current_year,
        },
        label="prefetch.llm_analyzer",
    )

    if hasattr(analysis_text, "content"):
        analysis_text = analysis_text.content
    if not isinstance(analysis_text, str):
        analysis_text = str(analysis_text)

    if not analysis_text.strip():
        logger.warning(
            "LLM analyzer returned empty text; generating fallback analysis."
        )
        country = state.get("country_code", "").strip()
        fallback_filters = (
            f"- column=p.pais_iso3 | operator== | value={country} | confidence=0.50"
            if country
            else "- column=p.pais_iso3 | operator== | value= | confidence=0.50"
        )
        analysis_text = (
            "### THINK_AHEAD\n"
            f"- The user asked: {question}\n"
            "- Generate minimal hypothesis with default columns.\n\n"
            "### SELECT_FIELDS\n- \n\n"
            "### TABLES_AND_JOINS\n- \n\n"
            "### FILTERS\n"
            f"{fallback_filters}\n\n"
            "### WARNINGS\n- Fallback analysis usado; validar manualmente filtros y joins.\n\n"
            "### UNCERTAINTIES\n- none\n\n"
            "### NON_MAPPABLE_ATTRIBUTES\n- none\n\n"
            "### THEME_MATCH_STRATEGY\n"
            "keywords: []\n"
            "search_fields: []\n"
            "territory_filters: []\n"
            "year_filters: {}\n"
            'notes: ""\n\n'
            "### DECISION\n"
            "status: proceed\n"
            'rationale: "Análisis por defecto; requiere confirmación manual."\n'
            "suggested_user_prompts: []\n"
            "exposed_schema_fields: []\n\n"
            "### REFERENCED_OBJECTS\n- \n"
        )

    logger.info("ANALYZER1 ▸ RAW OUTPUT\n{}", analysis_text)

    if "NO_TERRITORIAL_JOIN_REQUIRED" in analysis_text:
        territorial_keywords = (
            "territorio",
            "territorial",
            "departamento",
            "provincia",
            "comuna",
            "municipio",
            "región",
            "region",
            "distrito",
            "localidad",
        )
        q_lower = question.lower()
        tables_section = "\n".join(
            line
            for line in analysis_text.splitlines()
            if line.strip().lower().startswith("- table=")
        ).lower()
        filters_section = "\n".join(
            line
            for line in analysis_text.splitlines()
            if line.strip().lower().startswith("- column=")
        ).lower()

        territorial_tables = (
            "stg_mapainv_proyectosterritorios" in tables_section
            or "nombre_municipio" in filters_section
            or "nombre_departamento" in filters_section
            or "nombre_region" in filters_section
        )

        if territorial_tables or any(
            keyword in q_lower for keyword in territorial_keywords
        ):
            analysis_text = analysis_text.replace("NO_TERRITORIAL_JOIN_REQUIRED", "")

    # normalize escape sequences and split into real lines
    if "\\n" in analysis_text:
        analysis_text = analysis_text.replace("\\n", "\n")
    lines = analysis_text.splitlines()

    def _parse_kv_block(block: str) -> Dict[str, Any]:
        """
        Parse lines shaped as 'key=value | key2=value2' returning a dictionary.
        """
        result: Dict[str, Any] = {}
        if block.startswith("-"):
            block = block[1:].strip()
        for piece in (part.strip() for part in block.split("|")):
            if not piece or "=" not in piece:
                continue
            key, raw_value = piece.split("=", 1)
            key = key.strip().lower()
            raw_value = raw_value.strip()
            # Strip surrounding quotes
            if len(raw_value) >= 2 and (
                (raw_value[0] == raw_value[-1] == '"')
                or (raw_value[0] == raw_value[-1] == "'")
            ):
                value: Any = raw_value[1:-1]
            else:
                try:
                    value = ast.literal_eval(raw_value)
                except Exception:
                    value = raw_value
            result[key] = value
        return result

    def _parse_colon_block(line: str) -> tuple[str, Any]:
        if ":" not in line:
            return "", None
        key, raw_value = line.split(":", 1)
        key = key.strip().lower()
        raw_value = raw_value.strip()
        if len(raw_value) >= 2 and (
            (raw_value[0] == raw_value[-1] == '"')
            or (raw_value[0] == raw_value[-1] == "'")
        ):
            value: Any = raw_value[1:-1]
        else:
            try:
                value = ast.literal_eval(raw_value) if raw_value else raw_value
            except Exception:
                value = raw_value
        return key, value

    # -------------------------------------------------------------
    # Section-aware parsing (robust to optional blocks)
    # -------------------------------------------------------------
    tables: list[str] = []
    filters: list[str] = []
    uncertainties_lines: list[str] = []
    non_mappable_lines: list[str] = []
    theme_strategy_lines: list[str] = []
    decision_lines: list[str] = []
    current_section: str | None = None

    for line in lines:
        line_strip = line.strip()

        # Detect section headers (e.g., "### TABLES_AND_JOINS")
        if line_strip.startswith("###"):
            header = line_strip.lstrip("#").strip().upper()
            current_section = header
            continue

        # Collect only if we are inside the right section
        if current_section == "TABLES_AND_JOINS" and line_strip.lower().startswith(
            "- table="
        ):
            tables.append(line_strip)
        elif current_section == "FILTERS" and line_strip.lower().startswith(
            "- column="
        ):
            filters.append(line_strip)
        elif current_section == "UNCERTAINTIES" and line_strip:
            uncertainties_lines.append(line_strip)
        elif current_section == "NON_MAPPABLE_ATTRIBUTES" and line_strip:
            non_mappable_lines.append(line_strip)
        elif current_section == "THEME_MATCH_STRATEGY" and line_strip:
            theme_strategy_lines.append(line_strip)
        elif current_section == "DECISION" and line_strip:
            decision_lines.append(line_strip)

    parsed_uncertainties: list[Dict[str, Any]] = []
    for entry in uncertainties_lines:
        if entry.lower().startswith("- none"):
            if not parsed_uncertainties:
                parsed_uncertainties = []
            continue
        data = _parse_kv_block(entry)
        if not data:
            continue
        parsed_uncertainties.append(
            {
                "topic": data.get("topic") or "",
                "message": data.get("message") or "",
                "action": data.get("action"),
            }
        )

    parsed_non_mappable: list[Dict[str, Any]] = []
    for entry in non_mappable_lines:
        if entry.lower().startswith("- none"):
            if not parsed_non_mappable:
                parsed_non_mappable = []
            continue
        data = _parse_kv_block(entry)
        if not data:
            continue
        proxies = data.get("candidatos_proxies")
        if isinstance(proxies, str):
            proxies = [token.strip() for token in proxies.split(",") if token.strip()]
        parsed_non_mappable.append(
            {
                "atributo": data.get("atributo") or "",
                "razon": data.get("razon") or "",
                "impacto": (data.get("impacto") or "").lower(),
                "candidatos_proxies": list(proxies) if proxies else [],
            }
        )

    theme_strategy: Dict[str, Any] = {}
    for line in theme_strategy_lines:
        key, value = _parse_colon_block(line)
        if not key:
            continue
        theme_strategy[key] = value

    decision: Dict[str, Any] = {}
    for line in decision_lines:
        key, value = _parse_colon_block(line)
        if not key:
            continue
        decision[key] = value

    if decision and "status" in decision:
        decision["status"] = str(decision["status"]).lower()
    else:
        decision = {}

    if parsed_uncertainties:
        _set_gray_zone_non_mappable(state, parsed_uncertainties)
        _set_gray_zone_warnings(
            state,
            [
                item.get("message")
                for item in parsed_uncertainties
                if item.get("message")
            ],
        )
        action_payload = [
            {
                "topic": item.get("topic") or "",
                "message": item.get("message") or "",
                "action": item.get("action") or "",
            }
            for item in parsed_uncertainties
            if item.get("action")
        ]
        if action_payload:
            _set_uncertainty_actions(state, action_payload)
        else:
            _set_uncertainty_actions(state, [])
    else:
        _set_gray_zone_non_mappable(state, [])
        _set_gray_zone_warnings(state, [])
        _set_uncertainty_actions(state, [])

    if parsed_non_mappable:
        _set_gray_zone_non_mappable(state, parsed_non_mappable)
    else:
        _set_gray_zone_non_mappable(state, [])
    if decision:
        _set_gray_zone_decision(state, decision)
    else:
        _set_gray_zone_decision(state, {})

    analysis_lower = analysis_text.lower()
    status_block_match = re.search(r"status\s*:\s*block", analysis_lower)

    blocking_attrs = [
        attr
        for attr in parsed_non_mappable
        if attr.get("impacto", "").lower() == "blocking"
    ]

    decision_status = decision.get("status")
    if decision_status == "block":
        if not _get_gray_zone_reason(state):
            _set_gray_zone_reason(state, "MISSING_ATTRIBUTE")
    elif blocking_attrs or status_block_match:
        decision.setdefault("status", "block")
        decision.setdefault(
            "rationale", "Se detectó atributo duro inexistente en el análisis del LLM."
        )
        decision["status"] = "block"
        _set_gray_zone_reason(state, "MISSING_ATTRIBUTE")
    else:
        if decision_status in {"proceed", "proceed_with_warning"}:
            if _get_gray_zone_reason(state) == "MISSING_ATTRIBUTE":
                _set_gray_zone_reason(state, None)

    logger.info(
        f"LLM analyzer decision → status={decision.get('status')} "
        f"blocking_attrs={[attr.get('atributo') for attr in blocking_attrs]}"
    )

    logger.info(f"Analyzer hints → tables:{len(tables)}  filters:{len(filters)}")

    # --- Parse FILTERS lines into structured dicts
    parsed_filters: list[Dict[str, Any]] = []
    for entry in filters:
        data = _parse_kv_block(entry)
        if not data:
            continue
        confidence_raw = data.get("confidence", 1.0)
        try:
            confidence_val = float(confidence_raw)
        except (TypeError, ValueError):
            confidence_val = 1.0
        data["confidence"] = max(0.0, min(confidence_val, 1.0))
        parsed_filters.append(data)

    # ─── Canonicalizar filtros contra catálogos (fuzzy top-1, umbral alto) ───
    try:
        territory_catalog = (
            (dimension_catalog.get("territories") or [])
            if isinstance(dimension_catalog, dict)
            else []
        )
        sector_catalog = (
            (dimension_catalog.get("sectors") or [])
            if isinstance(dimension_catalog, dict)
            else []
        )
        entity_catalog = (
            (dimension_catalog.get("entities") or [])
            if isinstance(dimension_catalog, dict)
            else []
        )
        state_catalog = (
            (dimension_catalog.get("states") or [])
            if isinstance(dimension_catalog, dict)
            else []
        )
        funding_catalog = (
            (dimension_catalog.get("funding_sources") or [])
            if isinstance(dimension_catalog, dict)
            else []
        )
    except Exception:
        territory_catalog = sector_catalog = entity_catalog = state_catalog = (
            funding_catalog
        ) = []

    # Catálogo completo (sin recortes) para fallback fuzzy
    full_dimension_catalog = _get_dimensions_catalog(state) or {}
    territory_catalog_full = full_dimension_catalog.get("territories") or []
    sector_catalog_full = full_dimension_catalog.get("sectors") or []
    entity_catalog_full = full_dimension_catalog.get("entities") or []
    state_catalog_full = full_dimension_catalog.get("states") or []
    funding_catalog_full = full_dimension_catalog.get("funding_sources") or []

    fuzzy_map = {
        "nombre_region": territory_catalog,
        "nombre_departamento": territory_catalog,
        "nombre_municipio": territory_catalog,
        "nombresector_proyecto": sector_catalog,
        "nombreentidadejecutora_proyecto": entity_catalog,
        "estado_proyecto": state_catalog,
        "organismo_financiador": funding_catalog,
        "fuente_financiacion": funding_catalog,
    }

    fuzzy_map_full = {
        "nombre_region": territory_catalog_full,
        "nombre_departamento": territory_catalog_full,
        "nombre_municipio": territory_catalog_full,
        "nombresector_proyecto": sector_catalog_full,
        "nombreentidadejecutora_proyecto": entity_catalog_full,
        "estado_proyecto": state_catalog_full,
        "organismo_financiador": funding_catalog_full,
        "fuente_financiacion": funding_catalog_full,
    }

    for f in parsed_filters:
        col_norm = _normalize_column_name(str(f.get("column") or ""))
        catalog = fuzzy_map.get(col_norm) or []
        catalog_full = fuzzy_map_full.get(col_norm) or []
        val = f.get("value")
        if isinstance(val, str) and val.strip():
            # Limpiar value de wrappers como process_text('...') y quotes
            val_clean = _strip_function_wrappers(val)
            val_clean = val_clean.strip("'\"")
            if not val_clean:
                continue
            best = val_clean
            score = 0.0
            if catalog:
                best, score = _fuzzy_match_from_catalog(
                    val_clean, catalog, threshold=0.8
                )
            # Fallback al catálogo completo si no hay match fuerte en el recorte
            if (score < 0.8 or best == val_clean) and catalog_full:
                best_full, score_full = _fuzzy_match_from_catalog(
                    val_clean, catalog_full, threshold=0.8
                )
                if score_full > score:
                    best, score = best_full, score_full

            if score >= 0.8 and best != val_clean:
                f["fuzzy_original"] = val_clean
                f["fuzzy_score"] = score
                f["value"] = best
                logger.info(
                    "ANALYZER1 ▸ FUZZY catalog={} value='{}' → '{}' score={:.2f}",
                    col_norm,
                    val_clean,
                    best,
                    score,
                )
            elif score > 0:
                logger.info(
                    "ANALYZER1 ▸ FUZZY catalog={} value='{}' score={:.2f} (below threshold, keeping original)",
                    col_norm,
                    val_clean,
                    score,
                )

    # ─── Short-circuit: lookup por identificador único (id_proyecto / codigo_snip) ───
    # IMPORTANTE: Si hay un ID único, ignoramos filtros territoriales para evitar
    # que la expansión territorial corrompa la query o genere 0 resultados
    unique_cols = {"id_proyecto", "codigo_snip"}
    country_cols = {"pais_iso3"}
    unique_filters: list[Dict[str, Any]] = []
    country_filters: list[Dict[str, Any]] = []
    other_filters: list[Dict[str, Any]] = []
    territorial_cols = {"nombre_region", "nombre_departamento", "nombre_municipio"}

    for f in parsed_filters:
        norm_col = _normalize_column_name(str(f.get("column") or ""))
        if norm_col in unique_cols:
            unique_filters.append(f)
        elif norm_col in country_cols:
            country_filters.append(f)
        elif norm_col not in territorial_cols:
            other_filters.append(f)
        # Si hay unique_lookup, los filtros territoriales se ignoran

    if unique_filters:
        # Con ID único: solo país + ID, sin territorios ni otros filtros
        parsed_filters = country_filters + unique_filters
        state["unique_lookup"] = True
        logger.info(
            "ANALYZER1 ▸ UNIQUE_LOOKUP detected → keeping {} unique + {} country filters, dropping territorial",
            len(unique_filters),
            len(country_filters),
        )
    else:
        state.pop("unique_lookup", None)

    confidence_map: Dict[str, float] = {}
    low_confidence_filters: list[Dict[str, Any]] = []
    textual_filters: list[Dict[str, Any]] = []
    for data in parsed_filters:
        column_name = data.get("column") or ""
        normalized_column = _normalize_column_name(column_name) if column_name else ""
        if normalized_column:
            confidence_map[normalized_column] = data["confidence"]
            if normalized_column in TARGET_TEXT_COLUMNS and data.get("value"):
                textual_filters.append(data)
        if data["confidence"] < FILTER_CONFIDENCE_THRESHOLD:
            low_confidence_filters.append(data)

    _set_analysis_filters(state, parsed_filters)

    # ═══════════════════════════════════════════════════════════════════════
    # INYECTAR FILTROS PRESERVADOS DE SESIÓN ANTERIOR (territory_reply)
    # Cuando el usuario hace una repregunta territorial ("y en santiago")
    # después de una consulta con filtros ("proyectos de educación en..."),
    # debemos preservar esos filtros para que no se pierdan.
    # ═══════════════════════════════════════════════════════════════════════
    preserved_filters = state.get("territory_reply_preserved_filters", [])
    logger.info(
        "ANALYZER1 ▸ CHECK_PRESERVED_FILTERS found={} filters={}",
        len(preserved_filters) if preserved_filters else 0,
        preserved_filters,
    )
    if preserved_filters:
        current_filters = _get_analysis_filters(state)
        current_columns = {f.get("column", "") for f in current_filters}

        for pf in preserved_filters:
            pf_col = pf.get("column", "")
            # Solo inyectar si no hay conflicto (el Analyzer no generó ese filtro)
            if pf_col and pf_col not in current_columns:
                # Marcar como inyectado desde sesión
                pf_copy = dict(pf)
                pf_copy["evidence"] = f"(session preserved) {pf.get('evidence', '')}"
                current_filters.append(pf_copy)
                logger.info(
                    "ANALYZER1 ▸ INJECT_PRESERVED_FILTER column={} value={} from_session=True",
                    pf_col,
                    pf.get("value", ""),
                )

        _set_analysis_filters(state, current_filters)
        # Limpiar flag después de usar
        state.pop("territory_reply_preserved_filters", None)

    # ═══════════════════════════════════════════════════════════════════════
    # INYECTAR DIMENSIONES RESUELTAS DE SESSION_MEMORY (sector/entidad/estado)
    # Solo si el analyzer no las generó en este turno y el usuario no las cambió.
    # ═══════════════════════════════════════════════════════════════════════
    try:
        resolved_dims = _get_resolved_dimensions(state)
        current_filters = _get_analysis_filters(state) or []
        current_cols = {
            _normalize_column_name(str(f.get("column") or ""))
            for f in current_filters
            if f.get("column")
        }
        dim_map = {
            "nombresector_proyecto": "p.nombresector_proyecto",
            "nombreentidadejecutora_proyecto": "p.nombreentidadejecutora_proyecto",
            "estado_proyecto": "p.estado_proyecto",
        }
        for dim_key, col_name in dim_map.items():
            if dim_key not in resolved_dims:
                continue
            if _normalize_column_name(col_name) in current_cols:
                continue
            dim_val = resolved_dims[dim_key].get("value")
            dim_conf = resolved_dims[dim_key].get("confidence", 0.9)
            if not dim_val:
                continue
            current_filters.append(
                {
                    "column": col_name,
                    "operator": "=",
                    "value": dim_val,
                    "confidence": dim_conf,
                    "evidence": "(session memory)",
                }
            )
            logger.info(
                "ANALYZER1 ▸ INJECT_RESOLVED_DIMENSION column={} value={} conf={}",
                col_name,
                dim_val,
                dim_conf,
            )
        if current_filters:
            _set_analysis_filters(state, current_filters)
    except Exception as _e_res_dim:
        logger.warning(
            "ANALYZER1 ▸ resolved_dimensions injection failed: {}", _e_res_dim
        )

    soft_missing_filters_current = state.get("soft_missing_filters", [])

    extracted_tables: list[str] = []
    for entry in tables:
        match = re.search(r"table=([^|]+)", entry, re.IGNORECASE)
        if match:
            extracted_tables.append(match.group(1).strip())
    if state.get("unique_lookup"):
        extracted_tables = [BASE_PROJECT_TABLE]

    _set_analysis_tables(state, extracted_tables)
    _derive_modules_from_analyzer(state)

    # ─── Heuristic complexity features ──────────────────────────────
    join_count = max(len(tables) - 1, 0)  # joins = tables-1
    has_groupby = bool(
        re.search(r"\bgroup\s+by\b", analysis_text, re.I)
        or re.search(r"\bhaving\b", analysis_text, re.I)
    )

    # A query is complex if it involves ≥2 joins OR >2 tables OR >4 filters OR GROUP BY / HAVING
    is_complex = (
        1
        if (join_count >= 2 or len(tables) > 2 or len(filters) > 2 or has_groupby)
        else 0
    )
    # logger info
    logger.info(
        f"ANALYZER1 ▸ IS_COMPLEX join_count={join_count} tables={len(tables)} filters={len(filters)} has_groupby={has_groupby} is_complex={is_complex}"
    )

    used_columns: set[str] = {
        _normalize_column_name(f.get("column"))
        for f in parsed_filters
        if f.get("column")
    }
    used_columns_sorted = sorted(used_columns)

    logger.info(
        "ANALYZER1 ▸ SUMMARY tables={} joins={} filters={} strong={} soft={} groupby={} is_complex={} decision={} gray_reason={} assistance={}",
        len(tables),
        join_count,
        len(parsed_filters),
        sum(
            1
            for f in parsed_filters
            if f.get("confidence", 1.0) >= FILTER_CONFIDENCE_THRESHOLD
        ),
        len(low_confidence_filters),
        has_groupby,
        bool(is_complex),
        decision.get("status"),
        _get_gray_zone_reason(state),
        _get_assistance_needed(state),
    )

    # ──────────────────────────────────────────────────────────────
    # PASO 2: detectar grupos semánticos (para OR) desde los filtros
    # ──────────────────────────────────────────────────────────────
    try:
        # Intento 1: construir compound_filters y detectar sobre ese struct
        try:
            compound_filters = build_compound_text_filters(parsed_filters)
        except TypeError:
            # Posible firma distinta: probamos con los textuales fuertes
            compound_filters = build_compound_text_filters(textual_filters)
        semantic_or_groups = detect_semantic_or_groups(compound_filters)
    except Exception as e1:
        # Fallback: intentar detección directamente sobre los filtros textuales
        try:
            semantic_or_groups = detect_semantic_or_groups(
                textual_filters or parsed_filters
            )
        except Exception as e2:
            semantic_or_groups = []
            logger.warning("ANALYZER1 ▸ SEMANTIC_OR detection failed: {} / {}", e1, e2)

    # Persistir en state y loguear
    _set_semantic_or_groups(state, semantic_or_groups)
    if semantic_or_groups:
        try:
            size = len(semantic_or_groups[0].get("literals", []))
            lits = semantic_or_groups[0].get("literals", [])
            logger.info(
                "ANALYZER1 ▸ SEMANTIC_OR groups={} size={} literals={}",
                len(semantic_or_groups),
                size,
                lits,
            )
        except Exception:
            logger.info("ANALYZER1 ▸ SEMANTIC_OR groups detected (log format fallback)")

    # ─── Gray zone heuristics & clarificación ─────────────────────
    missing_items: list[str] = []
    if settings.enable_analyzer_gray_zone:
        blocking_attrs = [
            attr["atributo"]
            for attr in parsed_non_mappable
            if attr.get("impacto") == "blocking" and attr.get("atributo")
        ]
        if blocking_attrs:
            missing_items.extend(blocking_attrs)

        schema_columns = _get_schema_column_names()
        missing_from_filters = sorted(
            col for col in used_columns if col and col not in schema_columns
        )
        if missing_from_filters:
            logger.warning(f"ANALYZER1 ▸ UNSUPPORTED columns={missing_from_filters}")
            missing_items.extend(missing_from_filters)

        if missing_items:
            unique_missing = sorted(set(missing_items))
            logger.warning(f"ANALYZER1 ▸ UNSUPPORTED unique={unique_missing}")
            state["missing_filter_columns"] = unique_missing
        else:
            state.pop("missing_filter_columns", None)
        _set_gray_zone_reason(state, None)

    strong_textual_filters = [
        item
        for item in textual_filters
        if (item.get("confidence") or 0.0) >= FILTER_CONFIDENCE_THRESHOLD
    ]
    needs_textual_clarification = bool(textual_filters) and not strong_textual_filters

    question_text = state.get("complete_user_question", "") or state.get(
        "user_question", ""
    )
    base_clarification = (
        len(extracted_tables) <= 1
        and len(filters) == 0
        and not is_complex
        and len(question_text.strip().split()) >= 2
    )
    if missing_items:
        base_clarification = False

    uncertainty_actions = _get_uncertainty_actions(state)
    low_conf_filters_state = state.get("low_confidence_filters") or []
    has_low_conf_with_actions = bool(uncertainty_actions and low_conf_filters_state)

    clarification_targets: list[str] = []
    if base_clarification:
        clarification_targets.append("sector")
    if has_low_conf_with_actions:
        clarification_targets.extend(
            [(item.get("topic") or "general").lower() for item in uncertainty_actions]
        )
    if needs_textual_clarification:
        clarification_targets.append("keywords")
        assistance_ctx = _get_user_assistance(state)
        if not assistance_ctx.get("moment"):
            assistance_ctx["moment"] = "pre_sql"
        logger.info("ANALYZER1 ▸ CLARIFY low-confidence textual filters detected")

    # Normalizar targets (sin vacíos, únicos)
    normalized_targets: list[str] = []
    seen_targets: set[str] = set()
    for target in clarification_targets:
        target_norm = target.strip()
        if not target_norm:
            continue
        if target_norm in seen_targets:
            continue
        normalized_targets.append(target_norm)
        seen_targets.add(target_norm)
    clarification_targets = normalized_targets

    # ═══════════════════════════════════════════════════════════════════
    # IMPROVED DECISION LOGIC: Considera impacto y sugerencias
    # ═══════════════════════════════════════════════════════════════════

    # Detectar atributos bloqueantes (impacto=blocking)
    non_mappable_blocking = [
        attr
        for attr in parsed_non_mappable
        if attr.get("impacto", "").lower() == "blocking"
    ]

    # Detectar atributos no-bloqueantes pero con sugerencias
    non_mappable_suggestions = [
        attr
        for attr in parsed_non_mappable
        if attr.get("impacto", "").lower() == "non_blocking"
        and attr.get("candidatos_proxies")
    ]

    fallback_non_mappable_options: list[Dict[str, Any]] = []
    for idx, attr in enumerate(parsed_non_mappable):
        atributo = (attr.get("atributo") or attr.get("attribute") or "").strip()
        razon = (
            attr.get("razon") or attr.get("mensaje") or attr.get("reason") or ""
        ).strip()
        impacto_val = (attr.get("impacto") or "").lower().strip()
        proxies = attr.get("candidatos_proxies") or attr.get("proxies") or []
        proxies = [str(p).strip() for p in proxies if str(p).strip()]
        if not atributo and not razon and not proxies:
            continue
        description_parts: list[str] = []
        if razon:
            description_parts.append(razon)
        if proxies:
            description_parts.append("Puede probar con: " + ", ".join(proxies[:3]))
        description = ". ".join(description_parts)
        label = atributo or "Reformular criterio"
        fallback_non_mappable_options.append(
            {
                "key": f"non_mappable_{idx}",
                "label": f"Revisar {label}",
                "description": description,
                "topic": "general",
                "column": proxies[0] if proxies else None,
                "value": atributo or None,
                "impact": impacto_val,
                "source": "non_mappable_attribute",
                "interactive": False,
            }
        )

    # Extraer suggested_user_prompts del decision
    suggested_prompts = decision.get("suggested_user_prompts", [])
    if isinstance(suggested_prompts, str):
        suggested_prompts = [suggested_prompts]
    suggested_prompts = [p for p in suggested_prompts if p and isinstance(p, str)]

    # DECISIÓN 1: BLOQUEANTE (detener flujo, requiere clarificación)
    clarification_required = False

    if non_mappable_blocking or decision_status == "block":
        clarification_required = True  # Detiene el flujo
        logger.info(
            "ANALYZER1 ▸ DECISION blocking_clarification=True blocking_attrs={}",
            [attr.get("atributo") for attr in non_mappable_blocking],
        )

    # DECISIÓN 1.5: INTERCEPTOR DE TOPICS CRÍTICOS (defensa en profundidad)
    # Si el LLM emitió proceed_with_warning pero hay topics críticos, forzar clarificación
    elif decision_status == "proceed_with_warning" and uncertainty_actions:
        from modules.schemas.schemas import is_critical_uncertainty_topic

        uncertainty_topics = {
            (item.get("topic") or "").lower().strip() for item in uncertainty_actions
        }
        critical_found = [
            t for t in uncertainty_topics if is_critical_uncertainty_topic(t)
        ]
        if critical_found:
            clarification_required = True  # Forzar clarificación
            logger.info(
                "ANALYZER1 ▸ DECISION critical_topic_interceptor=True topics={}",
                critical_found,
            )
        else:
            clarification_required = False  # Solo warning, no bloquear

            # Guardar uncertainties como sugerencias para citizen_review post-fetch
            _init_user_assistance(state)
            state["user_assistance"]["type"] = "suggest"
            state["user_assistance"]["needed"] = False  # NO bloquea
            state["user_assistance"]["moment"] = "post_sql"
            state["user_assistance"]["metadata"]["suggestions_available"] = True
            state["user_assistance"]["metadata"]["non_blocking_issues"] = [
                {
                    "topic": item.get("topic"),
                    "message": item.get("message"),
                    "action": item.get("action"),
                }
                for item in uncertainty_actions
            ]
            logger.info(
                "ANALYZER1 ▸ DECISION proceed_with_warning non_critical_topics={} saved_for_postfetch=True",
                list(uncertainty_topics),
            )

    # DECISIÓN 2: SUGERENCIAS NO-BLOQUEANTES (continuar pero ofrecer opciones)
    elif (
        suggested_prompts
        or non_mappable_suggestions
        or (uncertainty_actions and decision_status == "proceed")
    ):
        clarification_required = False  # NO detiene el flujo

        # Poblar user_assistance con sugerencias (no-bloqueante)
        _init_user_assistance(state)
        state["user_assistance"]["type"] = "suggest"  # Nuevo tipo: sugerencia
        state["user_assistance"]["needed"] = False  # No bloquea
        state["user_assistance"]["moment"] = "pre_sql"
        state["user_assistance"]["metadata"]["suggestions_available"] = True
        state["user_assistance"]["metadata"]["suggested_prompts"] = suggested_prompts
        state["user_assistance"]["metadata"][
            "non_blocking_issues"
        ] = non_mappable_suggestions

        logger.info(
            "ANALYZER1 ▸ DECISION non_blocking_suggestions=True prompts={} non_mappable={}",
            len(suggested_prompts),
            len(non_mappable_suggestions),
        )

    # DECISIÓN 3: CLARIFICACIÓN POR TARGETS (legacy behavior)
    # FIX: Solo bloquear si el status NO es proceed/proceed_with_warning
    elif clarification_targets and decision_status not in {
        "proceed",
        "proceed_with_warning",
    }:
        clarification_required = True  # Detiene clarificación
        logger.info(
            "ANALYZER1 ▸ DECISION legacy_clarification=True targets={} status={}",
            clarification_targets,
            decision_status,
        )

    # Si hay targets pero el status es proceed_with_warning, NO bloquear
    elif clarification_targets and decision_status in {
        "proceed",
        "proceed_with_warning",
    }:
        clarification_required = False
        # Asegurar que los targets se pasen como sugerencias/warnings no bloqueantes
        if not state.get("user_assistance"):
            _init_user_assistance(state)

        # Agregar a non_blocking_issues o similar para que el frontend lo muestre si es necesario
        # pero SIN detener el flujo SQL
        logger.info(
            "ANALYZER1 ▸ DECISION non_blocking_targets=True targets={} status={}",
            clarification_targets,
            decision_status,
        )

    # DECISIÓN 4: NORMAL (sin problemas, continuar)
    else:
        clarification_required = False
        logger.info("ANALYZER1 ▸ DECISION proceed_normal no_issues_detected")

    # ═══════════════════════════════════════════════════════════════════

    # Actualizar state (legacy + nuevo)
    _init_user_assistance(state)
    assistance_state = state.get("user_assistance", {})
    metadata_state = (
        assistance_state.setdefault("metadata", {})
        if isinstance(assistance_state, dict)
        else {}
    )

    if clarification_required:
        metadata_state["targets"] = clarification_targets
        if fallback_non_mappable_options:
            existing = list(metadata_state.get("fallback_options") or [])
            metadata_state["fallback_options"] = (
                existing + fallback_non_mappable_options
            )
        else:
            metadata_state.pop("fallback_options", None)
    else:
        metadata_state["targets"] = []
        metadata_state.pop("fallback_options", None)

    _set_assistance_needed(state, clarification_required)

    _set_analysis_raw_text(state, analysis_text)
    _set_complexity(
        state, bool(is_complex), join_count, len(parsed_filters), bool(has_groupby)
    )
    state.pop("_filters_enforced", None)
    state.pop("missing_filters_errors", None)

    logger.info(
        "ANALYZER1 ▸ END tables={} filters={} textual={} needs_clarification={} semantic_or={}",
        len(tables),
        len(parsed_filters),
        len(textual_filters),
        _get_assistance_needed(state),
        len(_get_semantic_or_groups(state)),
    )
    logger.info("════════ ANALYZER1 ▸ END ═══════════")

    logger.info(f"------------ LLM Analysis Text:\n{analysis_text}")
    logger.info(f"------------ Is Complex: {is_complex}")

    # ═══════════════════════════════════════════════════════════════
    # NEW SYSTEM: Poblar analysis (consolidado)
    # ═══════════════════════════════════════════════════════════════
    _init_analysis(state)
    analysis_obj = state["analysis"]
    analysis_obj["raw_text"] = analysis_text

    analysis_filters = analysis_obj.setdefault("filters", {})
    analysis_filters["all"] = parsed_filters
    analysis_filters["confidence_map"] = confidence_map or {}
    analysis_filters["low_confidence"] = low_confidence_filters or []
    analysis_filters["soft_missing"] = soft_missing_filters_current
    analysis_filters["used_columns"] = used_columns_sorted

    analysis_tables = analysis_obj.setdefault("tables", {})
    analysis_tables["list"] = extracted_tables
    analysis_tables["count"] = len(extracted_tables)

    analysis_complexity = analysis_obj.setdefault("complexity", {})
    analysis_complexity.update(
        {
            "is_complex": bool(is_complex),
            "join_count": join_count,
            "filter_count": len(parsed_filters),
            "has_groupby": bool(has_groupby),
        }
    )
    uncertainties_obj = analysis_obj.setdefault("uncertainties", {})
    uncertainties_obj["reason"] = _get_gray_zone_reason(state)
    uncertainties_obj["decision"] = _get_gray_zone_decision(state)
    uncertainties_obj["details"] = _get_gray_zone_details(state)
    uncertainties_obj["non_mappable"] = parsed_non_mappable
    uncertainties_obj["warnings"] = _get_gray_zone_warnings(state)
    uncertainties_obj["actions"] = _get_uncertainty_actions(state)
    _set_theme_strategy(state, theme_strategy)
    analysis_theme = analysis_obj.setdefault("theme", {})
    analysis_theme["semantic_or_groups"] = _get_semantic_or_groups(state)

    # ═══════════════════════════════════════════════════════════════
    # ADDITIVE DIMENSION SEARCH: Detectar keywords en dimensiones (funding, sector, entity)
    # Controlado por feature flag: settings.enable_additive_dimension_search
    # ═══════════════════════════════════════════════════════════════
    theme_keywords = (
        theme_strategy.get("keywords", []) if isinstance(theme_strategy, dict) else []
    )

    # 🔴 CRITICAL: Usar catálogo COMPLETO para matching de dimensiones
    # El catálogo filtrado (funding_catalog, sector_catalog, entity_catalog) solo tiene
    # items con token-overlap con la pregunta, lo cual es demasiado restrictivo.
    # Para búsqueda aditiva, necesitamos buscar en TODO el catálogo.
    full_dimension_catalog = _get_dimensions_catalog(state)
    full_funding_catalog = (
        full_dimension_catalog.get("funding_sources", [])
        if isinstance(full_dimension_catalog, dict)
        else []
    )
    full_sector_catalog = (
        full_dimension_catalog.get("sectors", [])
        if isinstance(full_dimension_catalog, dict)
        else []
    )
    full_entity_catalog = (
        full_dimension_catalog.get("entities", [])
        if isinstance(full_dimension_catalog, dict)
        else []
    )

    logger.debug(
        "ADDITIVE_DIM_DEBUG ▸ flag={} keywords={} funding_catalog_len={} sector_catalog_len={} entity_catalog_len={}",
        settings.enable_additive_dimension_search,
        theme_keywords[:5] if theme_keywords else [],
        len(full_funding_catalog),
        len(full_sector_catalog),
        len(full_entity_catalog),
    )

    # Inicializar contadores para logging consolidado
    dimension_matches_summary = {"funding": 0, "sector": 0, "entity": 0}

    if settings.enable_additive_dimension_search and theme_keywords:
        # ─────────────────────────────────────────────────────────────
        # FUNDING KEYWORD DETECTION
        # ─────────────────────────────────────────────────────────────
        funding_keyword_matches: list[dict] = []

        if full_funding_catalog:
            funding_matcher = DimensionMatcher(
                name="funding",
                catalog=full_funding_catalog,
                strategy="tokenized",  # Tokeniza y compara stems: "emprendimiento" matchea "...EMPRENDIMIENTOS..."
                min_keyword_len=4,
            )
            funding_keyword_matches = funding_matcher.find_matches(theme_keywords)

            # Adaptar formato de matches al esperado por el resto del código
            for match in funding_keyword_matches:
                match["matched_source"] = match.pop("matched_value")  # Renombrar key
                match["match_type"] = match.pop("strategy")

        # Si encontramos matches, marcar para que el SQL generator haga JOIN con funding
        if funding_keyword_matches:
            state["funding_keyword_detected"] = True
            state["funding_keyword_matches"] = funding_keyword_matches
            dimension_matches_summary["funding"] = len(funding_keyword_matches)

            # Expandir search_fields para incluir fuente_financiacion
            current_search_fields = (
                theme_strategy.get("search_fields", [])
                if isinstance(theme_strategy, dict)
                else []
            )
            funding_fields = ["f.fuente_financiacion", "f.organismo_financiador"]

            # Agregar campos de funding si no están
            for ff in funding_fields:
                if ff not in current_search_fields:
                    current_search_fields.append(ff)

            if isinstance(theme_strategy, dict):
                theme_strategy["search_fields"] = current_search_fields
                theme_strategy["funding_keyword_matches"] = funding_keyword_matches
                # Marcar que se requiere JOIN con tabla de financiamiento
                notes = theme_strategy.get("notes", "") or ""
                if "funding_join_required" not in notes:
                    theme_strategy["notes"] = notes + " | funding_join_required"
                _set_theme_strategy(state, theme_strategy)

            # Forzar módulo funding
            analysis_obj.setdefault("modules", {}).update({"funding": True})
            _set_analysis_modules(
                state,
                territory=analysis_obj.get("modules", {}).get("territory", False),
                funding=True,
            )
        else:
            state.pop("funding_keyword_detected", None)
            state.pop("funding_keyword_matches", None)

        # ─────────────────────────────────────────────────────────────
        # SECTOR KEYWORD DETECTION
        # ─────────────────────────────────────────────────────────────
        sector_keyword_matches: list[dict] = []

        if full_sector_catalog:
            sector_matcher = DimensionMatcher(
                name="sector",
                catalog=full_sector_catalog,
                strategy="prefix",  # "agro" matchea "AGROPECUARIA Y PESCA"
                min_keyword_len=3,  # Sectores pueden tener keywords más cortos
            )
            sector_keyword_matches = sector_matcher.find_matches(theme_keywords)

            # Adaptar formato de matches
            for match in sector_keyword_matches:
                match["matched_sector"] = match.pop("matched_value")
                match["match_type"] = match.pop("strategy")

        # Si encontramos matches, marcar para que el SQL generator agregue OR en sector
        if sector_keyword_matches:
            state["sector_keyword_detected"] = True
            state["sector_keyword_matches"] = sector_keyword_matches
            dimension_matches_summary["sector"] = len(sector_keyword_matches)

            # Expandir search_fields para incluir nombresector_proyecto
            current_search_fields = (
                theme_strategy.get("search_fields", [])
                if isinstance(theme_strategy, dict)
                else []
            )
            sector_field = "p.nombresector_proyecto"

            if sector_field not in current_search_fields:
                current_search_fields.append(sector_field)

            if isinstance(theme_strategy, dict):
                theme_strategy["search_fields"] = current_search_fields
                theme_strategy["sector_keyword_matches"] = sector_keyword_matches
                # Agregar nota sobre sector match
                notes = theme_strategy.get("notes", "") or ""
                if "sector_match_detected" not in notes:
                    theme_strategy["notes"] = notes + " | sector_match_detected"
                _set_theme_strategy(state, theme_strategy)
        else:
            state.pop("sector_keyword_detected", None)
            state.pop("sector_keyword_matches", None)

        # ─────────────────────────────────────────────────────────────
        # ENTITY KEYWORD DETECTION
        # ─────────────────────────────────────────────────────────────
        entity_keyword_matches: list[dict] = []

        if full_entity_catalog:
            entity_matcher = DimensionMatcher(
                name="entity",
                catalog=full_entity_catalog,
                strategy="tokenized",  # Tokeniza y compara stems: "pymes" matchea "MIPYMES"
                min_keyword_len=4,  # Entidades suelen tener keywords más largos
            )
            entity_keyword_matches = entity_matcher.find_matches(theme_keywords)

            # Adaptar formato de matches
            for match in entity_keyword_matches:
                match["matched_entity"] = match.pop("matched_value")
                match["match_type"] = match.pop("strategy")

        # Si encontramos matches, marcar para que el SQL generator agregue OR en entidad
        if entity_keyword_matches:
            state["entity_keyword_detected"] = True
            state["entity_keyword_matches"] = entity_keyword_matches
            dimension_matches_summary["entity"] = len(entity_keyword_matches)

            # Expandir search_fields para incluir nombreentidadejecutora_proyecto
            current_search_fields = (
                theme_strategy.get("search_fields", [])
                if isinstance(theme_strategy, dict)
                else []
            )
            entity_field = "p.nombreentidadejecutora_proyecto"

            if entity_field not in current_search_fields:
                current_search_fields.append(entity_field)

            if isinstance(theme_strategy, dict):
                theme_strategy["search_fields"] = current_search_fields
                theme_strategy["entity_keyword_matches"] = entity_keyword_matches
                # Agregar nota sobre entity match
                notes = theme_strategy.get("notes", "") or ""
                if "entity_match_detected" not in notes:
                    theme_strategy["notes"] = notes + " | entity_match_detected"
                _set_theme_strategy(state, theme_strategy)
        else:
            state.pop("entity_keyword_detected", None)
            state.pop("entity_keyword_matches", None)

        # Log consolidado de todas las dimensiones
        total_matches = sum(dimension_matches_summary.values())
        if total_matches > 0:
            logger.info(
                "ANALYZER1 ▸ ADDITIVE_DIMENSION_SEARCH matches: funding={} sector={} entity={} total={}",
                dimension_matches_summary["funding"],
                dimension_matches_summary["sector"],
                dimension_matches_summary["entity"],
                total_matches,
            )
    else:
        # Feature flag deshabilitado o no hay keywords - limpiar estados
        state.pop("funding_keyword_detected", None)
        state.pop("funding_keyword_matches", None)
        state.pop("sector_keyword_detected", None)
        state.pop("sector_keyword_matches", None)
        state.pop("entity_keyword_detected", None)
        state.pop("entity_keyword_matches", None)

    # Si es lookup único, limpiar señales territoriales/tema para evitar joins o filtros extra
    if state.get("unique_lookup"):
        if isinstance(theme_strategy, dict):
            theme_strategy["territory_filters"] = []
            theme_strategy["notes"] = (
                theme_strategy.get("notes") or ""
            ) + " | unique_lookup"
            _set_theme_strategy(state, theme_strategy)
        analysis_tables["list"] = [BASE_PROJECT_TABLE]
        analysis_tables["count"] = 1
        analysis_obj.setdefault("modules", {}).update({"territory": False})

    # ═══════════════════════════════════════════════════════════════
    # TERRITORY RESOLUTION: Resolver territorio_filters a columnas específicas
    # Con detección de ambigüedad y clarificación
    # ═══════════════════════════════════════════════════════════════
    resolved_territories: list[dict] = []
    territory_filters = []
    if isinstance(theme_strategy, dict):
        territory_filters = theme_strategy.get("territory_filters") or []

    # Normalizar prefijos territoriales:
    # - "provincia X" / "departamento X" → "departamento X" (columna nombre_departamento)
    # - "municipio X" → "municipio X"
    # - "región X" → "region X"
    normalized_filters: list[str] = []
    explicit_levels: list[str] = []
    for tf in territory_filters:
        if not tf or not isinstance(tf, str):
            continue
        tf_clean = tf.strip()
        m_depto = re.match(
            r"^\s*(provincia|departamento)\s+(.+)$", tf_clean, re.IGNORECASE
        )
        m_muni = re.match(r"^\s*municipio\s+(.+)$", tf_clean, re.IGNORECASE)
        m_region = re.match(r"^\s*regi[oó]n\s+(.+)$", tf_clean, re.IGNORECASE)
        if m_depto:
            val = m_depto.group(2).strip()
            normalized_filters.append(f"departamento {val}")
            explicit_levels.append("departamento")
        elif m_muni:
            val = m_muni.group(1).strip()
            normalized_filters.append(f"municipio {val}")
            explicit_levels.append("municipio")
        elif m_region:
            val = m_region.group(1).strip()
            normalized_filters.append(f"region {val}")
            explicit_levels.append("region")
        else:
            normalized_filters.append(tf_clean)

    # Si el usuario explicitó un nivel, descartar otros niveles para evitar clarificaciones innecesarias
    if explicit_levels:
        target_level = explicit_levels[0]
        normalized_filters = [
            tf for tf in normalized_filters if tf.lower().startswith(target_level)
        ]

    if normalized_filters:
        territory_filters = normalized_filters
        if isinstance(theme_strategy, dict):
            theme_strategy["territory_filters"] = territory_filters
            _set_theme_strategy(state, theme_strategy)

    # ═══════════════════════════════════════════════════════════════
    # FUZZY CORRECTION: Corregir typos en territory_filters ANTES del resolver
    # Esto usa el mismo catálogo que el fuzzy matching de filters
    # ═══════════════════════════════════════════════════════════════
    if territory_filters and territory_catalog_full:
        fuzzy_corrected_filters: list[str] = []
        for tf in territory_filters:
            if not tf or not isinstance(tf, str):
                fuzzy_corrected_filters.append(tf)
                continue

            # Extraer prefijo de nivel (departamento, municipio, region) si existe
            level_prefix = ""
            tf_value = tf.strip()
            level_match = re.match(
                r"^\s*(departamento|municipio|region)\s+(.+)$", tf_value, re.IGNORECASE
            )
            if level_match:
                level_prefix = level_match.group(1).lower() + " "
                tf_value = level_match.group(2).strip()

            # Aplicar fuzzy matching al valor del territorio
            best, score = _fuzzy_match_from_catalog(
                tf_value, territory_catalog_full, threshold=0.8
            )

            if score >= 0.8 and best.upper() != tf_value.upper():
                corrected = level_prefix + best if level_prefix else best
                logger.info(
                    "TERRITORY_FILTER ▸ FUZZY typo correction: '{}' → '{}' (score={:.2f})",
                    tf,
                    corrected,
                    score,
                )
                fuzzy_corrected_filters.append(corrected)
            else:
                fuzzy_corrected_filters.append(tf)

        # Actualizar territory_filters con las correcciones
        if fuzzy_corrected_filters != territory_filters:
            territory_filters = fuzzy_corrected_filters
            if isinstance(theme_strategy, dict):
                theme_strategy["territory_filters"] = territory_filters
                _set_theme_strategy(state, theme_strategy)
            logger.info(
                f"TERRITORY_FILTER ▸ updated filters after fuzzy: {territory_filters}"
            )

    # Limpiar flags de clarificación territorial solo si NO hay asistencia pendiente
    # Limpiar flags de clarificación territorial solo si NO hay asistencia pendiente
    # Esto previene borrar el contexto cuando el usuario está respondiendo a una clarificación
    if not state.get("user_assistance", {}).get("needed"):
        state.pop("needs_territorial_clarification", None)
        state.pop("territorial_ambiguous_input", None)
        state.pop("territorial_options", None)
        state.pop("territorial_has_homonyms", None)
        state.pop("territorial_not_found", None)

    if territory_filters:
        logger.info(f"territorial_prefetch: processing filters: {territory_filters}")
        db = state.get("db")
        country_code = state.get("country_code", "").lower()

        if db and country_code:
            logger.info(
                f"territorial_prefetch: checking settings.use_territorial_disambiguation={settings.use_territorial_disambiguation}"
            )
            # Importar nuevo resolver si feature flag está habilitado
            if settings.use_territorial_disambiguation:
                from modules.graph.territorial_resolver import (
                    resolve_territorial_ambiguity,
                )

                # Usar nuevo sistema con detección de ambigüedad
                for tf in territory_filters:
                    if not tf or not isinstance(tf, str):
                        continue

                    territorio_input = tf.strip()

                    # Detectar si el usuario respondió a una clarificación con formato "(Tipo: Valor)"
                    # Ej: "proyectos en santiago (Provincia: SANTIAGO)"
                    clarification_match = re.search(
                        r"\(([^:]+):\s*([^)]+)\)\s*$", territorio_input, re.IGNORECASE
                    )
                    if clarification_match:
                        # Extraer solo la parte "(Tipo: Valor)" y usarla
                        territorio_input = f"({clarification_match.group(1)}: {clarification_match.group(2)})"
                        logger.info(
                            f"territorial_prefetch: detected clarification response format → '{territorio_input}'"
                        )

                    # Derivar nivel explícito del texto normalizado
                    force_level = None
                    tf_clean = territorio_input.strip()

                    # Detectar prefijo con o sin dos puntos (ej: "Departamento SANTIAGO" o "Departamento: SANTIAGO")
                    force_match = re.match(
                        r"^\s*(provincia|departamento|municipio|region)\s*:?\s+(.+)$",
                        tf_clean,
                        re.IGNORECASE,
                    )
                    if force_match:
                        level = force_match.group(1).lower()
                        value_only = force_match.group(2).strip()
                        if level == "provincia":
                            force_level = "departamento"
                        else:
                            force_level = level
                        tf_clean = value_only
                    else:
                        if tf_clean.lower().startswith("departamento "):
                            force_level = "departamento"
                            tf_clean = tf_clean.split(" ", 1)[1]
                        elif tf_clean.lower().startswith("municipio "):
                            force_level = "municipio"
                            tf_clean = tf_clean.split(" ", 1)[1]
                        elif tf_clean.lower().startswith("region "):
                            force_level = "region"
                            tf_clean = tf_clean.split(" ", 1)[1]
                        elif tf_clean.lower().startswith("provincia "):
                            force_level = "departamento"
                            tf_clean = tf_clean.split(" ", 1)[1]

                    try:
                        resolution = resolve_territorial_ambiguity(
                            territorio_name=tf_clean,  # Usar el input procesado
                            pais=country_code,
                            db_connection=db,
                            force_level=force_level,
                        )

                        if resolution.get("resolved"):
                            # Territorio único o con nivel explícito → usar columna específica
                            resolved_territories.append(
                                {
                                    "input": tf,
                                    "column": resolution.get("columna_filtro")
                                    or resolution.get("column"),
                                    "value": resolution["value"],
                                    "valor_original": resolution.get("valor_original"),
                                    "type": resolution.get("tipo"),
                                    "confidence": 0.95,
                                    "reason": resolution.get("reason", "unique"),
                                    "has_homonyms": resolution.get(
                                        "has_homonyms", False
                                    ),
                                }
                            )
                            # Si resolvimos, limpiar flags de aclaración territorial
                            state.pop("needs_territorial_clarification", None)
                            state.pop("territorial_ambiguous_input", None)
                            state.pop("territorial_options", None)
                            state.pop("territorial_has_homonyms", None)
                            state.pop("territorial_not_found", None)
                            _set_assistance_needed(state, False)

                            reason_display = resolution.get("reason", "unique")
                            logger.info(
                                "TERRITORY_RESOLVE ▸ '{}' → {}='{}' ({}, tipo={}, homonyms={})",
                                tf,
                                resolution.get("columna_filtro")
                                or resolution.get("column"),
                                resolution["value"],
                                reason_display,
                                resolution.get("tipo"),
                                resolution.get("has_homonyms", False),
                            )

                        elif resolution.get("needs_clarification"):
                            # Territorio ambiguo → marcar para clarificación
                            reason = resolution.get("reason", "unknown")
                            options = resolution.get("options", [])
                            has_homonyms = resolution.get("has_homonyms", False)

                            if reason == "ambiguous":
                                # Múltiples niveles → pedir clarificación
                                state["needs_territorial_clarification"] = True
                                state["territorial_ambiguous_input"] = tf
                                state["territorial_options"] = options
                                state["territorial_has_homonyms"] = has_homonyms

                                # Preparar user_assistance para que el flujo derive a clarificación pre-SQL
                                assistance_ctx = _get_user_assistance(state)
                                metadata_ctx = _get_assistance_metadata(state)
                                assistance_ctx["type"] = "disambiguate"
                                assistance_ctx["moment"] = "pre_sql"
                                assistance_ctx["needed"] = True
                                assistance_ctx["message"] = (
                                    assistance_ctx.get("message")
                                    or f"encuentro varias ubicaciones para '{tf}'. Elige la opción correcta."
                                )

                                clar_opts = []
                                for idx, opt in enumerate(options):
                                    # Campos estandarizados del resolver
                                    tipo = opt["tipo"]
                                    valor_display = opt["valor_original"]
                                    col = opt["columna_filtro"]

                                    # Label para mostrar al usuario
                                    label = f"{tipo.title()}: {valor_display}"

                                    # Valor para backend (formato "Tipo: Valor" para regex match)
                                    value_for_backend = label

                                    clar_opts.append(
                                        {
                                            "key": f"territory_{idx}",
                                            "label": label,
                                            "description": "Selecciona el territorio correcto",
                                            "topic": "territory",
                                            "column": col,
                                            "value": value_for_backend,
                                            "source": "territory_ambiguity",
                                        }
                                    )

                                assistance_ctx["options"] = clar_opts
                                metadata_ctx["targets"] = ["territory"]
                                metadata_ctx["territory_options"] = options
                                _set_assistance_needed(state, True)

                                logger.info(
                                    "TERRITORY_RESOLVE ▸ '{}' → AMBIGUOUS ({} options, homonyms={}): {}",
                                    tf,
                                    len(options),
                                    has_homonyms,
                                    [
                                        (
                                            o["tipo"],
                                            o.get("valor_original") or o.get("valor"),
                                        )
                                        for o in options[:3]
                                    ],
                                )

                                # NO agregar a resolved_territories para que no se genere filtro
                                # El prompt verá que no hay resolved_territories y pedirá clarificación

                            elif reason == "not_found":
                                # No encontrado → NO bloquear, solo advertencia
                                # El usuario pidió que "not found" sea warning/sugerencia, no bloqueo.
                                state["needs_territorial_clarification"] = False
                                state["territorial_ambiguous_input"] = tf
                                state["territorial_not_found"] = True

                                # Agregar sugerencia no bloqueante
                                if not state.get("user_assistance"):
                                    _init_user_assistance(state)

                                assistance_ctx = _get_user_assistance(state)
                                metadata_ctx = _get_assistance_metadata(state)

                                # Agregar a non_blocking_issues
                                non_blocking = metadata_ctx.get(
                                    "non_blocking_issues", []
                                )
                                non_blocking.append(
                                    {
                                        "atributo": "Territorio",
                                        "razon": f"No encuentro la ubicación '{tf}'.",
                                        "impacto": "non_blocking",
                                        "candidatos_proxies": [],
                                    }
                                )
                                metadata_ctx["non_blocking_issues"] = non_blocking

                                logger.warning(
                                    "TERRITORY_RESOLVE ▸ '{}' → NOT_FOUND, treating as non-blocking warning",
                                    tf,
                                )
                                # NO agregar a resolved_territories

                            elif reason == "generic_term":
                                # Término genérico (mi provincia, donde vivo, etc.) → BLOQUEAR
                                # Requiere clarificación ANTES de generar SQL
                                state["needs_territorial_clarification"] = True
                                state["territorial_ambiguous_input"] = tf
                                state["territorial_options"] = (
                                    []
                                )  # Sin opciones, pedir texto libre

                                # Preparar user_assistance para que el flujo derive a clarificación
                                assistance_ctx = _get_user_assistance(state)
                                metadata_ctx = _get_assistance_metadata(state)
                                assistance_ctx["type"] = "clarify_territory"
                                assistance_ctx["moment"] = "pre_sql"
                                assistance_ctx["needed"] = True
                                assistance_ctx["message"] = resolution.get(
                                    "message"
                                ) or (
                                    f"Para buscar en '{tf}', necesito saber el nombre específico. "
                                    "¿Cuál es el nombre de su provincia, departamento o municipio?"
                                )

                                # NO generar botones, pedir respuesta de texto libre
                                assistance_ctx["options"] = []
                                metadata_ctx["targets"] = ["territory"]
                                metadata_ctx["territory_options"] = []
                                metadata_ctx["requires_text_input"] = True
                                _set_assistance_needed(state, True)

                                logger.info(
                                    "TERRITORY_RESOLVE ▸ '{}' → GENERIC_TERM, blocking for clarification",
                                    tf,
                                )
                                # NO agregar a resolved_territories

                        else:
                            # Error de BD u otro caso crítico → fallback a OR triple solo por seguridad
                            # Este caso solo debería ocurrir en errores de conexión/query
                            resolved_territories.append(
                                {
                                    "input": tf,
                                    "column": None,
                                    "value": tf,
                                    "type": "error",
                                    "confidence": 0.0,
                                }
                            )
                            logger.error(
                                "TERRITORY_RESOLVE ▸ '{}' → ERROR: {}, fallback to OR triple for safety",
                                tf,
                                resolution.get("error", "unknown"),
                            )

                    except Exception as e:
                        logger.error(
                            "TERRITORY_RESOLVE ▸ error for '{}': {}",
                            tf,
                            e,
                            exc_info=True,
                        )
                        # Fallback a OR triple en caso de error
                        resolved_territories.append(
                            {
                                "input": tf,
                                "column": None,
                                "value": tf,
                                "type": "error",
                                "confidence": 0.0,
                            }
                        )

            else:
                # Feature flag disabled → usar sistema legacy (resolve_territory)
                for tf in territory_filters:
                    if not tf or not isinstance(tf, str):
                        continue
                    try:
                        match = resolve_territory(
                            db=db,
                            country_code=country_code,
                            user_input=tf.strip(),
                            min_similarity=0.5,  # umbral más bajo para capturar matches
                            limit=1,
                        )
                        if match:
                            resolved_territories.append(
                                {
                                    "input": tf,
                                    "column": match.columna_filtro,
                                    "value": match.valor_original,
                                    "type": match.tipo_territorio,
                                    "confidence": round(match.similitud, 2),
                                }
                            )
                            logger.info(
                                "TERRITORY_RESOLVE ▸ '{}' → {}='{}' (conf={:.0%}) [LEGACY]",
                                tf,
                                match.columna_filtro,
                                match.valor_original,
                                match.similitud,
                            )
                        else:
                            # No match encontrado, mantener fallback a triple-OR
                            resolved_territories.append(
                                {
                                    "input": tf,
                                    "column": None,
                                    "value": tf,
                                    "type": "unknown",
                                    "confidence": 0.0,
                                }
                            )
                            logger.debug(
                                "TERRITORY_RESOLVE ▸ '{}' → no match, fallback to OR [LEGACY]",
                                tf,
                            )
                    except Exception as e:
                        logger.warning(
                            "TERRITORY_RESOLVE ▸ error for '{}': {} [LEGACY]", tf, e
                        )
                        resolved_territories.append(
                            {
                                "input": tf,
                                "column": None,
                                "value": tf,
                                "type": "error",
                                "confidence": 0.0,
                            }
                        )

    # Guardar en analysis para que el generador SQL lo use
    analysis_obj["resolved_territories"] = resolved_territories
    state["resolved_territories"] = resolved_territories

    # FASE 2 FIX: Si hay territorios resueltos, eliminar los filtros genéricos de Analyzer1 de la lista 'filters'.
    # Analyzer1 genera filtros ILIKE para las 3 columnas (reg/dept/mun) cuando detecta territorio.
    # Si el Resolver tuvo éxito, debemos quitar esos filtros genéricos para que el SQL Generator
    # y Analyzer2 (Corrected Filters) se guíen ÚNICAMENTE por 'resolved_territories'.
    if resolved_territories:
        current_filters = analysis_obj.get("filters", [])
        cleaned_filters = []
        territorial_cols = {
            "nombre_departamento",
            "nombre_region",
            "nombre_municipio",
            "t.nombre_departamento",
            "t.nombre_region",
            "t.nombre_municipio",
        }

        pruned_count = 0
        for flt in current_filters:
            if not isinstance(flt, dict):
                cleaned_filters.append(flt)
                continue
            col_raw = str(flt.get("column") or "").lower()
            col_simple = col_raw.split(".")[-1]

            # DEBUG LOG
            logger.info(
                "DEBUG PRUNE check: col_raw='{}' simple='{}' match={}",
                col_raw,
                col_simple,
                col_simple in territorial_cols,
            )

            if col_simple in territorial_cols:
                pruned_count += 1
                continue
            cleaned_filters.append(flt)

        if pruned_count > 0:
            logger.info(
                "TERRITORY_RESOLVE ▸ Pruned {} redundant Analyzer1 territory filters to avoid conflicts",
                pruned_count,
            )
            analysis_obj["filters"] = cleaned_filters

    # Métricas de territorial disambiguation (para monitoreo y calibración)
    if settings.use_territorial_disambiguation and territory_filters:
        territorial_metrics = {
            "total_inputs": len(territory_filters),
            "resolved_unique": sum(
                1 for r in resolved_territories if r.get("reason") == "unique"
            ),
            "resolved_explicit_level": sum(
                1 for r in resolved_territories if r.get("reason") == "explicit_level"
            ),
            "resolved_exact_match": sum(
                1 for r in resolved_territories if r.get("reason") == "exact_match"
            ),
            "ambiguous_skipped": (
                1
                if state.get("needs_territorial_clarification")
                and not state.get("territorial_not_found")
                else 0
            ),
            "not_found_skipped": 1 if state.get("territorial_not_found") else 0,
            "error_fallback_legacy": sum(
                1 for r in resolved_territories if r.get("type") == "error"
            ),
            "has_homonyms_count": sum(
                1 for r in resolved_territories if r.get("has_homonyms")
            ),
        }

        analysis_obj["territorial_metrics"] = territorial_metrics

        logger.info(
            "TERRITORY_METRICS ▸ total={} unique={} explicit={} exact={} ambiguous={} not_found={} errors={} homonyms={}",
            territorial_metrics["total_inputs"],
            territorial_metrics["resolved_unique"],
            territorial_metrics["resolved_explicit_level"],
            territorial_metrics["resolved_exact_match"],
            territorial_metrics["ambiguous_skipped"],
            territorial_metrics["not_found_skipped"],
            territorial_metrics["error_fallback_legacy"],
            territorial_metrics["has_homonyms_count"],
        )

    if resolved_territories:
        logger.info(
            "TERRITORY_RESOLVE ▸ {} territories resolved: {}",
            len(resolved_territories),
            [
                (r["input"], r.get("column") or "AMBIGUOUS")
                for r in resolved_territories
            ],
        )

    # Si hay clarificación territorial pendiente, loguear
    if state.get("needs_territorial_clarification"):
        logger.info(
            "TERRITORY_RESOLVE ▸ CLARIFICATION_NEEDED input='{}' options={}",
            state.get("territorial_ambiguous_input"),
            len(state.get("territorial_options", [])),
        )

    # ═══════════════════════════════════════════════════════════════════════════
    # LOG CONSOLIDADO DE ESTRATEGIA DE FILTRADO
    # Muestra qué tipo de filtros se van a usar para la generación de SQL
    # ═══════════════════════════════════════════════════════════════════════════
    filter_strategy = {
        "text_search": {  # Búsqueda en nombre_proyecto, objetivo_proyecto
            "enabled": bool(theme_keywords),
            "keywords": theme_keywords[:5] if theme_keywords else [],
            "pattern": "ILIKE + process_text",
        },
        "dimension_funding": {  # Cruce con catálogo de fuentes
            "enabled": bool(state.get("funding_keyword_detected")),
            "matches": len(state.get("funding_keyword_matches", [])),
            "pattern": "JOIN + ILIKE process_text",
        },
        "dimension_sector": {  # Cruce con catálogo de sectores
            "enabled": bool(state.get("sector_keyword_detected")),
            "matches": len(state.get("sector_keyword_matches", [])),
            "pattern": "ILIKE process_text on nombresector_proyecto",
        },
        "dimension_entity": {  # Cruce con catálogo de entidades
            "enabled": bool(state.get("entity_keyword_detected")),
            "matches": len(state.get("entity_keyword_matches", [])),
            "pattern": "ILIKE process_text on nombreentidadejecutora_proyecto",
        },
        "catalog_equals": {  # Filtros de catálogo con igualdad exacta
            "enabled": bool(state.get("catalog_filter_suggestions")),
            "count": len(state.get("catalog_filter_suggestions", [])),
            "pattern": "UPPER(TRIM(col)) = UPPER(TRIM(val))",
        },
        "territory": {  # Filtros territoriales
            "enabled": bool(resolved_territories),
            "count": len(resolved_territories),
            "pattern": "ILIKE on t.nombre_X",
        },
        "unique_lookup": {  # Búsqueda por ID/código único
            "enabled": bool(state.get("unique_lookup")),
            "pattern": "col = value (exact)",
        },
    }

    # Construir resumen de estrategias activas
    active_strategies = [k for k, v in filter_strategy.items() if v.get("enabled")]

    logger.info(
        "═══════════════════════════════════════════════════════════════════════════\n"
        "FILTER_STRATEGY ▸ SUMMARY\n"
        "  active_strategies: {}\n"
        "  text_search: keywords={} (ILIKE + process_text)\n"
        "  dimension_funding: {} matches (JOIN fuentes)\n"
        "  dimension_sector: {} matches (ILIKE nombresector)\n"
        "  dimension_entity: {} matches (ILIKE entidad)\n"
        "  catalog_equals: {} filters (exact match)\n"
        "  territory: {} filters (ILIKE territorios)\n"
        "  unique_lookup: {} (ID/codigo_snip)\n"
        "═══════════════════════════════════════════════════════════════════════════",
        active_strategies,
        len(filter_strategy["text_search"]["keywords"]),
        filter_strategy["dimension_funding"]["matches"],
        filter_strategy["dimension_sector"]["matches"],
        filter_strategy["dimension_entity"]["matches"],
        filter_strategy["catalog_equals"]["count"],
        filter_strategy["territory"]["count"],
        filter_strategy["unique_lookup"]["enabled"],
    )

    logger.info("[ANALYSIS] Consolidated field populated")
    # ═══════════════════════════════════════════════════════════════

    # Preparar retorno consolidado (incluir asistencia territorial si se generó)
    result: dict[str, Any] = {
        "analysis": state.get("analysis"),
    }
    if state.get("user_assistance"):
        result["user_assistance"] = state.get("user_assistance")
    if state.get("needs_territorial_clarification"):
        result["needs_territorial_clarification"] = True
        result["territorial_options"] = state.get("territorial_options")
        result["territorial_ambiguous_input"] = state.get("territorial_ambiguous_input")
    return result


def classify_question_complexity(state: AgentState) -> dict:
    """
    Decide si la consulta es simple o compleja usando la bandera is_complex
    producida por llm_analyzer.
    """
    is_complex = _get_is_complex(state)
    state["is_complex_query"] = "yes" if is_complex else "no"
    logger.info(
        f"FLOW ▸ COMPLEXITY decision={state['is_complex_query']} analyzer_flag={is_complex}"
    )
    return {"is_complex_query": state["is_complex_query"]}


def llm_analyzer_2(state: AgentState) -> dict:
    """Genera few-shots dinámicos basados en el analyzer para consultas complejas."""

    logger.info(
        "════════ ANALYZER2 ▸ START ════════ country={}", state.get("country_code")
    )
    current_year = datetime.now().year

    # Reset default para no arrastrar valores previos
    state["dynamic_fewshots"] = ""
    state.pop("refined_text_filters", None)
    state.pop("refined_analysis_text", None)
    refined_filters_block: list | None = None

    if not settings.enable_dynamic_fewshots:
        logger.info("ANALYZER2 ▸ FEWSHOTS disabled=True")
        return {"dynamic_fewshots": ""}

    question = state.get("complete_user_question", "").strip()
    raw_question = state.get("user_question", "").strip()
    analysis = _get_analysis_raw_text(state).strip()
    country_code = state.get("country_code", "").strip()
    stop_tokens_text = ", ".join(sorted(TEXT_FILTER_TOKEN_STOPLIST)) or ""
    dimension_catalog = _get_dimensions_catalog(state)
    catalog_filter_hints = "- none"
    stoplist_notes = "[]"

    # ═══════════════════════════════════════════════════════════════════
    # 🚨 TOPIC SWITCH DETECTION - Segunda validación en Python
    # Si Analyzer 1 no detectó el topic switch, lo detectamos aquí
    # ═══════════════════════════════════════════════════════════════════
    if not state.get("topic_switch_detected"):
        is_topic_switch, safe_question, injected_concepts = (
            _detect_topic_switch_injection(raw_question, question, state)
        )
        if is_topic_switch:
            logger.warning(
                "ANALYZER2 ▸ TOPIC_SWITCH late detection! Using raw_question. "
                "Injected concepts blocked: {}",
                injected_concepts,
            )
            question = safe_question
            state["complete_user_question"] = safe_question
            state["topic_switch_detected"] = True
            state["topic_switch_injected"] = injected_concepts
    elif state.get("topic_switch_detected"):
        # Ya se detectó en Analyzer 1, confirmar que usamos la pregunta limpia
        logger.info(
            "ANALYZER2 ▸ TOPIC_SWITCH confirmed from Analyzer1, injected={}",
            state.get("topic_switch_injected", []),
        )

    # ═══════════════════════════════════════════════════════════════════
    # 🔒 RESULT SNAPSHOT VALIDATION - Double-check for ordinal references
    # Verify that if ANALYZER1 extracted an id_proyecto, it exists in
    # the result_snapshot from the previous query. No heuristics, just data.
    # ═══════════════════════════════════════════════════════════════════
    session_memory = _get_session_memory(state) or {}
    last_success = session_memory.get("last_success") or {}
    result_snapshot = last_success.get("result_snapshot") or []

    if result_snapshot:
        # Get IDs from the snapshot for validation
        snapshot_ids = {
            str(item.get("id", "")) for item in result_snapshot if item.get("id")
        }

        # Check if ANALYZER1 generated an id_proyecto filter
        analysis_filters = _get_analysis_filters(state)
        for flt in analysis_filters:
            col = str(flt.get("column", "")).lower()
            val = str(flt.get("value", ""))

            if "id_proyecto" in col or "codigo_snip" in col:
                if val in snapshot_ids:
                    # ✅ ID matches snapshot - this is expected for ordinal references
                    logger.info(
                        "ANALYZER2 ▸ SNAPSHOT_VALIDATION ✅ id={} found in result_snapshot (pos={})",
                        val,
                        next(
                            (
                                item.get("pos")
                                for item in result_snapshot
                                if str(item.get("id")) == val
                            ),
                            "?",
                        ),
                    )
                else:
                    # ⚠️ ID not in snapshot - could be a new query or LLM hallucination
                    # Log warning but don't block (user might have typed an ID directly)
                    logger.warning(
                        "ANALYZER2 ▸ SNAPSHOT_VALIDATION ⚠️ id={} NOT in result_snapshot. "
                        "Snapshot has: {}. This may be intentional if user specified ID directly.",
                        val,
                        [item.get("id") for item in result_snapshot[:5]],
                    )

    if not question or not analysis or not country_code:
        missing_fields = []
        if not question:
            missing_fields.append("complete_user_question")
        if not analysis:
            missing_fields.append("analysis.raw_text")
        if not country_code:
            missing_fields.append("country_code")
        logger.warning(
            f"ANALYZER2 ▸ FEWSHOTS skipped missing_inputs={','.join(missing_fields) or 'unknown'}"
        )
        return {"dynamic_fewshots": ""}

    try:
        tables_set = _get_analyzer_tables(state)
        columns_list = _get_analysis_used_columns(state)
        columns_set = set(columns_list) if columns_list else None

        # Log de tablas y columnas extraídas del Analyzer 1
        logger.info(
            "ANALYZER2 ▸ SCHEMA_EXPANSION tables_from_analyzer1={}",
            sorted(tables_set) if tables_set else "[]",
        )
        logger.info(
            "ANALYZER2 ▸ SCHEMA_EXPANSION columns_from_analyzer1={}",
            sorted(columns_set) if columns_set else "[]",
        )

        schema_minimal_filtered = _filter_schema_json(SCHEMA_MINIMAL_JSON, tables_set)
        schema_intermediate_filtered = _filter_schema_json(
            INTERMEDIATE_SCHEMA_JSON, tables_set
        )
        # Subconjunto enriquecido desde el esquema global (más detalles para tablas/columnas seleccionadas)
        schema_global_filtered, columns_found = _filter_schema_json_by_columns(
            SCHEMA_JSON_GLOBAL, tables_set, columns_set
        )

        # Log de tamaños de schemas filtrados y columnas encontradas
        logger.info(
            "ANALYZER2 ▸ SCHEMA_EXPANSION schema_sizes minimal={} intermediate={} global_subset={}",
            len(schema_minimal_filtered),
            len(schema_intermediate_filtered),
            len(schema_global_filtered),
        )
        if columns_found:
            logger.info(
                "ANALYZER2 ▸ SCHEMA_EXPANSION columns_detail={}",
                {t: cols for t, cols in columns_found.items()},
            )

        state["schema_minimal_json"] = schema_minimal_filtered
        state["schema_intermediate_json"] = schema_intermediate_filtered
        state["schema_global_subset_json"] = schema_global_filtered

        question_tokens = tokenize_like_process_text(question)

        # Usar estructura consolidada de analysis para strategy / filtros
        analysis_obj: Dict[str, Any] = (
            state.get("analysis") if isinstance(state.get("analysis"), dict) else {}
        )
        analysis_dirty = False
        theme_obj = (
            analysis_obj.setdefault("theme", {})
            if isinstance(analysis_obj, dict)
            else {}
        )
        existing_strategy = (
            theme_obj.get("strategy")
            if isinstance(theme_obj.get("strategy"), dict)
            else None
        )
        if not isinstance(existing_strategy, dict):
            existing_strategy = {}
            theme_obj["strategy"] = existing_strategy
            analysis_dirty = True
        theme_strategy_state = existing_strategy
        theme_keywords = theme_strategy_state.get("keywords") or []
        if theme_keywords:
            original_kw_len = len(theme_keywords)
            if original_kw_len > MAX_THEME_KEYWORDS_PROMPT:
                theme_keywords = theme_keywords[:MAX_THEME_KEYWORDS_PROMPT]
                logger.info(
                    "ANALYZER2 ▸ FEWSHOTS theme_keywords_truncated from={} to={}",
                    original_kw_len,
                    len(theme_keywords),
                )
                theme_strategy_state["keywords"] = theme_keywords
                analysis_dirty = True
        theme_keyword_tokens: list[str] = []
        for kw in theme_keywords:
            theme_keyword_tokens.extend(tokenize_like_process_text(str(kw)))
        logger.info(
            f"ANALYZER2 ▸ FEWSHOTS tokens question={question_tokens} theme={theme_keyword_tokens}"
        )

        blocked_catalog_tokens = _get_blocked_catalog_tokens(state)
        relax_catalog_filters = bool(state.get("catalog_filters_relaxed_columns"))

        dimension_suggestions = _suggest_dimension_filters_from_keywords(
            theme_keywords, dimension_catalog
        )
        # If no suggestions (or missing states), try phrases from the raw question too
        if not dimension_suggestions or not any(
            s.get("catalog_key") == "states" for s in dimension_suggestions
        ):
            question_phrases = _extract_question_phrases(question)
            extra_suggestions = _suggest_dimension_filters_from_keywords(
                question_phrases, dimension_catalog
            )
            if extra_suggestions:
                # merge without duplicates
                seen_keys = {
                    (s.get("column"), s.get("value")) for s in dimension_suggestions
                }
                for s in extra_suggestions:
                    key = (s.get("column"), s.get("value"))
                    if key not in seen_keys:
                        dimension_suggestions.append(s)
                        seen_keys.add(key)
        catalog_tokens_blocked: set[str] = set()
        if dimension_suggestions:
            _set_dimension_suggestions(state, dimension_suggestions)
            logger.info(
                "ANALYZER2 ▸ FEWSHOTS dimension_suggestions={}",
                dimension_suggestions,
            )
            catalog_filter_hints = (
                "\n".join(
                    f"- {item.get('label', 'Catálogo')}: usa {item.get('column')} = \"{item.get('value')}\""
                    for item in dimension_suggestions
                )
                or "- none"
            )
            # Proactively register structured filters for strict catalogs to avoid free-text noise
            try:
                for item in dimension_suggestions:
                    col = str(item.get("column") or "")
                    val = str(item.get("value") or "")
                    if _is_structured_text_column(col):
                        _register_structured_text_filter(state, col, val)
                        logger.info(
                            "ANALYZER2 ▸ FEWSHOTS structured_filter_autoregistered column={} value={}",
                            col,
                            val,
                        )
            except Exception as e:
                logger.warning(
                    "ANALYZER2 ▸ FEWSHOTS structured_filter_autoregister failed: {}", e
                )
            for item in dimension_suggestions:
                for token in _tokens_from_phrase(item.get("value")):
                    catalog_tokens_blocked.add(token)
        else:
            _clear_dimension_suggestions(state)
            catalog_filter_hints = "- none"

        state["catalog_filter_hints"] = catalog_filter_hints
        if dimension_suggestions:
            state["catalog_filter_suggestions"] = dimension_suggestions
        else:
            state.pop("catalog_filter_suggestions", None)
        if catalog_tokens_blocked:
            blocked_catalog_tokens.update(catalog_tokens_blocked)
        if blocked_catalog_tokens:
            state["catalog_filter_tokens_blocked"] = sorted(blocked_catalog_tokens)
        else:
            state.pop("catalog_filter_tokens_blocked", None)

        analyzer_filters = _get_analysis_filters(state)
        logger.info(
            "ANALYZER2 ▸ FEWSHOTS analyzer_filters_raw={}",
            analyzer_filters,
        )

        # ── Build catalog-corrected filter hints for LLM ──
        # Estos son los valores corregidos por fuzzy match que el LLM DEBE usar
        corrected_filter_values = []
        for f in analyzer_filters:
            col = _normalize_column_name(str(f.get("column") or ""))
            val = f.get("value")
            if col and val and isinstance(val, str):
                corrected_filter_values.append(f"- {col}: '{val}'")
        corrected_filters_hint = (
            "\n".join(corrected_filter_values) if corrected_filter_values else "- none"
        )

        compound_filters = build_compound_text_filters(
            analyzer_filters,
            question_tokens=question_tokens,
            theme_keyword_tokens=theme_keyword_tokens,
        )

        removed_tokens = _scrub_stoplist_from_compound_filters(compound_filters)
        if removed_tokens:
            logger.info("ANALYZER2 ▸ FEWSHOTS stoplist_pruned={}", removed_tokens)
            stoplist_notes = json.dumps(removed_tokens, ensure_ascii=False)
        else:
            stoplist_notes = "[]"

        # ── Semantic-OR candidate detection (analyzer stage, no SQL rewrite here) ──
        try:
            semantic_or_groups = detect_semantic_or_groups(compound_filters)
        except Exception as e:
            semantic_or_groups = []
            logger.warning("ANALYZER1 ▸ SEMANTIC_OR detection failed: {}", e)

        previous_groups = _get_semantic_or_groups(state)
        if semantic_or_groups != previous_groups:
            analysis_dirty = True
        _set_semantic_or_groups(state, semantic_or_groups)

        if semantic_or_groups:
            try:
                size = (
                    len(semantic_or_groups[0].get("literals", []))
                    if semantic_or_groups
                    else 0
                )
                lits = (
                    semantic_or_groups[0].get("literals", [])
                    if semantic_or_groups
                    else []
                )
                logger.info(
                    "ANALYZER1 ▸ SEMANTIC_OR groups={} size={} literals={}",
                    len(semantic_or_groups),
                    size,
                    lits,
                )
            except Exception:
                logger.info(
                    "ANALYZER1 ▸ SEMANTIC_OR groups detected (log format fallback)"
                )

        if compound_filters:
            state["compound_text_filters"] = compound_filters
            compound_details = [
                {
                    "filter_id": item.get("filter_id"),
                    "column": item.get("column"),
                    "value": item.get("value"),
                    "tokens": item.get("tokens"),
                    "confidence": item.get("confidence"),
                }
                for item in compound_filters
            ]
            logger.info(
                f"ANALYZER2 ▸ FEWSHOTS compound_filters_detected={len(compound_filters)} details={compound_details}"
            )
        else:
            state.pop("compound_text_filters", None)
            logger.info("ANALYZER2 ▸ FEWSHOTS compound_filters_detected=0")

        documents_block = (state.get("documents") or "").strip()
        dimension_payload = _build_dimension_prompt_payload(state)
        dimension_summary = dimension_payload.get("summary") or ""
        dimension_catalog_subset = dimension_payload.get("catalog") or {}
        dimension_vocab = dimension_payload.get("vocabulary") or {}
        state["dimension_hints_summary"] = dimension_summary
        state["dimension_hints_catalog"] = dimension_catalog_subset
        state["dimension_hints_vocabulary"] = dimension_vocab

        compound_filters_json = dumps_compound_filters(compound_filters)
        known_acronyms_map = _resolve_known_acronyms(country_code)
        known_acronyms_json = json.dumps(
            known_acronyms_map, ensure_ascii=False, indent=2
        )

        input_keys = [
            "question",
            "raw_question",
            "analysis",
            "schema_json",
            "country_code",
            "current_year",
            "compound_filters",
            "known_acronyms",
            "documents",
            "dimension_hints_summary",
            "dimension_hints",
            "dimension_vocabulary",
            "forbidden_tokens",
            "catalog_filter_hints",
            "corrected_filter_values",
            "stoplist_notes",
            "resolved_territories",  # FASE 2: Territorios resueltos por backend
        ]

        # 🚨 TOPIC SWITCH DETECTION: raw_question para validar inyección indebida
        raw_question = state.get("user_question", "") or ""

        chain = create_chain(
            llm_analyzer_2_prompt,
            input_keys,
        )

        # Log del schema que se usará en el prompt
        schema_used = schema_global_filtered or schema_minimal_filtered
        schema_source = "global_subset" if schema_global_filtered else "minimal"
        logger.info(
            "ANALYZER2 ▸ LLM_INVOKE schema_source={} schema_len={} tables_count={}",
            schema_source,
            len(schema_used) if schema_used else 0,
            len(json.loads(schema_used)) if schema_used else 0,
        )
        logger.info(
            "ANALYZER2 ▸ CORRECTED_FILTERS hint={}",
            corrected_filters_hint,
        )

        # FASE 2: Preparar resolved_territories para el prompt
        resolved_territories_for_prompt = state.get("resolved_territories") or []
        resolved_territories_json = (
            json.dumps(resolved_territories_for_prompt, ensure_ascii=False, indent=2)
            if resolved_territories_for_prompt
            else "None"
        )
        if resolved_territories_for_prompt:
            logger.info(
                "ANALYZER2 ▸ RESOLVED_TERRITORIES injected={}",
                resolved_territories_for_prompt,
            )

        response = invoke_llm_chain(
            chain,
            {
                "question": question,
                "raw_question": raw_question,
                "analysis": analysis,
                "schema_json": schema_used,
                "country_code": country_code,
                "current_year": current_year,
                "compound_filters": compound_filters_json,
                "known_acronyms": known_acronyms_json,
                "documents": documents_block or "None",
                "dimension_hints_summary": dimension_summary or "None",
                "dimension_hints": (
                    json.dumps(dimension_catalog_subset, ensure_ascii=False, indent=2)
                    if dimension_catalog_subset
                    else "{}"
                ),
                "dimension_vocabulary": (
                    json.dumps(dimension_vocab, ensure_ascii=False, indent=2)
                    if dimension_vocab
                    else '{"strings": [], "tokens": []}'
                ),
                "forbidden_tokens": stop_tokens_text,
                "catalog_filter_hints": catalog_filter_hints,
                "corrected_filter_values": corrected_filters_hint,
                "stoplist_notes": stoplist_notes,
                "resolved_territories": resolved_territories_json,  # FASE 2
            },
            label="prefetch.llm_analyzer2",
        )

        if hasattr(response, "content"):
            response = response.content
        if not isinstance(response, str):
            response = str(response)

        response_text = response.strip()
        sections = _parse_analyzer_sections(response_text)

        def _collect_section(name: str) -> str | None:
            lines = sections.get(name) or []
            cleaned = [line for line in lines if line.strip()]
            if not cleaned:
                return None
            return f"### {name}\n" + "\n".join(cleaned)

        refined_sections: list[str] = []
        for label in (
            "REFINED_FILTERS",
            "REFINED_WARNINGS",
            "REFINED_THEME_MATCH",
            "REFINED_GUIDANCE",
        ):
            section_text = _collect_section(label)
            if section_text:
                refined_sections.append(section_text)

        fewshots_lines = sections.get("FEWSHOTS") or []
        fewshots_block = "\n".join(fewshots_lines).strip()
        if not fewshots_block and not sections and response_text:
            fewshots_block = response_text

        refined_filters_block: list[dict[str, Any]] = []

        # Usar fallback determinístico para refined_filters
        if compound_filters:
            fallback_filters = build_default_refined_filters(compound_filters)
            if fallback_filters:
                refined_filters_block = fallback_filters
                logger.info(
                    f"ANALYZER2 ▸ FEWSHOTS fallback_refined_filters_applied={len(refined_filters_block)}"
                )

        if refined_filters_block:
            filtered_structured: list[dict[str, Any]] = []
            for entry in refined_filters_block:
                column_name = str(entry.get("column") or "")
                if _is_structured_text_column(column_name):
                    literal_value = entry.get("literal_value") or entry.get("value")
                    _register_structured_text_filter(state, column_name, literal_value)
                    logger.info(
                        "ANALYZER2 ▸ FEWSHOTS structured_filter_registered column={} value={}",
                        column_name,
                        literal_value,
                    )
                    continue
                filtered_structured.append(entry)
            refined_filters_block = filtered_structured

        if refined_filters_block and dimension_suggestions:
            catalog_columns_norm = {
                _normalize_column_name(item.get("column") or "")
                for item in dimension_suggestions
                if item.get("column")
            }
            if catalog_columns_norm:
                filtered_refined: list[dict[str, Any]] = []
                dropped = 0
                for entry in refined_filters_block:
                    column_norm = _normalize_column_name(str(entry.get("column") or ""))
                    if column_norm and column_norm in catalog_columns_norm:
                        dropped += 1
                        logger.info(
                            "ANALYZER2 ▸ FEWSHOTS skip_refined_filter catalog_column={}",
                            entry.get("column"),
                        )
                        continue
                    filtered_refined.append(entry)
                if dropped:
                    refined_filters_block = filtered_refined
                    logger.info(
                        "ANALYZER2 ▸ FEWSHOTS refined_filters_catalog_pruned={} columns={}",
                        dropped,
                        catalog_columns_norm,
                    )

        if refined_filters_block:
            blocked_tokens_set = _get_blocked_catalog_tokens(state)
            for entry in refined_filters_block:
                tokens_before = list(
                    entry.get("primary_tokens") or entry.get("tokens") or []
                )
                sanitized_tokens = _sanitize_refined_tokens(
                    tokens_before, entry.get("token_metadata")
                )
                if len(sanitized_tokens) != len(tokens_before):
                    logger.info(
                        "ANALYZER2 ▸ FEWSHOTS refined_tokens_sanitized column={} before={} after={}",
                        entry.get("column"),
                        len(tokens_before),
                        len(sanitized_tokens),
                    )
                if blocked_tokens_set:
                    filtered_tokens = [
                        token
                        for token in sanitized_tokens
                        if token not in blocked_tokens_set
                    ]
                    if len(filtered_tokens) != len(sanitized_tokens):
                        removed = sorted(set(sanitized_tokens) - set(filtered_tokens))
                        logger.info(
                            "ANALYZER2 ▸ FEWSHOTS refined_tokens_catalog_blocked column={} removed={}",
                            entry.get("column"),
                            removed,
                        )
                    sanitized_tokens = filtered_tokens
                entry["primary_tokens"] = sanitized_tokens
                entry["tokens"] = sanitized_tokens
                if not sanitized_tokens:
                    entry["use_token_exists"] = False

        guidance_block = build_filter_guidance_block(refined_filters_block)
        catalog_block = _build_dimension_filter_block(dimension_suggestions)
        if catalog_block and blocked_catalog_tokens and not relax_catalog_filters:
            catalog_block = (
                catalog_block
                + "\n- No repitas estas palabras como filtros textuales: "
                + ", ".join(sorted(blocked_catalog_tokens))
            )

        extra_guidance = [
            text for text in (guidance_block, catalog_block) if text.strip()
        ]
        if extra_guidance:
            guidance_text = "\n".join(extra_guidance)
            merged = False
            for idx, section_text in enumerate(refined_sections):
                if section_text.startswith("### REFINED_GUIDANCE"):
                    refined_sections[idx] = section_text + ("\n" + guidance_text)
                    merged = True
                    break
            if not merged:
                refined_sections.append("### REFINED_GUIDANCE\n" + guidance_text)

        if refined_sections:
            refined_text = "\n\n".join(refined_sections).strip()
            state["refined_analysis_text"] = refined_text
            logger.info(
                "ANALYZER2 ▸ FEWSHOTS refined_sections={} length={}",
                len(refined_sections),
                len(refined_text),
            )
        else:
            state.pop("refined_analysis_text", None)

        fallback_parts = [
            text for text in (guidance_block, catalog_block) if text.strip()
        ]
        dynamic_text = fewshots_block or "\n\n".join(fallback_parts).strip()
        state["dynamic_fewshots"] = dynamic_text

        if refined_filters_block:
            state["refined_text_filters"] = refined_filters_block
            logger.info(
                f"ANALYZER2 ▸ FEWSHOTS refined_filters={json.dumps(refined_filters_block, ensure_ascii=False)}"
            )
        else:
            state.pop("refined_text_filters", None)
            logger.info("ANALYZER2 ▸ FEWSHOTS refined_filters=0")

        if dynamic_text:
            preview = dynamic_text[:600].replace("\n", " ")
            logger.info(
                "ANALYZER2 ▸ FEWSHOTS generated length={} preview={}",
                len(dynamic_text),
                preview,
            )
            logger.info("ANALYZER2 ▸ FEWSHOTS content\n{}", dynamic_text)
        else:
            logger.info("ANALYZER2 ▸ FEWSHOTS empty_output=True")

        # ─────────────────────────────────────────────────────────────────
        # JOIN OPTIMIZATION: Clasificar filtros por tabla origen
        # ─────────────────────────────────────────────────────────────────
        filters_by_table = _classify_filters_by_table(state)
        has_cross_table_or = _detect_cross_table_or_semantic(state)

        state["filters_by_table"] = filters_by_table
        state["join_optimization_enabled"] = not has_cross_table_or

        logger.info(
            "ANALYZER2 ▸ JOIN_OPT by_table p={} t={} f={} cross_table_or={} optimization_enabled={}",
            len(filters_by_table.get("p", [])),
            len(filters_by_table.get("t", [])),
            len(filters_by_table.get("f", [])),
            has_cross_table_or,
            not has_cross_table_or,
        )

        if analysis_dirty:
            state["analysis"] = analysis_obj

        logger.info(
            "ANALYZER2 ▸ FEWSHOTS END output_len={} refined_filters={} relaxed_catalog={}",
            len(dynamic_text),
            len(refined_filters_block or []),
            state.get("catalog_filters_relaxed_columns"),
        )
        logger.info("════════ ANALYZER2 ▸ END ═══════════")
        return {"dynamic_fewshots": dynamic_text}

    except Exception as exc:  # pragma: no cover
        logger.error(f"ANALYZER2 ▸ FEWSHOTS error={exc}")
        logger.debug(traceback.format_exc())
        return {"dynamic_fewshots": ""}
