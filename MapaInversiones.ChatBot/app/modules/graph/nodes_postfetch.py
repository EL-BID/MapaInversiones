# nodes_postfetch.py
# Nodos de la etapa post-fetch: formatear la respuesta final, ejecutar citizen review y componer el frontend.

from __future__ import annotations

from typing import Any, Dict, List, Optional, Sequence

import copy
import json
import re
import traceback

from loguru import logger
from langchain_core.messages import AIMessage

from modules.config import settings
from modules.utils.log_decorator import trace_node
from modules.graph.state import AgentState
from modules.utils.markdown_utils import format_table_markdown
from modules.graph.prompts_postfetch import (
    generate_question_summary_prompt,
    user_response_frontend_prompt,
    user_response_whatsapp_prompt,
    user_response_norows_prompt,
    gray_zone_block_prompt,
    gray_zone_textual_prompt,
    row_relevance_evaluation_prompt,
    citizen_review_prompt,
    citizen_summary_rewrite_prompt,
)
from modules.schemas.schemas import (
    question_summary,
    process_user_question,
    sql_query_response,
)
from modules.graph.helpers import *  # noqa: F401,F403
from langchain_community.document_compressors.flashrank_rerank import FlashrankRerank
from flashrank import Ranker
from langchain.schema import Document

# Cliente FlashRank (lazy) para evitar reinstanciación en cada request
_flashrank_client: Optional[Ranker] = None
# Explicit imports (circular import workaround)
from modules.graph.helpers_estado import (
    _get_all_rows_irrelevant,
    _get_citizen_actions,
    _get_citizen_note,
    _get_dimensions_catalog,
    _get_effective_analysis_text,
    _get_frontend_base_notes,
    _get_frontend_base_notes_improved,
    _get_frontend_base_notes_raw,
    _get_frontend_columns_filtered,
    _get_frontend_columns_meta,
    _get_frontend_columns_removed,
    _get_frontend_rows_filtered,
    _get_frontend_rows_raw,
    _get_frontend_rows_removed,
    _get_frontend_show_table,
    _get_frontend_summary,
    _get_frontend_summary_improved,
    _get_frontend_summary_raw,
    _get_frontend_table_markdown,
    _get_frontend_table_metadata,
    _get_gray_zone_decision,
    _get_gray_zone_details,
    _get_gray_zone_non_mappable,
    _get_gray_zone_reason,
    _get_gray_zone_warnings,
    _get_irrelevant_retry_count,
    _get_keyword_tokens_tried,
    _get_keyword_used,
    _get_rows_limit_applied,
    _get_rows_limit_default,
    _get_rows_limit_max,
    _get_rows_removed_sample,
    _get_semantic_or_groups,
    _get_sql_cached_results,
    _get_sql_displayed_count,
    _get_sql_more_than_limit,
    _get_sql_query,
    _get_sql_results,
    _get_sql_rowcount,
    _get_theme_strategy,
    _get_uncertainty_actions,
    _get_user_assistance,
    _set_all_rows_irrelevant,
    _set_citizen_actions,
    _set_citizen_actions_details,
    _set_citizen_feedback,
    _set_citizen_note,
    _set_frontend_base_notes,
    _set_frontend_base_notes_improved,
    _set_frontend_base_notes_raw,
    _set_frontend_columns_filtered,
    _set_frontend_columns_meta,
    _set_frontend_columns_removed,
    _set_frontend_rows_filtered,
    _set_frontend_rows_raw,
    _set_frontend_rows_removed,
    _set_frontend_show_table,
    _set_frontend_summary,
    _set_frontend_summary_improved,
    _set_frontend_summary_raw,
    _set_frontend_table_markdown,
    _set_frontend_table_metadata,
    _get_frontend_technical_details,
    _set_frontend_technical_details,
    _set_frontend_warning_priority,
    _set_gray_zone_details,
    _set_gray_zone_reason,
    _set_rows_removed_sample,
    _record_citizen_metric,
    _collect_fallback_keywords,
    # Frustration Tracking
    _get_frustration_count,
    _increment_frustration_count,
    _reset_frustration_count,
    _should_show_human_contact,
    # Session Memory
    _save_success_context,
    _get_analysis_filters,
)
from modules.graph.helpers_texto import (
    _extract_first_json_block,
)
from modules.graph.helpers_respuesta import (
    _build_columns_meta_from_rows,
    _build_dimension_gap_notes,
    _build_gray_zone_note,
    _build_rows_preview,
    _build_technical_detail_sections,
    _collect_gray_zone_signals,
    _filter_rows_and_columns_by_relevance,
    _group_removal_reasons,
    _infer_gray_zone_reason,
    _load_definitions_markdown,
    _rewrite_summary_with_llm,
    summarize_analyzer_for_response,
)
from constants.nodes import SAFE_RESPONSE, MIN_WORD_COUNT_FOR_SUMMARY
from modules.graph.nodes_fetch import safe_invoke
from modules.utils.llm_guardrails import invoke_llm_chain
from modules.graph.citizen_rules import CITIZEN_RULES


def process_user_response(state: AgentState):
    """
    Procesa la respuesta SQL y la convierte en un mensaje amigable.
    """

    # — Moderation short‑circuit —
    resp_type = state.get("response_type")
    if resp_type in {"moderation_reprompt", "moderation_blocked"}:
        # El nodo de seguridad ya cargó SAFE_RESPONSE (u otro mensaje) en state["messages"].
        # No ejecutar SQL ni guardar; sólo devolver el mensaje actual.
        msgs = state.get("messages") or [AIMessage(content=SAFE_RESPONSE)]
        logger.info(f"FLOW ▸ RESPONSE short_circuit type={resp_type}")
        state["stop_processing"] = True  # señal opcional para capas superiores
        return {"messages": msgs, "response_type": resp_type}
    logger.info(
        "FLOW ▸ RESPONSE START cache_hit={} source={}",
        state.get("is_cache_hit", False),
        state.get("source"),
    )
    logger.info(
        "FLOW ▸ RESPONSE metadata={}",
        {
            "sql_query": _get_sql_query(state),
            "rowcount": _get_sql_rowcount(state),
            "used_keyword_regenerate": _get_keyword_used(state),
            "keyword_tokens": _get_keyword_tokens_tried(state),
            "keyword_original_filters": state.get("keyword_original_filters"),
            "used_fallback": state.get("used_fallback"),
            "fallback_sql": state.get("fallback_sql"),
            "fallback_rows": state.get("fallback_rows"),
            "gray_zone_reason": _get_gray_zone_reason(state),
            "gray_zone_details": _get_gray_zone_details(state),
            "response_type": state.get("response_type"),
        },
    )

    # Get cache status and results
    is_cache_hit = state.get("is_cache_hit", False)
    is_recent_cache_hit = state["is_recent_cache_hit"]
    cached_sql_results = _get_sql_cached_results(state) if is_cache_hit else None

    sql_rows_limit = _get_rows_limit_applied(state) or settings.sql_rows_limit

    # Get messages from state
    messages = state["messages"]

    # Determine SQL response source - either from cache or latest message
    sql_response = (
        cached_sql_results
        if is_cache_hit and is_recent_cache_hit
        else messages[-1].content if messages else ""
    )

    original_language_iso = state["original_language_iso"]
    question = state["complete_user_question"]
    source = state["source"]
    country_code = state["country_code"]
    sql_query = _get_sql_query(state)
    analyzer_text = _get_effective_analysis_text(state)
    analyzer_summary = summarize_analyzer_for_response(
        analyzer_text, original_language_iso
    )

    # ── Aviso de salida recortada ────────────────────────────────────────────
    #  Muestra el aviso si:
    #   a) execute_sql_query detectó truncado → more_than_n_rows = True,  OR
    #   b) la SQL contiene explícitamente LIMIT n  y el resultado tiene >1 fila
    #      (para evitar falsos positivos en queries tipo COUNT(*) que devuelven 1 fila).
    rowcount = _get_sql_rowcount(state)
    more_than_n_rows = _get_sql_more_than_limit(state)
    rows_displayed_cnt = _get_sql_displayed_count(state)
    has_limit_clause = bool(re.search(r"\blimit\s+\d+\b", sql_query, flags=re.I))
    limit_value = _get_rows_limit_applied(state) or settings.sql_rows_limit
    shown_count = rows_displayed_cnt or (
        min(rowcount, limit_value) if limit_value else rowcount
    )
    limitation_note = (
        f"Nota: se muestran solo {shown_count} resultados como vista previa; pueden existir más registros. "
        "Solicite un listado adicional si necesita el detalle completo."
        if (
            shown_count
            and shown_count > 1
            and (more_than_n_rows or (has_limit_clause and rowcount > 1))
        )
        else ""
    )

    no_data_payload: Optional[dict[str, Any]] = None
    assistance = _get_user_assistance(state)
    clarification_pending = bool(
        assistance.get("needed")
        or assistance.get("options")
        or assistance.get("payload")
    )
    if (rowcount or 0) == 0 and not clarification_pending:
        no_data_payload = _build_no_data_payload(state)
        if no_data_payload:
            if not state.get("response_type"):
                state["response_type"] = "no_data"
            state["no_data_payload"] = no_data_payload

    if is_cache_hit and is_recent_cache_hit and isinstance(cached_sql_results, list):
        # Cache hit with structured data: Use it directly
        rows = cached_sql_results
        # Format sql_response securely for the prompt
        sql_response = f"Resultados: {json.dumps(rows, ensure_ascii=False)}\nTotal de Filas: {len(rows)}"
    else:
        # Normal SQL flow or empty cache: Parse string output
        try:
            if not isinstance(sql_response, (str, bytes)):
                sql_response = str(sql_response) if sql_response is not None else ""
            rows = extract_json_rows(sql_response)
        except (json.JSONDecodeError, ValueError) as e:
            logger.error(f"Error al procesar la respuesta SQL: {e}")
            rows = None

    # Seleccionar el prompt según la fuente
    if source == "whatsapp":
        template = user_response_whatsapp_prompt
        schema = sql_query_response
    else:
        template = user_response_frontend_prompt
        schema = process_user_question

    # Si el JSON está vacío o tiene solo valores en cero, cambiar de template
    no_data_detected = False

    if rows is not None and len(rows) == 1:
        row = rows[0]
        no_data_detected = all(value in (0, "0", None, "") for value in row.values())

    if no_data_detected:
        logger.info("FLOW ▸ RESPONSE switch_template=no_rows")
        template = user_response_norows_prompt

    rows_raw = copy.deepcopy(rows) if isinstance(rows, list) else []
    columns_meta = _build_columns_meta_from_rows(rows_raw)
    _set_frontend_rows_raw(state, rows_raw)
    _set_frontend_columns_meta(state, columns_meta)
    # Reset technical details de turnos anteriores
    state.pop("llm_technical_details", None)
    _set_frontend_technical_details(state, [])

    # 🔴 Usamos safe_invoke() con reintentos y backoff
    chain = create_chain(
        template,
        [
            "sql_response",
            "question",
            "original_language_iso",
            "country_code",
            "sql_query",
            "limitation_note",
            "analyzer_summary",
        ],
        schema=schema,
    )

    response = safe_invoke(
        chain,
        {
            "sql_response": sql_response,
            "question": question,
            "original_language_iso": original_language_iso,
            "country_code": country_code,
            "sql_query": sql_query,
            "limitation_note": limitation_note,
            "analyzer_summary": analyzer_summary,
        },
    )

    if schema == sql_query_response:
        human_answer = response.human_answer
        tokens = _get_keyword_tokens_tried(state)
        originals = state.get("keyword_original_filters") or []
        original_note = ""
        if originals:
            cols_values = [
                f"{item.get('column', '').strip()} → '{item.get('value', '').strip()}'"
                for item in originals[:3]
            ]
            original_note = (
                "\n\nIntenté primero con los filtros originales: "
                + "; ".join(cols_values)
                + " y no hubo coincidencias exactas."
            )
        if tokens:
            joined = ", ".join(tokens[:5])
            if _get_keyword_used(state):
                note = (
                    "\n\nCoincidencia parcial aplicada: amplié la búsqueda con los tokens "
                    f"{joined}. Verifique que los proyectos listados realmente correspondan a su consulta."
                )
            else:
                note = (
                    "\n\nCoincidencia parcial intentada: probé con los tokens "
                    f"{joined}, pero no hubo coincidencias exactas. Puede refinar la pregunta para mayor precisión."
                )
            human_answer = f"{human_answer.strip()}{original_note}{note}"
        elif _get_keyword_used(state):
            human_answer = (
                f"{human_answer.strip()}{original_note}\n\nCoincidencia parcial aplicada sobre los filtros originales. "
                "Revise que los resultados se ajusten a lo que buscaba descargando los criterios o reformulando la consulta."
            )
        logger.info(
            f"FLOW ▸ RESPONSE END format=whatsapp rows={len(rows) if rows else 0}"
        )
        return {"messages": [AIMessage(content=human_answer)]}
    else:
        currency_code = state["currency_code"]

        # Renderizar la tabla siempre que haya filas disponibles
        if rows:
            formatted_table = format_table_markdown(
                rows, currency_code, response.monetary_properties
            )
        else:
            formatted_table = ""

        _set_frontend_table_metadata(
            state,
            getattr(response, "monetary_properties", "") or "",
        )

        # Usar direct_answer si está disponible (nuevo formato), fallback a summary (legacy)
        summary_text = (
            getattr(response, "direct_answer", None)
            or getattr(response, "summary", "")
            or ""
        )
        summary_text = re.sub(r"(?i)summary", "", summary_text).strip()
        table_markdown = formatted_table.strip()

        # Guardar technical_details del LLM para el sidebar (nuevo formato)
        llm_technical_details = getattr(response, "technical_details", None) or []
        if llm_technical_details and isinstance(llm_technical_details, list):
            # Guardar en el estado para que process_citizen_response lo use
            state["llm_technical_details"] = llm_technical_details
            logger.info(
                f"FLOW ▸ RESPONSE llm_technical_details count={len(llm_technical_details)}"
            )

        # Guardar follow_up si está disponible
        llm_follow_up = getattr(response, "follow_up", None) or ""
        if llm_follow_up:
            state["llm_follow_up"] = llm_follow_up.strip()

        if not summary_text and rows:
            try:
                first_row = rows[0]
                if isinstance(first_row, dict):
                    pieces: list[str] = []
                    for key, value in first_row.items():
                        if value is None:
                            continue
                        label = str(key).replace("_", " ").strip().capitalize()
                        pieces.append(f"{label}: {value}")
                        if len(pieces) >= 3:
                            break
                    summary_text = " • ".join(pieces).strip()
                else:
                    summary_text = str(first_row).strip()
            except Exception:
                summary_text = ""

        base_notes: list[str] = []

        # Flag de cobertura para evitar notas duplicadas aguas abajo
        coverage_flag = False
        if limitation_note:
            coverage_flag = True
            state["coverage_flag"] = True
        else:
            state.pop("coverage_flag", None)

        decision_note = ""
        decision = _get_gray_zone_decision(state)
        status = decision.get("status")
        warning_message = ""
        if status == "proceed_with_warning":
            rationale = decision.get("rationale")
            warnings_text = "; ".join(
                str(item).strip()
                for item in (decision.get("notes") or [])
                if str(item).strip()
            )
            warning_source = (
                rationale or warnings_text or _get_gray_zone_warnings(state)
            )
            if isinstance(warning_source, list):
                warning_source = "; ".join(
                    str(item).strip() for item in warning_source if str(item).strip()
                )
            warning_message = warning_source or (
                "Puede ser necesario ajustar los criterios: si especifica país, fechas o filtros adicionales, la respuesta será más precisa."
            )
            decision_note = f"> {warning_message}"

        if decision_note:
            base_notes.append(decision_note.strip())

        tokens = _get_keyword_tokens_tried(state)
        originals = state.get("keyword_original_filters") or []
        original_note = ""
        if originals:
            cols_values = [
                f"{item.get('column', '').strip()} → '{item.get('value', '').strip()}'"
                for item in originals[:3]
            ]
            original_note = (
                f"> Se probaron primero estos filtros exactos y no devolvieron resultados: "
                + "; ".join(cols_values)
            )

        keyword_note = ""
        if tokens:
            joined = ", ".join(tokens[:5])
            if _get_keyword_used(state):
                keyword_note = (
                    f"> Coincidencia parcial aplicada con: {joined}. "
                    "Revise que los resultados se ajusten a lo que buscaba."
                )
            else:
                keyword_note = (
                    f"> Intenté coincidencias parciales con: {joined}, "
                    "pero no hubo coincidencias exactas. Refine la consulta si necesita algo más específico."
                )
            if original_note:
                base_notes.append(original_note.strip())
            base_notes.append(keyword_note.strip())
        elif _get_keyword_used(state):
            fallback_note = (
                "> Coincidencia parcial aplicada sobre los filtros originales. "
                "Revise que los resultados se ajusten a lo que buscaba o ajuste los filtros."
            )
            if original_note:
                base_notes.append(original_note.strip())
            base_notes.append(fallback_note.strip())

        base_notes = [note for note in base_notes if note]

        # Disclaimer SNIP vs SIGEF cuando hay columnas monetarias
        monetary_props = getattr(response, "monetary_properties", "") or ""
        if monetary_props or any(
            col in (sql_query or "").lower()
            for col in ["valor_proyecto", "valor_ejecutado", "valor_vigente", "sum("]
        ):
            snip_note = (
                "> Los montos corresponden al valor registrado en el SNIP (Sistema Nacional de Inversión Pública), "
                "no al Presupuesto Nacional de Inversión Pública del SIGEF. "
                "Consulte el presupuesto oficial en: https://mapainversiones.transparenciafiscal.gob.do"
            )
            base_notes.append(snip_note)

        logger.info(
            "FLOW ▸ RESPONSE END format=frontend rows={} limitation_note={} base_notes={}",
            len(rows) if rows else 0,
            bool(limitation_note),
            len(base_notes),
        )
        _set_frontend_summary_raw(state, summary_text)
        _set_frontend_base_notes_raw(state, list(base_notes))
        _set_frontend_summary(state, summary_text)
        _set_frontend_table_markdown(state, table_markdown)
        _set_frontend_base_notes(state, base_notes)
        result_payload = {
            "frontend_summary": summary_text,
            "frontend_table_markdown": table_markdown,
            "frontend_base_notes": base_notes,
        }
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
            # Incluimos tanto los filtros del analysis como los territorios resueltos
            # ═══════════════════════════════════════════════════════════════
            filters = list(_get_analysis_filters(state))  # Make a copy
            question = (
                state.get("complete_user_question") or state.get("user_question") or ""
            )

            # Incluir territorios resueltos como filtros para session_memory
            analysis = state.get("analysis") or {}
            resolved_territories = analysis.get("resolved_territories") or []
            for rt in resolved_territories:
                rt_col = rt.get("column") or ""
                # Usar valor_original si existe (es el valor sin normalizar), sino value
                rt_val = rt.get("valor_original") or rt.get("value") or ""
                rt_type = rt.get("type") or ""
                rt_reason = rt.get("reason") or ""

                # Solo agregar si resolvió correctamente (no error/ambiguous)
                if (
                    rt_col
                    and rt_val
                    and rt_type not in ("error", "ambiguous", "unknown")
                ):
                    # Mapear columna territorial a columna de proyecto
                    # nombre_departamento → p.nombreprovincia_proyecto
                    # nombre_municipio → p.nombremunicipio_proyecto
                    project_col = rt_col
                    rt_col_lower = rt_col.lower()
                    if "departamento" in rt_col_lower or rt_type == "departamento":
                        project_col = "p.nombreprovincia_proyecto"
                    elif "municipio" in rt_col_lower or rt_type == "municipio":
                        project_col = "p.nombremunicipio_proyecto"
                    elif "region" in rt_col_lower or rt_type == "region":
                        project_col = "p.nombreregion_proyecto"

                    territory_filter = {
                        "column": project_col,
                        "operator": "=",
                        "value": rt_val,
                        "confidence": rt.get("confidence", 0.9),
                        "evidence": f"territorial_resolution_{rt_reason}",
                    }
                    filters.append(territory_filter)
                    logger.info(
                        "SESSION_MEMORY ▸ adding resolved territory to filters: {}={} (type={}, reason={})",
                        project_col,
                        rt_val,
                        rt_type,
                        rt_reason,
                    )

            _save_success_context(state, filters, question, rowcount, rows=rows_raw)

        # IMPORTANTE: Incluir lifecycle en el return para que LangGraph persista
        # los cambios al session_memory (frustration_count, resolved_dimensions, etc.)
        result_payload["lifecycle"] = state.get("lifecycle", {})
        return result_payload


