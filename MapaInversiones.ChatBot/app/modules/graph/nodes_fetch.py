# nodes_fetch.py
# Nodos de la etapa de fetch: generación/selección SQL, ejecución y manejo de zona gris.

from __future__ import annotations

from typing import Any, Dict, List

import json
import re

import backoff
from loguru import logger
from langchain_core.messages import AIMessage

from modules.config import settings
from modules.graph.state import AgentState
from modules.utils.db_utils import (
    execute_sql_query,
    prepare_sql_for_execution,
)
from modules.graph.prompts_fetch import (
    build_generate_sql_query_prompt,
    build_keyword_regenerate_prompt,
    build_trigram_regenerate_prompt,
    build_regenerate_query_prompt,
    choose_sql_prompt,
)
from modules.schemas.schemas import sql_query, SqlChoiceSchema
from modules.graph.helpers import *  # noqa: F401,F403
from modules.graph.helpers_sql import parse_pg_error  # noqa: F401
from modules.graph.helpers_sql import _cascade_text_search  # Cascade search

# Explicit imports (circular import workaround)
from modules.graph.helpers_estado import (
    _get_analysis_filters,
    _get_analysis_modules,
    _set_analysis_modules,
    _get_analyzer_tables,
    _get_assistance_metadata,
    _get_blocked_catalog_tokens,
    _get_catalog_applied_columns,
    _get_effective_analysis_text,
    _get_gray_zone_details,
    _get_gray_zone_non_mappable,
    _get_gray_zone_reason,
    _get_irrelevant_retry_count,
    _get_keyword_tokens_tried,
    _get_keyword_used,
    _get_relaxed_catalog_columns,
    _get_rows_limit_applied,
    _get_rows_limit_default,
    _get_rows_limit_max,
    _get_rows_removed_sample,
    _get_semantic_or_groups,
    _get_sql_candidates,
    _get_sql_displayed_count,
    _get_sql_error,
    _get_sql_query,
    _get_sql_query_raw,
    _get_sql_rowcount,
    _get_sql_scored_list,
    _get_theme_strategy,
    _get_user_assistance,
    _set_assistance_needed,
    _set_gray_zone_decision,
    _set_gray_zone_details,
    _set_gray_zone_non_mappable,
    _set_gray_zone_reason,
    _set_gray_zone_warnings,
    _set_keyword_tokens_tried,
    _set_keyword_used,
    _set_relaxed_catalog_columns,
    _set_rows_limit_applied,
    _set_sql_best,
    _set_sql_candidates,
    _set_sql_execution,
    _set_sql_query,
    _set_sql_scored_list,
    _store_catalog_applied_columns,
    _clear_keyword_regeneration,
    _record_duplicate_hint,
    _collect_fallback_keywords,
)
from modules.graph.helpers_texto import (
    _normalize_column_name,
    _norm_for_dedupe,
    _filter_keywords_for_text_search,
)
from modules.graph.helpers_sql import (
    _apply_catalog_equals_to_sql,
    _apply_refined_filters_to_sql,
    _apply_structured_text_filters,
    _build_fallback_sql,
    _build_keyword_regeneration_sql_from_theme,
    _derive_modules_from_analyzer,
    _ensure_country_filter,
    _ensure_distinct_on_multijoin,
    _sanitize_iso_code_sql,
    _filter_schema_json,
    _find_missing_filters,
    _has_only_catalog_filters,
    _prep_for_preview,
    _score_query,
)
from modules.graph.helpers_respuesta import (
    _build_dimension_prompt_payload,
    _infer_gray_zone_reason,
    _is_zero_payload,
    _prepare_post_fetch_clarification,
    _prioritize_reevaluacion,
)
from constants.nodes import MISSING_DATA_ERROR, NO_DATA_RESPONSE
from modules.utils.build_schema_enriched import (
    SCHEMA_MINIMAL_JSON,
    INTERMEDIATE_SCHEMA_JSON,
)
from modules.utils.llm_guardrails import invoke_llm_chain

NUM_SQL_CANDIDATES = 2