def _build_no_data_payload(state: AgentState) -> dict[str, Any]:
    """
    Construye un bloque de sugerencias cuando no hay filas y no se disparó
    una clarificación. Propone pistas reutilizando catálogo de dimensiones.
    Incluye frustration tracking para ofrecer contacto humano tras fallos consecutivos.
    """
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

    def _take(values: Optional[Sequence[Any]], limit: int = 6) -> list[str]:
        cleaned: list[str] = []
        for value in values or []:
            if value is None:
                continue
            text = str(value).strip()
            if not text:
                continue
            if text not in cleaned:
                cleaned.append(text)
            if len(cleaned) >= limit:
                break
        return cleaned

    dimension_catalog = _get_dimensions_catalog(state)
    sectors = _take(dimension_catalog.get("sectors"), 6)
    entities = _take(dimension_catalog.get("entities"), 6)
    territories = _take(dimension_catalog.get("states"), 6)
    funding = _take(dimension_catalog.get("funding_sources"), 6)
    year_range = dimension_catalog.get("year_range") or {}

    hints: list[str] = [
        "Verifique la ortografía de entidades, territorios o proyectos antes de volver a buscar.",
        "Puede añadir un sector, entidad ejecutora o territorio para abrir más resultados.",
    ]

    tokens = _get_keyword_tokens_tried(state)
    if tokens:
        sample = ", ".join(
            str(token).strip() for token in tokens[:3] if str(token).strip()
        )
        if sample:
            hints.append(f"Pruebe con variantes o sinónimos de: {sample}.")

    soft_missing = state.get("soft_missing_filters") or []
    missing_labels = [
        str((item.get("value") or item.get("column") or "")).strip()
        for item in soft_missing
        if isinstance(item, dict)
    ]
    missing_labels = [label for label in missing_labels if label]
    if missing_labels:
        hints.append(
            f"Añadí datos para {', '.join(missing_labels[:3])} o Seleccione uno de los filtros sugeridos."
        )

    suggestions: list[dict[str, Any]] = []
    if sectors:
        suggestions.append(
            {"target": "sector", "label": "Sectores disponibles", "values": sectors}
        )
    if entities:
        suggestions.append(
            {
                "target": "entity",
                "label": "Entidades ejecutoras frecuentes",
                "values": entities,
            }
        )
    if territories:
        suggestions.append(
            {
                "target": "territory",
                "label": "Territorios con proyectos",
                "values": territories,
            }
        )
    if funding:
        suggestions.append(
            {
                "target": "funding",
                "label": "Fuentes de financiamiento registradas",
                "values": funding,
            }
        )
    if year_range.get("start") and year_range.get("end"):
        start_year = year_range.get("start")
        end_year = year_range.get("end")
        suggestions.append(
            {
                "target": "year_range",
                "label": "Rango de años disponibles",
                "values": [f"{start_year} - {end_year}"],
            }
        )

    # ═══════════════════════════════════════════════════════════════════
    # Construir mensaje principal más informativo
    # Explica claramente por qué no hay datos y cómo ampliar la búsqueda
    # ═══════════════════════════════════════════════════════════════════
    filters_applied = []
    analysis_obj = (
        state.get("analysis") if isinstance(state.get("analysis"), dict) else {}
    )
    if analysis_obj:
        filters_data = analysis_obj.get("filters", {})
        if isinstance(filters_data, dict):
            for flt in filters_data.get("all", [])[:5]:
                if isinstance(flt, dict):
                    col = str(flt.get("column", "")).split(".")[-1].replace("_", " ")
                    val = str(flt.get("value", ""))
                    if col and val:
                        filters_applied.append(f"{col}: {val}")

    if filters_applied:
        filters_text = ", ".join(filters_applied)
        lead_message = f"No se encontraron datos para estos filtros: {filters_text}. Puede ampliar la búsqueda eliminando algún criterio o probando alternativas."
    else:
        lead_message = "No se encontraron proyectos con esos criterios. Puede ampliar la búsqueda con términos más generales o verificar la ortografía."

    # Agregar hint de fallback explícito
    hints.insert(
        0,
        "Intente una búsqueda más amplia eliminando filtros específicos (territorio, año, sector).",
    )

    # ═══════════════════════════════════════════════════════════════════
    # FRUSTRATION: Agregar contacto humano si se alcanzó el umbral
    # ═══════════════════════════════════════════════════════════════════
    support_email = ""
    feedback_hint = ""
    if show_human_contact:
        country_code = state.get("country_code", "").lower()
        # Emails de soporte por país
        support_emails = {
            "dom": "infomapainversiones@hacienda.gov.do",
            "arg": "mapainversiones@jefatura.gob.ar",
            "cri": "mapainversiones@hacienda.go.cr",
        }
        support_email = support_emails.get(country_code, "soporte@mapainversiones.org")
        hints.append(f"¿Necesita ayuda adicional? Puede escribirnos a {support_email}")
        # Sugerencia de feedback para mejora continua
        feedback_hint = (
            "Si esta respuesta no fue útil, puede usar el botón 👎 para indicarlo. "
            "Le pedimos que describa brevemente el inconveniente para ayudarnos a mejorar."
        )
        hints.append(feedback_hint)

    payload = {
        "lead": lead_message,
        "hints": hints,
        "suggestions": suggestions,
        "filters_applied": filters_applied,  # Para mostrar qué filtros se usaron
        "original_question": state.get("complete_user_question")
        or state.get("user_question")
        or "",
        "country_code": state.get("country_code"),
        "show_human_contact": show_human_contact,
        "support_email": support_email,
        "feedback_hint": feedback_hint,
        "frustration_count": frustration_count,
    }
    return payload


def _collect_citizen_signals(state: AgentState) -> dict[str, Any]:
    rowcount = _get_sql_rowcount(state)
    rows_limit_applied = (
        _get_rows_limit_applied(state)
        or _get_rows_limit_default(state)
        or settings.sql_rows_limit
    )
    rows_limit_max = _get_rows_limit_max(state) or settings.sql_rows_limit_max
    rows_displayed = _get_sql_displayed_count(state)
    if rows_displayed is None and rowcount is not None and rows_limit_applied:
        rows_displayed = min(rowcount, rows_limit_applied)
    more_than_limit = _get_sql_more_than_limit(state)
    coverage_warning = bool(
        (rowcount and rows_limit_applied and rowcount > rows_limit_applied)
        or more_than_limit
    )
    shown_rows = rows_displayed or 0
    if coverage_warning and shown_rows <= 1:
        coverage_warning = False

    tokens = _get_keyword_tokens_tried(state)
    originals = state.get("keyword_original_filters") or []
    missing_keywords = []
    if state.get("soft_missing_filters"):
        for filt in state["soft_missing_filters"]:
            label = filt.get("value") or filt.get("column")
            if label:
                missing_keywords.append(str(label))

    assistance = _get_user_assistance(state)
    clarification_pending = bool(
        assistance.get("needed")
        or assistance.get("options")
        or assistance.get("payload")
    )

    analysis_obj = (
        state.get("analysis") if isinstance(state.get("analysis"), dict) else {}
    )
    uncertainties_obj = (
        analysis_obj.get("uncertainties", {}) if isinstance(analysis_obj, dict) else {}
    )
    cached_results = _get_sql_cached_results(state)
    live_results = _get_sql_results(state)

    signals: dict[str, Any] = {
        "rowcount": rowcount or 0,
        "rows_displayed": rows_displayed or 0,
        "rows_limit_applied": rows_limit_applied,
        "rows_limit_default": _get_rows_limit_default(state),
        "rows_limit_max": rows_limit_max,
        "coverage_warning": coverage_warning,
        "used_keyword_regenerate": _get_keyword_used(state),
        "keyword_tokens_tried": tokens[:5],
        "keyword_original_filters": originals[:3],
        "gray_zone_reason": uncertainties_obj.get("reason"),
        "uncertainty_actions": uncertainties_obj.get("actions", []),
        "clarification_pending": clarification_pending,
        "source": state.get("source"),
        "original_language_iso": state.get("original_language_iso"),
        "missing_keywords": missing_keywords[:5],
        "tone_hint": state.get("tone_energy"),
        "base_notes_present": bool(_get_frontend_base_notes(state)),
        # NUEVO: Para validación de relevancia semántica
        "theme_keywords": _get_theme_strategy(state).get("keywords", []),
        "theme_keywords_used": state.get("theme_keywords_used", False),
        "complete_user_question": state.get("complete_user_question", ""),
        "results_json": (
            cached_results if cached_results is not None else (live_results or "")
        ),
        "dimension_catalog": _get_dimensions_catalog(state),
        "used_fallback": state.get("used_fallback", False),
        "no_data_payload": state.get("no_data_payload") or {},
        "postfetch_clarification_exhausted": bool(
            state.get("postfetch_clarification_exhausted")
        ),
        "postfetch_clarification_turns": state.get("postfetch_clarification_turns"),
        # Señales adicionales mejoradas
        "catalog_filters_relaxed": bool(state.get("catalog_filters_relaxed_columns")),
        "missing_filter_columns": state.get("missing_filter_columns") or [],
    }
    signals["soft_missing_filters"] = state.get("soft_missing_filters") or []
    duplicate_hint = state.get("result_duplicates")
    if duplicate_hint:
        signals["duplicate_hint"] = duplicate_hint

    evidence_pairs = []
    for item in originals:
        col = str(item.get("column") or "").strip()
        value = str(item.get("value") or "").strip()
        if col or value:
            evidence_pairs.append(f"{value or '?'} → {col or '?'}")
    if evidence_pairs:
        logger.info(f"FLOW ▸ CITIZEN evidence_filters={evidence_pairs}")

    # Limpiar hint de duplicados para evitar falsos positivos en próximas requests
    state.pop("result_duplicates", None)

    return signals


def _generate_alternative_search_terms(
    failed_keywords: list[str], question: str
) -> list[str]:
    """
    Genera sugerencias de búsqueda alternativa cuando los keywords no matchean.
    """
    suggestions = []

    # Simplificar: quitar adjetivos/modificadores de keywords compuestos
    for kw in failed_keywords[:3]:
        words = kw.split()
        if len(words) > 1:
            # Ofrecer solo la palabra raíz (última palabra suele ser el sustantivo)
            root_word = words[-1]
            if root_word not in suggestions:
                suggestions.append(root_word)

    # Sugerir búsqueda más amplia
    suggestions.append("Pruebe con términos más generales o un sector específico")

    return suggestions[:3]


def _find_related_sectors_from_keywords(
    keywords: list[str], available_sectors: list[str], top_n: int = 5
) -> list[dict[str, Any]]:
    """
    Encuentra sectores relacionados a los keywords usando fuzzy matching simple.
    Retorna lista de {sector, score} ordenada por relevancia.
    """
    if not keywords or not available_sectors:
        return []

    from modules.utils.text_processing import process_text_like_db

    # Normalizar keywords
    keywords_norm = [process_text_like_db(kw).lower() for kw in keywords if kw]

    if not keywords_norm:
        return []

    # Scoring simple: cuántos keywords matchean en cada sector
    sector_scores = []
    for sector in available_sectors:
        sector_norm = process_text_like_db(sector).lower()
        matches = sum(1 for kw in keywords_norm if kw in sector_norm)
        if matches > 0:
            sector_scores.append({"sector": sector, "score": matches})

    # Ordenar por score y tomar top_n
    sector_scores.sort(key=lambda x: -x["score"])
    return sector_scores[:top_n]


def _validate_semantic_relevance(signals: dict[str, Any]) -> dict[str, Any]:
    """
    Valida si los resultados son semánticamente relevantes a la pregunta.
    Usa heurística simple basada en keyword coverage en los resultados.
    """
    results_json = signals.get("results_json", "")
    theme_keywords = signals.get("theme_keywords", [])

    if not results_json or not theme_keywords:
        return {"is_low_relevance": False}

    try:
        results = (
            json.loads(results_json) if isinstance(results_json, str) else results_json
        )
        if not isinstance(results, list) or not results:
            return {"is_low_relevance": False}
    except:
        return {"is_low_relevance": False}

    # Concatenar textos de resultados
    result_texts = []
    for r in results:
        if not isinstance(r, dict):
            continue
        text_parts = [
            str(r.get("nombre_proyecto", "")),
            str(r.get("objetivo_proyecto", "")),
            str(r.get("nombresector_proyecto", "")),
        ]
        result_texts.append(" ".join(text_parts))

    if not result_texts:
        return {"is_low_relevance": False}

    combined = " ".join(result_texts)

    # Normalizar texto de resultados
    from modules.utils.text_processing import process_text_like_db

    combined_norm = process_text_like_db(combined).lower()

    # Calcular cobertura de keywords
    keywords_found = 0
    keywords_details = []
    for kw in theme_keywords[:5]:  # Max 5 para no saturar
        kw_norm = process_text_like_db(kw).lower()
        if kw_norm in combined_norm:
            keywords_found += 1
            keywords_details.append(f"'{kw}'✅")
        else:
            keywords_details.append(f"'{kw}'❌")

    coverage = keywords_found / len(theme_keywords[:5]) if theme_keywords else 0.0

    logger.info(
        f"FLOW ▸ CITIZEN relevance_check coverage={coverage:.2f} found={keywords_found}/{len(theme_keywords[:5])} details={keywords_details}"
    )

    # Threshold dinámico: más estricto si hay pocos keywords, más flexible si hay muchos
    # Base: 40%, ajustado según cantidad de keywords
    num_keywords = len(theme_keywords[:5])
    if num_keywords == 0:
        threshold = 0.0  # Sin keywords, no podemos validar relevancia
    elif num_keywords == 1:
        threshold = 0.5  # Con 1 keyword, requiere match exacto
    elif num_keywords <= 3:
        threshold = 0.4  # Threshold estándar
    else:
        threshold = 0.3  # Con muchos keywords, más flexible (algunos pueden faltar)

    if coverage < threshold:
        question = signals.get("complete_user_question", "")
        return {
            "is_low_relevance": True,
            "coverage": coverage,
            "message": f"Los resultados no parecen relacionados con su búsqueda ({int(coverage*100)}% de coincidencia con keywords detectados).",
            "reason": f"Keywords en resultados: {', '.join(keywords_details[:3])}",
            "suggestions": _generate_alternative_search_terms(theme_keywords, question),
        }

    return {"is_low_relevance": False, "coverage": coverage}


def _fix_rowcount_in_summary(
    summary: str,
    correct_count: int,
    original_count: int,
) -> str:
    """
    Corrige el conteo de filas/proyectos en el summary de forma determinística.

    Problema: El LLM a veces no reemplaza correctamente el número de proyectos
    cuando se filtran filas por relevancia. Esto resulta en summaries que dicen
    "5 proyectos" cuando solo se muestran 2.

    Solución: Reemplazar patrones como "N proyectos" con el conteo correcto.
    Solo reemplaza si el número original está presente y difiere del correcto.

    Args:
        summary: El texto del summary a corregir
        correct_count: El número correcto de filas (después de filtrado)
        original_count: El número original de filas (antes de filtrado)

    Returns:
        El summary con el conteo corregido
    """
    if not summary or correct_count == original_count:
        return summary

    if original_count <= 0 or correct_count < 0:
        return summary

    import re

    # Patrones comunes de conteo en español
    # Captura: "5 proyectos", "Se encontraron 20 registros", etc.
    patterns = [
        # "N proyectos" / "N proyecto"
        (
            rf"\b{original_count}\s+proyectos?\b",
            (
                f"{correct_count} proyectos"
                if correct_count != 1
                else f"{correct_count} proyecto"
            ),
        ),
        # "N registros" / "N registro"
        (
            rf"\b{original_count}\s+registros?\b",
            (
                f"{correct_count} registros"
                if correct_count != 1
                else f"{correct_count} registro"
            ),
        ),
        # "N resultados" / "N resultado"
        (
            rf"\b{original_count}\s+resultados?\b",
            (
                f"{correct_count} resultados"
                if correct_count != 1
                else f"{correct_count} resultado"
            ),
        ),
        # "N filas" / "N fila"
        (
            rf"\b{original_count}\s+filas?\b",
            f"{correct_count} filas" if correct_count != 1 else f"{correct_count} fila",
        ),
        # "Se muestran N" al inicio de frase
        (rf"Se muestran\s+{original_count}\b", f"Se muestran {correct_count}"),
        # "Se encontraron N" al inicio de frase
        (rf"Se encontraron\s+{original_count}\b", f"Se encontraron {correct_count}"),
        # "Hay N" al inicio
        (rf"\bHay\s+{original_count}\b", f"Hay {correct_count}"),
        # "Existen N"
        (rf"\bExisten\s+{original_count}\b", f"Existen {correct_count}"),
    ]

    fixed_summary = summary
    replacements_made = 0

    for pattern, replacement in patterns:
        new_summary, count = re.subn(
            pattern, replacement, fixed_summary, flags=re.IGNORECASE
        )
        if count > 0:
            fixed_summary = new_summary
            replacements_made += count

    if replacements_made > 0:
        logger.info(
            "FLOW ▸ CITIZEN fix_rowcount original={} → correct={} replacements={}",
            original_count,
            correct_count,
            replacements_made,
        )

    return fixed_summary


def _deduplicate_count_paragraphs(text: str) -> str:
    """
    Elimina párrafos redundantes que contienen conteos de proyectos/resultados.

    Problema: A veces el LLM genera un summary con múltiples párrafos que dicen
    cuántos proyectos hay, con números diferentes (ej: "Se muestran 5..." y
    "Se encontraron 2..."). Esto confunde al usuario.

    Solución: Detectar párrafos que mencionan conteos y mantener solo UNO
    (preferimos el que tiene el conteo más bajo, ya que suele ser el filtrado).

    Args:
        text: El texto a procesar (puede ser multi-línea)

    Returns:
        El texto con párrafos de conteo redundantes eliminados
    """
    if not text:
        return text

    import re

    # Patrones que indican un párrafo de conteo
    count_patterns = [
        r"se\s+muestran?\s+\d+",
        r"se\s+encontraron?\s+\d+",
        r"hay\s+\d+\s+proyectos?",
        r"existen?\s+\d+\s+proyectos?",
        r"\d+\s+proyectos?\s+(relacionados?|en|de|del)",
        r"encontr[éé]\s+\d+\s+proyectos?",
    ]

    # Dividir en párrafos (por doble newline o línea vacía)
    paragraphs = re.split(r"\n\s*\n|\n(?=\s*-\s)", text)

    # Identificar párrafos con conteo
    count_paragraphs = []
    other_paragraphs = []

    for para in paragraphs:
        para = para.strip()
        if not para:
            continue

        is_count_para = False
        for pattern in count_patterns:
            if re.search(pattern, para.lower()):
                is_count_para = True
                break

        if is_count_para:
            # Extraer el número del párrafo para ordenar
            numbers = re.findall(r"\d+", para)
            min_num = min(int(n) for n in numbers) if numbers else 999999
            count_paragraphs.append((min_num, para))
        else:
            other_paragraphs.append(para)

    # Si hay múltiples párrafos de conteo, mantener solo el de número más bajo
    if len(count_paragraphs) > 1:
        # Ordenar por número (menor primero) y tomar el primero
        count_paragraphs.sort(key=lambda x: x[0])
        kept_para = count_paragraphs[0][1]
        removed = len(count_paragraphs) - 1
        logger.info(
            "FLOW ▸ COMPOSE deduplicate_count kept_num={} removed={} total_count_paras={}",
            count_paragraphs[0][0],
            removed,
            len(count_paragraphs),
        )
        count_paragraphs = [(count_paragraphs[0][0], kept_para)]

    # Reconstruir el texto: primero el párrafo de conteo, luego los demás
    result_parts = []
    if count_paragraphs:
        result_parts.append(count_paragraphs[0][1])
    result_parts.extend(other_paragraphs)

    return "\n\n".join(result_parts)


def _heuristic_citizen_evaluation(
    signals: dict[str, Any],
) -> tuple[str, dict[str, Any], list[str], dict[str, Any]]:

    note_parts: list[str] = []
    rule_fragments: list[str] = []
    applied_rules: list[str] = []
    actions: list[str] = []
    action_details: dict[str, Any] = {}
    score = 1

    rowcount = signals.get("rowcount") or 0
    rows_displayed = signals.get("rows_displayed") or 0
    rows_limit_applied = signals.get("rows_limit_applied") or 0

    if signals.get("postfetch_clarification_exhausted"):
        turns_used = (
            signals.get("postfetch_clarification_turns") or MAX_CLARIFICATION_TURNS
        )
        note_parts.append(
            "Intentamos todas las variantes sugeridas y necesito un dato nuevo para seguir buscando."
        )
        actions.append("suggest_clarification")

    # ═══════════════════════════════════════════════════════════
    # CASO ESPECIAL: 0 rows (ofrecer sectores relacionados)
    # ═══════════════════════════════════════════════════════════
    if rowcount == 0:
        theme_keywords = signals.get("theme_keywords", [])
        dimension_catalog = signals.get("dimension_catalog", {})
        used_fallback = signals.get("used_fallback", False)

        # Si hay keywords y catálogo, buscar sectores relacionados
        if theme_keywords and dimension_catalog:
            available_sectors = dimension_catalog.get("sectors", [])
            if available_sectors:
                related_sectors = _find_related_sectors_from_keywords(
                    theme_keywords, available_sectors, top_n=5
                )

                if related_sectors:
                    note_parts.append(
                        "💡 Con esos criterios específicos no hay registros aún. "
                        "¿Le gustaría explorar estos sectores relacionados?"
                    )
                    actions.append("suggest_sectors")
                    action_details["suggest_sectors"] = {
                        "sectors": related_sectors,
                        "message": "Sectores que podrían tener proyectos relacionados",
                    }
                    score = 0  # Neutral (no es error, solo no hay datos)

        # Si usó fallback y sigue con 0, mensaje progresivo (no "No encuentro" duro)
        if used_fallback:
            if not note_parts:  # Solo si no agregamos nota de sectores
                note_parts.append(
                    "🔍 Amplié la búsqueda pero aún no hay coincidencias con esos términos. "
                    "Podemos intentar con palabras diferentes o explorar por sector."
                )
            score = -1  # Negativo (intentamos todo y no hay nada)

        if not note_parts:
            payload = signals.get("no_data_payload") or {}
            lead = payload.get("lead") or "Con esos criterios aún no hay registros."
            hints = payload.get("hints") or []
            hint_text = " ".join(hints[:2]).strip()
            fallback_note = f"{lead} {hint_text}".strip() if hint_text else lead
            note_parts.append(fallback_note)

            suggestions_payload = payload.get("suggestions") or []
            fallback_chips: list[dict[str, Any]] = []
            for item in suggestions_payload:
                values = item.get("values") or []
                if not values:
                    continue
                first_value = str(values[0]).strip()
                if not first_value:
                    continue
                label = item.get("label") or "Filtro sugerido"
                target = item.get("target") or ""
                prompt = (
                    f"Filtrá por {target} {first_value}".strip()
                    if target
                    else f"Filtrá por {first_value}"
                )
                fallback_chips.append(
                    {
                        "label": f"{label}: {first_value}",
                        "column": target,
                        "value": first_value,
                        "suggested_prompt": prompt,
                    }
                )
            if fallback_chips:
                existing_chips = action_details.get("show_filter_chips") or []
                combined_chips = existing_chips + fallback_chips
                action_details["show_filter_chips"] = combined_chips[:2]
                actions.append("show_filter_chips")

        # Return early para 0 rows (no necesita evaluar cobertura_warning, etc.)
        feedback = {
            "satisfaction_score": score,
            "coverage_warning": False,
            "missing_topics": theme_keywords if score < 0 else [],
            "uncertainty_notice": "",
            "tone": "empathetic" if score < 0 else "neutral",
        }
        actions_clean = list(dict.fromkeys(actions))
        logger.info(
            f"FLOW ▸ CITIZEN zero_rows score={score} actions={actions_clean} sectors_offered={bool(action_details.get('suggest_sectors'))}"
        )
        extras_zero = {
            "rule_fragments": list(rule_fragments),
            "applied_rules": list(applied_rules),
        }
        return (
            " ".join(note_parts).strip(),
            feedback,
            actions_clean,
            action_details,
            extras_zero,
        )

    # ═══════════════════════════════════════════════════════════
    # VALIDACIÓN DE RELEVANCIA SEMÁNTICA (si hay resultados)
    # ═══════════════════════════════════════════════════════════
    # NOTA: Esta validación se hace ANTES de aplicar las reglas
    # para que las reglas puedan detectar has_low_relevance
    # SKIP: No validar relevancia en queries de agregación (COUNT/SUM)
    #       porque solo devuelven números, no campos de texto
    is_aggregation = signals.get("is_aggregation_response", False)
    if is_aggregation:
        logger.info(
            "FLOW ▸ CITIZEN semantic_relevance_skipped reason=aggregation_query"
        )
    if rowcount > 0 and not is_aggregation:
        relevance_check = _validate_semantic_relevance(signals)
        if relevance_check.get("is_low_relevance"):
            # Agregar señal para que las reglas puedan detectarla
            signals["has_low_relevance"] = True
            note_parts.append(
                f"{relevance_check.get('message', 'Resultados con baja relevancia')}"
            )
            actions.append("suggest_rephrase")
            action_details["suggest_rephrase"] = {
                "suggestions": relevance_check.get("suggestions", []),
                "reason": relevance_check.get("reason", ""),
                "coverage": relevance_check.get("coverage", 0.0),
            }
            score -= 2  # Penalizar fuertemente la baja relevancia
            logger.warning(
                f"FLOW ▸ CITIZEN low_relevance detected coverage={relevance_check.get('coverage', 0):.2f}"
            )

    missing_topics = signals.get("missing_keywords") or []
    unresolved = signals.get("uncertainty_actions") or []
    coverage_warning = bool(signals.get("coverage_warning"))
    duplicate_hint = signals.get("duplicate_hint")

    for rule in CITIZEN_RULES:
        if not _citizen_rule_matches(rule, signals):
            continue
        applied_rules.append(rule["name"])
        effects = rule.get("effects") or {}
        note_builder = effects.get("note")
        if note_builder:
            fragment = _build_citizen_note_fragment(note_builder, signals)
            if fragment:
                note_parts.append(fragment)
                rule_fragments.append(fragment)
        for action_name in effects.get("actions") or []:
            _apply_citizen_action(
                action_name,
                signals,
                actions,
                action_details,
            )
        score += int(rule.get("score_delta") or 0)

    if applied_rules:
        logger.info("FLOW ▸ CITIZEN rules_applied={}", applied_rules)

    prompt_snippets: list[str] = []
    limit_actions = action_details.get("offer_increase_limit")
    if isinstance(limit_actions, list) and limit_actions:
        first_limit = limit_actions[0]
        prompt = first_limit.get("suggested_prompt")
        if prompt:
            prompt_snippets.append(f'Si necesita ver más filas, indíqueme "{prompt}".')
    filter_actions = action_details.get("show_filter_chips")
    if isinstance(filter_actions, list) and filter_actions:
        first_filter = filter_actions[0]
        prompt = first_filter.get("suggested_prompt")
        if prompt:
            prompt_snippets.append(f'Para ajustar la búsqueda, escribí "{prompt}".')
    clarification_actions = action_details.get("suggest_clarification")
    if isinstance(clarification_actions, list) and clarification_actions:
        first_option = clarification_actions[0]
        prompt = first_option.get("suggested_prompt")
        if prompt:
            prompt_snippets.append(
                f'Si desea aclarar un criterio, puede decir "{prompt}".'
            )
    if prompt_snippets:
        note_parts.append(" ".join(prompt_snippets))

    heuristic_note = " ".join(note_parts).strip()
    score = max(-1, min(1, score))
    tone = "empathetic" if score < 1 else "neutral"
    uncertainty_notice = "Hay criterios pendientes por aclarar." if unresolved else ""

    feedback = {
        "satisfaction_score": score,
        "coverage_warning": bool(coverage_warning),
        "missing_topics": missing_topics,
        "uncertainty_notice": uncertainty_notice,
        "tone": tone,
    }
    if duplicate_hint:
        feedback["duplicate_warning"] = True

    # Remove duplicates preserving order
    actions = list(dict.fromkeys(actions))
    extras = {
        "rule_fragments": list(rule_fragments),
        "applied_rules": list(applied_rules),
    }
    return heuristic_note, feedback, actions, action_details, extras