def generate_sql_query(state: AgentState):
    """
    Generates a SQL query based on the user's question, retrieved documents, and country code.
    - Usa documentos y fewshots dinámicos.
    - Filtra el schema a las tablas relevantes detectadas por el analyzer.
    - Aplica limpieza de la SQL resultante.
    - Enforce de filtros faltantes detectados por el analyzer (una pasada); si faltan, deriva a regenerate_query().
    """
    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT START country={}",
        state.get("country_code"),
    )

    # 1) Inputs principales
    question = (state.get("complete_user_question") or "").strip()
    docs = (state.get("documents") or "").strip()
    docs_fewshots = (state.get("documents_fewshots") or "").strip()
    dynamic_fewshots = (state.get("dynamic_fewshots") or "").strip()
    country_code = (state.get("country_code") or "").strip()

    # Schema filtrado por tablas del analyzer
    tables_set = _get_analyzer_tables(state)
    schema_minimal_filtered = _filter_schema_json(
        state.get("schema_minimal_json") or SCHEMA_MINIMAL_JSON, tables_set
    )
    schema_intermediate_filtered = _filter_schema_json(
        state.get("schema_intermediate_json") or INTERMEDIATE_SCHEMA_JSON, tables_set
    )
    state["schema_minimal_json"] = schema_minimal_filtered
    state["schema_intermediate_json"] = schema_intermediate_filtered

    schema_json = schema_minimal_filtered
    analysis = _get_effective_analysis_text(state, "{}")

    # Inyectar información de optimización de joins en el analysis
    join_opt_enabled = state.get("join_optimization_enabled", True)
    filters_by_table = state.get("filters_by_table", {})

    if join_opt_enabled and filters_by_table:
        has_base_filters = len(filters_by_table.get("p", [])) > 0
        has_territorial_filters = len(filters_by_table.get("t", [])) > 0
        has_funding_filters = len(filters_by_table.get("f", [])) > 0

        if has_base_filters and (has_territorial_filters or has_funding_filters):
            join_opt_note = "\n\n### JOIN OPTIMIZATION ENABLED\n"
            join_opt_note += f"- Base table filters (p.*): {len(filters_by_table.get('p', []))} filters\n"
            if has_territorial_filters:
                join_opt_note += f"- Territorial filters (t.*): {len(filters_by_table.get('t', []))} filters → Move to ON clause\n"
            if has_funding_filters:
                join_opt_note += f"- Funding filters (f.*): {len(filters_by_table.get('f', []))} filters → Move to ON clause\n"
            join_opt_note += "- Apply base filters in WHERE, then join with ON clause filters for performance.\n"

            analysis = analysis + join_opt_note

            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT JOIN_OPT injected base={} territorial={} funding={}",
                len(filters_by_table.get("p", [])),
                len(filters_by_table.get("t", [])),
                len(filters_by_table.get("f", [])),
            )

    sql_rows_limit = (
        _get_rows_limit_applied(state)
        or _get_rows_limit_default(state)
        or settings.sql_rows_limit
    )

    dimension_payload = _build_dimension_prompt_payload(state)
    dimension_summary = dimension_payload.get("summary") or ""
    dimension_catalog_subset = dimension_payload.get("catalog") or {}
    dimension_vocab = dimension_payload.get("vocabulary") or {}

    # 2) Validaciones mínimas
    if not question:
        return {"messages": [AIMessage(content=MISSING_DATA_ERROR)]}
    if not docs:
        logger.warning("\n\n ---> SQL ▸ ONE_SHOT docs_empty=True")

    # 3) Contexto (fewshots priorizados + docs)
    combined_fewshots = docs_fewshots
    if dynamic_fewshots:
        blocks = [f"PRIORITY FEWSHOTS\n{dynamic_fewshots}"]
        if docs_fewshots:
            blocks.append(docs_fewshots)
        combined_fewshots = "\n\n".join(blocks)

    # 3.5) Derivar flags modulares de forma determinista desde analyzer_tables
    # Fuerza unique_lookup si hay filtros por ID/SNIP aunque el analyzer no lo marcara
    if not state.get("unique_lookup"):
        for f in _get_analysis_filters(state) or []:
            col_norm = _normalize_column_name(str(f.get("column") or ""))
            if col_norm in {"codigo_snip", "id_proyecto"}:
                state["unique_lookup"] = True
                logger.info("SQL ▸ UNIQUE_LOOKUP inferred from analysis filters")
                break

    _derive_modules_from_analyzer(state, tables_set)
    modules = _get_analysis_modules(state)
    if state.get("unique_lookup"):
        tables_set = {BASE_PROJECT_TABLE}
        modules["territory"] = False
        modules["funding"] = False
        _set_analysis_modules(state, territory=False, funding=False)
        logger.info(
            "\n\n ---> SQL ▸ UNIQUE_LOOKUP enforcing base table only (no territory/funding)"
        )

    # ═══════════════════════════════════════════════════════════════
    # FUNDING KEYWORD OVERRIDE: Si el analyzer detectó keywords que matchean
    # con fuentes de financiamiento, forzar funding=True para JOIN
    # ═══════════════════════════════════════════════════════════════
    if state.get("funding_keyword_detected") and not state.get("unique_lookup"):
        modules["funding"] = True
        _set_analysis_modules(
            state, territory=modules.get("territory", False), funding=True
        )
        logger.info(
            "\n\n ---> SQL ▸ FUNDING_KEYWORD_OVERRIDE modules.funding=True matches={}",
            len(state.get("funding_keyword_matches", [])),
        )

    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT modules (derived, analyzer_tables) territorial={} funding={} from tables={}",
        modules.get("territory", False),
        modules.get("funding", False),
        sorted([t.lower() for t in (tables_set or [])]),
    )

    # 3.6) Construir theme_instruction para inyectar en el prompt
    theme_strategy = _get_theme_strategy(state)
    semantic_or_groups = _get_semantic_or_groups(state)
    theme_fields = theme_strategy.get("search_fields") or []
    raw_theme_keywords = theme_strategy.get("keywords", [])
    blocked_tokens = _get_blocked_catalog_tokens(state)
    theme_keywords = _filter_keywords_for_text_search(
        raw_theme_keywords, blocked_tokens
    )
    if raw_theme_keywords and len(theme_keywords) != len(raw_theme_keywords):
        logger.info(
            "\n\n ---> SQL ▸ ONE_SHOT theme_keywords_catalog_filtered before={} after={}",
            len(raw_theme_keywords),
            len(theme_keywords),
        )

    # NEW: Optimize SQL by limiting keywords and columns
    max_sql_kw = settings.max_sql_keywords
    max_sql_cols = settings.max_sql_columns

    sql_keywords = theme_keywords[:max_sql_kw] if theme_keywords else []
    flashrank_keywords = theme_keywords  # Keep all for semantic search
    sql_priority_cols = settings.sql_priority_columns[:max_sql_cols]

    # Store in state for Flashrank to use full context
    state["theme_keywords_for_flashrank"] = flashrank_keywords
    state["theme_keywords_for_sql"] = sql_keywords
    state["theme_columns_for_sql"] = sql_priority_cols

    if theme_keywords:
        logger.info(
            "\n\n ---> SQL ▸ ONE_SHOT theme_optimization "
            "total_keywords={} sql_keywords={} total_columns={} sql_columns={}",
            len(theme_keywords),
            len(sql_keywords),
            len(theme_fields),
            len(sql_priority_cols),
        )

    state["theme_keywords_used"] = bool(sql_keywords)
    theme_notes = theme_strategy.get("notes", "")

    # Helper: detectar si los FILTROS del analyzer son de catálogo
    def _has_only_catalog_filters() -> bool:
        """
        Detecta si TODOS los filtros del analyzer son de catálogo.
        Si solo hay filtros de catálogo (sector, estado, país), NO inyectar theme_instruction.
        """
        CATALOG_FIELDS = {"nombresector_proyecto", "estado_proyecto", "pais_iso3"}
        FREE_TEXT_FIELDS = {
            "nombre_proyecto",
            "objetivo_proyecto",
            "nombreentidadejecutora_proyecto",
        }

        analyzer_filters = _get_analysis_filters(state)
        if not analyzer_filters:
            return False

        # Extraer columnas de filtros con alta confianza (>= 0.7)
        high_conf_columns = []
        for f in analyzer_filters:
            conf = f.get("confidence", 0.0)
            if conf >= 0.7:
                col_raw = f.get("column", "")
                # Extraer nombre de columna (quitando process_text, alias, etc.)
                col_match = re.search(
                    r"([a-z_]+proyecto|[a-z_]+sector|[a-z_]+estado|pais_iso3)",
                    col_raw,
                    re.IGNORECASE,
                )
                if col_match:
                    col_name = col_match.group(1).lower()
                    high_conf_columns.append(col_name)

        if not high_conf_columns:
            return False

        # Si TODOS los filtros son de catálogo, retornar True
        all_catalog = all(col in CATALOG_FIELDS for col in high_conf_columns)

        # Si hay algún filtro de texto libre, retornar False (necesita expansión)
        has_freetext = any(col in FREE_TEXT_FIELDS for col in high_conf_columns)

        return all_catalog and not has_freetext

    theme_instruction = ""
    # Solo inyectar si: 1+ sql_keywords Y hay filtros de texto libre
    if len(sql_keywords) >= 1 and not _has_only_catalog_filters():
        keywords_display = '", "'.join(sql_keywords)  # Limited keywords for SQL

        # Apply cap and prioritize text fields for the prompt (so LLM sees a compact list)
        max_fields_cfg = getattr(settings, "max_keyword_fields", 3)
        try:
            max_fields_cfg = int(max_fields_cfg)
        except Exception:
            max_fields_cfg = 3

        # Filter to only priority columns
        sql_col_bases = [col.replace("_", "").lower() for col in sql_priority_cols]
        cleaned_tf: list[str] = []
        seen_tf: set[str] = set()
        for f in theme_fields or []:
            if not f:
                continue
            ff = str(f).strip()
            if ff in seen_tf:
                continue
            # Only include if matches priority columns
            field_base = ff.split(".")[-1].lower().replace("_", "")
            if any(col_base in field_base for col_base in sql_col_bases):
                seen_tf.add(ff)
                cleaned_tf.append(ff)

        # ═══════════════════════════════════════════════════════════════
        # FUNDING KEYWORD: Si hay matches con fuentes de financiamiento,
        # agregar campos de funding al conjunto de campos a buscar
        # ═══════════════════════════════════════════════════════════════
        if state.get("funding_keyword_detected"):
            funding_search_fields = ["f.fuente_financiacion", "f.organismo_financiador"]
            for ff in funding_search_fields:
                if ff not in seen_tf:
                    seen_tf.add(ff)
                    cleaned_tf.append(ff)
            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT funding_fields_added fields={}",
                funding_search_fields,
            )

        # ═══════════════════════════════════════════════════════════════
        # SECTOR KEYWORD: Si hay matches con sectores,
        # agregar nombresector_proyecto al conjunto de campos a buscar
        # ═══════════════════════════════════════════════════════════════
        sector_matches = state.get("sector_keyword_matches", [])
        if state.get("sector_keyword_detected") and sector_matches:
            sector_field = "p.nombresector_proyecto"
            if sector_field not in seen_tf:
                seen_tf.add(sector_field)
                cleaned_tf.append(sector_field)
            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT sector_field_added field={} matches={}",
                sector_field,
                [m.get("matched_sector", "")[:30] for m in sector_matches],
            )

        # ═══════════════════════════════════════════════════════════════
        # ENTITY KEYWORD: Si hay matches con entidades ejecutoras,
        # agregar nombreentidadejecutora_proyecto al conjunto de campos a buscar
        # ═══════════════════════════════════════════════════════════════
        entity_matches = state.get("entity_keyword_matches", [])
        if state.get("entity_keyword_detected") and entity_matches:
            entity_field = "p.nombreentidadejecutora_proyecto"
            if entity_field not in seen_tf:
                seen_tf.add(entity_field)
                cleaned_tf.append(entity_field)
            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT entity_field_added field={} matches={}",
                entity_field,
                [m.get("matched_entity", "")[:40] for m in entity_matches],
            )

        used_tf = cleaned_tf[: max_sql_cols + 2]  # Allow extra cols for funding
        dropped_tf = cleaned_tf[max_sql_cols + 2 :]
        state["theme_fields_prompt_used"] = used_tf
        state["theme_fields_prompt_dropped"] = dropped_tf

        fields_display = (
            ", ".join(used_tf) if used_tf else "nombre_proyecto, objetivo_proyecto"
        )

        # Generar ejemplo dinámicamente basado en cantidad de keywords
        # Caso 1: Solo 1 keyword (simplificado)
        if len(sql_keywords) == 1:
            kw = sql_keywords[0].replace("'", "''")

            # Construir ejemplo dinámico basado en campos disponibles
            # ILIKE con process_text en ambos lados para búsqueda de keywords
            exists_blocks = [
                f"process_text(p.nombre_proyecto) ILIKE '%' || process_text('{kw}') || '%'",
                f"process_text(p.objetivo_proyecto) ILIKE '%' || process_text('{kw}') || '%'",
            ]

            # Si hay funding_keyword_detected, agregar búsqueda en fuentes
            if state.get("funding_keyword_detected"):
                exists_blocks.append(
                    f"process_text(f.fuente_financiacion) ILIKE '%' || process_text('{kw}') || '%'"
                )
                exists_blocks.append(
                    f"process_text(f.organismo_financiador) ILIKE '%' || process_text('{kw}') || '%'"
                )

            # Si hay sector_keyword_detected, agregar búsqueda en sector
            # Sector usa ILIKE porque matchea contra valores del catálogo (no tokenización)
            sector_matches = state.get("sector_keyword_matches", [])
            if state.get("sector_keyword_detected") and sector_matches:
                matched_sectors = [
                    m.get("matched_sector", "")
                    for m in sector_matches
                    if m.get("matched_sector")
                ]
                for sector_val in matched_sectors:
                    sector_safe = sector_val.replace("'", "''")
                    exists_blocks.append(
                        f"process_text(p.nombresector_proyecto) ILIKE '%' || process_text('{sector_safe}') || '%'"
                    )

            # Si hay entity_keyword_detected, agregar búsqueda en entidad
            # Entidad usa ILIKE porque matchea contra valores del catálogo (no tokenización)
            entity_matches = state.get("entity_keyword_matches", [])
            if state.get("entity_keyword_detected") and entity_matches:
                matched_entities = [
                    m.get("matched_entity", "")
                    for m in entity_matches
                    if m.get("matched_entity")
                ]
                for entity_val in matched_entities:
                    entity_safe = entity_val.replace("'", "''")
                    exists_blocks.append(
                        f"process_text(p.nombreentidadejecutora_proyecto) ILIKE '%' || process_text('{entity_safe}') || '%'"
                    )

            example_where = "\n  OR \n  ".join(exists_blocks)

            theme_instruction = f"""

═══════════════════════════════════════════════════════════════════
CRITICAL INSTRUCTION - KEYWORD SEARCH STRATEGY
═══════════════════════════════════════════════════════════════════

The analyzer detected a single keyword for this search:

Keyword: "{kw}"
Search fields: [{fields_display}]
Strategy: {theme_notes}

**YOU MUST use ILIKE with process_text() on BOTH sides for text matching.**

Example (adapt to your specific query structure):

WHERE (
  {example_where}
)

**CRITICAL RULES:**
1. ALWAYS use pattern: process_text(<alias>.<column>) ILIKE '%' || process_text('value') || '%'
2. Apply process_text() to BOTH the column expression AND the literal value
3. Search across ALL listed fields with OR between them
4. NEVER use ILIKE ANY (ARRAY[...]) - this pattern is FORBIDDEN

═══════════════════════════════════════════════════════════════════
"""
            logger.info(
                f"\n\n ---> SQL ▸ ONE_SHOT theme_expansion injected single_keyword='{kw}' fields={len(used_tf)} funding={state.get('funding_keyword_detected', False)} sector={state.get('sector_keyword_detected', False)} entity={state.get('entity_keyword_detected', False)}"
            )

        # Caso 2: Múltiples keywords (2+)
        else:
            # Generar ejemplos dinámicamente para los sql_keywords (limitados)
            keyword_examples = []
            for i, kw in enumerate(sql_keywords, 1):
                kw_safe = kw.replace("'", "''")

                # Construir bloque ILIKE para este keyword
                exists_parts = [
                    f"process_text(p.nombre_proyecto) ILIKE '%' || process_text('{kw_safe}') || '%'",
                    f"process_text(p.objetivo_proyecto) ILIKE '%' || process_text('{kw_safe}') || '%'",
                ]

                # Si hay funding_keyword_detected, agregar búsqueda en fuentes
                if state.get("funding_keyword_detected"):
                    exists_parts.append(
                        f"process_text(f.fuente_financiacion) ILIKE '%' || process_text('{kw_safe}') || '%'"
                    )
                    exists_parts.append(
                        f"process_text(f.organismo_financiador) ILIKE '%' || process_text('{kw_safe}') || '%'"
                    )

                # Si hay sector_keyword_detected, agregar búsqueda en sector
                sector_matches = state.get("sector_keyword_matches", [])
                if state.get("sector_keyword_detected") and sector_matches:
                    matched_sectors = [
                        m.get("matched_sector", "")
                        for m in sector_matches
                        if m.get("matched_sector")
                    ]
                    for sector_val in matched_sectors:
                        sector_safe = sector_val.replace("'", "''")
                        exists_parts.append(
                            f"process_text(p.nombresector_proyecto) ILIKE '%' || process_text('{sector_safe}') || '%'"
                        )

                # Si hay entity_keyword_detected, agregar búsqueda en entidad
                entity_matches = state.get("entity_keyword_matches", [])
                if state.get("entity_keyword_detected") and entity_matches:
                    matched_entities = [
                        m.get("matched_entity", "")
                        for m in entity_matches
                        if m.get("matched_entity")
                    ]
                    for entity_val in matched_entities:
                        entity_safe = entity_val.replace("'", "''")
                        exists_parts.append(
                            f"process_text(p.nombreentidadejecutora_proyecto) ILIKE '%' || process_text('{entity_safe}') || '%'"
                        )

                exists_block = "\n   OR \n   ".join(exists_parts)
                keyword_examples.append(
                    f"""  -- Keyword {i}: "{kw}"
  ({exists_block})"""
                )

            keyword_block = "\n  OR\n".join(keyword_examples)

            # Note about additional keywords handled by Flashrank
            additional_kw_count = len(flashrank_keywords) - len(sql_keywords)
            additional_note = (
                f"\n\nNote: {additional_kw_count} additional related keywords will be evaluated semantically by the ranking system."
                if additional_kw_count > 0
                else ""
            )

            theme_instruction = f"""

═══════════════════════════════════════════════════════════════════
CRITICAL INSTRUCTION - KEYWORD EXPANSION STRATEGY
═══════════════════════════════════════════════════════════════════

The analyzer detected these PRIMARY keywords for SQL filtering:

Keywords: ["{keywords_display}"]
Search fields: [{fields_display}]
Strategy: {theme_notes}{additional_note}

**YOU MUST generate SQL that searches these keywords with OR logic using ILIKE with process_text().**

Example template (adapt to your specific query structure):

WHERE (
{keyword_block}
)

**CRITICAL RULES:**
1. Use OR between ALL keywords shown above - they are variants/synonyms of the same concept
2. NEVER use AND between these keywords - we want HIGH RECALL, not high precision
3. Each keyword searches across the listed fields with OR
4. ALWAYS use pattern: process_text(<alias>.<column>) ILIKE '%' || process_text('value') || '%'
5. Apply process_text() to BOTH the column expression AND the literal value
6. NEVER use ILIKE ANY (ARRAY[...]) - this pattern is FORBIDDEN
7. ONLY use the fields listed above - do not add additional columns

═══════════════════════════════════════════════════════════════════
"""
            logger.info(
                f"\n\n ---> SQL ▸ ONE_SHOT theme_expansion injected "
                f"keywords={len(sql_keywords)}/{len(flashrank_keywords)} fields={len(used_tf)} funding={state.get('funding_keyword_detected', False)} sector={state.get('sector_keyword_detected', False)} entity={state.get('entity_keyword_detected', False)}"
            )
    elif len(sql_keywords) >= 2 and _has_only_catalog_filters():
        logger.info(
            f"\n\n ---> SQL ▸ ONE_SHOT theme_expansion skipped_catalog_filters sql_keywords={len(sql_keywords)}"
        )
    else:
        logger.info(
            f"\n\n ---> SQL ▸ ONE_SHOT theme_expansion skipped sql_keywords_count={len(sql_keywords)}"
        )

    prompt_inputs = {
        "question": question,
        "schema_json": schema_json,
        "context": f"Country (pais_iso3) : {country_code}\n{docs}\n{theme_instruction}",
        "context_fewshots": combined_fewshots,
        "country_code": country_code,
        "analysis": analysis,
        "sql_rows_limit": sql_rows_limit,
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
    }
    input_keys = [
        "question",
        "schema_json",
        "context",
        "context_fewshots",
        "country_code",
        "analysis",
        "sql_rows_limit",
        "dimension_hints_summary",
        "dimension_hints",
        "dimension_vocabulary",
    ]

    # ═══════════════════════════════════════════════════════════════════════════
    # LOG CONSOLIDADO DE ESTRATEGIA DE SQL - Muestra qué filtros se inyectarán
    # ═══════════════════════════════════════════════════════════════════════════
    sql_strategy_summary = {
        "keywords_for_sql": len(sql_keywords),
        "keywords_for_flashrank": len(flashrank_keywords),
        "theme_fields": len(used_tf) if "used_tf" in dir() else 0,
        "funding_keyword_detected": state.get("funding_keyword_detected", False),
        "sector_keyword_detected": state.get("sector_keyword_detected", False),
        "entity_keyword_detected": state.get("entity_keyword_detected", False),
        "catalog_suggestions": len(state.get("catalog_filter_suggestions", [])),
        "refined_filters": len(state.get("refined_text_filters", [])),
        "unique_lookup": state.get("unique_lookup", False),
        "modules_territory": modules.get("territory", False),
        "modules_funding": modules.get("funding", False),
    }

    logger.info(
        "═══════════════════════════════════════════════════════════════════════════\n"
        "SQL_GEN ▸ FILTER STRATEGY APPLIED\n"
        "  keywords: sql={} flashrank={}\n"
        "  dimension_matches: funding={} sector={} entity={}\n"
        "  catalog_equals: {} | refined_filters: {}\n"
        "  unique_lookup: {} | modules: territory={} funding={}\n"
        "  PATTERN: process_text(col) ILIKE '%%' || process_text('val') || '%%'\n"
        "═══════════════════════════════════════════════════════════════════════════",
        sql_strategy_summary["keywords_for_sql"],
        sql_strategy_summary["keywords_for_flashrank"],
        sql_strategy_summary["funding_keyword_detected"],
        sql_strategy_summary["sector_keyword_detected"],
        sql_strategy_summary["entity_keyword_detected"],
        sql_strategy_summary["catalog_suggestions"],
        sql_strategy_summary["refined_filters"],
        sql_strategy_summary["unique_lookup"],
        sql_strategy_summary["modules_territory"],
        sql_strategy_summary["modules_funding"],
    )

    # 4) Prompt + chain
    prompt_template = build_generate_sql_query_prompt(
        include_territorial=modules.get("territory", False),
        include_funding=modules.get("funding", False),
    )
    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT modules territorial={} funding={}",
        modules.get("territory", False),
        modules.get("funding", False),
    )
    chain = create_chain(
        prompt_template,
        input_keys,
        schema=sql_query,
    )

    # 5) LLM → SQL
    try:
        response = invoke_llm_chain(
            chain,
            prompt_inputs,
            label="fetch.generate_sql_query",
        )
        if not response or not hasattr(response, "sql_query"):
            raise ValueError("La respuesta no contiene una consulta SQL válida.")
    except (AttributeError, ValueError) as e:
        logger.error(f"\n\n ---> SQL ▸ ONE_SHOT controlled_error={str(e)}")
        return {
            "messages": [
                AIMessage(content=settings.staticmessages("error_sqlquery", str(e)))
            ]
        }
    except Exception as e:
        logger.exception("\n\n ---> SQL ▸ ONE_SHOT unexpected_error")
        return {
            "messages": [
                AIMessage(content=settings.staticmessages("error_sqlquery", str(e)))
            ]
        }

    # 6) Limpieza
    raw_sql = response.sql_query
    if state.get("unique_lookup"):
        try:
            base_alias = "p"
            country = (state.get("country_code") or "").strip().upper()
            filters = []
            if country:
                filters.append(f"{base_alias}.pais_iso3 = '{country}'")
            unique_vals = []
            for f in _get_analysis_filters(state) or []:
                col_norm = _normalize_column_name(str(f.get("column") or ""))
                if col_norm in {"codigo_snip", "id_proyecto"} and f.get(
                    "value"
                ) not in (None, ""):
                    unique_vals.append((col_norm, f.get("value")))
            if unique_vals:
                col, val = unique_vals[0]
                if col == "codigo_snip":
                    filters.append(f"{base_alias}.codigo_snip = '{val}'")
                else:
                    filters.append(f"{base_alias}.id_proyecto = {int(val)}")
            where_clause = " AND ".join(filters) if filters else "1=1"
            raw_sql = (
                "SELECT DISTINCT "
                f"{base_alias}.id_proyecto, {base_alias}.codigo_snip, {base_alias}.nombre_proyecto, "
                f"{base_alias}.nombresector_proyecto, {base_alias}.nombreentidadejecutora_proyecto, "
                f"{base_alias}.estado_proyecto, {base_alias}.valor_proyecto, "
                f"{base_alias}.anio_fechainicio_proyecto, {base_alias}.anio_fechafin_proyecto, "
                f"{base_alias}.url_link_proyecto, LEFT({base_alias}.objetivo_proyecto, 150) AS objetivo_proyecto "
                f"FROM {BASE_PROJECT_TABLE} AS {base_alias} "
                f"WHERE {where_clause} "
                f"ORDER BY {base_alias}.id_proyecto LIMIT {sql_rows_limit}"
            )
            logger.info("SQL ▸ UNIQUE_LOOKUP deterministic SQL applied: {}", raw_sql)
        except Exception as _e_ul:
            logger.warning(
                "SQL ▸ UNIQUE_LOOKUP post-process failed, keeping generated SQL. err={}",
                _e_ul,
            )
    sql_clean = (
        raw_sql.replace("\n", " ")
        .replace("\r", " ")
        .replace("\t", " ")
        .replace("  ", " ")
    ).strip()

    # ------- sql creted:
    logger.info("\n\n ---> SQL ▸ ONE_SHOT RESULT : generated_sql : {}", sql_clean)

    # - Aplicar filtros refinados

    refined_filters = state.get("refined_text_filters") or []
    if refined_filters:
        skip_columns = _get_catalog_applied_columns(state)
        sql_augmented, applied_ids = _apply_refined_filters_to_sql(
            sql_clean,
            refined_filters,
            skip_columns=skip_columns,
        )
        if applied_ids:
            logger.info(
                f"\n\n ---> SQL ▸ ONE_SHOT applied_refined_filters filters={applied_ids}"
            )
        sql_clean = sql_augmented

    catalog_suggestions = state.get("catalog_filter_suggestions") or []
    if catalog_suggestions:
        relaxed_columns = _get_relaxed_catalog_columns(state)
        sql_clean, applied_catalog_columns = _apply_catalog_equals_to_sql(
            sql_clean,
            catalog_suggestions,
            relaxed_columns,
            enforce_existing_columns=True,
        )
        _store_catalog_applied_columns(state, applied_catalog_columns)
        if applied_catalog_columns:
            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT applied_catalog_equals columns={} pattern=UPPER(TRIM(col))=UPPER(TRIM(val))",
                list(applied_catalog_columns),
            )
    else:
        state.pop("catalog_filters_last_applied", None)

    structured_filters = state.get("structured_text_filters") or []
    if structured_filters:
        sql_clean = _apply_structured_text_filters(
            sql_clean, structured_filters, enforce_existing_columns=True
        )

    # 7) Enforcement de filtros del analyzer (1 pasada)
    # SKIP validation para casos triviales (query simple de catálogo)
    analyzer_filters = _get_analysis_filters(state)
    is_trivial_query = (
        len(analyzer_filters) == 1
        and analyzer_filters[0].get("confidence", 0) >= 0.8
        and _has_only_catalog_filters()
    )

    resolved_territories = state.get("resolved_territories") or []
    if resolved_territories:
        # Clarificación territorial resuelta: limpiar flag pendiente
        state.pop("needs_territorial_clarification", None)
        state.pop("territorial_ambiguous_input", None)
        state.pop("territorial_options", None)
        state.pop("territorial_has_homonyms", None)

    has_territorial_pending = (
        state.get("needs_territorial_clarification") and not resolved_territories
    )

    if is_trivial_query:
        logger.info(
            "\n\n ---> SQL ▸ ONE_SHOT filter_validation_skipped reason=trivial_catalog_query filters=1 SIMPLE "
        )
        strong_missing, soft_missing = [], []
    else:
        strong_missing, soft_missing = _find_missing_filters(state, sql_clean)

    # Si hay clarificación territorial pendiente y los missing son territoriales, no bloquear
    if has_territorial_pending and strong_missing:
        territorial_missing = [
            f
            for f in strong_missing
            if str(f.get("column", "")).lower().startswith("t.")
            or "territorio" in str(f.get("column", "")).lower()
            or "nombre_departamento" in str(f.get("column", "")).lower()
            or "nombre_municipio" in str(f.get("column", "")).lower()
            or "nombre_region" in str(f.get("column", "")).lower()
        ]
        if territorial_missing and len(territorial_missing) == len(strong_missing):
            logger.info(
                "\n\n ---> SQL ▸ ONE_SHOT filter_validation_skipped reason=territorial_clarification_pending"
            )
            strong_missing = []

    # logger strong_missing y soft_missing
    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT filter_validation_results || STRONG AND SOFT: strong_missing={} soft_missing={}",
        strong_missing,
        soft_missing,
    )

    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT IS NOT TRIVIAL missing_filters || SHOW SQL_CLEAN : {} || SHOW strong={} || SHOW soft={}",
        sql_clean,
        strong_missing,
        soft_missing,
    )

    if soft_missing:
        state["soft_missing_filters"] = soft_missing
    else:
        state.pop("soft_missing_filters", None)

    if strong_missing and not state.get("_filters_enforced"):
        state["_filters_enforced"] = True
        state["missing_filters_errors"] = strong_missing
        logger.warning(
            "\n\n ---> SQL ▸ ONE_SHOT missing_filters strong={} → regenerate",
            strong_missing,
        )
        return regenerate_query(state)
    elif strong_missing:
        logger.warning(
            "\n\n ---> SQL ▸ ONE_SHOT missing_filters_persist={} proceeding",
            strong_missing,
        )

    # 8) Persistir y salir
    _set_sql_query(state, sql_clean, raw=raw_sql)

    logger.info(
        "\n\n ---> SQL ▸ ONE_SHOT END length={} soft_missing={}",
        len(sql_clean),
        len(soft_missing),
    )

    # Propagar estado consolidado hacia el grafo
    return {"sql": state.get("sql", {})}