def evaluate_citizen_response(state: AgentState):
    """
    - Evalúa la respuesta para generar notas, feedback y acciones para el usuario.
    - Usa heurísticas simples y, si está habilitado, un LLM para mejorar la evaluación.
    - Devuelve un dict con las actualizaciones para el estado.

    TRANSPARENCIA Y EXPLICABILIDAD (UNESCO):
    Esta función implementa el principio de transparencia de la Recomendación de la UNESCO
    sobre la Ética de la IA (art. 37-41). Proporciona a los ciudadanos información clara
    sobre cómo el sistema procesó su consulta, qué decisiones tomó y qué limitaciones o
    advertencias aplican a la respuesta. El "citizen review" garantiza que los usuarios
    estén informados cuando una decisión está basada en algoritmos de IA y puedan entender
    el contexto completo de la respuesta recibida.
    Referencia: https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence
    """
    # ───────────────────────────────────────────────────────────────────
    # Resetear flags de filas irrelevantes al inicio de cada evaluación
    # Esto permite que un reintento exitoso pueda mostrar la tabla normalmente
    # ───────────────────────────────────────────────────────────────────
    _set_all_rows_irrelevant(state, False)
    # Resetear detalles técnicos previos para evitar reciclar sidebar
    _set_frontend_technical_details(state, [])
    state.pop("llm_technical_details", None)
    # No resetear rows_removed_sample aquí, se reseteará solo si hay filas válidas

    if state.get("stop_processing"):
        logger.info("FLOW ▸ CITIZEN skip=stop_processing")
        return {}
    source = (state.get("source") or "").lower()

    summary = _get_frontend_summary(state) or ""
    table = _get_frontend_table_markdown(state) or ""
    if source != "whatsapp" and not summary and not table:
        logger.info("FLOW ▸ CITIZEN skip=no_content")
        return {}

    signals = _collect_citizen_signals(state)
    # Evitar duplicar avisos de cobertura si ya fue marcado en process_user_response
    if state.get("coverage_flag"):
        signals["coverage_warning"] = False

    rows_raw = _get_frontend_rows_raw(state)
    columns_meta = _get_frontend_columns_meta(state)
    summary_raw = _get_frontend_summary_raw(state) or _get_frontend_summary(state)
    base_notes_source = _get_frontend_base_notes_raw(state) or _get_frontend_base_notes(
        state
    )
    if isinstance(base_notes_source, list):
        base_notes_raw = base_notes_source
    elif isinstance(base_notes_source, str) and base_notes_source.strip():
        base_notes_raw = [base_notes_source.strip()]
    else:
        base_notes_raw = []
    analysis_obj = (
        state.get("analysis") if isinstance(state.get("analysis"), dict) else {}
    )
    question_text = (
        state.get("complete_user_question") or state.get("user_question") or ""
    )

    rows_filtered: list[dict[str, Any]] = []
    columns_filtered: list[dict[str, Any]] = []
    columns_removed: list[dict[str, Any]] = []
    citizen_actions: list[str] = []
    citizen_actions_details: dict[str, Any] = {}

    # ───────────────────────────────────────────────────────────────────
    # Rerank de filas con FlashRank (semántico y barato) para reducir carga al LLM
    # Opera sobre rows_raw ANTES del filtrado de columnas
    # ───────────────────────────────────────────────────────────────────

    # ═══════════════════════════════════════════════════════════════════
    # DETECCIÓN DE QUERIES AGREGADAS (COUNT, SUM, AVG, etc.)
    # Estas queries devuelven UN número, no filas de proyectos.
    # NO debe aplicarse filtrado de relevancia semántica porque:
    # 1. No hay campos de texto para evaluar
    # 2. La "fila" solo contiene el resultado numérico de la agregación
    # ═══════════════════════════════════════════════════════════════════
    sql_query_for_agg_check = _get_sql_query(state) or ""
    is_aggregation_query = bool(
        re.search(
            r"\b(COUNT|SUM|AVG|MIN|MAX)\s*\(", sql_query_for_agg_check, re.IGNORECASE
        )
    )

    # También detectar por nombre de columnas típicas de agregación
    aggregation_column_patterns = [
        "total_",
        "count_",
        "suma_",
        "promedio_",
        "conteo_",
        "cantidad_",
        "numero_",
        "num_",
    ]
    column_names = {
        c.get("name", "").lower() for c in columns_meta or [] if isinstance(c, dict)
    }
    has_aggregation_columns = any(
        any(
            col.startswith(pattern) or col == pattern.rstrip("_")
            for pattern in aggregation_column_patterns
        )
        for col in column_names
    )

    # Si es query de agregación, marcar para saltar filtrado
    if is_aggregation_query or has_aggregation_columns:
        state["is_aggregation_response"] = True
        signals["is_aggregation_response"] = True  # Propagar a signals para validación
        logger.info(
            f"FLOW ▸ CITIZEN aggregation_query_detected sql_agg={is_aggregation_query} col_agg={has_aggregation_columns} columns={list(column_names)}"
        )

    # Verificar si hay campos de texto de proyecto (columnas)
    text_columns = {
        c.get("name", "") for c in columns_meta or [] if isinstance(c, dict)
    }
    has_project_text_columns = any(
        name in text_columns
        for name in (
            "nombre_proyecto",
            "objetivo_proyecto",
            "descripcion_proyecto",
            "descripcion",
        )
    )

    # Verificar si hay contenido textual real (runtime check)
    has_meaningful_text = False
    if has_project_text_columns and rows_raw:
        # Sample primeras 5 filas para verificar contenido
        TEXT_FIELDS = [
            "nombre_proyecto",
            "objetivo_proyecto",
            "descripcion_proyecto",
            "descripcion",
        ]
        min_text_length = settings.flashrank_min_text_length  # Configurable via .env

        for row in rows_raw[:5]:
            if not isinstance(row, dict):
                continue

            text_parts = []
            for field in TEXT_FIELDS:
                val = row.get(field)
                if val and str(val).strip():
                    text_parts.append(str(val).strip())

            combined_text = " ".join(text_parts)
            if len(combined_text) >= min_text_length:
                has_meaningful_text = True
                break

        if not has_meaningful_text:
            logger.info(
                "FLOW ▸ CITIZEN flashrank skipped: text columns present but content empty/minimal"
            )
            state["flashrank_skipped_no_text"] = True

    if (
        settings.feature_flashrank_citizen
        and rows_raw  # ← Ahora usa rows_raw que SÍ tiene datos
        and question_text.strip()
        and has_project_text_columns
        and has_meaningful_text  # ← Nueva validación de contenido real
    ):
        try:
            global _flashrank_client
            if _flashrank_client is None:
                _flashrank_client = Ranker(
                    max_length=256, cache_dir=settings.flashrank_cache_dir
                )
                logger.info(
                    f"FLOW ▸ CITIZEN flashrank client initialized (max_length=256, cache_dir={settings.flashrank_cache_dir})"
                )

            # Construir texto por fila usando TODAS las columnas disponibles
            documents: list[Document] = []
            for idx, row in enumerate(rows_raw):
                if not isinstance(row, dict):
                    continue
                # Usar TODOS los campos no-null para mejor contexto semántico
                parts: list[str] = []
                for key, val in row.items():
                    if val is not None and str(val).strip():
                        parts.append(f"{key}: {val}")

                row_text = " | ".join(parts) if parts else ""
                if row_text:  # Solo agregar si hay contenido
                    documents.append(
                        Document(
                            page_content=row_text,
                            metadata={"row_index": idx},
                        )
                    )

            if not documents:
                logger.warning("FLOW ▸ CITIZEN flashrank skipped: no valid documents")
            else:
                # Rerank
                reranker = FlashrankRerank(
                    client=_flashrank_client, top_n=len(documents)
                )
                reranked_docs = reranker.compress_documents(documents, question_text)

                # Extraer scores
                scores: dict[int, float] = {}
                for doc in reranked_docs:
                    try:
                        idx = int(doc.metadata.get("row_index"))
                        scores[idx] = float(doc.metadata.get("relevance_score", 0.0))
                    except Exception:
                        continue

                # Clasificar en high/gray/low
                high_rows: list[dict[str, Any]] = []
                gray_rows: list[dict[str, Any]] = []
                low_rows: list[dict[str, Any]] = []

                for idx, row in enumerate(rows_raw):
                    if not isinstance(row, dict):
                        # Mantener filas inválidas (conservador)
                        high_rows.append(row)
                        continue

                    score = scores.get(idx, 0.0)
                    row["_flashrank_score"] = score

                    if score >= settings.flashrank_high_threshold:
                        high_rows.append(row)
                    elif score <= settings.flashrank_low_threshold:
                        low_rows.append(row)
                    else:
                        gray_rows.append(row)

                # Logging y métricas
                if scores:
                    scores_list = list(scores.values())
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank scores "
                        f"min={min(scores_list):.3f} "
                        f"avg={sum(scores_list)/len(scores_list):.3f} "
                        f"max={max(scores_list):.3f}"
                    )

                    _record_citizen_metric(
                        state,
                        "flashrank_scores",
                        {
                            "min": min(scores_list),
                            "max": max(scores_list),
                            "avg": sum(scores_list) / len(scores_list),
                        },
                    )

                # Logging detallado por categoría
                logger.info(
                    f"FLOW ▸ CITIZEN flashrank split "
                    f"high={len(high_rows)} gray={len(gray_rows)} low={len(low_rows)}"
                )

                # Log detallado de HIGH (auto-aprobadas)
                if high_rows:
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank HIGH (score ≥ {settings.flashrank_high_threshold}):"
                    )
                    for row in high_rows[:5]:  # Max 5 para no saturar log
                        if isinstance(row, dict):
                            score = row.get("_flashrank_score", 0.0)
                            nombre = row.get("nombre_proyecto", "Sin nombre")[:60]
                            logger.info(f"  ↳ [{score:.3f}] {nombre}")
                    if len(high_rows) > 5:
                        logger.info(f"  ↳ ... y {len(high_rows) - 5} más")

                # Log detallado de GRAY (van al LLM)
                if gray_rows:
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank GRAY ({settings.flashrank_low_threshold} < score < {settings.flashrank_high_threshold}) → LLM:"
                    )
                    for row in gray_rows:  # Todas (suelen ser pocas)
                        if isinstance(row, dict):
                            score = row.get("_flashrank_score", 0.0)
                            nombre = row.get("nombre_proyecto", "Sin nombre")[:60]
                            logger.info(f"  ↳ [{score:.3f}] {nombre}")

                # Log detallado de LOW (auto-descartadas)
                if low_rows:
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank LOW (score ≤ {settings.flashrank_low_threshold}) → DESCARTADAS:"
                    )
                    for row in low_rows[:5]:  # Max 5 para no saturar log
                        if isinstance(row, dict):
                            score = row.get("_flashrank_score", 0.0)
                            nombre = row.get("nombre_proyecto", "Sin nombre")[:60]
                            logger.info(f"  ↳ [{score:.3f}] {nombre}")
                    if len(low_rows) > 5:
                        logger.info(f"  ↳ ... y {len(low_rows) - 5} más")

                _record_citizen_metric(
                    state,
                    "flashrank_split",
                    {
                        "high": len(high_rows),
                        "gray": len(gray_rows),
                        "low": len(low_rows),
                    },
                )

                # CRÍTICO: Decidir si aplicar filtrado o preservar resultados
                original_count = len(rows_raw)
                question_text_lower = question_text.lower()

                # ═══════════════════════════════════════════════════════════════
                # Detectar si el usuario pidió una cantidad específica pequeña
                # Patrones: "los 3 proyectos", "top 5", "dame 2", "primeros 4",
                #           "tres proyectos", "los dos mayores", etc.
                # ═══════════════════════════════════════════════════════════════

                # Mapeo de palabras numéricas a dígitos
                WORD_TO_NUM = {
                    "uno": 1,
                    "un": 1,
                    "una": 1,
                    "dos": 2,
                    "tres": 3,
                    "cuatro": 4,
                    "cinco": 5,
                    "seis": 6,
                    "siete": 7,
                    "ocho": 8,
                    "nueve": 9,
                    "diez": 10,
                }

                requested_count = None

                # Patrón 1: número explícito con contexto
                # "los 3 proyectos", "dame 5", "top 3", "primeros 4"
                numeric_match = re.search(
                    r"\b(?:los|las|dame|muestra|muestrame|top|primeros?|primeras?|mejores?|mayores?|menores?)\s+(\d+)\b"
                    r"|\b(\d+)\s+(?:proyectos?|resultados?|primeros?|primeras?|mejores?|mayores?|menores?)\b",
                    question_text_lower,
                )
                if numeric_match:
                    for g in numeric_match.groups():
                        if g and g.isdigit():
                            requested_count = int(g)
                            break

                # Patrón 2: palabras numéricas con contexto
                # "los tres proyectos", "dame dos", "primeros cinco"
                if not requested_count:
                    for word, num in WORD_TO_NUM.items():
                        # Buscar la palabra numérica con contexto relevante
                        word_pattern = rf"\b(?:los|las|dame|muestra|top|primeros?|primeras?|mejores?|mayores?|menores?)\s+{word}\b|\b{word}\s+(?:proyectos?|resultados?|primeros?|primeras?|mejores?|mayores?|menores?)\b"
                        if re.search(word_pattern, question_text_lower):
                            requested_count = num
                            break

                # ═══════════════════════════════════════════════════════════════
                # Aplicar reglas de preservación
                # ═══════════════════════════════════════════════════════════════

                # Guardar copia de low_rows antes de manipular (para logging y transparencia)
                original_low_rows = list(low_rows)

                # REGLA 1: Si el usuario pidió ≤5 resultados específicos y tenemos
                # aproximadamente esa cantidad (+2 tolerancia), NO descartar ninguno.
                # Es muy frustrante pedir "los 3 mayores" y que aparezca 1.
                # Tolerancia de +2 porque el ranking de la DB puede no ser exacto.
                if (
                    requested_count
                    and requested_count <= 5
                    and original_count <= (requested_count + 2)
                ):
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank PRESERVE: usuario pidió {requested_count} resultados "
                        f"(rows={original_count}) → manteniendo TODAS las filas sin filtrar"
                    )
                    rows_raw = high_rows + gray_rows + low_rows

                # REGLA 2: Si hay pocas filas (≤10) y TODAS cayeron en LOW (ninguna HIGH),
                # promover a GRAY para que el LLM decida (no descartar automáticamente).
                elif original_count <= 10 and len(low_rows) > 0 and len(high_rows) == 0:
                    logger.info(
                        f"FLOW ▸ CITIZEN flashrank PROMOTE: pequeño conjunto sin HIGH "
                        f"(rows={original_count}, low={len(low_rows)}) → promoviendo LOW a GRAY"
                    )
                    gray_rows = gray_rows + low_rows
                    low_rows = []
                    rows_raw = high_rows + gray_rows

                # REGLA 3: Comportamiento normal para conjuntos grandes
                else:
                    rows_raw = high_rows + gray_rows

                logger.info(
                    f"FLOW ▸ CITIZEN flashrank filtered "
                    f"original={original_count} kept={len(rows_raw)} removed={original_count - len(rows_raw)}"
                )

                # Guardar filas eliminadas para transparencia (solo si realmente se descartaron)
                actually_removed = original_count - len(rows_raw)
                if actually_removed > 0 and original_low_rows:
                    reasoned_low_rows = []
                    for row in original_low_rows:
                        # Crear una copia superficial para no mutar el row original
                        if isinstance(row, dict):
                            annotated = dict(row)
                            annotated.setdefault(
                                "_removal_reason",
                                "Descartado por baja relevancia en el reranking semántico",
                            )
                            reasoned_low_rows.append(annotated)
                        else:
                            reasoned_low_rows.append(row)
                    _set_frontend_rows_removed(state, reasoned_low_rows)
                    _set_rows_removed_sample(state, reasoned_low_rows[:3])

                # Si se descartaron todas las filas por baja relevancia, avisar en las notas base
                if original_count > 0 and not rows_raw:
                    existing_notes = _get_frontend_base_notes(state) or []
                    note = (
                        "Se ocultaron resultados porque no parecían relevantes a la pregunta. "
                        "Pide ver más detalles o ajusta los filtros."
                    )
                    if note not in existing_notes:
                        existing_notes.append(note)
                    _set_frontend_base_notes(state, existing_notes)

                # Transparencia: Agregar sección al sidebar
                transparency_section = {
                    "title": "🎯 Filtrado Inteligente de Relevancia",
                    "items": [
                        f"**Total de resultados SQL**: {original_count} proyectos",
                        f"**Alta relevancia**: {len(high_rows)} proyectos (incluidos automáticamente)",
                        f"**Relevancia moderada**: {len(gray_rows)} proyectos (verificados con IA)",
                        f"**Baja relevancia**: {len(original_low_rows)} proyectos (descartados)",
                        "",
                        f"📊 El sistema utilizó reranking semántico para pre-clasificar los resultados "
                        f"y luego verificará manualmente hasta {settings.flashrank_max_llm_rows} filas "
                        f"en zona gris para asegurar máxima precisión.",
                    ],
                }

                # Agregar al principio de technical details
                existing_details = _get_frontend_technical_details(state) or []
                existing_details.insert(0, transparency_section)
                _set_frontend_technical_details(state, existing_details)

        except Exception as exc:
            logger.warning(f"FLOW ▸ CITIZEN flashrank_failed error={exc}")
            _record_citizen_metric(state, "flashrank_failed", True)
            # Fallback: continuar con rows_raw completo (sin reranking)

    # Agregar nota de transparencia cuando se salta FlashRank por falta de texto
    if settings.feature_flashrank_citizen and state.get("flashrank_skipped_no_text"):
        try:
            existing_details = _get_frontend_technical_details(state) or []

            skip_section = {
                "title": "⚡ Optimización de Procesamiento",
                "items": [
                    "Reranking semántico desactivado para esta respuesta",
                    "**Motivo**: Respuesta agregada sin campos de texto de proyecto para evaluar relevancia",
                    "Los resultados se muestran tal como los retorna la base de datos",
                ],
            }

            existing_details.append(skip_section)
            _set_frontend_technical_details(state, existing_details)

            logger.info(
                "FLOW ▸ CITIZEN flashrank transparency note added for skipped case"
            )
        except Exception as e:
            logger.warning(f"FLOW ▸ CITIZEN flashrank transparency note failed: {e}")

    # Agregar nota de transparencia cuando es query de agregación (COUNT, SUM, etc.)
    if state.get("is_aggregation_response"):
        try:
            existing_details = _get_frontend_technical_details(state) or []

            agg_section = {
                "title": "📊 Respuesta Numérica/Agregada",
                "items": [
                    "Esta consulta retorna un valor calculado (conteo, suma, promedio, etc.)",
                    "**Optimización aplicada**: El filtrado de relevancia semántica no aplica a resultados numéricos",
                    "El valor mostrado es el resultado directo de la base de datos",
                ],
            }

            existing_details.append(agg_section)
            _set_frontend_technical_details(state, existing_details)

            logger.info("FLOW ▸ CITIZEN aggregation transparency note added")
        except Exception as e:
            logger.warning(f"FLOW ▸ CITIZEN aggregation transparency note failed: {e}")

    # Agregar transparencia territorial cuando se aplicó filtro
    if settings.use_territorial_disambiguation and state.get("resolved_territories"):
        try:
            resolved_territories = state.get("resolved_territories", [])

            # Solo mostrar si hay al menos un territorio resuelto con columna específica
            resolved_with_column = [
                rt for rt in resolved_territories if rt.get("column")
            ]

            if resolved_with_column:
                existing_details = _get_frontend_technical_details(state) or []

                # Obtener país para mapear nombres
                pais = state.get("country_code", "").lower()

                for rt in resolved_with_column:
                    column = rt.get("column")
                    value = (
                        rt.get("value")
                        or rt.get("valor_original")
                        or rt.get("value_original")
                    )
                    tipo = rt.get("type", "")
                    input_original = rt.get("input", "")
                    has_homonyms = rt.get("has_homonyms", False)
                    reason = rt.get("reason", "")

                    # Mapear columna a nombre legible
                    if pais == "dom" and column == "nombre_departamento":
                        tipo_display = "Provincia"
                    else:
                        tipo_map = {
                            "nombre_region": "Región",
                            "nombre_departamento": "Departamento",
                            "nombre_municipio": "Municipio",
                        }
                        tipo_display = tipo_map.get(
                            column, tipo.title() if tipo else "Territorio"
                        )

                    territorial_section = {
                        "title": "🗺️ Filtro Territorial Aplicado",
                        "items": [
                            f"**Tipo**: {tipo_display}",
                            f"**Valor**: {value}",
                        ],
                    }

                    # Agregar nota si fue nivel explícito
                    if reason == "explicit_level":
                        territorial_section["items"].append("")
                        territorial_section["items"].append(
                            "✅ Nivel territorial especificado explícitamente en la consulta"
                        )

                    # Si hay opciones alternativas (territorio ambiguo) o has_homonyms
                    if has_homonyms or state.get("territorial_options"):
                        alternatives = state.get("territorial_options", [])

                        # Filtrar alternativas (excluir la seleccionada)
                        other_alternatives = [
                            opt
                            for opt in alternatives
                            if opt.get("columna_filtro") != column
                            or opt.get("valor") != value
                        ]

                        if other_alternatives:
                            territorial_section["items"].append("")
                            territorial_section["items"].append(
                                "⚠️ **También existen**:"
                            )

                            for alt in other_alternatives[:3]:  # Max 3 alternativas
                                alt_tipo = alt.get("tipo", "").title()
                                alt_valor = alt.get("valor_original") or alt.get(
                                    "valor"
                                )

                                # Mapear tipo para RD
                                if (
                                    pais == "dom"
                                    and alt.get("column") == "nombre_departamento"
                                ):
                                    alt_tipo = "Provincia"

                                territorial_section["items"].append(
                                    f"• {alt_tipo}: {alt_valor}"
                                )

                            if len(other_alternatives) > 3:
                                territorial_section["items"].append(
                                    f"• ... y {len(other_alternatives) - 3} más"
                                )

                            territorial_section["items"].append("")
                            territorial_section["items"].append(
                                "💡 Si buscabas otro nivel territorial, especifícalo en tu consulta."
                            )

                    existing_details.append(territorial_section)
                    logger.info(
                        f"FLOW ▸ CITIZEN territorial_transparency tipo={tipo_display} "
                        f"valor='{value}' alternatives={len(state.get('territorial_options', []))}"
                    )

                _set_frontend_technical_details(state, existing_details)

        except Exception as e:
            logger.warning(f"FLOW ▸ CITIZEN territorial transparency failed: {e}")

    if rows_raw and columns_meta:
        (
            rows_filtered,
            columns_filtered,
            columns_removed,
        ) = _filter_rows_and_columns_by_relevance(
            question_text,
            analysis_obj,
            rows_raw,
            columns_meta,
        )
        _set_frontend_rows_filtered(state, rows_filtered)
        _set_frontend_columns_filtered(state, columns_filtered)
        if columns_removed:
            _set_frontend_columns_removed(state, columns_removed)
            logger.info(
                "FLOW ▸ CITIZEN columns_removed count={} names={}",
                len(columns_removed),
                [col.get("name") for col in columns_removed[:5]],
            )
        else:
            logger.info(
                "FLOW ▸ CITIZEN columns_filtered count={} (all kept)",
                len(columns_filtered),
            )
        _record_citizen_metric(state, "rows_filtered_count", len(rows_filtered))
        _record_citizen_metric(state, "columns_filtered_count", len(columns_filtered))
        _record_citizen_metric(state, "columns_removed_count", len(columns_removed))
    else:
        rows_filtered = _get_frontend_rows_filtered(state) or []
        columns_filtered = _get_frontend_columns_filtered(state) or []
        columns_removed = _get_frontend_columns_removed(state) or []

    # ───────────────────────────────────────────────────────────────────
    # Filtrar filas irrelevantes con LLM (después de filtrar columnas)
    # SKIP si:
    # - flashrank_skipped_no_text: hay columnas de texto pero vacías
    # - is_aggregation_response: es una query COUNT/SUM/etc. (solo números)
    # Nota: citizen_actions y citizen_actions_details ya están inicializados
    # en las líneas 1000-1001, disponibles para todo el flujo
    # ───────────────────────────────────────────────────────────────────
    skip_llm_filtering = state.get("flashrank_skipped_no_text") or state.get(
        "is_aggregation_response"
    )

    if skip_llm_filtering:
        logger.info(
            f"FLOW ▸ CITIZEN llm_filtering_skipped "
            f"flashrank_skip={state.get('flashrank_skipped_no_text')} "
            f"aggregation={state.get('is_aggregation_response')}"
        )

    if settings.feature_filter_rows_llm and not skip_llm_filtering:
        theme_keywords = signals.get("theme_keywords", [])

        if (
            theme_keywords
            and rows_filtered
            and len(rows_filtered) <= settings.rows_llm_max
        ):
            try:
                rows_kept, rows_removed = _filter_irrelevant_rows_with_llm(
                    state=state,
                    rows=rows_filtered,
                    question=question_text,
                    theme_keywords=theme_keywords,
                    analysis=analysis_obj,
                )

                if rows_removed:
                    logger.info(
                        f"FLOW ▸ CITIZEN filtered_irrelevant_rows "
                        f"total={len(rows_filtered)} kept={len(rows_kept)} removed={len(rows_removed)}"
                    )

                    # Actualizar estado con filas filtradas
                    _set_frontend_rows_filtered(state, rows_kept)
                    _set_frontend_rows_removed(state, rows_removed)

                    # Registrar métricas
                    _record_citizen_metric(
                        state, "irrelevant_rows_removed", len(rows_removed)
                    )
                    _record_citizen_metric(
                        state,
                        "irrelevant_rows_removed_percentage",
                        (
                            (len(rows_removed) / len(rows_filtered) * 100)
                            if rows_filtered
                            else 0.0
                        ),
                    )

                    # Actualizar rows_filtered para uso posterior
                    rows_filtered = rows_kept

                    # ───────────────────────────────────────────────────────────────────
                    # Si hay filas válidas después del filtrado, resetear muestra
                    # ───────────────────────────────────────────────────────────────────
                    if rows_kept:
                        # Hay filas válidas: resetear muestra de filas removidas
                        # (el flag all_rows_irrelevant ya se reseteó al inicio de la función)
                        _set_rows_removed_sample(state, [])
                        logger.debug(
                            "FLOW ▸ CITIZEN rows_kept_after_filtering resetting sample"
                        )

                    # ───────────────────────────────────────────────────────────────────
                    # Detectar si TODAS las filas fueron filtradas
                    # ───────────────────────────────────────────────────────────────────
                    if not rows_kept and rows_removed:
                        logger.info(
                            f"FLOW ▸ CITIZEN all_rows_irrelevant "
                            f"total_removed={len(rows_removed)}"
                        )

                        # Setear flags
                        _set_all_rows_irrelevant(state, True)

                        # Agrupar razones y obtener muestra
                        grouped_message, sample_rows = _group_removal_reasons(
                            rows_removed
                        )
                        _set_rows_removed_sample(state, sample_rows)

                        # Limpiar rows_filtered y columns_filtered (ya están vacíos, pero asegurar)
                        _set_frontend_rows_filtered(state, [])
                        _set_frontend_columns_filtered(state, [])

                        # Construir citizen_note con razones agrupadas
                        # Mensaje empático que explica la demora y elimina disonancia
                        retry_count = _get_irrelevant_retry_count(state)

                        if retry_count == 0:
                            # Primer intento: mensaje completo con explicación de chequeo
                            all_irrelevant_note = (
                                f"La búsqueda devolvió {len(rows_removed)} resultado{'s' if len(rows_removed) > 1 else ''}, "
                                f"pero tras verificar su relevancia semántica, ninguno corresponde al tipo de proyecto que busca. "
                                f"Preferimos no mostrarle datos que no responden a su pregunta. {grouped_message}"
                            )
                        else:
                            # Segundo intento: mensaje más directo
                            all_irrelevant_note = (
                                f"Tras ajustar los filtros, la búsqueda devolvió {len(rows_removed)} resultado{'s' if len(rows_removed) > 1 else ''}, "
                                f"pero nuevamente ninguno corresponde al tipo buscado. {grouped_message}"
                            )

                        # Guardar note (se sobrescribirá más adelante si hay LLM citizen, pero esto es el fallback)
                        _set_citizen_note(state, all_irrelevant_note)

                        # Agregar acciones: reintentar (si es primer intento) y clarificar
                        if retry_count == 0:
                            # Primer intento: ofrecer reintento automático como acción principal
                            _apply_citizen_action(
                                "reintentar_con_filtros_ajustados",
                                signals,
                                citizen_actions,
                                citizen_actions_details,
                            )
                            # También ofrecer clarificación como alternativa
                            _apply_citizen_action(
                                "suggest_clarification",
                                signals,
                                citizen_actions,
                                citizen_actions_details,
                            )
                        else:
                            # Segundo intento: solo clarificación (ya se intentó una vez)
                            _apply_citizen_action(
                                "suggest_clarification",
                                signals,
                                citizen_actions,
                                citizen_actions_details,
                            )

                        logger.info(
                            f"FLOW ▸ CITIZEN all_rows_irrelevant_set "
                            f"note_length={len(all_irrelevant_note)} "
                            f"actions={len(citizen_actions)} "
                            f"retry_count={retry_count}"
                        )
                else:
                    logger.debug("FLOW ▸ CITIZEN no_rows_removed_by_llm")
                    # Si no se removieron filas, asegurar que el flag esté en False
                    # (ya se reseteó al inicio, pero por seguridad)
                    if rows_filtered:
                        _set_all_rows_irrelevant(state, False)
                        _set_rows_removed_sample(state, [])

            except Exception as e:
                # Fallback: mantener todas las filas si hay error
                logger.warning(
                    f"FLOW ▸ CITIZEN row_filtering_failed error={e}, keeping all rows"
                )
                # No actualizar estado, mantener rows_filtered originales
                # Si hay filas después del error, asegurar que el flag esté en False
                if rows_filtered:
                    _set_all_rows_irrelevant(state, False)
                    _set_rows_removed_sample(state, [])
        else:
            logger.debug(
                f"FLOW ▸ CITIZEN skip_row_filtering "
                f"has_keywords={bool(theme_keywords)} "
                f"rows_count={len(rows_filtered) if rows_filtered else 0} "
                f"max={settings.rows_llm_max}"
            )
            # Si se saltó el filtrado pero hay filas, asegurar que el flag esté en False
            if rows_filtered:
                _set_all_rows_irrelevant(state, False)
                _set_rows_removed_sample(state, [])

    # ───────────────────────────────────────────────────────────────────
    # CRÍTICO: Actualizar conteos ANTES de _heuristic_citizen_evaluation
    # para que el mensaje "Estoy mostrando X de Y" use números correctos.
    # rows_filtered puede ser:
    #   - []: lista vacía (inicial o todas filtradas) → usar len()
    #   - [row1, row2, ...]: filas que pasaron el filtro → len()
    # ───────────────────────────────────────────────────────────────────
    sql_rowcount = signals.get("rowcount") or 0  # Conteo original del SQL

    # Determinar conteo filtrado basado en rows_filtered actual
    # Si rows_filtered está vacío pero rows_raw tiene datos, significa que el filtrado
    # aún no se aplicó (o se aplicó y eliminó todo)
    if rows_filtered:
        filtered_rowcount = len(rows_filtered)
    elif rows_raw and not rows_filtered:
        # rows_filtered vacío pero rows_raw tiene datos: revisar si hubo filtrado
        # Si _get_all_rows_irrelevant es True, todas fueron descartadas
        if _get_all_rows_irrelevant(state):
            filtered_rowcount = 0
        else:
            # No hubo filtrado efectivo, usar rows_raw
            filtered_rowcount = len(rows_raw) if rows_raw else sql_rowcount
    else:
        filtered_rowcount = sql_rowcount

    # Actualizar signals si hubo cambio en el conteo
    if filtered_rowcount != sql_rowcount:
        signals["rowcount_original"] = (
            sql_rowcount  # Preservar original para transparencia
        )
        signals["rowcount"] = filtered_rowcount  # Actualizar con conteo real
        signals["rows_displayed"] = min(
            filtered_rowcount, signals.get("rows_limit_applied") or filtered_rowcount
        )
        signals["rows_filtered_by_relevance"] = sql_rowcount - filtered_rowcount
        logger.info(
            f"FLOW ▸ CITIZEN rowcount_adjusted sql={sql_rowcount} → filtered={filtered_rowcount} "
            f"(removed {sql_rowcount - filtered_rowcount} by relevance)"
        )

    # Caso especial: todas las filas fueron filtradas
    if filtered_rowcount == 0 and sql_rowcount > 0:
        all_irrelevant_from_state = _get_all_rows_irrelevant(state)
        signals["all_rows_filtered_by_relevance"] = all_irrelevant_from_state or True
        logger.info(
            f"FLOW ▸ CITIZEN all_rows_filtered sql={sql_rowcount} → 0 by relevance"
        )

    (
        heuristic_note,
        heuristic_feedback,
        heuristic_actions,
        heuristic_details,
        heuristic_meta,
    ) = _heuristic_citizen_evaluation(signals)

    dimension_catalog = _get_dimensions_catalog(state)
    extra_sections: list[dict[str, Any]] = []
    dimension_note_text, dimension_section = _build_dimension_gap_notes(
        signals,
        dimension_catalog,
        _get_gray_zone_reason(state),
    )

    citizen_note = heuristic_note
    if dimension_note_text:
        citizen_note = (
            f"{dimension_note_text} {citizen_note}".strip()
            if citizen_note
            else dimension_note_text
        )
    if dimension_section:
        extra_sections.append(dimension_section)

    # citizen_actions y citizen_actions_details ya están inicializados al inicio (líneas 1000-1001)
    # y pueden haber sido modificados en el bloque de all_rows_irrelevant

    if signals.get("missing_filter_columns"):
        _apply_citizen_action(
            "suggest_clarification",
            signals,
            citizen_actions,
            citizen_actions_details,
        )
    citizen_feedback = heuristic_feedback.copy()
    # Combinar acciones heurísticas con las ya existentes (pueden venir de all_rows_irrelevant)
    heuristic_actions_list = list(heuristic_actions)
    for action in heuristic_actions_list:
        if action not in citizen_actions:
            citizen_actions.append(action)
    # Combinar detalles, preservando los existentes (las acciones de all_rows_irrelevant tienen prioridad)
    citizen_actions_details = {**dict(heuristic_details), **citizen_actions_details}

    warning_priority = None
    if citizen_feedback.get("coverage_warning"):
        warning_priority = "high"
    elif signals.get("used_keyword_regenerate"):
        warning_priority = "medium"

    signals["heuristic_note"] = heuristic_note
    rule_fragments_output = heuristic_meta.get("rule_fragments") or []
    applied_rules_output = heuristic_meta.get("applied_rules") or []
    _record_citizen_metric(state, "citizen_rules_applied", list(applied_rules_output))
    _record_citizen_metric(state, "citizen_rule_fragments", len(rule_fragments_output))

    # ───────────────────────────────────────────────────────────────────
    # Agregar información sobre filas irrelevantes para el LLM citizen
    # ───────────────────────────────────────────────────────────────────
    all_rows_irrelevant_flag = _get_all_rows_irrelevant(state)
    rows_removed_sample = _get_rows_removed_sample(state)
    irrelevant_retry_count = _get_irrelevant_retry_count(state)

    context_payload = {
        "channel": source,
        "user_question": state.get("user_question"),
        "complete_user_question": state.get("complete_user_question"),
        "response_summary": summary,
        "base_notes": _get_frontend_base_notes(state) or [],
        "signals": signals,
        "heuristic_fragments": rule_fragments_output,
        "applied_rules": applied_rules_output,
        "heuristic_actions": citizen_actions,
        # Información crítica para manejo de frustración
        "all_rows_irrelevant": all_rows_irrelevant_flag,
        "rows_removed_count": len(rows_removed_sample) if rows_removed_sample else 0,
        "rows_removed_sample": rows_removed_sample[:3] if rows_removed_sample else [],
        "irrelevant_retry_count": irrelevant_retry_count,
        "citizen_note_prefilled": citizen_note,  # El mensaje que ya construimos (fallback)
    }

    if settings.feature_citizen_node:
        try:
            context_json = json.dumps(context_payload, ensure_ascii=False)
            rowcount = signals.get("rowcount") or 0
            rows_limit = (
                signals.get("rows_limit_applied")
                or _get_rows_limit_applied(state)
                or settings.sql_rows_limit
            )
            # Reducir el payload al LLM: solo filas en zona gris o top‑K por score
            gray_rows: list[dict[str, Any]] = []
            if state.get("flashrank_skipped_no_text"):
                rows_for_llm = []
                _record_citizen_metric(state, "rows_for_llm_count", len(rows_for_llm))
                logger.info(
                    "FLOW ▸ CITIZEN rows_for_llm skipped (no project text fields)"
                )
            else:
                rows_for_llm = []
                gray_rows = [
                    r
                    for r in rows_filtered
                    if isinstance(r, dict) and r.get("_flashrank_score") is not None
                ]
                if gray_rows:
                    gray_rows.sort(
                        key=lambda r: r.get("_flashrank_score", 0.0), reverse=True
                    )
                    rows_for_llm = gray_rows[: settings.flashrank_max_llm_rows]
                elif rows_filtered:
                    # Si no hay gray, opcionalmente tomar top‑K de las filas mostradas
                    rows_copy = list(rows_filtered)
                    rows_copy.sort(
                        key=lambda r: r.get("_flashrank_score", 0.0), reverse=True
                    )
                    rows_for_llm = rows_copy[: settings.flashrank_max_llm_rows]

            context_payload["rows_for_llm"] = rows_for_llm
            _record_citizen_metric(state, "rows_for_llm_count", len(rows_for_llm))
            logger.info(
                "FLOW ▸ CITIZEN rows_for_llm count={} (gray available={})",
                len(rows_for_llm),
                bool(gray_rows),
            )

            chain = create_chain(
                citizen_review_prompt,
                ["context_json", "rowcount", "rows_limit", "rows_for_llm"],
                family="control",
                mini=True,
                effort=REASONING_EFFORT_TEXT,
                verbosity=REASONING_VERBOSITY_TEXT,
                seed=REASONING_SEED,
            )
            raw_output = safe_invoke(
                chain,
                {
                    "context_json": context_json,
                    "rowcount": rowcount,
                    "rows_limit": rows_limit,
                    "rows_for_llm": rows_for_llm,
                },
            )
            raw_text = getattr(raw_output, "content", raw_output)
            parsed = _extract_first_json_block(raw_text)
            if parsed:
                epilogue = parsed.get("epilogue")
                if isinstance(epilogue, str) and epilogue.strip():
                    # Si all_rows_irrelevant es True, el LLM debería haber generado un mensaje empático
                    # Si no lo hizo o es muy corto, usar el fallback que ya construimos
                    if all_rows_irrelevant_flag and len(epilogue.strip()) < 50:
                        # El LLM no generó un mensaje adecuado, mantener el fallback
                        logger.warning(
                            f"FLOW ▸ CITIZEN LLM epilogue too short for all_rows_irrelevant, "
                            f"keeping fallback message"
                        )
                    else:
                        citizen_note = epilogue.strip()
                parsed_feedback = parsed.get("citizen_feedback")
                if isinstance(parsed_feedback, dict):
                    for key, value in parsed_feedback.items():
                        if value is None:
                            continue
                        if key == "satisfaction_score":
                            try:
                                citizen_feedback[key] = max(-1, min(1, int(value)))
                            except (TypeError, ValueError):
                                continue
                        else:
                            citizen_feedback[key] = value
                    if citizen_feedback.get("coverage_warning"):
                        warning_priority = warning_priority or "high"
                parsed_actions = parsed.get("citizen_actions")
                if isinstance(parsed_actions, list):
                    merged = list(
                        dict.fromkeys(
                            citizen_actions
                            + [
                                str(item)
                                for item in parsed_actions
                                if isinstance(item, str)
                            ]
                        )
                    )
                    citizen_actions = merged
        except Exception as exc:
            logger.warning(f"FLOW ▸ CITIZEN prompt_failed={exc}")

    citizen_note = citizen_note.strip()
    if source == "whatsapp" and citizen_note:
        citizen_note = re.sub(r"[>*`_]+", "", citizen_note).strip()
        if len(citizen_note) > 220:
            citizen_note = citizen_note[:217].rstrip() + "..."

    citizen_actions = list(dict.fromkeys(citizen_actions))
    citizen_actions_details = {
        key: value
        for key, value in citizen_actions_details.items()
        if key in citizen_actions
    }

    _set_citizen_note(state, citizen_note)
    _set_citizen_feedback(state, citizen_feedback)
    _set_citizen_actions(state, citizen_actions)
    _set_citizen_actions_details(state, citizen_actions_details)
    if warning_priority:
        _set_frontend_warning_priority(state, warning_priority)
    else:
        _set_frontend_warning_priority(state, None)

    logger.info(
        "FLOW ▸ CITIZEN END warning={} actions={} note={} source={}",
        warning_priority,
        citizen_actions,
        bool(citizen_note),
        source,
    )
    logger.debug(
        "FLOW ▸ CITIZEN details actions={} feedback={}",
        citizen_actions_details,
        citizen_feedback,
    )

    # Calculate execution time
    from time import time

    start_time = state.get("execution_start_time")
    elapsed_str = None
    if start_time:
        elapsed = time() - float(start_time)
        elapsed_str = f"{elapsed:.2f}s"
    if signals:
        signals["elapsed_time"] = elapsed_str

    technical_sections: list[dict[str, Any]] = []
    if settings.feature_citizen_technical_details:
        technical_sections = _build_technical_detail_sections(
            state,
            signals,
            analysis_obj,
            columns_removed,
        )
        # Añadir detalle de cobertura si aplica
        if state.get("coverage_flag"):
            rows_displayed = signals.get("rows_displayed") or 0
            rowcount = signals.get("rowcount") or 0
            technical_sections.append(
                {
                    "title": "Cobertura de resultados",
                    "body": f"Se mostraron {rows_displayed} de {rowcount} registros (vista previa).",
                    "type": "text",
                }
            )
        if extra_sections:
            technical_sections.extend(extra_sections)
    summary_improved = summary_raw
    base_notes_improved = list(base_notes_raw)
    tech_notes_from_llm: list[str] = []

    # ───────────────────────────────────────────────────────────────────
    # Calcular show_table: ocultar tabla SOLO si:
    # - Filas <= HIDE_TABLE_MAX_ROWS (default: 1) Y
    # - Columnas <= HIDE_TABLE_MAX_COLS (default: 2)
    # Si cualquier umbral es 0, la tabla siempre se muestra
    # Configurable via .env: HIDE_TABLE_MAX_ROWS, HIDE_TABLE_MAX_COLS
    # NOTA: signals["rowcount"] ya fue actualizado arriba con el conteo filtrado
    # ───────────────────────────────────────────────────────────────────
    filtered_rowcount = signals.get("rowcount") or 0  # Ya actualizado con conteo real
    column_count = (
        len(columns_filtered)
        if columns_filtered
        else len(columns_meta) if columns_meta else 0
    )
    hide_max_rows = settings.hide_table_max_rows
    hide_max_cols = settings.hide_table_max_cols
    # Ocultar tabla si filas <= umbral Y columnas <= umbral (ambos > 0)
    # Si cualquier umbral es 0, siempre mostrar tabla
    if hide_max_rows == 0 or hide_max_cols == 0:
        show_table = True
    else:
        show_table = not (
            filtered_rowcount <= hide_max_rows and column_count <= hide_max_cols
        )
    _set_frontend_show_table(state, show_table)
    if not show_table:
        logger.info(
            f"FLOW ▸ CITIZEN show_table=False (rowcount={filtered_rowcount}, columns={column_count}, data integrated in summary)"
        )
    else:
        logger.debug(
            f"FLOW ▸ CITIZEN show_table=True (rowcount={filtered_rowcount}, columns={column_count})"
        )

    if (
        settings.feature_citizen_node
        and source != "whatsapp"
        and getattr(settings, "feature_citizen_summary_rewrite", False)
    ):
        # IMPORTANTE: usar 'is not None' para distinguir:
        #   - None: no se aplicó filtrado → usar rows_raw
        #   - []: lista vacía, todas filtradas → usar [] (vacío es válido)
        preview_rows = rows_filtered if rows_filtered is not None else rows_raw
        preview_columns = (
            columns_filtered if columns_filtered is not None else columns_meta
        )
        rows_preview = _build_rows_preview(preview_rows, preview_columns)
        no_data_payload = (
            state.get("no_data_payload")
            if isinstance(state.get("no_data_payload"), dict)
            else {}
        )
        # Obtener datos para validación anti-alucinación
        sql_query_for_validation = _get_sql_query(state) or ""
        analyzer_text = _get_effective_analysis_text(state) or ""
        analyzer_summary_for_validation = summarize_analyzer_for_response(
            analyzer_text, state.get("original_language_iso") or "es"
        )
        user_question_original = (
            state.get("user_question") or ""
        )  # Sin expansión de historial

        summary_llm, notes_llm, tech_notes_llm = _rewrite_summary_with_llm(
            question_text,
            summary_raw or "",
            base_notes_improved,
            citizen_note,
            signals,  # signals ahora tiene rowcount actualizado
            citizen_actions,
            citizen_actions_details,
            rows_preview,
            no_data_payload,
            state.get("original_language_iso") or "es",
            bool(signals.get("soft_missing_filters"))
            or bool(signals.get("missing_filter_columns")),
            show_table=show_table,
            sql_query=sql_query_for_validation,
            analyzer_summary=analyzer_summary_for_validation,
            user_question_original=user_question_original,
        )
        if summary_llm:
            summary_improved = summary_llm
        if notes_llm is not None:
            base_notes_improved = notes_llm
        if tech_notes_llm:
            tech_notes_from_llm = tech_notes_llm

    # ───────────────────────────────────────────────────────────────────
    # CORRECCIÓN DETERMINÍSTICA DE CONTEO: Garantizar que el summary use
    # el rowcount correcto (filtered_rowcount), no el original del SQL.
    # Esto corrige casos donde el LLM no reemplazó correctamente el número.
    # ───────────────────────────────────────────────────────────────────
    summary_improved = _fix_rowcount_in_summary(
        summary_improved or summary_raw,
        filtered_rowcount,
        signals.get("rowcount_original") or filtered_rowcount,
    )

    _set_frontend_summary_improved(state, summary_improved or summary_raw)
    _set_frontend_base_notes_improved(state, base_notes_improved)

    # ───────────────────────────────────────────────────────────────────
    # Construir "Metodología aplicada" directamente del analyzer y SQL
    # Sin LLM - extracción determinística de filtros aplicados
    # Ahora incluye: pregunta interpretada, filtros, resultados, y SQL
    # ───────────────────────────────────────────────────────────────────

    methodology_sections = _build_methodology_from_analyzer(
        question_text,
        analysis_obj,
        _get_sql_query(state) or "",
        signals.get("rowcount") or 0,
        rows_displayed=signals.get("rows_displayed") or 0,
        rows_limit_applied=signals.get("rows_limit_applied") or 0,
        more_than_limit=signals.get("coverage_warning") or False,
    )

    if methodology_sections and settings.feature_citizen_technical_details:
        # Las secciones de metodología ahora son objetos con título/items/type
        # Insertarlas al inicio para visibilidad
        for i, section in enumerate(reversed(methodology_sections)):
            technical_sections.insert(0, section)
        logger.info(
            "FLOW ▸ CITIZEN methodology_sections count={}",
            len(methodology_sections),
        )

    if settings.feature_citizen_technical_details:
        _set_frontend_technical_details(state, technical_sections)
        if technical_sections:
            _record_citizen_metric(state, "technical_sections", len(technical_sections))
            logger.info(
                "FLOW ▸ CITIZEN technical_details sections={} columns_removed={}",
                len(technical_sections),
                len(columns_removed),
            )
    else:
        _set_frontend_technical_details(state, [])

    result: dict[str, Any] = {
        "citizen_note": citizen_note,
        "citizen_feedback": citizen_feedback,
        "citizen_actions": citizen_actions,
        "citizen_actions_details": citizen_actions_details,
    }
    if warning_priority:
        result["frontend_warning_priority"] = warning_priority
    # Transparencia: incluir recuento de filas descartadas y muestra breve
    rows_removed = _get_frontend_rows_removed(state) or []
    if rows_removed:
        result["frontend_rows_removed_count"] = len(rows_removed)
        sample = rows_removed[:3]
        result["frontend_rows_removed_sample"] = sample
    return result


def _build_methodology_from_analyzer(
    question: str,
    analysis: dict[str, Any] = None,  # No usado, mantenido por compatibilidad
    sql_query: str = "",  # No usado, ya está en _build_technical_detail_sections
    rowcount: int = 0,  # No usado, ya está en _build_technical_detail_sections
    rows_displayed: int = 0,  # No usado
    rows_limit_applied: int = 0,  # No usado
    more_than_limit: bool = False,  # No usado
) -> list[dict[str, Any]]:
    """
    Construye la sección "Pregunta interpretada" para el sidebar técnico.

    Las demás secciones (Filtros, Resultados, SQL) ya existen en
    _build_technical_detail_sections para evitar duplicación (DRY).

    Retorna una lista de secciones con título e items para el sidebar técnico.
    """
    sections: list[dict[str, Any]] = []

    # ═══════════════════════════════════════════════════════════════════
    # SECCIÓN 1: Pregunta interpretada
    # Esta es la única sección exclusiva de metodología.
    # Las demás (Filtros, Resultados, SQL) ya están en _build_technical_detail_sections
    # ═══════════════════════════════════════════════════════════════════
    if question and question.strip():
        sections.append(
            {
                "title": "Pregunta interpretada",
                "body": question.strip(),  # "body" para que el frontend lo renderice como <pre>
            }
        )

    # NOTA: Las siguientes secciones ya existen en _build_technical_detail_sections:
    # - "Filtros aplicados" → ya está
    # - "Ejecución" (filas devueltas, límite) → ya está
    # - "Consulta ejecutada" (SQL) → ya está
    # Evitamos duplicar aquí para mantener DRY.

    return sections