def regenerate_query(state: AgentState):
    """
    Regenera una consulta SQL fallida basada en:
      • Mensaje de error previo (PG + mensajes)
      • Pregunta original
      • Schema (intermediate)
      • Errores acumulados de candidatos
      • Filtros forzados del analyzer (missing_filters_errors)
    Incrementa `retry_count` y devuelve la nueva SQL.

    PROTECCIÓN: Si se agotan los reintentos (default: 3), retorna mensaje de error
    en lugar de seguir intentando (evita loops infinitos).
    """
    from modules.graph.helpers_estado import (
        _increment_sql_retry_count,
        _get_sql_retry_count,
        _is_sql_retry_exhausted,
        _get_sql_max_retries,
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # PROTECCIÓN ANTI-LOOP: Verificar si se agotaron los reintentos ANTES de intentar
    # ═══════════════════════════════════════════════════════════════════════════
    if _is_sql_retry_exhausted(state):
        current_retries = _get_sql_retry_count(state)
        max_retries = _get_sql_max_retries(state)
        logger.error(
            "SQL ▸ REGENERATE max_retries_exhausted current={} max={}",
            current_retries,
            max_retries,
        )
        error_msg = (
            "No pude generar una consulta válida después de varios intentos. "
            "Por favor, intente reformular su pregunta con términos más específicos."
        )
        return {
            "messages": [AIMessage(content=error_msg)],
            "response_type": "error_max_retries",
            "stop_processing": True,
        }

    retry_count = _increment_sql_retry_count(state)
    country_code = state.get("country_code", "")
    question = state.get("complete_user_question", "")

    # Schema filtrado
    tables_set = _get_analyzer_tables(state)
    schema_json = _filter_schema_json(
        state.get("schema_intermediate_json") or INTERMEDIATE_SCHEMA_JSON,
        tables_set,
    )
    state["schema_intermediate_json"] = schema_json

    # 1) Errores previos (de EXPLAIN/preview o enforcement)
    scored = _get_sql_scored_list(state)
    error_entries = [{"sql": sql, "error": err} for _, sql, _, err in scored if err]

    # Forzar filtros faltantes del analyzer (se extraen y además se documentan)
    forced_filters = state.pop("missing_filters_errors", [])
    if forced_filters:
        for filt in forced_filters:
            error_entries.append(
                {
                    "sql": _get_sql_query_raw(state),
                    "error": (
                        "Missing required filter from analyzer: "
                        f"column={filt.get('column', '')}, "
                        f"operator={filt.get('operator', '')}, "
                        f"value={filt.get('value', '')}"
                    ),
                }
            )
    errors_block = json.dumps(error_entries, ensure_ascii=False, indent=2)

    # 2) Último mensaje de fallo (si existe) + nota de filtros requeridos
    messages = state.get("messages", [])
    failure_message = messages[-1].content if messages else ""

    # 2.5) Contexto de filas removidas (si viene de reintento por filas irrelevantes)
    from modules.graph.helpers_estado import (
        _get_rows_removed_sample,
        _get_irrelevant_retry_count,
    )

    retry_count_irrelevant = _get_irrelevant_retry_count(state)
    if retry_count_irrelevant > 0:
        # Hay un reintento activo por filas irrelevantes
        rows_removed_sample = _get_rows_removed_sample(state)
        if rows_removed_sample:
            prev_sql_for_context = _get_sql_query(state)
            if hasattr(prev_sql_for_context, "sql_query"):
                prev_sql_for_context = prev_sql_for_context.sql_query

            irrelevant_context = "\n\n### CONTEXTO DE FALLA: FILAS IRRELEVANTES\n"
            irrelevant_context += f"La consulta SQL anterior devolvió resultados, pero todos fueron filtrados como irrelevantes.\n\n"
            irrelevant_context += (
                f"SQL ejecutada anteriormente:\n```sql\n{prev_sql_for_context}\n```\n\n"
            )
            irrelevant_context += f"Ejemplos de proyectos descartados y razones:\n"
            for idx, sample in enumerate(rows_removed_sample[:3], 1):
                nombre = sample.get("nombre", "Proyecto desconocido")
                razon = sample.get("razon", "Sin razón especificada")
                sector = sample.get("sector", "")
                irrelevant_context += f"{idx}. {nombre}"
                if sector:
                    irrelevant_context += f" (sector: {sector})"
                irrelevant_context += f"\n   Razón: {razon}\n"

            irrelevant_context += "\nINSTRUCCIONES:\n"
            irrelevant_context += (
                "- Evita proyectos de estos tipos que no corresponden a la pregunta.\n"
            )
            irrelevant_context += "- Ajusta los filtros para ser más específico y evitar falsos positivos.\n"
            irrelevant_context += (
                "- Enfócate en el tipo de proyecto que realmente busca el usuario.\n"
            )

            failure_message = f"{failure_message}{irrelevant_context}".strip()
            logger.info(
                f"FLOW ▸ REGENERATE irrelevant_retry_context added "
                f"retry_count={retry_count_irrelevant} samples={len(rows_removed_sample)}"
            )

    if forced_filters:
        filters_summary = ", ".join(
            f"{f.get('column', '')}={f.get('value', '')}" for f in forced_filters
        )
        extra_msg = f"Missing required filters: {filters_summary}".strip()
        failure_message = f"{failure_message}\n{extra_msg}".strip()

        # Hint extra para evitar falsos positivos del detector: permitir OR entre columnas textuales
        try:
            ff_cols_lc = " ".join(
                [str(f.get("column") or "").lower() for f in forced_filters]
            )
            if (
                "nombre_proyecto" in ff_cols_lc or "objetivo_proyecto" in ff_cols_lc
            ) and "process_text" in ff_cols_lc:
                failure_message = (
                    f"{failure_message}\n"
                    "Nota: es válido combinar filtros textuales en un bloque OR entre columnas relacionadas, por ejemplo: "
                    "process_text(p.nombre_proyecto) ILIKE ... OR process_text(p.objetivo_proyecto) ILIKE ...."
                )
        except Exception:
            pass

    # 3) SQL previa (si la hay)
    prev_sql = _get_sql_query_raw(state)
    if hasattr(prev_sql, "sql_query"):
        prev_sql = prev_sql.sql_query

    # Error granular de PG previo (si hubo)
    sql_error_info_json = json.dumps(
        _get_sql_error(state),
        ensure_ascii=False,
        indent=2,
    )

    logger.info(f"---REGENERATE QUERY (retry {retry_count})---")
    logger.debug(f"Failure message: {failure_message}")
    logger.debug(f"Errors block: {errors_block}")

    # 4) Contexto (reuse documentos existentes) + fewshots priorizados
    context = (state.get("documents") or "").strip()
    dynamic_fewshots = (state.get("dynamic_fewshots") or "").strip()
    docs_fewshots = (state.get("documents_fewshots") or "").strip()

    combined_fewshots = ""
    if dynamic_fewshots or docs_fewshots:
        blocks: list[str] = []
        if dynamic_fewshots:
            blocks.append(f"PRIORITY FEWSHOTS\n{dynamic_fewshots}")
        if docs_fewshots:
            blocks.append(docs_fewshots)
        combined_fewshots = "\n\n".join(blocks)
    relaxed_catalog_columns = state.get("catalog_filters_relaxed_columns") or []
    if relaxed_catalog_columns and combined_fewshots:
        combined_fewshots = (
            combined_fewshots
            + "\n\nCATALOG FILTERS RELAXED\nSe agotó la igualdad; puedes usar keywords textuales."
            + f"\nColumnas relajadas: {', '.join(relaxed_catalog_columns)}"
        )
    context_fewshots = combined_fewshots

    # 4.5) Derivar flags modulares de forma determinista desde analyzer_tables
    _derive_modules_from_analyzer(state, tables_set)
    modules = _get_analysis_modules(state)
    if state.get("unique_lookup"):
        modules["territory"] = False
        modules["funding"] = False
        _set_analysis_modules(state, territory=False, funding=False)
        tables_set = {BASE_PROJECT_TABLE}
        logger.info(
            "[PROMPT][REGEN] UNIQUE_LOOKUP enforcing base table only (no territory/funding)"
        )
    logger.info(
        "[PROMPT][REGEN] Modules (derived) → territorial={} funding={} from tables={}",
        modules.get("territory", False),
        modules.get("funding", False),
        sorted([t.lower() for t in (tables_set or [])]),
    )

    # 5) Prompt de regenerate
    analysis = _get_effective_analysis_text(state, "-- No analysis provided --")

    # Inyectar información de optimización de joins
    join_opt_enabled = state.get("join_optimization_enabled", True)
    filters_by_table = state.get("filters_by_table", {})

    if join_opt_enabled and filters_by_table:
        has_base_filters = len(filters_by_table.get("p", [])) > 0
        has_territorial_filters = len(filters_by_table.get("t", [])) > 0
        has_funding_filters = len(filters_by_table.get("f", [])) > 0

        if has_base_filters and (has_territorial_filters or has_funding_filters):
            join_opt_note = "\n\n### JOIN OPTIMIZATION ENABLED\n"
            join_opt_note += f"- Base table filters (p.*): {len(filters_by_table.get('p', []))} filters\n"
            if has_territorial_filters:
                join_opt_note += f"- Territorial filters (t.*): {len(filters_by_table.get('t', []))} filters → Move to ON clause\n"
            if has_funding_filters:
                join_opt_note += f"- Funding filters (f.*): {len(filters_by_table.get('f', []))} filters → Move to ON clause\n"
            join_opt_note += "- Apply base filters in WHERE, then join with ON clause filters for performance.\n"

            analysis = analysis + join_opt_note

            logger.info(
                "\n\n ---> SQL ▸ REGEN JOIN_OPT injected base={} territorial={} funding={}",
                len(filters_by_table.get("p", [])),
                len(filters_by_table.get("t", [])),
                len(filters_by_table.get("f", [])),
            )

    prompt_template = build_regenerate_query_prompt(
        include_territorial=modules.get("territory", False),
        include_funding=modules.get("funding", False),
    )

    # 5.5) Si la estrategia es TRIGRAM, usar el prompt especializado
    if state.get("search_strategy") == "trigram":
        logger.info(
            "[PROMPT][REGEN] Using TRIGRAM prompt due to search_strategy=trigram"
        )
        prompt_template = build_trigram_regenerate_prompt()
        # En caso de trigram prompt, 'original_sql' se pasa como {original_sql}
        # pero el create_chain espera claves exactas.
        # El prompt de trigramas usa {original_sql}.
        # Lo pasaremos engañando al invocador pasando prev_sql como original_sql más abajo

    chain = create_chain(
        prompt_template,
        [
            "schema_json",
            "failure_message",
            "errors_block",
            "sql_error_info",
            "question",
            "context",
            "context_fewshots",
            "country_code",
            "analysis",
            "prev_sql",  # Standard prompt expects this
            "original_sql",  # Trigram prompt expects this
            "replacements_json",
        ],
        schema=sql_query,
    )

    # 🔁 Invocar con backoff para tolerar 429/transient
    inputs = {
        "schema_json": schema_json,
        "failure_message": failure_message,
        "errors_block": errors_block,
        "sql_error_info": sql_error_info_json,
        "question": question,
        "context": context,
        "context_fewshots": context_fewshots,
        "country_code": country_code,
        "analysis": analysis,
        "prev_sql": prev_sql or "",
        "original_sql": prev_sql or "",  # Mapear para trigrama
        "replacements_json": "[]",
    }
    response: sql_query = safe_invoke(
        chain,
        inputs,
    )

    # 6) Limpieza y persistencia
    raw_sql = response.sql_query
    if state.get("unique_lookup"):
        try:
            base_alias = "p"
            country = (state.get("country_code") or "").strip().upper()
            filters = []
            if country:
                filters.append(f"{base_alias}.pais_iso3 = '{country}'")
            unique_vals = []
            for f in _get_analysis_filters(state) or []:
                col_norm = _normalize_column_name(str(f.get("column") or ""))
                if col_norm in {"codigo_snip", "id_proyecto"} and f.get(
                    "value"
                ) not in (None, ""):
                    unique_vals.append((col_norm, f.get("value")))
            if unique_vals:
                col, val = unique_vals[0]
                if col == "codigo_snip":
                    filters.append(f"{base_alias}.codigo_snip = '{val}'")
                else:
                    filters.append(f"{base_alias}.id_proyecto = {int(val)}")
            where_clause = " AND ".join(filters) if filters else "1=1"
            raw_sql = (
                "SELECT DISTINCT "
                f"{base_alias}.id_proyecto, {base_alias}.codigo_snip, {base_alias}.nombre_proyecto, "
                f"{base_alias}.nombresector_proyecto, {base_alias}.nombreentidadejecutora_proyecto, "
                f"{base_alias}.estado_proyecto, {base_alias}.valor_proyecto, "
                f"{base_alias}.anio_fechainicio_proyecto, {base_alias}.anio_fechafin_proyecto, "
                f"{base_alias}.url_link_proyecto, LEFT({base_alias}.objetivo_proyecto, 150) AS objetivo_proyecto "
                f"FROM {BASE_PROJECT_TABLE} AS {base_alias} "
                f"WHERE {where_clause} "
                f"ORDER BY {base_alias}.id_proyecto LIMIT {_get_rows_limit_applied(state) or _get_rows_limit_default(state) or settings.sql_rows_limit}"
            )
            logger.info(
                "SQL ▸ UNIQUE_LOOKUP deterministic SQL applied (regen): {}", raw_sql
            )
        except Exception as _e_ul2:
            logger.warning(
                "SQL ▸ UNIQUE_LOOKUP regen post-process failed, keeping generated SQL. err={}",
                _e_ul2,
            )
    cleaned_sql = (
        raw_sql.replace("\n", " ")
        .replace("\r", " ")
        .replace("\t", " ")
        .replace("  ", " ")
    ).strip()

    refined_filters = state.get("refined_text_filters") or []
    if refined_filters:
        skip_columns = _get_catalog_applied_columns(state)
        cleaned_with_filters, applied_ids = _apply_refined_filters_to_sql(
            cleaned_sql,
            refined_filters,
            skip_columns=skip_columns,
        )
        if applied_ids:
            logger.info(
                f"\n\n ---> SQL ▸ REGEN applied_refined_filters retry={retry_count} filters={applied_ids}"
            )
        cleaned_sql = cleaned_with_filters

    catalog_suggestions = state.get("catalog_filter_suggestions") or []
    if catalog_suggestions:
        relaxed_columns = _get_relaxed_catalog_columns(state)
        cleaned_sql, applied_catalog_columns = _apply_catalog_equals_to_sql(
            cleaned_sql,
            catalog_suggestions,
            relaxed_columns,
        )
        _store_catalog_applied_columns(state, applied_catalog_columns)
    else:
        state.pop("catalog_filters_last_applied", None)

    structured_filters = state.get("structured_text_filters") or []
    if structured_filters:
        cleaned_sql = _apply_structured_text_filters(cleaned_sql, structured_filters)
    else:
        state.pop("catalog_filters_last_applied", None)

    _set_sql_query(state, cleaned_sql, raw=raw_sql)

    # 7) Return (retry_count ya incrementado al inicio con _increment_sql_retry_count)
    logger.info(f"♻️  SQL REGENERADA (retry={retry_count}): {cleaned_sql}")

    return {
        "messages": [AIMessage(content=cleaned_sql)],
        "sql": state.get("sql", {}),
    }


def fetch_data(state: AgentState):
    """
    Ejecuta la consulta SQL almacenada en el estado y devuelve los resultados.
    Mantiene intacta la variable `more_than_n_rows` aunque no se utilice,
    y garantiza un rollback si ocurre cualquier excepción para evitar que la
    conexión quede en estado aborted.
    """

    state["fetch_failed"] = False
    state.pop("fetch_error_message", None)
    rows_limit_default = _get_rows_limit_default(state)
    if rows_limit_default is None:
        rows_limit_default = settings.sql_rows_limit
    rows_limit_max = _get_rows_limit_max(state)
    if rows_limit_max is None:
        rows_limit_max = settings.sql_rows_limit_max
    if (
        rows_limit_default is not None
        and rows_limit_max is not None
        and rows_limit_default > rows_limit_max
    ):
        rows_limit_default = rows_limit_max

    logger.debug(f"FLOW ▸ FETCH sql_query={_get_sql_query(state)}")
    limit_match = re.search(
        r"(?is)\blimit\s+(\d+)(?:\s+offset\s+(\d+))?\s*$", _get_sql_query(state)
    )
    limit_applied = None
    user_limit = state.get("user_limit")
    LLM_GENERIC_LIMITS = {50, 100, 200, 500, 1000}

    if limit_match:
        try:
            limit_applied = int(limit_match.group(1))
        except (TypeError, ValueError):
            limit_applied = rows_limit_default
        # Si el usuario pidió un límite explícito y es válido, respetarlo
        if user_limit:
            try:
                limit_applied = int(user_limit)
            except Exception:
                limit_applied = limit_applied or rows_limit_default
        # Si es un límite genérico del LLM y no hay user_limit, usar default
        elif limit_applied in LLM_GENERIC_LIMITS and rows_limit_default is not None:
            logger.info(
                "FLOW ▸ FETCH llm_generic_limit detected=%s using_default=%s",
                limit_applied,
                rows_limit_default,
            )
            limit_applied = rows_limit_default
        # Respetar tope máximo
        if rows_limit_max is not None and limit_applied is not None:
            limit_applied = min(limit_applied, rows_limit_max)
    else:
        limit_applied = user_limit or rows_limit_default

    # Telemetría simple de límites
    try:
        logger.info(
            "FLOW ▸ FETCH limit_trace requested={} applied={} default={} max={}",
            user_limit,
            limit_applied,
            rows_limit_default,
            rows_limit_max,
        )
    except Exception:
        pass

    _set_rows_limit_applied(state, limit_applied)
    logger.info(
        "FLOW ▸ FETCH START limit={} cache_hit={}",
        _get_rows_limit_applied(state) or settings.sql_rows_limit,
        state.get("is_cache_hit", False),
    )

    try:
        query = _get_sql_query(state)
        raw_query = _get_sql_query_raw(state)

        enforced_query = _ensure_country_filter(query, state.get("country_code", ""))
        if enforced_query != query:
            logger.debug(
                f"FLOW ▸ FETCH country_filter applied origin={query} modified={enforced_query}"
            )
            query = enforced_query
            _set_sql_query(state, query)

        # SAFETY NET: Sanitizar ISO3 (evitar process_text en pais_iso3)
        sanitized_query = _sanitize_iso_code_sql(query)
        if sanitized_query != query:
            logger.info(
                "FLOW ▸ FETCH iso3_sanitized clean_sql={}", sanitized_query[:100]
            )
            query = sanitized_query
            _set_sql_query(state, query)

        # Asegurar DISTINCT cuando hay JOINs con tablas multi-fila
        distinct_query = _ensure_distinct_on_multijoin(query)
        if distinct_query != query:
            logger.info("FLOW ▸ FETCH distinct_applied reason=multijoin")
            query = distinct_query
            _set_sql_query(state, query)

        if raw_query.strip() != query.strip():
            logger.debug(f"FLOW ▸ FETCH cleaned_sql raw={raw_query} clean={query}")
        is_cache_hit = state.get("is_cache_hit", False)

        # Si es cache-hit, suprimimos comentarios /* … */ al principio
        if is_cache_hit:
            query = re.sub(r"/\*.*?\*/", "", query, flags=re.DOTALL).strip()

        # DEBUG: Ver qué estamos pasando a execute_sql_query
        logger.info(
            "FLOW ▸ FETCH about_to_execute query_type=%s query_len=%s query_preview=%s",
            type(query),
            len(query) if isinstance(query, str) else "N/A",
            query[:100] if isinstance(query, str) else query,
        )

        results_json, more_than_n_rows, total_rows, no_data, displayed_count = (
            execute_sql_query(
                state["db"],
                query,
                rows_limit_default=rows_limit_default,
                rows_limit_max=rows_limit_max,
            )
        )

        # Guardar el total de filas para uso posterior (p. ej. disclaimer 10-filas)
        _set_sql_execution(
            state,
            rowcount=total_rows,
            more_than_limit=more_than_n_rows,
            results=results_json,
            displayed_count=displayed_count,
        )
        logger.debug(
            "FLOW ▸ FETCH limit_applied=%s displayed=%s",
            _get_rows_limit_applied(state),
            _get_sql_displayed_count(state),
        )

        zero_payload = False
        try:
            if total_rows == 1 and _is_zero_payload(results_json):
                zero_payload = True
        except Exception:
            zero_payload = False

        if zero_payload:
            logger.info("FLOW ▸ FETCH aggregate_zero_payload detected")
            _set_sql_execution(
                state,
                rowcount=0,
                more_than_limit=False,
                results=None,
                displayed_count=0,
            )
            total_rows = 0
            no_data = 1

        # ═══════════════════════════════════════════════════════════
        # KEYWORD REGENERATION V2 - Using theme_keywords from analyzer
        # ═══════════════════════════════════════════════════════════
        _clear_keyword_regeneration(state)
        state.pop("keyword_original_filters", None)

        if total_rows == 0:
            # ═══════════════════════════════════════════════════════════
            # CASCADING SEARCH STRATEGY v2 🌊
            # ═══════════════════════════════════════════════════════════
            cascade_enabled = getattr(settings, "search_cascade_mode", False)
            trigram_enabled = getattr(settings, "search_enable_trigram", True)
            current_strategy = state.get("search_strategy", "semantic")

            # Si el modo Cascada está activado y falló la estrategia semántica estándar:
            if cascade_enabled and trigram_enabled and current_strategy == "semantic":
                logger.warning(
                    "\n"
                    "🌊🌊🌊 CASCADING SEARCH ACTIVATED 🌊🌊🌊\n"
                    "reason=zero_results source=semantic target=trigram\n"
                    "Attempting query rewrite with Fuzzy Logic..."
                )

                # Marcar cambio de estrategia para el próximo ciclo
                state["search_strategy"] = "trigram"
                state["fetch_failed"] = True
                state["fetch_error_message"] = (
                    "0 rows in Semantic Mode. Switching to Trigram Mode."
                )

                # Regenerate SQL with Trigram Prompt
                prompt = build_trigram_regenerate_prompt().format(original_sql=query)
                return {
                    "messages": [
                        AIMessage(content=f"REGENERATING_TRIGRAM_MODE: {prompt}")
                    ],
                    # Trigger regeneration
                    "regen_sql_count": state.get("regen_sql_count", 0) + 1,
                    # Propagate strategy change
                    "search_strategy": "trigram",
                }

            # FALLBACK ORIGINAL: Usar keywords del analyzer directamente
            theme_strategy = _get_theme_strategy(state)
            theme_keywords_raw = theme_strategy.get("keywords", [])
            blocked_tokens = _get_blocked_catalog_tokens(state)
            theme_keywords = _filter_keywords_for_text_search(
                theme_keywords_raw, blocked_tokens
            )
            if theme_keywords_raw and len(theme_keywords) != len(theme_keywords_raw):
                logger.info(
                    "FLOW ▸ FETCH theme_keywords_catalog_filtered before={} after={}",
                    len(theme_keywords_raw),
                    len(theme_keywords),
                )
            theme_fields = theme_strategy.get("search_fields", [])

            # SKIP keyword_regen_v2 si hay múltiples filtros con alta confianza
            # (indica lógica compleja con AND entre conceptos diferentes)
            analyzer_filters_all = _get_analysis_filters(state)
            high_conf_filters = [
                f for f in analyzer_filters_all if f.get("confidence", 0) >= 0.8
            ]

            # Si hay 3+ filtros fuertes, NO usar keyword regen (puede romper lógica AND)
            if len(high_conf_filters) >= 3:
                logger.info(
                    f"FLOW ▸ FETCH keyword_regen_v2_skipped reason=complex_logic high_conf_filters={len(high_conf_filters)}"
                )
            elif theme_keywords and len(theme_keywords) >= 1:
                logger.info(
                    f"FLOW ▸ FETCH keyword_regen_v2 using_theme_keywords count={len(theme_keywords)}"
                )

                # Preparar campos: cap configurable, priorizar columnas textuales y aplicar regla funding
                max_fields_cfg = getattr(settings, "max_keyword_fields", 3)
                try:
                    max_fields_cfg = int(max_fields_cfg)
                except Exception:
                    max_fields_cfg = 3

                # Normalizar y priorizar campos (preservando orden)
                PRIORITY_BASES = [
                    "nombre_proyecto",
                    "objetivo_proyecto",
                    "nombreentidadejecutora_proyecto",
                ]
                cleaned: list[str] = []
                seen: set[str] = set()
                for f in theme_fields or []:
                    if not f:
                        continue
                    ff = str(f).strip()
                    if ff in seen:
                        continue
                    seen.add(ff)
                    cleaned.append(ff)

                prioritized = [
                    f for f in cleaned if f.split(".")[-1].lower() in PRIORITY_BASES
                ]
                others = [f for f in cleaned if f not in prioritized]
                ordered_fields = prioritized + others

                funding_by_analyzer = any(
                    (f.get("confidence", 0) or 0) >= 0.75
                    and isinstance(f.get("column"), str)
                    and (
                        f.get("column").strip().lower().startswith("f.")
                        or ".f." in f.get("column").strip().lower()
                        or "f_" in f.get("column").strip().lower()
                    )
                    for f in (analyzer_filters_all or [])
                )
                modules = _get_analysis_modules(state)
                allow_funding = bool(modules.get("funding")) or bool(
                    funding_by_analyzer
                )

                # Filter out funding fields unless allowed
                if not allow_funding:
                    filtered_fields = [
                        f
                        for f in ordered_fields
                        if not str(f).strip().lower().startswith("f.")
                    ]
                else:
                    filtered_fields = ordered_fields

                used_fields = filtered_fields[:max_fields_cfg]
                dropped_fields = filtered_fields[max_fields_cfg:]

                # Telemetry: store what we will try
                state["theme_fields_used"] = used_fields
                state["theme_fields_dropped"] = dropped_fields
                state["theme_fields_in_count"] = len(theme_fields or [])

                # Construir SQL con EXISTS para todos los keywords (devolverá cap aplicado internamente también)
                new_sql = _build_keyword_regeneration_sql_from_theme(
                    original_sql=raw_query,
                    country_code=state.get("country_code", ""),
                    keywords=theme_keywords,
                    fields=used_fields,
                    allow_funding=allow_funding,
                    max_fields=max_fields_cfg,
                )

                if new_sql and new_sql.strip() != raw_query.strip():
                    try:
                        # Endurecer SQL antes de ejecutar (país, DISTINCT)
                        hardened_sql = _ensure_country_filter(
                            new_sql, state.get("country_code", "")
                        )
                        hardened_sql = _ensure_distinct_on_multijoin(hardened_sql)

                        (
                            results_json_kw,
                            more_than_n_rows_kw,
                            total_rows_kw,
                            no_data_kw,
                            displayed_count_kw,
                        ) = execute_sql_query(
                            state["db"],
                            hardened_sql,
                            rows_limit_default=rows_limit_default,
                            rows_limit_max=rows_limit_max,
                        )
                    except Exception as regen_exc:
                        logger.warning(
                            f"FLOW ▸ FETCH keyword_regen_v2_error={regen_exc}"
                        )
                    else:
                        if total_rows_kw and total_rows_kw > 0:
                            logger.info(
                                "FLOW ▸ FETCH keyword_regen_v2_success rows={} keywords_used={}",
                                total_rows_kw,
                                theme_keywords,
                            )
                            _set_keyword_used(state, True)
                            _set_keyword_tokens_tried(state, theme_keywords)

                            cleaned_sql = (
                                hardened_sql.replace("\n", " ")
                                .replace("\r", " ")
                                .replace("\t", " ")
                                .replace("  ", " ")
                                .strip()
                            )
                            _set_sql_query(state, cleaned_sql, raw=hardened_sql)

                            raw_query = hardened_sql
                            query = cleaned_sql
                            results_json = results_json_kw
                            more_than_n_rows = more_than_n_rows_kw
                            total_rows = total_rows_kw
                            _set_sql_execution(
                                state,
                                rowcount=total_rows_kw,
                                more_than_limit=more_than_n_rows_kw,
                                results=results_json_kw,
                                displayed_count=displayed_count_kw,
                            )
                            no_data = no_data_kw

                            # Revalidar filtros requeridos tras regeneración
                            try:
                                strong_missing_kw, soft_missing_kw = (
                                    _find_missing_filters(state, cleaned_sql)
                                )
                                if soft_missing_kw:
                                    state["soft_missing_filters"] = soft_missing_kw
                                else:
                                    state.pop("soft_missing_filters", None)

                                if strong_missing_kw and not state.get(
                                    "_filters_enforced"
                                ):
                                    state["_filters_enforced"] = True
                                    state["missing_filters_errors"] = strong_missing_kw
                                    logger.warning(
                                        "FLOW ▸ FETCH keyword_regen_v2 missing_filters={} → regenerate",
                                        strong_missing_kw,
                                    )
                                    return regenerate_query(state)
                                elif strong_missing_kw:
                                    logger.warning(
                                        "FLOW ▸ FETCH keyword_regen_v2 missing_filters_persist={} proceeding",
                                        strong_missing_kw,
                                    )
                            except Exception as _e_validate_kw:
                                logger.warning(
                                    "FLOW ▸ FETCH keyword_regen_v2 validation_error={}",
                                    _e_validate_kw,
                                )
                        else:
                            logger.info(
                                "FLOW ▸ FETCH keyword_regen_v2_still_zero keywords={}",
                                theme_keywords,
                            )
                            # ═══════════════════════════════════════════════════════════
                            # CASCADE TEXT SEARCH 🌊 (Trigram High → Trigram Low → FTS)
                            # ═══════════════════════════════════════════════════════════
                            cascade_results, cascade_rows, cascade_strategy = (
                                _cascade_text_search(
                                    db=state["db"],
                                    keywords=theme_keywords,
                                    country_code=state.get("country_code", ""),
                                )
                            )
                            if cascade_rows and cascade_rows > 0:
                                logger.info(
                                    "🎯 FETCH cascade_text_search_success strategy={} rows={}",
                                    cascade_strategy,
                                    cascade_rows,
                                )
                                # Update state with cascade results
                                state["search_resolution"] = {
                                    "strategy_used": cascade_strategy,
                                    "rows_found": cascade_rows,
                                    "keywords_searched": theme_keywords[:5],
                                }
                                results_json = cascade_results
                                total_rows = cascade_rows
                                no_data = 0
                                _set_sql_execution(
                                    state,
                                    rowcount=cascade_rows,
                                    more_than_limit=False,
                                    results=cascade_results,
                                    displayed_count=min(
                                        cascade_rows, rows_limit_default or 20
                                    ),
                                )
                                state["used_cascade"] = True
                            else:
                                logger.info(
                                    "FLOW ▸ FETCH cascade_text_search exhausted strategy={}",
                                    cascade_strategy,
                                )
                                state["search_resolution"] = {
                                    "strategy_used": "all_failed",
                                    "rows_found": 0,
                                    "keywords_searched": theme_keywords[:5],
                                }
                        # Telemetry: estimate exists clauses tried and sql len
                        try:
                            num_fields_used = len(state.get("theme_fields_used") or [])
                            state["keyword_regen_exists_estimate"] = (
                                len(theme_keywords) * num_fields_used
                            )
                            state["keyword_regen_sql_length"] = len(new_sql or "")
                        except Exception:
                            pass
            else:
                logger.info("FLOW ▸ FETCH keyword_regen_v2_skipped no_theme_keywords")

        # ---------------------------------------------------------------------
        # Fallback plan B: 0 filas + pinta de “proyecto por memoria”
        #  - Relaja estado temporalmente (lo quita)
        #  - Amplía superficies de texto: nombre/objetivo/entidad con PROCESS_TEXT + ILIKE (OR)
        #  - Si matchea, prioriza REEVALUACION y reemplaza el payload de 0 filas
        # ---------------------------------------------------------------------
        try:
            zero_rows = (_get_sql_rowcount(state) == 0) or (total_rows == 0)
        except Exception:
            zero_rows = total_rows == 0

        if zero_rows:
            has_uncertainty_name = any(
                (u.get("topic", "") or "").lower() == "project_name"
                for u in _get_gray_zone_non_mappable(state)
            )
            tm_keywords = _get_theme_strategy(state).get("keywords") or []
            looks_named_project = bool(has_uncertainty_name or tm_keywords)

            if looks_named_project:
                logger.info(
                    f"FLOW ▸ FETCH fallback_trigger keywords={keywords if (keywords := _collect_fallback_keywords(state)) else []}"
                )
                if keywords:
                    fallback_limit = (
                        _get_rows_limit_applied(state)
                        or rows_limit_default
                        or settings.sql_rows_limit
                    )
                    theme_strategy = _get_theme_strategy(state)
                    search_fields = theme_strategy.get("search_fields", [])

                    # Prepare cap/prioritization and funding rule for fallback
                    max_fields_cfg = getattr(settings, "max_keyword_fields", 3)
                    try:
                        max_fields_cfg = int(max_fields_cfg)
                    except Exception:
                        max_fields_cfg = 3

                    PRIORITY_BASES = [
                        "nombre_proyecto",
                        "objetivo_proyecto",
                        "nombreentidadejecutora_proyecto",
                    ]
                    cleaned_sf: list[str] = []
                    seen_sf: set[str] = set()
                    for f in search_fields or []:
                        if not f:
                            continue
                        ff = str(f).strip()
                        if ff in seen_sf:
                            continue
                        seen_sf.add(ff)
                        cleaned_sf.append(ff)

                    prioritized_sf = [
                        f
                        for f in cleaned_sf
                        if f.split(".")[-1].lower() in PRIORITY_BASES
                    ]
                    others_sf = [f for f in cleaned_sf if f not in prioritized_sf]
                    ordered_sf = prioritized_sf + others_sf

                    analyzer_filters = _get_analysis_filters(state)
                    funding_by_analyzer = any(
                        (f.get("confidence", 0) or 0) >= 0.75
                        and isinstance(f.get("column"), str)
                        and (
                            f.get("column").strip().lower().startswith("f.")
                            or ".f." in f.get("column").strip().lower()
                            or "f_" in f.get("column").strip().lower()
                        )
                        for f in (analyzer_filters or [])
                    )
                    modules = _get_analysis_modules(state)
                    allow_funding = bool(modules.get("funding")) or bool(
                        funding_by_analyzer
                    )

                    if not allow_funding:
                        ordered_sf = [
                            f
                            for f in ordered_sf
                            if not str(f).strip().lower().startswith("f.")
                        ]

                    used_fallback_fields = ordered_sf[:max_fields_cfg]
                    dropped_fallback_fields = ordered_sf[max_fields_cfg:]
                    state["fallback_fields_used"] = used_fallback_fields
                    state["fallback_fields_dropped"] = dropped_fallback_fields

                    fallback_sql = _build_fallback_sql(
                        state.get("country_code", ""),
                        keywords,
                        used_fallback_fields,
                        fallback_limit,
                        allow_funding=allow_funding,
                        max_fields=max_fields_cfg,
                    )
                    # Endurecer SQL antes de ejecutar (país, DISTINCT)
                    fallback_sql = _ensure_country_filter(
                        fallback_sql, state.get("country_code", "")
                    )
                    fallback_sql = _ensure_distinct_on_multijoin(fallback_sql)
                    logger.debug(f"FLOW ▸ FETCH fallback_sql={fallback_sql}")
                    try:
                        (
                            results_json_fb,
                            more_than_n_rows_fb,
                            total_rows_fb,
                            no_data_fb,
                            displayed_count_fb,
                        ) = execute_sql_query(
                            state["db"],
                            fallback_sql,
                            rows_limit_default=rows_limit_default,
                            rows_limit_max=rows_limit_max,
                        )
                        # Reordenar: priorizar REEVALUACION
                        try:
                            rows_fb = (
                                json.loads(results_json_fb)
                                if isinstance(results_json_fb, str)
                                else (results_json_fb or [])
                            )
                            rows_fb = _prioritize_reevaluacion(rows_fb)
                            results_json_fb = json.dumps(rows_fb, ensure_ascii=False)
                        except Exception as _e_reorder:
                            logger.warning(
                                f"No se pudo priorizar REEVALUACION en fallback: {_e_reorder}"
                            )

                        # Marcas en estado (útil para debugging / front)
                        state["used_fallback"] = True
                        state["fallback_sql"] = fallback_sql
                        state["fallback_rows"] = (
                            json.loads(results_json_fb)
                            if isinstance(results_json_fb, str)
                            else results_json_fb
                        )

                        cleaned_sql_fb = (
                            fallback_sql.replace("\n", " ")
                            .replace("\r", " ")
                            .replace("\t", " ")
                            .replace("  ", " ")
                            .strip()
                        )
                        _set_sql_query(state, cleaned_sql_fb, raw=fallback_sql)

                        _set_sql_execution(
                            state,
                            rowcount=int(total_rows_fb or 0),
                            more_than_limit=more_than_n_rows_fb,
                            results=results_json_fb,
                            displayed_count=displayed_count_fb,
                        )

                        # Si trajo algo, sustituimos el resultado original 0-rows
                        if total_rows_fb and total_rows_fb > 0:
                            results_json = results_json_fb
                            more_than_n_rows = more_than_n_rows_fb
                            total_rows = total_rows_fb
                            no_data = 0  # hay filas
                            logger.info(
                                "FLOW ▸ FETCH fallback_success rows={}",
                                total_rows_fb,
                            )
                            # Revalidar filtros requeridos tras fallback
                            try:
                                strong_missing_fb, soft_missing_fb = (
                                    _find_missing_filters(state, cleaned_sql_fb)
                                )
                                if soft_missing_fb:
                                    state["soft_missing_filters"] = soft_missing_fb
                                else:
                                    state.pop("soft_missing_filters", None)

                                if strong_missing_fb and not state.get(
                                    "_filters_enforced"
                                ):
                                    state["_filters_enforced"] = True
                                    state["missing_filters_errors"] = strong_missing_fb
                                    logger.warning(
                                        "FLOW ▸ FETCH fallback missing_filters={} → regenerate",
                                        strong_missing_fb,
                                    )
                                    return regenerate_query(state)
                                elif strong_missing_fb:
                                    logger.warning(
                                        "FLOW ▸ FETCH fallback missing_filters_persist={} proceeding",
                                        strong_missing_fb,
                                    )
                            except Exception as _e_validate_fb:
                                logger.warning(
                                    "FLOW ▸ FETCH fallback validation_error={}",
                                    _e_validate_fb,
                                )
                    except Exception as fb_exc:
                        logger.warning(f"FLOW ▸ FETCH fallback_error={fb_exc}")
                        # Conservamos el 0-rows original; la mensajería de zona gris se encargará

        _record_duplicate_hint(state, results_json)

        # ---------------------------------------------------------------------

        if total_rows == 0:
            catalog_suggestions = state.get("catalog_filter_suggestions") or []
            last_applied = state.get("catalog_filters_last_applied") or []
            if catalog_suggestions and last_applied:
                relaxed_columns = _get_relaxed_catalog_columns(state)
                updated_relaxed = set(relaxed_columns)
                for col in last_applied:
                    normalized = _normalize_column_name(col)
                    if normalized:
                        updated_relaxed.add(normalized)
                if updated_relaxed != relaxed_columns:
                    _set_relaxed_catalog_columns(state, updated_relaxed)
                    _set_sql_execution(
                        state,
                        rowcount=0,
                        more_than_limit=False,
                        results=results_json,
                        displayed_count=_get_sql_displayed_count(state) or 0,
                    )
                    logger.info(
                        "FLOW ▸ FETCH catalog_filters_relax_triggered columns={}",
                        updated_relaxed,
                    )
                    return {
                        "messages": [
                            AIMessage(
                                content=(
                                    "Los filtros exactos de catálogo no devolvieron filas; "
                                    "relajando esas columnas para reintentar con coincidencias aproximadas."
                                ),
                            )
                        ],
                        "sql": state.get("sql", {}),
                    }
            prepared = _prepare_post_fetch_clarification(state)
            metadata = _get_assistance_metadata(state)
            metadata["postfetch_ready"] = prepared
            metadata["postfetch_shown"] = False
            _set_assistance_needed(state, prepared)
            assistance_snapshot = _get_user_assistance(state)
            logger.info(
                "POSTFETCH ▸ DIAG zero_rows ready={} options={} soft_missing_filters={}",
                prepared,
                len(assistance_snapshot.get("options") or []),
                bool(state.get("soft_missing_filters")),
            )
            inferred_reason = _infer_gray_zone_reason(state)
            if (
                settings.enable_norows_gray_zone
                and inferred_reason != "NO_ROWS_FILTERED"
            ):
                _set_gray_zone_reason(state, inferred_reason)
            else:
                _set_gray_zone_reason(state, None)
                _set_gray_zone_details(state, {})
        else:
            assistance = _get_user_assistance(state)
            metadata = _get_assistance_metadata(state)
            assistance["options"] = []
            assistance["payload"] = {}
            assistance["message"] = ""
            assistance["moment"] = "pre_sql"
            metadata["targets"] = []
            metadata["synonyms"] = []
            metadata["used_filters"] = []
            metadata["fallback_options"] = []
            metadata["postfetch_ready"] = False
            metadata["postfetch_shown"] = False
            state["postfetch_clarification_exhausted"] = False
            state.pop("postfetch_clarification_turns", None)
            _set_assistance_needed(state, False)
            _set_gray_zone_reason(state, None)
            _set_gray_zone_details(state, {})
            _set_gray_zone_decision(state, {})
            _set_gray_zone_non_mappable(state, [])
            _set_gray_zone_warnings(state, [])

        if no_data == 1:
            response_message = NO_DATA_RESPONSE
        else:
            response_message = (
                f"Resultados: {results_json}\nTotal de Filas: {total_rows}"
            )

        result = {
            "messages": [AIMessage(content=response_message)],
            "sql": state.get("sql", {}),
            "rows_limit_applied": _get_rows_limit_applied(state),
            "rows_displayed": _get_sql_displayed_count(state) or 0,
            "fetch_failed": False,
        }
        gray_reason = _get_gray_zone_reason(state)
        gray_details = _get_gray_zone_details(state)
        if gray_reason:
            result["gray_zone_reason"] = gray_reason
        if gray_details:
            result["gray_zone_details"] = gray_details
        logger.info(
            "FLOW ▸ FETCH END rows={} more_than_limit={} fallback={} clarification_ready={}",
            total_rows,
            more_than_n_rows,
            state.get("used_fallback", False),
            _get_assistance_metadata(state).get("postfetch_ready", False),
        )
        logger.info(
            "FLOW ▸ PAYLOAD snapshot={}",
            {
                "used_keyword_regenerate": _get_keyword_used(state),
                "keyword_tokens": _get_keyword_tokens_tried(state),
                "keyword_original_filters": state.get("keyword_original_filters"),
                "used_fallback": state.get("used_fallback"),
                "fallback_sql": state.get("fallback_sql"),
                "fallback_rows": state.get("fallback_rows"),
                "gray_zone_reason": gray_reason,
                "gray_zone_details": gray_details,
                "response_type": state.get("response_type"),
            },
        )
        return result

    except Exception as e:
        # Intentamos poner la sesión en estado limpio
        try:
            state["db"].rollback()
        except Exception:
            pass

        # ⇣ store granular PG error for downstream regenerate_query
        error_info = parse_pg_error(e)
        _set_sql_execution(state, error=error_info)
        state["fetch_failed"] = True
        state["fetch_error_message"] = str(e)

        error_message = settings.staticmessages(
            "error_sqlquery", f"fetch-data-exception: {str(e)}"
        )
        logger.error(f"FLOW ▸ FETCH error={e}")
        return {
            "messages": [AIMessage(content=error_message)],
            "sql": state.get("sql", {}),
            "sql_error_info": _get_sql_error(state),
            "fetch_failed": True,
        }


# ═══════════════════════════════════════════════════════════════════════════
# SAFE INVOKE: LLM con manejo robusto de errores transitorios
# ═══════════════════════════════════════════════════════════════════════════
# Errores que sí deben reintentar (transitorios):
# - RateLimitError (429): límite de API excedido
# - APITimeoutError: timeout de red/API
# - APIConnectionError: problemas de conexión
# - InternalServerError (500): error temporal del servidor
#
# Errores que NO deben reintentar (permanentes):
# - AuthenticationError: API key inválida
# - InvalidRequestError: request mal formado
# - Excepciones de Python (bugs de código)
# ═══════════════════════════════════════════════════════════════════════════

# Importar excepciones específicas de OpenAI
try:
    from openai import (
        RateLimitError,
        APITimeoutError,
        APIConnectionError,
        InternalServerError,
    )

    TRANSIENT_ERRORS = (
        RateLimitError,
        APITimeoutError,
        APIConnectionError,
        InternalServerError,
    )
except ImportError:
    # Fallback si la versión de openai es antigua
    TRANSIENT_ERRORS = (Exception,)
    RateLimitError = Exception  # Fallback
    logger.warning(
        "SAFE_INVOKE ▸ Could not import specific OpenAI exceptions, using generic Exception"
    )


class RateLimitExhausted(Exception):
    """
    Raised when all retries have been exhausted due to rate limiting.
    This exception carries a user-friendly message for graceful degradation.
    """

    def __init__(self, message: str = None, original_exception: Exception = None):
        self.user_message = message or (
            "Estamos procesando muchas consultas en este momento. "
            "Por favor, intente nuevamente en unos segundos."
        )
        self.original_exception = original_exception
        super().__init__(self.user_message)


@backoff.on_exception(
    backoff.expo,
    TRANSIENT_ERRORS,
    max_tries=5,
    max_time=120,  # Timeout total de 2 minutos para todos los reintentos
    on_backoff=lambda details: _on_backoff_callback(details),
    on_giveup=lambda details: logger.error(
        "SAFE_INVOKE ▸ Giving up after {tries} tries ({exception})",
        tries=details.get("tries", 0),
        exception=str(details.get("exception", "Unknown"))[:200],
    ),
)
def safe_invoke(chain, params):
    """
    Ejecuta invoke con backoff exponencial para errores transitorios.

    - Reintenta: RateLimitError (429), Timeout, Connection errors
    - No reintenta: Auth errors, Invalid requests, bugs de código
    - Timeout total: 120 segundos para todos los reintentos
    - Throttle adaptativo: cuando hay 429, reduce concurrencia global
    """
    # Import here to avoid circular dependency
    from modules.utils.concurrency import adaptive_throttle

    # Apply throttle rate limiting (no-op if not throttled)
    with adaptive_throttle.rate_limit() as delay:
        if delay > 0:
            logger.debug("SAFE_INVOKE ▸ throttle_delay={:.2f}s", delay)
        return chain.invoke(params)


def graceful_safe_invoke(chain, params):
    """
    Wrapper around safe_invoke that converts rate limit exhaustion
    into a user-friendly RateLimitExhausted exception.

    Use this for user-facing calls where you want graceful degradation
    instead of a 500 error.
    """
    try:
        return safe_invoke(chain, params)
    except RateLimitError as e:
        logger.warning(
            "SAFE_INVOKE ▸ RATE_LIMIT_EXHAUSTED after all retries, returning friendly message"
        )
        raise RateLimitExhausted(original_exception=e)


def _on_backoff_callback(details):
    """Callback for backoff that activates throttle on RateLimitError (429)."""
    from modules.utils.concurrency import adaptive_throttle

    exception = details.get("exception")
    tries = details.get("tries", 0)
    max_tries = details.get("max_tries", 5)
    wait = details.get("wait", 0)

    # Activate throttle if this is a rate limit error
    try:
        if exception and "RateLimitError" in type(exception).__name__:
            # Extract retry-after from error message if available
            error_msg = str(exception)
            if "retry after" in error_msg.lower():
                # Parse "retry after X second" from Azure message
                import re

                match = re.search(r"retry after (\d+)", error_msg.lower())
                if match:
                    retry_after = int(match.group(1))
                    # Activate for longer than suggested to let things settle
                    adaptive_throttle.activate(
                        duration_override=max(30.0, retry_after * 5)
                    )
                else:
                    adaptive_throttle.activate()  # Default 30 seconds
            else:
                adaptive_throttle.activate()
    except Exception as e:
        logger.warning("SAFE_INVOKE ▸ throttle_activate_error={}", e)

    logger.info(
        "SAFE_INVOKE ▸ Retry {tries}/{max_tries} after {wait:.1f}s due to {exception}",
        tries=tries,
        max_tries=max_tries,
        wait=wait,
        exception=type(exception).__name__ if exception else "Unknown",
    )


def choose_sql_with_llm(state: dict) -> dict:
    """
    Elige entre múltiples SQL candidatas usando un LLM **solo** si hay 2 o más.
    Si hay 1 candidata válida (scored==1) o 1 candidata cruda (len(sql_list)==1),
    se salta el LLM para reducir hops y latencia.
    """

    scored = _get_sql_scored_list(state)
    sql_list = _get_sql_candidates(state)

    # Sin candidatas -> regenerar
    if not sql_list:
        logger.warning("choose_sql_with_llm: no hay sql_candidates → regenerate")
        return regenerate_query(state)

    # 🔸 Fast-path 1: EXACTAMENTE UNA candidata válida (len(scored)==1)
    if len(scored) == 1:
        # select_best_sql_candidate suele dejarla en state["sql_query"], si no, tomar del scored
        best_sql = _get_sql_query(state) or scored[0][1]
        try:
            best_idx = sql_list.index(best_sql)
        except ValueError:
            best_idx = 0
            best_sql = sql_list[0]

        _set_sql_query(state, best_sql)
        _set_sql_best(state, best_idx, "Skipped LLM choose: only one valid candidate.")
        logger.info("choose_sql_with_llm: single candidate → skip LLM")
    # Propagar estado consolidado hacia el grafo
    return {"sql": state.get("sql", {})}

    # 🔸 Fast-path 2: scored vacío pero hay 1 candidata cruda (evita “sql_scored_list vacío → regenerar”)
    if not scored and len(sql_list) == 1:
        best_sql = _get_sql_query(state) or sql_list[0]
        _set_sql_query(state, best_sql)
        _set_sql_best(state, 0, "Heuristic choose without LLM: single raw candidate.")
        logger.info("choose_sql_with_llm: one raw candidate → skip LLM")
    # Propagar estado consolidado hacia el grafo
    return {"sql": state.get("sql", {})}

    # Desde aquí: caso normal con 2+ candidatas → usar LLM
    if not scored:
        logger.warning(
            "choose_sql_with_llm: sql_scored_list vacío con múltiples candidatas → regenerate"
        )
        return regenerate_query(state)

    # Construcción de bloques para el LLM
    sql_block = "\n\n".join([f"[{i}] {s}" for i, s in enumerate(sql_list)])
    rows_block = json.dumps([t[2] for t in scored], ensure_ascii=False, indent=2)
    errors_block = json.dumps(
        [{"sql": t[1], "error": t[3]} for t in scored if t[3]],
        ensure_ascii=False,
        indent=2,
    )
    preview_n = ROWS_PREVIEW

    chain = create_chain(
        choose_sql_prompt,
        [
            "question",
            "sql_block",
            "rows_block",
            "errors_block",
            "schema_json",
            "rows_preview",
            "analysis",
        ],
        schema=SqlChoiceSchema,
    )
    resp = invoke_llm_chain(
        chain,
        {
            "question": state["complete_user_question"],
            "sql_block": sql_block,
            "rows_block": rows_block,
            "errors_block": errors_block,
            "schema_json": state.get("schema_minimal_json", SCHEMA_MINIMAL_JSON),
            "rows_preview": preview_n,
            "analysis": _get_effective_analysis_text(state, "{}"),
        },
        label="fetch.choose_sql",
    )

    if not (0 <= resp.best_idx < len(sql_list)):
        raise ValueError(f"best_idx fuera de rango: {resp.best_idx}")

    _set_sql_query(state, sql_list[resp.best_idx])
    _set_sql_best(state, resp.best_idx, resp.rationale)
    # Propagar estado consolidado hacia el grafo
    return {"sql": state.get("sql", {})}


## --------------


# SQL

# ─────────────────────────────────────────────────────────────
# Fetch nodes adicionales (movidos desde nodes.py)
# ─────────────────────────────────────────────────────────────


def generate_sql_candidates(state: AgentState):
    """
    Genera varias SQL usando el análisis LLM y los documentos.
    - Filtra el schema con las tablas del analyzer (rama compleja).
    - Reintenta la invocación del LLM de forma suave si falla.
    - Refuerza OR semántico si el analyzer lo detectó.
    - Evita duplicados con una normalización más estricta.
    """
    logger.info(
        "\n\n ---> SQL ▸ CANDIDATES START total={} country={}",
        NUM_SQL_CANDIDATES,
        state.get("country_code"),
    )

    analysis = _get_effective_analysis_text(state, "-- No analysis provided --")

    # Inyectar información de optimización de joins
    join_opt_enabled = state.get("join_optimization_enabled", True)
    filters_by_table = state.get("filters_by_table", {})

    if join_opt_enabled and filters_by_table:
        has_base_filters = len(filters_by_table.get("p", [])) > 0
        has_territorial_filters = len(filters_by_table.get("t", [])) > 0
        has_funding_filters = len(filters_by_table.get("f", [])) > 0

        if has_base_filters and (has_territorial_filters or has_funding_filters):
            join_opt_note = "\n\n### JOIN OPTIMIZATION ENABLED\n"
            join_opt_note += f"- Base table filters (p.*): {len(filters_by_table.get('p', []))} filters\n"
            if has_territorial_filters:
                join_opt_note += f"- Territorial filters (t.*): {len(filters_by_table.get('t', []))} filters → Move to ON clause\n"
            if has_funding_filters:
                join_opt_note += f"- Funding filters (f.*): {len(filters_by_table.get('f', []))} filters → Move to ON clause\n"
            join_opt_note += "- Apply base filters in WHERE, then join with ON clause filters for performance.\n"

            analysis = analysis + join_opt_note

            logger.info(
                "\n\n ---> SQL ▸ CANDIDATES JOIN_OPT injected base={} territorial={} funding={}",
                len(filters_by_table.get("p", [])),
                len(filters_by_table.get("t", [])),
                len(filters_by_table.get("f", [])),
            )

    docs = state.get("documents", "")
    docs_fewshots = (state.get("documents_fewshots", "") or "").strip()
    dynamic_fewshots = (state.get("dynamic_fewshots", "") or "").strip()

    # 0) Schema filtrado por las tablas que el analyzer marcó como relevantes
    _derive_modules_from_analyzer(state)
    tables_set = _get_analyzer_tables(state)
    try:
        base_schema_json = (
            state.get("schema_intermediate_json") or INTERMEDIATE_SCHEMA_JSON
        )
    except NameError:
        base_schema_json = (
            state.get("schema_intermediate_json")
            or state.get("schema_intermediate_json_default")
            or "{}"
        )
    schema_json_filtered = _filter_schema_json(base_schema_json, tables_set)
    state["schema_intermediate_json"] = (
        schema_json_filtered  # mantener consistencia aguas abajo
    )

    # 1) Fewshots combinados (priorizando dinámicos)
    combined_fewshots = docs_fewshots
    if dynamic_fewshots:
        blocks = [f"PRIORITY FEWSHOTS\n{dynamic_fewshots}"]
        if docs_fewshots:
            blocks.append(docs_fewshots)
        combined_fewshots = "\n\n".join(blocks)

    relaxed_catalog_columns = state.get("catalog_filters_relaxed_columns") or []
    if relaxed_catalog_columns:
        note = (
            "CATALOG FILTERS RELAXED\n"
            "La igualdad estricta por catálogo no devolvió filas; ahora puedes usar keywords textuales para ampliar la búsqueda.\n"
            f"Columnas relajadas: {', '.join(relaxed_catalog_columns)}"
        )
        combined_fewshots = (combined_fewshots + "\n\n" + note).strip()

    candidates: list[str] = []
    sql_rows_limit = (
        _get_rows_limit_applied(state)
        or _get_rows_limit_default(state)
        or settings.sql_rows_limit
    )

    modules = _get_analysis_modules(state)
    include_territorial = bool(modules.get("territory"))
    include_funding = bool(modules.get("funding"))
    prompt_generate_sql = build_generate_sql_query_prompt(
        include_territorial=include_territorial,
        include_funding=include_funding,
    )

    # Hints de dimensiones (opcionales)
    dim_summary = state.get("dimension_hints_summary") or ""
    dim_hints = state.get("dimension_hints") or {}
    dim_vocab = state.get("dimension_vocabulary") or {}

    # Utilidad local para dedupe robusto
    def _norm_for_dedupe(s: str) -> str:
        return " ".join((s or "").split()).rstrip(" ;").casefold()

    # Semántic OR (si el analyzer lo dejó en analysis)
    semantic_or_groups = _get_semantic_or_groups(state)

    for i in range(NUM_SQL_CANDIDATES):
        logger.info("\n\n ---> SQL ▸ CANDIDATE build index={}", i)

        # ⚠️ Usar el prompt modular con el schema filtrado
        chain = create_chain(
            prompt_generate_sql,
            [
                "analysis",
                "context",
                "context_fewshots",
                "question",
                "schema_json",
                "country_code",
                "sql_rows_limit",
                "dimension_hints_summary",
                "dimension_hints",
                "dimension_vocabulary",
            ],
            schema=sql_query,
        )

        # 2) invoke con invoke_llm_chain (incluye reintentos automáticos con tenacity)
        try:
            resp = invoke_llm_chain(
                chain,
                {
                    "analysis": analysis,
                    "context": docs,  # el prompt espera 'context'
                    "context_fewshots": combined_fewshots,
                    "question": state["complete_user_question"],
                    "schema_json": schema_json_filtered,
                    "country_code": state["country_code"],
                    "sql_rows_limit": sql_rows_limit,
                    "dimension_hints_summary": dim_summary,
                    "dimension_hints": dim_hints,
                    "dimension_vocabulary": dim_vocab,
                },
                label=f"fetch.generate_sql_candidate_{i}",
            )
        except Exception as e:
            logger.error(
                "\n\n ---> SQL ▸ CANDIDATE invoke_failed index={} err={}", i, e
            )
            continue

        # 3) Limpieza base
        raw_sql = getattr(resp, "sql_query", "") if resp else ""
        sql_clean = " ".join(raw_sql.split()).rstrip(" ;")

        # 4) Refuerzo OR semántico si aplica
        if semantic_or_groups:
            try:
                sql_with_or = apply_semantic_or_from_groups(
                    sql_clean, semantic_or_groups
                )
                if sql_with_or and sql_with_or != sql_clean:
                    logger.info(
                        "\n\n ---> SQL ▸ CANDIDATE applied_semantic_or index={} groups={}",
                        i,
                        len(semantic_or_groups),
                    )
                    sql_clean = sql_with_or
            except Exception as e:
                logger.warning(
                    "\n\n ---> SQL ▸ CANDIDATE semantic_or_apply_error index={} err={}",
                    i,
                    e,
                )

        structured_filters = state.get("structured_text_filters") or []
        if structured_filters:
            sql_clean = _apply_structured_text_filters(sql_clean, structured_filters)

        # 5) Aplicar refined filters si hay
        refined_filters = state.get("refined_text_filters") or []
        if refined_filters:
            skip_columns = _get_catalog_applied_columns(state)
            sql_with_filters, applied_ids = _apply_refined_filters_to_sql(
                sql_clean,
                refined_filters,
                skip_columns=skip_columns,
            )
            if applied_ids:
                logger.info(
                    "\n\n ---> SQL ▸ CANDIDATE applied_refined_filters index={} filters={}",
                    i,
                    applied_ids,
                )
            sql_clean = sql_with_filters

        # 6) Evitar duplicados (normalización fuerte)
        norm = _norm_for_dedupe(sql_clean)
        if any(_norm_for_dedupe(c) == norm for c in candidates):
            logger.info("\n\n ---> SQL ▸ CANDIDATE duplicate_skip index={}", i)
            continue

        candidates.append(sql_clean)
        logger.debug("\n\n ---> SQL ▸ CANDIDATE SQL[{}] {}", i, sql_clean)

    _set_sql_candidates(state, candidates)
    logger.info("\n\n ---> SQL ▸ CANDIDATES END generated={}", len(candidates))
    # Propagar estado consolidado hacia el grafo
    return {"sql": state.get("sql", {})}


def select_best_sql_candidate(state: dict):
    """
    Evaluates a SQL candidate in 3 sequential steps:

    1. Runs EXPLAIN to validate syntax and schema correctness.
    - If EXPLAIN fails (e.g. invalid table, syntax error), the query is discarded (score = -1).

    2. If EXPLAIN succeeds, executes a limited version of the query (LIMIT 3) to preview results.

    3. Assigns a score based on the number of rows returned:
    - Score = 90 if ≥1 row is returned.
    - Score = 85 if 0 rows are returned (light penalty).

    Returns a tuple: (score, preview_rows, error_message).
    Used to select the best SQL candidate.
    """
    logger.info(
        "\n\n ---> SQL ▸ SELECT START candidates={}",
        len(_get_sql_candidates(state)),
    )
    sql_list = _get_sql_candidates(state)
    # Analyzer guidance for territorial joins
    analysis_text = _get_effective_analysis_text(state, "", uppercase=True)
    no_territorial_needed = (
        "NO_TERRITORIAL_JOIN_REQUIRED" in analysis_text
        and "STG_MAPAINV_PROYECTOSTERRITORIOS" not in analysis_text
    )
    if not sql_list:
        logger.warning("\n\n ---> SQL ▸ SELECT no_candidates")
        _set_sql_scored_list(state, [])  # ← evita KeyError aguas abajo
        return regenerate_query(state)

    db = state["db"]
    scored = []

    for idx, sql in enumerate(sql_list):
        if not sql.strip():
            logger.warning(f"\n\n ---> SQL ▸ SELECT empty_candidate index={idx}")
            continue
        score, preview, error = _score_query(db, sql)
        # ── Custom penalty: unnecessary territorial join ────────────────
        if no_territorial_needed and re.search(
            r"\bstg_mapainv_proyectosterritorios\b", sql, re.I
        ):
            logger.info(
                f"\n\n ---> SQL ▸ SELECT apply_penalty index={idx} reason=territorial_join"
            )
            score -= TERRITORIAL_PENALTY
        if score < 0:
            logger.warning(f"\n\n ---> SQL ▸ SELECT discard index={idx} error={error}")
            continue
        scored.append((score, sql, preview, error))
        logger.info(
            "\n\n ---> SQL ▸ SELECT candidate_ok index={} score={} preview_rows={}",
            idx,
            score,
            len(preview),
        )

    if not scored:
        logger.warning("\n\n ---> SQL ▸ SELECT none_valid")
        _set_sql_scored_list(state, scored)  # guarda lista vacía para consistencia
        return regenerate_query(state)

    # Ordenar por score descendente y elegir la mejor
    scored.sort(key=lambda t: t[0], reverse=True)
    best_score, best_sql, best_preview, best_error = scored[0]

    best_sql_clean = _prep_for_preview(best_sql)
    _set_sql_query(state, best_sql_clean, raw=best_sql)
    _set_sql_scored_list(state, scored)

    strong_missing, soft_missing = _find_missing_filters(state, best_sql_clean)
    if soft_missing:
        state["soft_missing_filters"] = soft_missing
    else:
        state.pop("soft_missing_filters", None)

    if strong_missing and not state.get("_filters_enforced"):
        state["_filters_enforced"] = True
        state["missing_filters_errors"] = strong_missing
        logger.warning(
            "\n\n ---> SQL ▸ SELECT missing_filters strong={} → regenerate",
            strong_missing,
        )
        return regenerate_query(state)
    elif strong_missing:
        logger.warning(
            "\n\n ---> SQL ▸ SELECT missing_filters_persist={} proceeding",
            strong_missing,
        )

    # --- Fast-path flag: if exactly one candidate is valid (or only one input) ---
    try:
        only_one_ok = len(scored) == 1
    except Exception:
        only_one_ok = False
    try:
        only_one_input = len(sql_list) == 1
    except Exception:
        only_one_input = False

    if only_one_ok or only_one_input:
        state["best_sql_decided"] = True
        logger.info(
            "\n\n ---> SQL ▸ SELECT best_sql_decided=True reason={}",
            "one_valid" if only_one_ok else "one_input",
        )
    else:
        # Evitar arrastrar el flag de ejecuciones previas
        state.pop("best_sql_decided", None)

    if best_sql_clean.strip() != best_sql.strip():
        logger.debug(f"\n\n ---> SQL ▸ SELECT cleaned_sql={best_sql_clean}")

    try:
        chosen_index = sql_list.index(best_sql)
    except ValueError:
        chosen_index = 0
    logger.info(
        "\n\n ---> SQL ▸ SELECT END choice_index={} score={} preview_rows={} strong_missing={} soft_missing={}",
        chosen_index,
        best_score,
        len(best_preview),
        len(strong_missing),
        len(soft_missing),
    )

    return {"sql": state.get("sql", {})}