def _format_analysis_summary(analysis: dict[str, Any]) -> str:
    """Formatea el análisis en un string legible para el prompt de evaluación de relevancia."""
    if not analysis or not isinstance(analysis, dict):
        return ""

    parts = []

    # Filtros aplicados
    filters_data = analysis.get("filters", {})
    if isinstance(filters_data, dict):
        filters_all = filters_data.get("all", [])
        if filters_all:
            filter_texts = []
            for flt in filters_all[:5]:  # Max 5 filtros
                if not isinstance(flt, dict):
                    continue
                column = str(flt.get("column", "")).strip()
                value = str(flt.get("value", "")).strip()
                if column and value:
                    filter_texts.append(f"{column}: {value}")
            if filter_texts:
                parts.append(f"Filtros aplicados: {', '.join(filter_texts)}")

    # Tablas usadas
    tables_data = analysis.get("tables", {})
    if isinstance(tables_data, dict):
        tables_list = tables_data.get("list", [])
        if tables_list:
            parts.append(f"Tablas consultadas: {', '.join(tables_list[:3])}")

    return ". ".join(parts) if parts else "Sin filtros específicos aplicados."


def _extract_relevant_row_fields(row: dict[str, Any]) -> dict[str, Any]:
    """Extrae solo los campos relevantes de una fila para evaluación de relevancia."""
    if not isinstance(row, dict):
        return {}

    # Campos de texto relevantes para evaluación semántica
    relevant_fields = [
        "nombre_proyecto",
        "objetivo_proyecto",
        "nombresector_proyecto",
        "nombreentidadejecutora_proyecto",
        "estado_proyecto",
    ]

    extracted = {}
    for field in relevant_fields:
        value = row.get(field)
        if value is not None:
            extracted[field] = str(value).strip()

    return extracted


def _filter_irrelevant_rows_with_llm(
    state: AgentState,
    rows: list[dict[str, Any]],
    question: str,
    theme_keywords: list[str],
    analysis: dict[str, Any],
) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    """
    Filtra filas que no son relevantes a la pregunta usando LLM.

    Evalúa cada fila individualmente con un LLM para determinar si es relevante.
    Retorna tupla (rows_kept, rows_removed) donde rows_removed incluye metadata
    de por qué se removieron.
    """
    import time
    from modules.graph.helpers_respuesta import (
        create_chain,
        REASONING_EFFORT_TEXT,
        REASONING_VERBOSITY_TEXT,
        REASONING_SEED,
    )

    # Early exits
    if not settings.feature_filter_rows_llm:
        logger.debug("FLOW ▸ CITIZEN row_filtering disabled by feature flag")
        return rows, []

    if not theme_keywords or len(theme_keywords) == 0:
        logger.debug("FLOW ▸ CITIZEN row_filtering skipped: no theme keywords")
        return rows, []

    if len(rows) > settings.rows_llm_max:
        logger.debug(
            f"FLOW ▸ CITIZEN row_filtering skipped: too many rows ({len(rows)} > {settings.rows_llm_max})"
        )
        return rows, []

    if not rows or len(rows) == 0:
        return [], []

    start_time = time.time()

    # Preparar contexto compartido
    analysis_summary = _format_analysis_summary(analysis)
    keywords_text = ", ".join(theme_keywords[:10])  # Max 10 keywords

    logger.info(
        f"FLOW ▸ CITIZEN row_filtering_start "
        f"rows={len(rows)} keywords=[{keywords_text}] threshold={settings.rows_llm_threshold}"
    )

    rows_kept = []
    rows_removed = []
    threshold = settings.rows_llm_threshold

    # Iterar sobre filas
    for idx, row in enumerate(rows):
        if not isinstance(row, dict):
            # Mantener filas inválidas (no sabemos si son relevantes)
            rows_kept.append(row)
            continue

        try:
            # Extraer campos relevantes
            row_fields = _extract_relevant_row_fields(row)
            row_data_json = json.dumps(row_fields, ensure_ascii=False, indent=2)

            # Construir payload para LLM
            chain = create_chain(
                row_relevance_evaluation_prompt,
                ["user_question", "theme_keywords", "analysis_summary", "row_data"],
                family="control",
                mini=True,  # Modelo rápido para evaluación
                effort=REASONING_EFFORT_TEXT,
                verbosity=REASONING_VERBOSITY_TEXT,
                seed=REASONING_SEED,
            )

            # Invocar LLM
            raw_output = safe_invoke(
                chain,
                {
                    "user_question": question,
                    "theme_keywords": keywords_text,
                    "analysis_summary": analysis_summary,
                    "row_data": row_data_json,
                },
            )

            # Parsear respuesta
            raw_text = (
                getattr(raw_output, "content", raw_output)
                if hasattr(raw_output, "content")
                else str(raw_output)
            )
            parsed = _extract_first_json_block(raw_text)

            if not parsed or not isinstance(parsed, dict):
                # Parsing falló, mantener fila (conservador)
                logger.warning(
                    f"FLOW ▸ CITIZEN row_evaluation_parse_failed row_idx={idx}"
                )
                rows_kept.append(row)
                continue

            is_relevant = parsed.get(
                "is_relevant", True
            )  # Default: mantener si no está claro
            confidence = float(parsed.get("confidence", 0.0))
            reason = str(parsed.get("reason", "Sin razón especificada")).strip()

            # Obtener nombre para logging
            nombre = row_fields.get("nombre_proyecto", f"Fila {idx+1}")

            # Decidir mantener o eliminar
            if not is_relevant and confidence >= threshold:
                # Filtrar: no es relevante y confianza alta
                row_with_metadata = {
                    **row,
                    "_removal_reason": reason,
                    "_confidence": confidence,
                    "_row_index": idx,
                }
                rows_removed.append(row_with_metadata)
                logger.info(
                    f"FLOW ▸ CITIZEN row_removed nombre={nombre[:60]} confidence={confidence:.2f} reason={reason[:80]}"
                )
            else:
                # Mantener: es relevante o confianza baja (conservador)
                rows_kept.append(row)
                logger.info(
                    f"FLOW ▸ CITIZEN row_kept nombre={nombre[:60]} is_relevant={is_relevant} confidence={confidence:.2f} reason={reason[:50]}"
                )

        except Exception as e:
            # Error en evaluación, mantener fila (conservador)
            logger.warning(
                f"FLOW ▸ CITIZEN row_evaluation_error row_idx={idx} error={e}"
            )
            rows_kept.append(row)
            continue

    elapsed_ms = int((time.time() - start_time) * 1000)

    if rows_removed:
        logger.info(
            f"FLOW ▸ CITIZEN filtered_irrelevant_rows "
            f"total={len(rows)} kept={len(rows_kept)} removed={len(rows_removed)} "
            f"evaluation_time_ms={elapsed_ms}"
        )

    return rows_kept, rows_removed


def _generate_follow_up_hint(
    state: AgentState, rowcount: int, rows_displayed: int
) -> str:
    """
    Genera una sugerencia de repregunta contextual para acompañar la respuesta.
    Esto invita al usuario a continuar explorando los datos.

    Retorna string vacío si no hay sugerencia apropiada.
    """
    # Obtener el análisis y filtros aplicados
    analysis_obj = (
        state.get("analysis") if isinstance(state.get("analysis"), dict) else {}
    )
    filters_data = (
        analysis_obj.get("filters", {}) if isinstance(analysis_obj, dict) else {}
    )
    filters_all = filters_data.get("all", []) if isinstance(filters_data, dict) else []

    # Obtener suggested_user_prompts del analyzer si existe
    decision = _get_gray_zone_decision(state) or {}
    suggested = (
        decision.get("suggested_user_prompts")
        or state.get("suggested_user_prompts")
        or []
    )

    # Si ya hay suggested prompts, usar el primero como hint
    if suggested and len(suggested) > 0:
        first_prompt = str(suggested[0]).strip()
        if first_prompt and len(first_prompt) > 10:
            return f"💡 *¿Desea explorar más?* {first_prompt}"

    # Generar hint contextual basado en los filtros aplicados
    has_territory_filter = any(
        "departamento" in str(f.get("column", "")).lower()
        or "municipio" in str(f.get("column", "")).lower()
        or "region" in str(f.get("column", "")).lower()
        for f in filters_all
        if isinstance(f, dict)
    )

    has_sector_filter = any(
        "sector" in str(f.get("column", "")).lower()
        for f in filters_all
        if isinstance(f, dict)
    )

    has_year_filter = any(
        "anio" in str(f.get("column", "")).lower()
        or "fecha" in str(f.get("column", "")).lower()
        or "year" in str(f.get("column", "")).lower()
        for f in filters_all
        if isinstance(f, dict)
    )

    # Sugerencias contextuales
    hints = []

    if rowcount > 5 and not has_territory_filter:
        hints.append("filtrar por territorio (provincia, municipio)")

    if rowcount > 5 and not has_sector_filter:
        hints.append("filtrar por sector")

    if not has_year_filter:
        hints.append("especificar un año o período")

    if rowcount > 0:
        hints.append("ver detalles de un proyecto específico")

    if hints:
        hint_text = " o ".join(hints[:2])  # Max 2 sugerencias
        return f"💡 *Puede refinar su búsqueda:* {hint_text}."

    return ""


def compose_frontend_response(state: AgentState):

    if state.get("stop_processing"):
        logger.info("FLOW ▸ COMPOSE skip=stop_processing")
        return {}
    source = (state.get("source") or "").lower()
    if source == "whatsapp":
        return {}

    summary = (
        _get_frontend_summary_improved(state)
        or _get_frontend_summary_raw(state)
        or _get_frontend_summary(state)
        or ""
    ).strip()
    base_notes = (
        _get_frontend_base_notes_improved(state)
        or _get_frontend_base_notes_raw(state)
        or _get_frontend_base_notes(state)
        or []
    )
    citizen_note = (_get_citizen_note(state) or "").strip()
    table_markdown = (_get_frontend_table_markdown(state) or "").strip()
    rows_filtered = _get_frontend_rows_filtered(state)
    columns_filtered = _get_frontend_columns_filtered(state)
    currency_code = state.get("currency_code")
    table_markdown_source = "original"

    # ───────────────────────────────────────────────────────────────────
    # Detectar si todas las filas fueron filtradas como irrelevantes
    # ───────────────────────────────────────────────────────────────────
    all_rows_irrelevant = _get_all_rows_irrelevant(state)
    if all_rows_irrelevant:
        # No construir tabla, solo mostrar mensaje
        logger.info(
            "FLOW ▸ COMPOSE all_rows_irrelevant=True, skipping table generation"
        )
        table_markdown = ""  # Forzar tabla vacía
        table_markdown_source = "skipped_all_irrelevant"
        _record_citizen_metric(state, "table_markdown_source", table_markdown_source)
    elif rows_filtered and columns_filtered:
        table_markdown_source = "filtered"
        logger.info(
            "FLOW ▸ COMPOSE table_override=filtered rows={} cols={}",
            len(rows_filtered),
            len(columns_filtered),
        )
        _record_citizen_metric(state, "table_markdown_source", table_markdown_source)
        include_names = [col.get("name") for col in columns_filtered if col.get("name")]
        ordered_rows: list[dict[str, Any]] = []
        for row in rows_filtered:
            if not isinstance(row, dict):
                continue
            ordered_rows.append({name: row.get(name) for name in include_names})
        monetary_properties_str = _get_frontend_table_metadata(state) or ""
        try:
            table_markdown = format_table_markdown(
                ordered_rows,
                currency_code,
                monetary_properties_str,
            ).strip()
        except Exception:
            logger.warning("FLOW ▸ COMPOSE fallback=table_markdown_filtered_failed")
            try:
                table_markdown = format_table_markdown(
                    rows_filtered,
                    currency_code,
                    monetary_properties_str,
                ).strip()
            except Exception:
                table_markdown = (_get_frontend_table_markdown(state) or "").strip()
    else:
        _record_citizen_metric(state, "table_markdown_source", table_markdown_source)
    actions = _get_citizen_actions(state) or []

    # ───────────────────────────────────────────────────────────────────
    # CORRECCIÓN: Eliminar párrafos redundantes de conteo en el summary.
    # Problema: A veces el summary contiene múltiples líneas que dicen
    # cuántos proyectos hay (ej: "Se muestran 5..." y "Se encontraron 2...").
    # Solución: Mantener solo el ÚLTIMO párrafo de conteo (el más actualizado).
    # ───────────────────────────────────────────────────────────────────
    summary = _deduplicate_count_paragraphs(summary)

    # Calcular conteo base para normalizar textos de vista previa
    sql_rowcount = _get_sql_rowcount(state) or 0
    if rows_filtered:
        rowcount_displayed = len(rows_filtered)
    else:
        rowcount_displayed = sql_rowcount
    total_rowcount = sql_rowcount if sql_rowcount else rowcount_displayed
    rows_limit_applied = _get_rows_limit_applied(state) or settings.sql_rows_limit
    rows_displayed = (
        min(rowcount_displayed, rows_limit_applied)
        if rows_limit_applied
        else rowcount_displayed
    )
    rowcount = (
        rowcount_displayed  # Conteo real que se está mostrando tras citizen review
    )

    def _build_rowcount_phrase(
        displayed: int,
        total: int,
        *,
        all_irrelevant: bool = False,
    ) -> str:
        if all_irrelevant and total:
            plural = "resultados" if total != 1 else "resultado"
            return (
                f"La búsqueda devolvió {total} {plural}, pero ninguno superó la verificación de relevancia. "
                "Prefiero no mostrar datos que no respondan a tu consulta."
            )
        if displayed and total and displayed < total:
            plural_total = "resultados" if total != 1 else "resultado"
            return (
                f"Se muestran {displayed} de {total} {plural_total} más relevantes. "
                "Puedo ampliar el listado o ajustar los filtros si necesitás ver más."
            )
        if displayed:
            plural = "resultados" if displayed != 1 else "resultado"
            return f"Se muestran {displayed} {plural} relevantes."
        if total:
            plural = "resultados" if total != 1 else "resultado"
            return f"Se encontraron {total} {plural}, pero la vista previa aún no contiene datos visibles."
        return ""

    rowcount_phrase = _build_rowcount_phrase(
        rows_displayed,
        total_rowcount,
        all_irrelevant=bool(all_rows_irrelevant),
    )

    def _normalize_rowcount_text(text: str) -> str:
        if not rowcount_phrase:
            return (text or "").strip()
        original = text or ""
        updated = original
        replaced = False
        patterns = [
            r"se\s+muestran?\s+\d+[^.\n]*",
            r"mostrando\s+\d+[^.\n]*",
            r"\b\d+\s+de\s+\d+\b",
            r"estoy\s+mostrando\s+\d+[^.\n]*",
        ]
        for pat in patterns:
            new_text, count = re.subn(
                pat, rowcount_phrase, updated, flags=re.IGNORECASE
            )
            if count > 0:
                updated = new_text
                replaced = True
        if not updated.strip():
            return rowcount_phrase
        if not replaced and rowcount_phrase not in updated:
            updated = f"{rowcount_phrase}\n\n{updated}".strip()
        return updated.strip()

    summary = _normalize_rowcount_text(summary)
    citizen_note = _normalize_rowcount_text(citizen_note)
    base_notes = [
        _normalize_rowcount_text(note) if note else note for note in base_notes
    ]

    if not summary and base_notes:
        summary = base_notes[0].strip()
        base_notes = base_notes[1:]

    # Detectar si citizen_note ya está integrado en summary para evitar duplicación
    if citizen_note and summary:
        # Extraer palabras significativas (más de 3 caracteres, excluyendo palabras comunes)
        common_words = {
            "para",
            "con",
            "los",
            "las",
            "del",
            "que",
            "una",
            "por",
            "son",
            "están",
            "puede",
            "pueden",
            "tiene",
            "tienen",
            "este",
            "esta",
            "estos",
            "estas",
            "como",
            "más",
            "muy",
            "también",
            "solo",
        }
        citizen_words = set(
            word.lower().strip()
            for word in re.split(r"[^\w]+", citizen_note)
            if len(word.strip()) > 3 and word.lower().strip() not in common_words
        )
        summary_words = set(
            word.lower().strip()
            for word in re.split(r"[^\w]+", summary)
            if len(word.strip()) > 3 and word.lower().strip() not in common_words
        )

        # Calcular overlap solo si hay palabras significativas
        if len(citizen_words) >= 2:  # Mínimo 2 palabras significativas
            overlap_ratio = len(citizen_words & summary_words) / len(citizen_words)
            # Si más del 40% de las palabras clave de citizen_note están en summary,
            # asumimos que ya está integrado (umbral más bajo para ser más permisivo)
            if overlap_ratio >= 0.4:
                logger.info(
                    "FLOW ▸ COMPOSE citizen_note_integrated overlap={:.2f} citizen_words={} summary_words={}",
                    overlap_ratio,
                    len(citizen_words),
                    len(summary_words),
                )
                citizen_note = ""
        elif len(citizen_words) == 1:
            # Si solo hay una palabra significativa, verificar si está en summary
            if citizen_words & summary_words:
                logger.info(
                    "FLOW ▸ COMPOSE citizen_note_integrated single_word_match citizen_word={}",
                    list(citizen_words)[0],
                )
                citizen_note = ""

    highlight_first = "highlight_warning" in actions
    note_after_table = "note_after_table" in actions and not highlight_first

    # ───────────────────────────────────────────────────────────────────
    # Obtener show_table: si False, no mostrar tabla (rowcount == 1)
    # ───────────────────────────────────────────────────────────────────
    show_table = _get_frontend_show_table(state)
    if not show_table:
        logger.info(
            "FLOW ▸ COMPOSE show_table=False, hiding table (single row integrated in summary)"
        )
        table_markdown = ""  # No mostrar tabla cuando hay 1 sola fila
        # También limpiar del state para que el frontend no la muestre
        _set_frontend_table_markdown(state, "")

    segments: list[str] = []
    coverage_flag = bool(state.get("coverage_flag"))

    def _append(segment: str):
        segment = (segment or "").strip()
        if segment:
            segments.append(segment)

    # Filtrar cobertura duplicada en citizen_note si ya hay flag/nota de cobertura
    if citizen_note and (state.get("coverage_flag") or coverage_flag):
        coverage_patterns = [
            "se muestran",
            "mostrando",
            "vista previa",
            "ampliar el listado",
            "ver más resultados",
        ]
        filtered_lines = []
        for line in citizen_note.splitlines():
            if not line:
                continue
            if any(pattern in line.lower() for pattern in coverage_patterns):
                logger.debug("FLOW ▸ COMPOSE skip_citizen_coverage_line: {}", line[:60])
                continue
            filtered_lines.append(line)
        citizen_note = "\n".join(filtered_lines).strip()

    # Deduplicar notas de cobertura/límite en summary + base_notes + citizen_note (incluye variantes con emojis)
    def _normalize_note_line(line: str) -> str:
        # Quitar emojis comunes de prefijo y normalizar espacios
        line_no_emoji = re.sub(r"^[\W_]+", "", line.strip())
        return re.sub(r"\s+", " ", line_no_emoji.lower())

    seen_notes = set()
    dedup_base_notes = []

    # Detectar en summary - agregar tanto el texto completo como cada párrafo
    if summary:
        # Agregar el texto completo normalizado
        norm_full = _normalize_note_line(summary)
        seen_notes.add(norm_full)
        # También agregar cada párrafo individual para detectar duplicaciones parciales
        for para in summary.split("\n\n"):
            para = para.strip()
            if para:
                norm_para = _normalize_note_line(para)
                seen_notes.add(norm_para)

    # Dedup base_notes
    for note in base_notes:
        norm = _normalize_note_line(note)
        if norm in seen_notes:
            logger.debug("FLOW ▸ COMPOSE dedup base_note duplicate: {}", note[:80])
            continue
        seen_notes.add(norm)
        dedup_base_notes.append(note)
    base_notes = dedup_base_notes

    # Dedup citizen_note si repite coverage/limit ya presente
    if citizen_note:
        norm = _normalize_note_line(citizen_note)
        if norm in seen_notes:
            logger.debug("FLOW ▸ COMPOSE dedup citizen_note duplicate")
            citizen_note = ""

    if highlight_first and citizen_note:
        _append(citizen_note)

    _append(summary)

    if not highlight_first and citizen_note and not note_after_table:
        _append(citizen_note)

    # ───────────────────────────────────────────────────────────────────
    # MEJORA: Agregar mensaje "Mostrando X de Y" cuando hay más resultados
    # Esto evita que el usuario piense que solo hay 5 proyectos cuando en
    # realidad hay más pero se está mostrando un subconjunto
    # CORRECCIÓN: Usar conteo de rows_filtered si está disponible, ya que
    # puede ser menor que el conteo SQL original después del filtrado por relevancia.
    # ───────────────────────────────────────────────────────────────────
    # Nota de cobertura sin formatos “X de Y”
    coverage_note = ""
    if rowcount_phrase and rows_displayed < total_rowcount:
        coverage_note = rowcount_phrase

    # Solo agregar tabla si show_table es True
    if show_table:
        _append(table_markdown)
        # Agregar nota de cobertura DESPUÉS de la tabla
        if coverage_note:
            _append(coverage_note)
            logger.info(
                "FLOW ▸ COMPOSE coverage_note added: {} of {}",
                rows_displayed or rows_limit_applied,
                total_rowcount,
            )

    if citizen_note and note_after_table:
        _append(citizen_note)

    if base_notes:
        existing = "\n\n".join(segments)
        # Patrones de notas de cobertura que ya incluimos con coverage_note
        coverage_patterns = [
            "se muestran",
            "mostrando",
            "vista previa",
            "ampliar el listado",
            "ver más resultados",
        ]
        for note in base_notes:
            stripped = (note or "").strip()
            if not stripped:
                continue
            if stripped in existing:
                continue
            # Si ya tenemos coverage_note o flag de cobertura, evitar notas duplicadas de cobertura
            if coverage_note or coverage_flag:
                note_lower = stripped.lower()
                if any(pattern in note_lower for pattern in coverage_patterns):
                    logger.debug(
                        "FLOW ▸ COMPOSE skip_redundant_note: {}", stripped[:60]
                    )
                    continue
            _append(stripped)
            existing = "\n\n".join(segments)

    # ───────────────────────────────────────────────────────────────────
    # Agregar pregunta de seguimiento del LLM al final (si existe)
    # Esto invita al usuario a explorar más detalles
    # ───────────────────────────────────────────────────────────────────
    llm_follow_up = (state.get("llm_follow_up") or "").strip()
    if llm_follow_up:
        # Evitar duplicación: verificar que no esté ya en el texto
        existing_text = "\n\n".join(segments).lower()
        if llm_follow_up.lower() not in existing_text:
            _append(llm_follow_up)
            logger.debug("FLOW ▸ COMPOSE follow_up added: {}", llm_follow_up[:50])

    # ───────────────────────────────────────────────────────────────────
    # MEJORA: Agregar acompañamiento de repregunta al final
    # Esto invita al usuario a continuar explorando los datos
    # ───────────────────────────────────────────────────────────────────
    if rowcount > 0 and not llm_follow_up:
        # Generar sugerencia de repregunta basada en el contexto
        repregunta_hint = _generate_follow_up_hint(state, rowcount, rows_displayed)
        if repregunta_hint:
            _append(repregunta_hint)
            logger.debug("FLOW ▸ COMPOSE repregunta_hint added")

    def _dedup_segments(entries: list[str]) -> list[str]:
        """
        Elimina segmentos redundantes de conteo/cobertura.

        Detecta dos tipos de patrones:
        1. Cobertura: "se muestran X de Y", "mostrando", "vista previa"
        2. Conteo inicial: "Se encontraron X proyectos", "Hay X resultados"

        Si el summary ya contiene un conteo inicial (ej: "Se encontraron 2 proyectos..."),
        NO agregamos una nota de cobertura redundante cuando X == Y (todos mostrados).
        """
        # Patrones de cobertura (notas de límite)
        coverage_patterns = [
            "se muestran",
            "mostrando",
            "vista previa",
            "ampliar el listado",
            "ver más resultados",
        ]
        # Patrones de conteo inicial (en el summary principal)
        count_patterns = [
            "se encontraron",
            "se encontró",
            "hay ",
            "existen ",
            "encontré ",
        ]

        coverage_seen = False
        count_seen = False
        deduped: list[str] = []

        for seg in entries:
            normalized = seg.lower()

            # Detectar si es un segmento de conteo inicial
            is_count_segment = any(pattern in normalized for pattern in count_patterns)
            # Detectar si es un segmento de cobertura
            is_coverage_segment = any(
                pattern in normalized for pattern in coverage_patterns
            )

            # Si ya vimos un conteo inicial y este es cobertura redundante (ej: "📊 Se muestran 2 de 2"),
            # detectar si es redundante comparando si el "X de X" implica todos mostrados
            if count_seen and is_coverage_segment:
                # Extraer números del segmento de cobertura
                import re

                nums = re.findall(r"\d+", seg)
                if len(nums) >= 2:
                    shown, total = int(nums[0]), int(nums[1])
                    if shown == total:
                        # "Se muestran 2 de 2" es redundante si ya dijimos "Se encontraron 2"
                        logger.debug(
                            "FLOW ▸ COMPOSE skip_redundant_coverage (shown==total): {}",
                            seg[:80],
                        )
                        continue

            # Skip duplicates de cobertura
            if is_coverage_segment:
                if coverage_seen:
                    logger.debug(
                        "FLOW ▸ COMPOSE skip_duplicate_coverage_segment: {}", seg[:80]
                    )
                    continue
                coverage_seen = True

            # Marcar si vimos conteo
            if is_count_segment:
                count_seen = True

            deduped.append(seg)
        return deduped

    segments = _dedup_segments(segments)

    final_text = "\n\n".join(segment for segment in segments if segment).strip()

    # Extraemos las sugerencias generadas por el analyzer (si existen) desde el state.
    decision = _get_gray_zone_decision(state)
    suggested_prompts = (
        decision.get("suggested_user_prompts")
        or state.get("suggested_user_prompts")
        or []
    )
    # Normalizamos: lista de strings, trim, unique y límite razonable para el frontend.
    cleaned_prompts: list[str] = []
    try:
        for item in suggested_prompts:
            if item is None:
                continue
            s = str(item).strip()
            if not s:
                continue
            if s not in cleaned_prompts:
                cleaned_prompts.append(s)
            if len(cleaned_prompts) >= 8:
                break
    except Exception:
        cleaned_prompts = []

    if not final_text:
        logger.warning("FLOW ▸ COMPOSE fallback=no_content")
        fallback_text = "Esta respuesta quedó pendiente. Indíqueme si desea que vuelva a intentarlo o si prefiere ajustar la consulta."
        return {
            "messages": [AIMessage(content=fallback_text)],
            "suggested_user_prompts": cleaned_prompts,
        }

    logger.info(
        "FLOW ▸ COMPOSE END segments={} actions={} coverage_shown={}",
        len(segments),
        actions,
        bool(coverage_note),
    )
    # Devolvemos la respuesta principal y, opcionalmente, las preguntas sugeridas
    return {
        "messages": [AIMessage(content=final_text)],
        "suggested_user_prompts": cleaned_prompts,
    }


def handle_gray_zone(state: AgentState):
    """Comunica limitaciones estructurales: datos faltantes, métricas no soportadas o bloqueos.

    Se diferencia de `request_clarification` en que aquí no pedimos más contexto al
    usuario, sino que explicamos por qué la respuesta no puede generarse con la base actual.
    """

    logger.info(
        "FLOW ▸ GRAY START reason={} decision={} rowcount={}",
        _get_gray_zone_reason(state),
        _get_gray_zone_decision(state).get("status"),
        _get_sql_rowcount(state),
    )

    decision = _get_gray_zone_decision(state)
    decision_status = str(decision.get("status") or "").lower()
    reason = _get_gray_zone_reason(state) or _infer_gray_zone_reason(state)
    _set_gray_zone_reason(state, reason)

    # Caso específico: no hay datos de contratistas/proveedores
    if str(reason).upper() == "MISSING_CONTRACTOR_DATA":
        note = (
            "Este dataset solo incluye entidades públicas ejecutoras; no contiene datos de contratistas ni proveedores."
            " Si necesitas, puedo mostrar las entidades ejecutoras con más proyectos."
        )
        suggested_prompts = [
            "Muéstrame entidades ejecutoras con más proyectos",
            "Quiero ver top entidades ejecutoras por monto",
        ]
        details = {
            "reason": reason,
            "rationale": note,
            "suggested_user_prompts": suggested_prompts,
        }
        _set_gray_zone_details(state, details)
        _set_gray_zone_decision(
            state,
            {
                "status": "block",
                "rationale": note,
                "suggested_user_prompts": suggested_prompts,
            },
        )
        return {
            "messages": [AIMessage(content=note)],
            "gray_zone_details": details,
            "suggested_user_prompts": suggested_prompts,
            "response_type": "gray_zone_block",
            "stop_processing": True,
        }

    question = state.get("complete_user_question") or state.get("user_question") or ""
    country_code = state.get("country_code", "")
    original_language_iso = state.get("original_language_iso", "es")
    sql_query = _get_sql_query(state)
    theme_strategy = _get_theme_strategy(state)
    semantic_or_groups = _get_semantic_or_groups(state)
    uncertainties = _get_gray_zone_non_mappable(state)
    non_mappable = _get_gray_zone_non_mappable(state)
    limitation_note = _build_gray_zone_note(state)

    # Heurística mejorada para activar "respuesta textual"
    # Solo activar textual cuando hay indicios claros de búsqueda por nombre/tema
    # NO activar solo por 0 filas (eso se maneja en is_zero_rows)
    rowcount = _get_sql_rowcount(state) or 0
    has_project_name_uncertainty = any(
        (u.get("topic", "") or "").lower() == "project_name" for u in uncertainties
    )
    has_theme_keywords = bool(theme_strategy and theme_strategy.get("keywords"))

    use_textual = (
        reason == "MISSING_DIMENSION"
        or (has_project_name_uncertainty and has_theme_keywords)
        or (has_project_name_uncertainty and rowcount == 0)
    )

    details: Dict[str, Any] = {
        "reason": reason,
        "decision": decision,
        "uncertainties": uncertainties,
        "non_mappable": non_mappable,
        "limitation_note": limitation_note,
        "uncertainty_actions": _get_uncertainty_actions(state),
        "soft_missing_filters": state.get("soft_missing_filters"),
    }

    if theme_strategy:
        details["theme_strategy"] = theme_strategy
    if semantic_or_groups:
        details["semantic_or_groups"] = semantic_or_groups

    # ───────────────────────────────────────────────────────────────────
    # Caso BLOCK (atributo faltante/unsupported)
    # ───────────────────────────────────────────────────────────────────
    blocking_attr = next(
        (attr for attr in non_mappable if attr.get("impacto") == "blocking"),
        {},
    )

    if decision_status == "block" or (
        reason and reason not in {"", "NO_ROWS_FILTERED", None}
    ):
        logger.info(
            "FLOW ▸ GRAY path=block attribute={}",
            blocking_attr.get("atributo") or decision.get("missing_attribute"),
        )

        missing_attribute = (
            blocking_attr.get("atributo") or decision.get("missing_attribute") or ""
        )
        rationale = (
            blocking_attr.get("razon") or decision.get("rationale") or limitation_note
        )
        proxies = (
            blocking_attr.get("candidatos_proxies") or decision.get("proxies") or []
        )
        schema_fields = decision.get("exposed_schema_fields") or []
        suggested_prompts = decision.get("suggested_user_prompts") or []

        def _format_bullets(items: list[str], empty_msg: str) -> str:
            cleaned = [str(item).strip() for item in items if str(item).strip()]
            if not cleaned:
                return f"- {empty_msg}"
            return "\n".join(f"- {value}" for value in cleaned)

        proxies_bullets = _format_bullets(
            proxies,
            "Por ahora no contamos con un proxy directo; puedo ayudarte con otros campos disponibles.",
        )
        schema_fields_bullets = _format_bullets(
            schema_fields,
            "No hay campos adicionales relevantes en el esquema para este atributo.",
        )
        suggested_prompts_bullets = _format_bullets(
            suggested_prompts,
            "Puedes reformular la consulta usando otra métrica disponible (por ejemplo, estado del proyecto).",
        )

        limitation_note_text = limitation_note or "Sin notas adicionales."

        chain = create_chain(
            gray_zone_block_prompt,
            [
                "question",
                "missing_attribute",
                "rationale",
                "proxies_bullets",
                "schema_fields_bullets",
                "suggested_prompts_bullets",
                "country_code",
                "original_language_iso",
                "limitation_note",
            ],
        )

        response_text = safe_invoke(
            chain,
            {
                "question": question,
                "missing_attribute": missing_attribute,
                "rationale": rationale,
                "proxies_bullets": proxies_bullets,
                "schema_fields_bullets": schema_fields_bullets,
                "suggested_prompts_bullets": suggested_prompts_bullets,
                "country_code": country_code,
                "original_language_iso": original_language_iso,
                "limitation_note": limitation_note_text,
            },
        )

        if hasattr(response_text, "content"):
            response_text = response_text.content
        message = str(response_text).strip()
        details["message_type"] = "block"
        _set_gray_zone_details(state, details)

        logger.info("FLOW ▸ GRAY END path=block")
        return {
            "messages": [AIMessage(content=message or limitation_note)],
            "gray_zone_details": details,
            "response_type": "gray_zone_block",
        }

    # ───────────────────────────────────────────────────────────────────
    # Zero rows / aclaraciones post-fetch (respuesta textual guiada)
    # ───────────────────────────────────────────────────────────────────
    messages = state.get("messages") or []
    sql_response = (
        messages[-1].content if messages else "Resultados: []\nTotal de Filas: 0"
    )

    # Mejorar la detección de zero rows para considerar todos los casos
    rowcount = _get_sql_rowcount(state) or 0
    is_zero_rows = (
        rowcount == 0
        and reason in {"NO_ROWS_FILTERED", None, ""}
        and decision_status not in {"block"}
    )

    # Solo usar respuesta textual si realmente hay indicios de búsqueda por nombre/tema
    # y no es un caso de bloqueo
    if (
        is_zero_rows
        and not decision_status == "block"
        and (
            (theme_strategy and theme_strategy.get("keywords"))
            or decision_status in {"proceed", "proceed_with_warning"}
            or use_textual
        )
    ):
        # Si no vino theme_strategy, poblamos defaults + keywords de fallback
        keywords = (theme_strategy.get("keywords") or []) if theme_strategy else []
        if not keywords:
            try:
                # Usa las mismas heurísticas que el fallback SQL (si existen)
                keywords = _collect_fallback_keywords(state) or []
            except Exception as _ek:
                logger.warning(f"No se pudieron generar keywords de fallback: {_ek}")
                keywords = []
        logger.info("FLOW ▸ GRAY path=no_rows_textual keywords={}", keywords)

        search_fields = (
            (theme_strategy.get("search_fields") or []) if theme_strategy else []
        )
        if not search_fields:
            search_fields = [
                "nombre_proyecto",
                "objetivo_proyecto",
                "nombreentidadejecutora_proyecto",
            ]

        territory_filters = (
            theme_strategy.get("territory_filters") if theme_strategy else []
        )
        year_filters = theme_strategy.get("year_filters") if theme_strategy else {}

        suggested_prompts = decision.get("suggested_user_prompts") or []
        rationale = (
            decision.get("rationale")
            or limitation_note
            or "Sin resultados con los filtros actuales."
        )
        uncertainty_messages: list[str] = []
        for item in uncertainties:
            msg = (item.get("message") or "").strip()
            action = (item.get("action") or "").strip()
            combined_parts = [fragment for fragment in (msg, action) if fragment]
            if combined_parts:
                uncertainty_messages.append(" ".join(combined_parts))

        chain = create_chain(
            gray_zone_textual_prompt,
            [
                "question",
                "rationale",
                "keywords",
                "search_fields",
                "territory_filters",
                "year_filters",
                "uncertainties",
                "suggested_prompts",
                "country_code",
                "original_language_iso",
            ],
        )

        response_text = safe_invoke(
            chain,
            {
                "question": question,
                "rationale": rationale,
                "keywords": keywords,
                "search_fields": search_fields,
                "territory_filters": territory_filters or [],
                "year_filters": year_filters or {},
                "uncertainties": uncertainty_messages,
                "suggested_prompts": suggested_prompts,
                "country_code": country_code,
                "original_language_iso": original_language_iso,
            },
        )

        if hasattr(response_text, "content"):
            response_text = response_text.content
        message = str(response_text).strip()
        details["message_type"] = "no_rows_textual"
        _set_gray_zone_details(state, details)

        logger.info("FLOW ▸ GRAY END path=no_rows_textual")
        return {
            "messages": [AIMessage(content=message or limitation_note)],
            "gray_zone_details": details,
            "response_type": "gray_zone_fallback",
        }

    # ───────────────────────────────────────────────────────────────────
    # Zero rows por defecto (plantilla no_rows)
    # ───────────────────────────────────────────────────────────────────
    logger.info("FLOW ▸ GRAY path=no_rows_default")

    # Generate analyzer summary for the prompt
    analyzer_text = _get_effective_analysis_text(state)
    analyzer_summary = summarize_analyzer_for_response(
        analyzer_text, original_language_iso
    )

    chain = create_chain(
        user_response_norows_prompt,
        [
            "sql_response",
            "question",
            "original_language_iso",
            "country_code",
            "sql_query",
            "limitation_note",
            "analyzer_summary",
        ],
        schema=process_user_question,
    )

    response = safe_invoke(
        chain,
        {
            "sql_response": sql_response,
            "question": question,
            "original_language_iso": original_language_iso,
            "country_code": country_code,
            "sql_query": sql_query,
            "limitation_note": limitation_note,
            "analyzer_summary": analyzer_summary,
        },
    )

    parts: list[str] = []
    contextual_intro = getattr(response, "contextual_introduction", "")
    if contextual_intro:
        parts.append(contextual_intro.strip())
    summary = getattr(response, "summary", "")
    if summary:
        parts.append(summary.strip())

    final_content = "\n\n".join(parts).strip()
    if limitation_note and limitation_note not in final_content:
        final_content = f"{final_content}\n\n{limitation_note}".strip()

    final_content = re.sub(r"(?i)summary", "", final_content).strip()

    details["message_type"] = "no_rows_default"
    _set_gray_zone_details(state, details)

    logger.info("FLOW ▸ GRAY END path=no_rows_default")
    return {
        "messages": [AIMessage(content=final_content or limitation_note)],
        "gray_zone_details": details,
        "response_type": "gray_zone_norows",
    }


def generate_question_summary(state: AgentState):
    """
    Generates a summary of the complete question if it's too long (more than 10 words).
    """

    logger.info("FLOW ▸ SUMMARY START")
    question = state["complete_user_question"]

    if len(question.split()) > MIN_WORD_COUNT_FOR_SUMMARY:
        chain = create_chain(
            generate_question_summary_prompt, ["question"], schema=question_summary
        )
        response: question_summary = invoke_llm_chain(
            chain,
            {"question": question},
            label="postfetch.question_summary",
        )
        logger.info("FLOW ▸ SUMMARY END shortened=True")
        return {"summary": response.summary}
    else:
        logger.info("FLOW ▸ SUMMARY END shortened=False")
        return {"summary": question}


def definitions_lookup(state: AgentState):
    """
    Nodo que busca conceptos y definiciones EXCLUSIVAMENTE en un archivo Markdown.
    NO utiliza conocimiento del modelo LLM, solo información del documento fuente.

    Flujo:
    1. Lee archivo concepts_definitions_v1.0.md
    2. Invoca LLM con instrucciones estrictas anti-alucinación
    3. Valida confianza de la respuesta
    4. Retorna definición estructurada o mensaje de "no encontrado"

    Returns:
        Dict con: messages (respuesta formateada), response_type, stop_processing
    """

    from modules.schemas.schemas import DefinitionLookup
    from modules.graph.prompts_postfetch import definitions_lookup_prompt

    logger.info("FLOW ▸ DEFINITIONS_LOOKUP START")

    # CRITICAL: Extraer ambas versiones de la pregunta para preservar contexto
    # - user_question_raw: pregunta original sin enriquecer (tal como la escribió el usuario)
    # - user_question_complete: pregunta enriquecida con historial conversacional
    # Esto permite al LLM usar keywords exactos de la raw y contexto semántico de la complete
    user_question_raw = state.get("user_question", "")
    user_question_complete = state.get("complete_user_question", "")

    # Si complete no existe, usar raw en ambos casos (primera interacción o flujo legacy)
    if not user_question_complete:
        user_question_complete = user_question_raw

    if not user_question_raw:
        logger.warning("FLOW ▸ DEFINITIONS_LOOKUP no user_question in state")
        return {
            "messages": [AIMessage(content="No se recibió ninguna consulta.")],
            "response_type": "definitions_error",
            "stop_processing": True,
        }

    # Logging mejorado para observabilidad
    logger.info(
        "FLOW ▸ DEFINITIONS_LOOKUP raw='{}' complete='{}'",
        user_question_raw[:60],
        user_question_complete[:80],
    )

    # Obtener documento de definiciones desde caché en memoria
    try:
        document_content, source_path = _load_definitions_markdown()
        logger.debug(
            "FLOW ▸ DEFINITIONS_LOOKUP using_cached_document len={} file={}",
            len(document_content),
            source_path,
        )
    except Exception as e:
        logger.error(f"FLOW ▸ DEFINITIONS_LOOKUP definitions_load_failed: {e}")
        return {
            "messages": [
                AIMessage(
                    content="El archivo de definiciones no está disponible temporalmente."
                )
            ],
            "response_type": "definitions_error",
            "stop_processing": True,
        }

    # Invocar LLM con prompt estricto (pasando ambas versiones de la pregunta)
    chain = create_chain(
        definitions_lookup_prompt,
        ["user_query_raw", "user_query_complete", "document_content"],
        schema=DefinitionLookup,
    )

    try:
        response: DefinitionLookup = invoke_llm_chain(
            chain,
            {
                "user_query_raw": user_question_raw,
                "user_query_complete": user_question_complete,
                "document_content": document_content,
            },
            label="postfetch.definitions_lookup",
        )

        logger.info(
            f"FLOW ▸ DEFINITIONS_LOOKUP result: concept={response.concept}, confidence={response.confidence}"
        )

        # Validar confianza
        if response.confidence == "not_found":
            message = (
                f"❌ **Concepto no encontrado**\n\n"
                f'El concepto *"{response.concept}"* no está disponible en la documentación actual.\n\n'
                f"Conceptos disponibles incluyen: Proyecto de Inversión Pública, Estado de Proyecto, Sector, "
                f"Entidad Ejecutora, Fuente de Financiamiento, entre otros.\n\n"
                f"¿Te gustaría consultar alguno de estos conceptos?"
            )
            logger.info("FLOW ▸ DEFINITIONS_LOOKUP END confidence=not_found")
            return {
                "messages": [AIMessage(content=message)],
                "response_type": "definitions_not_found",
                "stop_processing": True,
            }

        # Formatear respuesta exitosa
        confidence_emoji = {
            "high": "",
            "medium": "",
            "low": "",
        }.get(response.confidence, "")

        parts = []
        parts.append(f"{confidence_emoji} **{response.concept}**")
        parts.append(f"\n{response.definition}")

        if response.source_section:
            parts.append(f"\n\n📄 *Fuente: {response.source_section}*")

        if response.notes:
            parts.append(f"\n\n💡 *Nota: {response.notes}*")

        if response.confidence == "low":
            parts.append(
                "\n\nLa coincidencia es ambigua. ¿Podrías especificar mejor el concepto que buscas?"
            )

        final_message = "".join(parts)

        logger.info("FLOW ▸ DEFINITIONS_LOOKUP END success=True")
        return {
            "messages": [AIMessage(content=final_message)],
            "response_type": "definitions_found",
            "stop_processing": True,
            "definition_lookup": {
                "concept": response.concept,
                "confidence": response.confidence,
                "source_section": response.source_section,
            },
        }

    except Exception as e:
        logger.error(
            f"FLOW ▸ DEFINITIONS_LOOKUP error invoking LLM: {e}\n{traceback.format_exc()}"
        )
        return {
            "messages": [
                AIMessage(
                    content="Ocurrió un error al buscar la definición. Intenta nuevamente."
                )
            ],
            "response_type": "definitions_error",
            "stop_processing": True,
        }


# ---------------
# Auto‑decoramos TODAS las funciones‑nodo para que impriman un log de entrada
# y salida.  Añadimos un flag interno `_is_traced` para no envolver dos veces.
import inspect, sys

_TRACE_PREFIXES = (
    "generate_",
    "classify_",
    "retrieve_",
    "select_",
    "choose_",
    "fetch_",
    "process_",
    "regenerate_",
    "send_",
    "handle_",
    "llm_",
)

for _name, _fn in inspect.getmembers(sys.modules[__name__], inspect.isfunction):
    if _name.startswith(_TRACE_PREFIXES) and not getattr(_fn, "_is_traced", False):
        wrapped = trace_node(_name)(_fn)
        wrapped._is_traced = True  # evita doble decoración
        setattr(sys.modules[__name__], _name, wrapped)


def _citizen_rule_matches(rule: dict[str, Any], signals: dict[str, Any]) -> bool:
    """Evalúa si una regla de citizen review coincide con las señales actuales.

    Mejorado para manejar nuevas condiciones:
    - has_low_relevance
    - used_fallback combinado con otras condiciones
    """
    conditions = rule.get("conditions") or {}

    # Condiciones existentes
    if conditions.get("coverage_warning") and not signals.get("coverage_warning"):
        return False
    if conditions.get("used_keyword_regenerate") and not signals.get(
        "used_keyword_regenerate"
    ):
        return False
    if conditions.get("has_uncertainty_actions") and not (
        signals.get("uncertainty_actions") or []
    ):
        return False
    if conditions.get("has_missing_keywords") and not (
        signals.get("missing_keywords") or []
    ):
        return False
    if conditions.get("has_duplicate_hint") and not signals.get("duplicate_hint"):
        return False
    if conditions.get("has_soft_missing_filters") and not (
        signals.get("soft_missing_filters") or []
    ):
        return False

    # Nuevas condiciones
    if conditions.get("has_low_relevance") and not signals.get("has_low_relevance"):
        return False
    if conditions.get("theme_keywords_used") and not signals.get("theme_keywords_used"):
        return False

    if conditions.get("used_fallback") is not None:
        if conditions.get("used_fallback") != signals.get("used_fallback", False):
            return False

    rowcount_gt = conditions.get("rowcount_gt")
    if rowcount_gt is not None:
        if not ((signals.get("rowcount") or 0) > rowcount_gt):
            return False

    return True


def _build_citizen_note_fragment(kind: str, signals: dict[str, Any]) -> str:
    if kind == "coverage_warning":
        rowcount = signals.get("rowcount") or 0
        rows_displayed = signals.get("rows_displayed")
        rows_limit_applied = signals.get("rows_limit_applied")
        shown = (
            rows_displayed
            or rows_limit_applied
            or (min(rowcount, rows_limit_applied) if rows_limit_applied else None)
            or rowcount
        )
        if not shown and rows_limit_applied:
            shown = rows_limit_applied
        if not shown:
            shown = rowcount or 0
        return (
            f"Estoy mostrando {shown} de {rowcount} registros como vista previa. "
            "Puede pedirme un filtro extra o ampliar el tope si necesita ver más."
        )
    if kind == "keyword_regenerate":
        tokens = signals.get("keyword_tokens_tried") or []
        if tokens:
            token_text = ", ".join(tokens[:3])
            return (
                f"Aclaración: amplié la búsqueda con coincidencia parcial usando {token_text}. "
                "Revise que la lista coincida con lo que esperaba."
            )
        return "Aclaración: amplié la búsqueda con coincidencia parcial porque los filtros exactos no devolvieron resultados."
    if kind == "possible_false_positives":
        return (
            "Advertencia: la búsqueda pudo incluir resultados con coincidencias parciales de palabras. "
            "Si ve proyectos irrelevantes, considere reformular la consulta con términos más específicos."
        )
    if kind == "uncertainty_pending":
        return "El analizador detectó dudas pendientes; si desea, podemos seguir aclarando un criterio antes de cerrar."
    if kind == "missing_keywords":
        missing = signals.get("missing_keywords") or []
        sample = ", ".join(missing[:3])
        if not sample:
            return ""
        return f"📌 Puede añadir datos para {sample} o seleccionar uno de los filtros sugeridos para afinar la búsqueda."
    if kind == "duplicate_hint":
        return "🔁 Noté proyectos repetidos porque comparten varios registros; puedo mostrarte cada uno solo una vez."
    return ""


def _build_soft_missing_filter_chips(signals: dict[str, Any]) -> list[dict[str, Any]]:
    chips: list[dict[str, Any]] = []
    for filt in signals.get("soft_missing_filters") or []:
        column = str(filt.get("column") or "").strip()
        value = str(filt.get("value") or "").strip()
        if not (column or value):
            continue
        label = value or column
        chips.append(
            {
                "label": f"Filtrar por {label}",
                "column": column,
                "value": value,
                "suggested_prompt": f"Filtrá por {label}",
            }
        )
    return chips


def _apply_citizen_action(
    action: str,
    signals: dict[str, Any],
    actions: list[str],
    action_details: dict[str, Any],
) -> None:
    action = action.strip().lower()
    if action == "highlight_warning":
        actions.append("highlight_warning")
        return
    if action == "offer_increase_limit":
        actions.append("offer_increase_limit")
        candidate_limits: list[int] = []
        rows_limit_applied = signals.get("rows_limit_applied")
        max_limit = signals.get("rows_limit_max") or rows_limit_applied
        rowcount = signals.get("rowcount") or 0
        for option in [10, 20, 40, rowcount]:
            if not option:
                continue
            if rows_limit_applied and option <= rows_limit_applied:
                continue
            if max_limit and option > max_limit:
                continue
            candidate_limits.append(option)
        if candidate_limits:
            candidate_limits = sorted(set(candidate_limits))
            best_limit = candidate_limits[0]
            action_details["offer_increase_limit"] = [
                {
                    "label": f"Ver {best_limit} resultados",
                    "limit": best_limit,
                    "suggested_prompt": f"Mostrame los primeros {best_limit} resultados",
                }
            ]
        return
    if action == "show_filter_chips":
        chips = _build_soft_missing_filter_chips(signals)
        if chips:
            actions.append("show_filter_chips")
            action_details.setdefault("show_filter_chips", chips[:2])
        return
    if action == "show_filter_chips_from_missing":
        missing = signals.get("missing_keywords") or []
        if not missing:
            return
        chips = [
            {
                "label": f"Filtrar por {item}",
                "column": "",
                "value": item,
                "suggested_prompt": f"Filtrá por {item}",
            }
            for item in missing[:2]
            if item
        ]
        if chips:
            actions.append("show_filter_chips")
            existing = action_details.get("show_filter_chips") or []
            action_details["show_filter_chips"] = (existing + chips)[:2]
        return
    if action == "reintentar_con_filtros_ajustados":
        actions.append("reintentar_con_filtros_ajustados")
        action_details["reintentar_con_filtros_ajustados"] = {
            "label": "Reintentar con filtros ajustados",
            "suggested_prompt": "Reintentar con filtros más específicos para evitar resultados irrelevantes",
            # Hacer más prominente: explicar que se ajustarán los filtros automáticamente
            "description": "Ajustaré los filtros automáticamente para buscar proyectos más específicos",
        }
        return
    if action == "suggest_clarification":
        unresolved = signals.get("uncertainty_actions") or []
        if not unresolved:
            return
        actions.append("suggest_clarification")
        clarification_suggestions: list[dict[str, Any]] = []
        for item in unresolved[:2]:
            action_text = (item.get("action") or item.get("message") or "").strip()
            column = str(item.get("column") or "").strip()
            value = str(item.get("value") or "").strip()
            label = (
                action_text or (column and f"Aclarar {column}") or "Aclarar criterio"
            )
            prompt_text = action_text or ""
            if column and value:
                prompt_text = f"Confirme {column}: {value}"
            if not prompt_text:
                prompt_text = "Aclarar un criterio pendiente"
            clarification_suggestions.append(
                {
                    "label": label,
                    "column": column,
                    "value": value,
                    "suggested_prompt": prompt_text,
                }
            )
        if clarification_suggestions:
            action_details["suggest_clarification"] = clarification_suggestions
        return
    if action == "dedupe_unique_results":
        duplicate_hint = signals.get("duplicate_hint")
        if not isinstance(duplicate_hint, dict):
            return
        actions.append("dedupe_unique_results")
        action_details.setdefault(
            "dedupe_unique_results",
            [
                {
                    "label": "Ver proyectos únicos",
                    "suggested_prompt": "Mostrame los proyectos únicos sin repetir territorios",
                    "column": duplicate_hint.get("column"),
                    "sample_total": duplicate_hint.get("sample_total"),
                    "sample_unique": duplicate_hint.get("sample_unique"),
                }
            ],
        )
