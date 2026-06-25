# helpers_estado.py
"""
Funciones de manejo de estado del grafo.

Incluye:
- _get_*: Lectores de campos del estado
- _set_*: Escritores de campos del estado
- _init_*: Inicializadores de estructuras
- _ensure_*: Garantizadores de contenedores

Todas las funciones operan sobre AgentState.
"""

from __future__ import annotations

import json
from collections.abc import MutableMapping
from typing import Any, Dict, List, Optional, Sequence

from loguru import logger

from modules.graph.state import AgentState

# ═══════════════════════════════════════════════════════════════════════════
# Configuración - constantes importadas desde módulo de texto
# ═══════════════════════════════════════════════════════════════════════════
MAX_CLARIFICATION_TURNS = 2  # Valor por defecto, se puede sobrescribir


# ═══════════════════════════════════════════════════════════════════════════
# SQL Container Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _ensure_sql_container(state: AgentState) -> Dict[str, Any]:
    """Garantiza que `state["sql"]` exista y sea un dict."""
    sql_obj = state.get("sql")
    if not isinstance(sql_obj, dict):
        sql_obj = {}
        if isinstance(state, MutableMapping):
            state["sql"] = sql_obj
    return sql_obj


def _set_sql_query(state: AgentState, query: str, raw: Optional[str] = None) -> None:
    """Escribe la SQL consolidada en el contenedor canonical."""
    sql_obj = _ensure_sql_container(state)
    sql_obj["query"] = query
    if raw is not None:
        sql_obj["query_raw"] = raw


def _get_sql_query(state: AgentState) -> str:
    """Obtiene la SQL consolidada almacenada en el estado."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        query = sql_obj.get("query")
        if isinstance(query, list):
            return query[0] if query else ""
        if isinstance(query, str):
            return query
    return ""


def _get_sql_query_raw(state: AgentState) -> str:
    """Obtiene la SQL original almacenada en el estado (query_raw si existe)."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        raw = sql_obj.get("query_raw")
        if isinstance(raw, list):
            return raw[0] if raw else ""
        if isinstance(raw, str):
            return raw
    return _get_sql_query(state)


def _set_sql_execution(
    state: AgentState,
    rowcount: Optional[int] = None,
    more_than_limit: Optional[bool] = None,
    error: Optional[Dict[str, Any]] = None,
    retry_count: Optional[int] = None,
    results: Optional[Any] = None,
    cached_results: Optional[Any] = None,
    displayed_count: Optional[int] = None,
) -> None:
    """Actualiza datos de ejecución SQL dentro de la estructura consolidada."""
    sql_obj = _ensure_sql_container(state)
    execution = sql_obj.setdefault("execution", {})

    if rowcount is not None:
        execution["rowcount"] = rowcount
    if more_than_limit is not None:
        execution["more_than_limit"] = more_than_limit
    if error is not None:
        execution["error"] = error
    if retry_count is not None:
        execution["retry_count"] = retry_count
    if results is not None:
        execution["results"] = results
    if cached_results is not None:
        execution["cached_results"] = cached_results
    if displayed_count is not None:
        execution["displayed_count"] = displayed_count


def _get_sql_rowcount(state: AgentState) -> int:
    """Obtiene la cantidad total de filas reportadas por la ejecución SQL."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            return execution.get("rowcount", 0) or 0
    return 0


def _get_sql_more_than_limit(state: AgentState) -> bool:
    """Indica si la ejecución SQL devolvió más filas que el límite aplicado."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            return bool(execution.get("more_than_limit", False))
    return False


def _get_sql_results(state: AgentState) -> Any:
    """Obtiene los resultados crudos de la última ejecución SQL."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            return execution.get("results")
    return None


def _get_sql_cached_results(state: AgentState) -> Any:
    """Obtiene los resultados provenientes del cache semántico."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            return execution.get("cached_results")
    return None


def _get_sql_displayed_count(state: AgentState) -> Optional[int]:
    """Obtiene la cantidad de filas mostradas tras aplicar límites."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            value = execution.get("displayed_count")
            if value is not None:
                return value
    return None


def _get_sql_error(state: AgentState) -> Dict[str, Any]:
    """Obtiene la información estructurada del último error SQL."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        execution = sql_obj.get("execution")
        if isinstance(execution, dict):
            error = execution.get("error")
            if isinstance(error, dict):
                return error
    return {}


# ═══════════════════════════════════════════════════════════════════════════
# SQL Generation Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _set_sql_candidates(state: AgentState, candidates: list[str]) -> None:
    """Escribe SQL candidates en la estructura consolidada."""
    sql_obj = _ensure_sql_container(state)
    generation = sql_obj.setdefault("generation", {})
    generation["candidates"] = candidates


def _get_sql_candidates(state: AgentState) -> list[str]:
    """Lee SQL candidates desde sql.generation."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        generation = sql_obj.get("generation")
        if isinstance(generation, dict):
            candidates = generation.get("candidates", [])
            return candidates if isinstance(candidates, list) else []
    return []


def _set_sql_scored_list(state: AgentState, scored: list) -> None:
    """Escribe SQL scored list en la estructura consolidada."""
    sql_obj = _ensure_sql_container(state)
    generation = sql_obj.setdefault("generation", {})
    generation["scored"] = scored


def _get_sql_scored_list(state: AgentState) -> list:
    """Lee SQL scored list desde sql.generation."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        generation = sql_obj.get("generation")
        if isinstance(generation, dict):
            scored = generation.get("scored", [])
            return scored if isinstance(scored, list) else []
    return []


def _set_sql_best(state: AgentState, best_idx: int, rationale: str) -> None:
    """Escribe best SQL candidate index y rationale en la estructura consolidada."""
    sql_obj = _ensure_sql_container(state)
    generation = sql_obj.setdefault("generation", {})
    generation["best_index"] = best_idx
    generation["rationale"] = rationale


# ═══════════════════════════════════════════════════════════════════════════
# SQL Keyword Regeneration Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _init_keyword_regeneration(state: AgentState) -> Dict[str, Any]:
    """Inicializa el contenedor de keyword regeneration en sql.keyword_regeneration."""
    sql_obj = _ensure_sql_container(state)
    if "keyword_regeneration" not in sql_obj:
        sql_obj["keyword_regeneration"] = {
            "used": False,
            "tokens_tried": [],
            "replacements": [],
        }
    return sql_obj["keyword_regeneration"]


def _get_keyword_used(state: AgentState) -> bool:
    """Devuelve si se usó keyword regeneration."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        kw_regen = sql_obj.get("keyword_regeneration")
        if isinstance(kw_regen, dict):
            return bool(kw_regen.get("used", False))
    return False


def _set_keyword_used(state: AgentState, used: bool) -> None:
    """Setea si se usó keyword regeneration."""
    kw_regen = _init_keyword_regeneration(state)
    kw_regen["used"] = used


def _get_keyword_tokens_tried(state: AgentState) -> List[str]:
    """Devuelve los tokens probados en keyword regeneration."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        kw_regen = sql_obj.get("keyword_regeneration")
        if isinstance(kw_regen, dict):
            tokens = kw_regen.get("tokens_tried", [])
            if isinstance(tokens, list):
                return tokens
    return []


def _set_keyword_tokens_tried(state: AgentState, tokens: List[str]) -> None:
    """Setea los tokens probados en keyword regeneration."""
    kw_regen = _init_keyword_regeneration(state)
    kw_regen["tokens_tried"] = list(tokens) if tokens else []


def _get_keyword_replacements(state: AgentState) -> List[Dict[str, Any]]:
    """Devuelve los reemplazos de keywords."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        kw_regen = sql_obj.get("keyword_regeneration")
        if isinstance(kw_regen, dict):
            replacements = kw_regen.get("replacements", [])
            if isinstance(replacements, list):
                return replacements
    return []


def _set_keyword_replacements(
    state: AgentState, replacements: List[Dict[str, Any]]
) -> None:
    """Setea los reemplazos de keywords."""
    kw_regen = _init_keyword_regeneration(state)
    kw_regen["replacements"] = list(replacements) if replacements else []


def _clear_keyword_regeneration(state: AgentState) -> None:
    """Limpia todos los datos de keyword regeneration."""
    sql_obj = state.get("sql")
    if isinstance(sql_obj, dict):
        sql_obj.pop("keyword_regeneration", None)


# ═══════════════════════════════════════════════════════════════════════════
# Dimensions Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _ensure_dimensions_container(state: AgentState) -> Dict[str, Any]:
    """Garantiza que `state["dimensions"]` exista."""
    dimensions = state.get("dimensions")
    if not isinstance(dimensions, dict):
        dimensions = {}
        if isinstance(state, MutableMapping):
            state["dimensions"] = dimensions
    return dimensions


def _set_dimensions_catalog(
    state: AgentState, catalog: Optional[Dict[str, Any]]
) -> None:
    """Actualiza el catálogo consolidado."""
    container = _ensure_dimensions_container(state)
    container["catalog"] = catalog or {}


def _get_dimensions_catalog(state: AgentState) -> Dict[str, Any]:
    """Obtiene el catálogo de dimensiones consolidado."""
    container = _ensure_dimensions_container(state)
    catalog = container.get("catalog")
    return catalog if isinstance(catalog, dict) else {}


def _ensure_dimensions_loaded(state: AgentState) -> None:
    """
    Lazy-load dimensions catalog only when needed (is_relevant="yes").

    OPTIMIZACIÓN: En vez de cargar dimensions para TODAS las consultas (incluidos
    saludos, soporte, definiciones), solo las cargamos cuando el flujo SQL las necesita.
    """
    existing = _get_dimensions_catalog(state)
    if existing:
        logger.debug("DIMENSIONS already loaded, skipping")
        return

    country_code = state.get("country_code", "")
    db = state.get("db")

    if not country_code or not db:
        logger.warning(
            "DIMENSIONS cannot load: country_code={} db={}",
            bool(country_code),
            bool(db),
        )
        return

    # Importar aquí para evitar import circular
    from modules.utils.dimension_utils import get_dimension_catalog

    logger.info("DIMENSIONS lazy-loading for country={}", country_code)
    dimension_catalog = get_dimension_catalog(country_code, db)
    _set_dimensions_catalog(state, dimension_catalog)
    logger.info(
        "DIMENSIONS loaded: sectors={} entities={} states={} funding={} territories={}",
        len(dimension_catalog.get("sectors", [])),
        len(dimension_catalog.get("entities", [])),
        len(dimension_catalog.get("states", [])),
        len(dimension_catalog.get("funding_sources", [])),
        len(dimension_catalog.get("territories", [])),
    )


def _get_filtered_dimensions_for_analyzer(
    state: AgentState,
    question: str,
    max_per_category: int = 10,
    max_territories: int = 30,
) -> Dict[str, Any]:
    """
    Filtra el catálogo de dimensiones para enviar solo las relevantes al analyzer.

    Usa token overlap + fuzzy matching con funciones existentes del proyecto.
    Reduce ~204 items a ~30-50 relevantes, ahorrando tokens en el prompt.

    Args:
        state: Estado del agente con el catálogo cargado
        question: Pregunta del usuario
        max_per_category: Máximo items por categoría (default 10)
        max_territories: Máximo de territorios a incluir (default 30)

    Returns:
        Catálogo filtrado con solo las dimensiones relevantes
    """
    from modules.utils.text_processing import tokenize_like_process_text
    from modules.graph.helpers_texto import _fuzzy_match_from_catalog

    logger.info("DIMENSIONS_FILTER ▸ START question_tokens pending")

    full_catalog = _get_dimensions_catalog(state)
    if not full_catalog or not question:
        logger.info("DIMENSIONS_FILTER ▸ SKIP empty catalog or question")
        return full_catalog or {}

    question_tokens = set(tokenize_like_process_text(question))
    if not question_tokens:
        logger.info("DIMENSIONS_FILTER ▸ SKIP no question tokens")
        return full_catalog

    logger.info(
        f"DIMENSIONS_FILTER ▸ TOKENS question_tokens={list(question_tokens)[:10]}"
    )

    filtered_catalog: Dict[str, Any] = {}
    total_original = 0
    total_filtered = 0

    categories = ["sectors", "entities", "states", "funding_sources", "territories"]
    for category in categories:
        items = full_catalog.get(category, [])
        if not items:
            filtered_catalog[category] = []
            continue

        total_original += len(items)
        matched: list = []
        remaining: list = []
        cap = max_territories if category == "territories" else max_per_category

        # Capa 1: Token overlap
        for item in items:
            item_tokens = set(tokenize_like_process_text(str(item)))
            if question_tokens & item_tokens:
                matched.append(item)
            else:
                remaining.append(item)

        # Capa 2: Fuzzy match para los que no matchearon (si hay espacio)
        for item in remaining:
            if category != "territories" and len(matched) >= cap:
                break
            _, score = _fuzzy_match_from_catalog(question, [item], threshold=0.7)
            if score >= 0.7:
                matched.append(item)

        if category == "territories":
            # Para territorios: si hay matches, no recortar; si no hay matches, no enviar lista y delegar al resolver backend
            if matched:
                filtered_catalog[category] = matched  # sin truncar matches relevantes
            else:
                filtered_catalog[category] = []  # no sesgar con un top-N arbitrario
                filtered_catalog["territories_note"] = (
                    "Territorios se resuelven en backend con territorial_resolver; no intentes mapearlos aquí."
                )
        else:
            filtered_catalog[category] = matched[:cap]
        total_filtered += len(filtered_catalog[category])

    # Copiar campos que no se filtran
    for key in ["year_range"]:
        if key in full_catalog:
            filtered_catalog[key] = full_catalog[key]

    logger.info(
        f"DIMENSIONS_FILTER ▸ END original={total_original} filtered={total_filtered} reduction={100 - (total_filtered * 100 // max(total_original, 1))}%"
    )

    return filtered_catalog


def _init_dimensions(state: AgentState) -> None:
    """Inicializa estructura de dimensiones con defaults."""
    dimensions = state.get("dimensions")
    if not isinstance(dimensions, dict):
        dimensions = {}
        state["dimensions"] = dimensions
    dimensions.setdefault("catalog", {})
    dimensions.setdefault("hints", {})
    dimensions.setdefault("suggestions", [])


def _set_dimension_suggestions(state: AgentState, suggestions: list) -> None:
    """Setea las sugerencias de dimensiones."""
    _init_dimensions(state)
    state["dimensions"]["suggestions"] = suggestions


def _get_dimension_suggestions(state: AgentState) -> list:
    """Obtiene las sugerencias de dimensiones."""
    dimensions = state.get("dimensions")
    if dimensions and isinstance(dimensions, dict):
        return dimensions.get("suggestions", [])
    return []


def _clear_dimension_suggestions(state: AgentState) -> None:
    """Limpia las sugerencias de dimensiones."""
    dimensions = state.get("dimensions")
    if dimensions and isinstance(dimensions, dict):
        dimensions["suggestions"] = []


# ═══════════════════════════════════════════════════════════════════════════
# Analysis Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _init_analysis(state: AgentState) -> None:
    """Inicializa la estructura de análisis con todos sus sub-contenedores."""
    if "analysis" not in state:
        state["analysis"] = {
            "raw_text": "",
            "filters": {
                "all": [],
                "confidence_map": {},
                "low_confidence": [],
                "soft_missing": [],
                "used_columns": [],
            },
            "tables": {
                "list": [],
                "count": 0,
            },
            "complexity": {
                "is_complex": False,
                "join_count": 0,
                "filter_count": 0,
                "has_groupby": False,
            },
            "modules": {
                "territory": False,
                "funding": False,
            },
            "schema": {
                "minimal": "",
                "intermediate": "",
            },
            "uncertainties": {
                "reason": None,
                "decision": {},
                "details": {},
                "non_mappable": [],
                "warnings": [],
                "actions": [],
            },
            "theme": {
                "strategy": {},
                "semantic_or_groups": [],
            },
        }


def _get_analysis_raw_text(state: AgentState) -> str:
    """Obtiene el texto raw del analysis."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        return analysis.get("raw_text", "")
    return ""


def _set_analysis_raw_text(state: AgentState, text: str) -> None:
    """Setea el texto raw del analysis."""
    _init_analysis(state)
    state["analysis"]["raw_text"] = text


def _get_effective_analysis_text(
    state: AgentState,
    default: str = "",
    *,
    uppercase: bool = False,
) -> str:
    """Obtiene el análisis efectivo (refinado o raw)."""
    selected: str | None = None
    refined = state.get("refined_analysis_text")
    if refined:
        refined_text = str(refined).strip()
        if refined_text:
            selected = refined_text
    if selected is None:
        raw_text = _get_analysis_raw_text(state).strip()
        if raw_text:
            selected = raw_text
    if selected is None:
        selected = (default or "").strip()
    if uppercase:
        return selected.upper()
    return selected


def _set_analysis_filters(state: AgentState, filters: List[Dict[str, Any]]) -> None:
    """Setea los filtros del analysis."""
    _init_analysis(state)
    state["analysis"]["filters"]["all"] = filters


def _get_analysis_filters(state: AgentState) -> List[Dict[str, Any]]:
    """Obtiene los filtros del analysis."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        filters_dict = analysis.get("filters", {})
        if isinstance(filters_dict, dict):
            return filters_dict.get("all", [])
    return []


def _get_analysis_filter_confidence_map(state: AgentState) -> Dict[str, float]:
    """Obtiene el mapa de confianza de filtros."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        filters_dict = analysis.get("filters", {})
        if isinstance(filters_dict, dict):
            conf_map = filters_dict.get("confidence_map", {})
            if isinstance(conf_map, dict):
                return dict(conf_map)
    return {}


def _get_analysis_used_columns(state: AgentState) -> List[str]:
    """Obtiene las columnas usadas del analysis (pobladas por llm_analyzer)."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        filters_dict = analysis.get("filters", {})
        if isinstance(filters_dict, dict):
            used_cols = filters_dict.get("used_columns", [])
            if isinstance(used_cols, list):
                return used_cols
    return []


def _set_analysis_tables(state: AgentState, tables: List[str]) -> None:
    """Setea las tablas del analysis."""
    _init_analysis(state)
    state["analysis"]["tables"]["list"] = tables
    state["analysis"]["tables"]["count"] = len(tables)


def _get_analysis_tables_list(state: AgentState) -> List[str]:
    """Obtiene la lista de tablas del analysis."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        tables_dict = analysis.get("tables", {})
        if isinstance(tables_dict, dict):
            return tables_dict.get("list", [])
    return []


def _get_analyzer_tables(state: AgentState) -> set[str]:
    """Obtiene las tablas del analyzer normalizadas."""
    tables = state.get("analyzer_tables")
    if tables and isinstance(tables, list):
        return {str(t).lower() for t in tables if t}
    tables_analysis = _get_analysis_tables_list(state)
    return {str(t).lower() for t in (tables_analysis or []) if t}


def _set_analysis_modules(state: AgentState, *, territory: bool, funding: bool) -> None:
    """Setea los módulos del analysis."""
    _init_analysis(state)
    modules = state["analysis"].setdefault("modules", {})
    modules["territory"] = bool(territory)
    modules["funding"] = bool(funding)


def _get_analysis_modules(state: AgentState) -> Dict[str, Any]:
    """Obtiene los módulos del analysis."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        modules = analysis.get("modules")
        if isinstance(modules, dict):
            return modules
    return {}


def _set_complexity(
    state: AgentState,
    is_complex: bool,
    join_count: int,
    filter_count: int,
    has_groupby: bool,
) -> None:
    """Setea la complejidad del analysis."""
    _init_analysis(state)
    state["analysis"]["complexity"] = {
        "is_complex": is_complex,
        "join_count": join_count,
        "filter_count": filter_count,
        "has_groupby": has_groupby,
    }


def _get_is_complex(state: AgentState) -> bool:
    """Obtiene si el análisis es complejo."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        complexity = analysis.get("complexity", {})
        if isinstance(complexity, dict):
            return complexity.get("is_complex", False)
    return False


# ═══════════════════════════════════════════════════════════════════════════
# Theme Strategy Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _get_theme_strategy(state: AgentState) -> Dict[str, Any]:
    """
    Obtiene la estrategia de tema desde el analysis.

    Si no está disponible en theme.strategy, intenta obtener los keywords
    desde el analysis raw (parsed) como fallback.
    """
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        theme = analysis.get("theme")
        if isinstance(theme, dict):
            strategy = theme.get("strategy")
            if isinstance(strategy, dict):
                return dict(strategy)

        # FALLBACK: Si no hay strategy pero hay analysis raw
        analysis_raw = analysis.get("raw") or analysis.get("parsed")
        if analysis_raw and isinstance(analysis_raw, dict):
            theme_raw = analysis_raw.get("theme") or {}
            if isinstance(theme_raw, dict):
                strategy_raw = theme_raw.get("strategy")
                if isinstance(strategy_raw, dict):
                    logger.debug(
                        "FLOW ▸ THEME_STRATEGY using fallback from analysis.raw"
                    )
                    return dict(strategy_raw)

            # FALLBACK adicional
            theme_match = analysis_raw.get("THEME_MATCH_STRATEGY") or {}
            if isinstance(theme_match, dict):
                keywords = theme_match.get("keywords")
                if keywords and isinstance(keywords, list):
                    logger.debug("FLOW ▸ THEME_STRATEGY using fallback keywords")
                    return {"keywords": keywords}

    return {}


def _set_theme_strategy(state: AgentState, strategy: Dict[str, Any]) -> None:
    """Setea la estrategia de tema."""
    _init_analysis(state)
    theme = state["analysis"].setdefault("theme", {})
    theme["strategy"] = dict(strategy) if isinstance(strategy, dict) else {}


def _get_semantic_or_groups(state: AgentState) -> List[Dict[str, Any]]:
    """Obtiene los grupos semánticos OR."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        theme = analysis.get("theme")
        if isinstance(theme, dict):
            groups = theme.get("semantic_or_groups")
            if isinstance(groups, list):
                return groups
    return []


def _set_semantic_or_groups(
    state: AgentState, groups: Sequence[Dict[str, Any]] | None
) -> None:
    """Setea los grupos semánticos OR."""
    _init_analysis(state)
    theme = state["analysis"].setdefault("theme", {})
    if groups:
        theme["semantic_or_groups"] = list(groups)
    else:
        theme["semantic_or_groups"] = []


# ═══════════════════════════════════════════════════════════════════════════
# Gray Zone Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _set_gray_zone_reason(state: AgentState, reason: Optional[str]) -> None:
    """Setea la razón de zona gris."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["reason"] = reason


def _get_gray_zone_reason(state: AgentState) -> Optional[str]:
    """Obtiene la razón de zona gris."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("reason")
    return None


def _set_gray_zone_decision(state: AgentState, decision: Dict[str, Any]) -> None:
    """Setea la decisión de zona gris."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["decision"] = decision


def _get_gray_zone_decision(state: AgentState) -> Dict[str, Any]:
    """Obtiene la decisión de zona gris."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("decision", {})
    return {}


def _set_gray_zone_details(state: AgentState, details: Dict[str, Any]) -> None:
    """Setea los detalles de zona gris."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["details"] = details


def _get_gray_zone_details(state: AgentState) -> Dict[str, Any]:
    """Obtiene los detalles de zona gris."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("details", {})
    return {}


def _set_gray_zone_non_mappable(
    state: AgentState, non_mappable: List[Dict[str, Any]]
) -> None:
    """Setea los filtros no mapeables."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["non_mappable"] = non_mappable


def _get_gray_zone_non_mappable(state: AgentState) -> List[Dict[str, Any]]:
    """Obtiene los filtros no mapeables."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("non_mappable", [])
    return []


def _set_gray_zone_warnings(state: AgentState, warnings: List[str]) -> None:
    """Setea los warnings de zona gris."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["warnings"] = warnings


def _get_gray_zone_warnings(state: AgentState) -> List[str]:
    """Obtiene los warnings de zona gris."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("warnings", [])
    return []


def _set_uncertainty_actions(state: AgentState, actions: List[Dict[str, Any]]) -> None:
    """Setea las acciones de incertidumbre."""
    _init_analysis(state)
    state["analysis"]["uncertainties"]["actions"] = actions


def _get_uncertainty_actions(state: AgentState) -> List[Dict[str, Any]]:
    """Obtiene las acciones de incertidumbre."""
    analysis = state.get("analysis")
    if analysis and isinstance(analysis, dict):
        uncertainties = analysis.get("uncertainties", {})
        if isinstance(uncertainties, dict):
            return uncertainties.get("actions", [])
    return []


# ═══════════════════════════════════════════════════════════════════════════
# User Assistance Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _init_user_assistance(state: AgentState) -> None:
    """Inicializa la estructura de asistencia al usuario."""
    if "user_assistance" not in state or not isinstance(state["user_assistance"], dict):
        state["user_assistance"] = {
            "needed": False,
            "turn": 0,
            "max_turns": MAX_CLARIFICATION_TURNS,
            "moment": None,
            "type": None,
            "options": [],
            "metadata": {
                "targets": [],
                "synonyms": [],
                "used_filters": [],
                "postfetch_ready": False,
                "postfetch_shown": False,
                "suggestions_available": False,
                "suggested_prompts": [],
                "non_blocking_issues": [],
                "fallback_options": [],
            },
            "payload": {},
            "message": "",
        }
    else:
        assistance = state["user_assistance"]
        assistance.setdefault("needed", False)
        assistance.setdefault("turn", 0)
        assistance.setdefault("max_turns", MAX_CLARIFICATION_TURNS)
        assistance.setdefault("moment", None)
        assistance.setdefault("type", None)
        assistance.setdefault("options", [])
        assistance.setdefault("payload", {})
        assistance.setdefault("message", "")
        metadata = assistance.setdefault(
            "metadata",
            {
                "targets": [],
                "synonyms": [],
                "used_filters": [],
                "postfetch_ready": False,
                "postfetch_shown": False,
                "suggestions_available": False,
                "suggested_prompts": [],
                "non_blocking_issues": [],
                "fallback_options": [],
            },
        )
        if not isinstance(metadata, dict):
            assistance["metadata"] = {
                "targets": [],
                "synonyms": [],
                "used_filters": [],
                "postfetch_ready": False,
                "postfetch_shown": False,
                "suggestions_available": False,
                "suggested_prompts": [],
                "non_blocking_issues": [],
                "fallback_options": [],
            }


def _get_user_assistance(state: AgentState) -> Dict[str, Any]:
    """Obtiene la estructura de asistencia al usuario."""
    _init_user_assistance(state)
    assistance = state.get("user_assistance", {})
    if not isinstance(assistance, dict):
        state["user_assistance"] = {}
        _init_user_assistance(state)
        assistance = state["user_assistance"]
    return assistance


def _get_assistance_metadata(state: AgentState) -> Dict[str, Any]:
    """Obtiene los metadatos de asistencia."""
    assistance = _get_user_assistance(state)
    metadata = assistance.get("metadata")
    if not isinstance(metadata, dict):
        metadata = {
            "targets": [],
            "synonyms": [],
            "used_filters": [],
            "postfetch_ready": False,
            "postfetch_shown": False,
            "suggestions_available": False,
            "suggested_prompts": [],
            "non_blocking_issues": [],
            "fallback_options": [],
        }
        assistance["metadata"] = metadata
    return metadata


def _reset_user_assistance(state: AgentState, *, moment: str = "pre_sql") -> None:
    """Resetea la asistencia al usuario."""
    _init_user_assistance(state)
    metadata: Dict[str, Any] = {
        "targets": [],
        "synonyms": [],
        "used_filters": [],
        "postfetch_ready": False,
        "postfetch_shown": False,
        "suggestions_available": False,
        "suggested_prompts": [],
        "non_blocking_issues": [],
        "fallback_options": [],
    }
    state["user_assistance"].update(
        {
            "needed": False,
            "turn": 0,
            "max_turns": MAX_CLARIFICATION_TURNS,
            "moment": moment,
            "type": "expand",
            "options": [],
            "metadata": metadata,
            "payload": {},
            "message": "",
        }
    )


def _get_assistance_turn(state: AgentState) -> int:
    """Obtiene el turno actual de asistencia."""
    assistance = state.get("user_assistance")
    if assistance and isinstance(assistance, dict):
        return assistance.get("turn", 0)
    return 0


def _increment_assistance_turn(state: AgentState) -> int:
    """Incrementa el turno de asistencia."""
    current = _get_assistance_turn(state)
    new_turn = current + 1
    _init_user_assistance(state)
    state["user_assistance"]["turn"] = new_turn
    return new_turn


def _get_assistance_needed(state: AgentState) -> bool:
    """Indica si se necesita asistencia."""
    assistance = state.get("user_assistance")
    if assistance and isinstance(assistance, dict):
        return assistance.get("needed", False)
    return False


def _set_assistance_needed(state: AgentState, needed: bool) -> None:
    """Setea si se necesita asistencia."""
    _init_user_assistance(state)
    state["user_assistance"]["needed"] = needed


# ═══════════════════════════════════════════════════════════════════════════
# Rendering Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _init_rendering(state: AgentState) -> None:
    """Inicializa la estructura de rendering con todos sus sub-contenedores."""
    rendering = state.get("rendering")
    if not isinstance(rendering, dict):
        rendering = {}

    limits = rendering.get("limits")
    if not isinstance(limits, dict):
        limits = {"default": None, "max": None, "applied": None}
    else:
        limits.setdefault("default", None)
        limits.setdefault("max", None)
        limits.setdefault("applied", None)
    rendering["limits"] = limits

    frontend = rendering.get("frontend")
    if not isinstance(frontend, dict):
        frontend = {
            "summary": "",
            "table_markdown": "",
            "notes": [],
            "warning_priority": "",
        }
    else:
        frontend.setdefault("summary", "")
        frontend.setdefault("table_markdown", "")
        frontend.setdefault("notes", [])
        frontend.setdefault("warning_priority", "")
    rendering["frontend"] = frontend

    citizen = rendering.get("citizen")
    if not isinstance(citizen, dict):
        citizen = {
            "feedback": {},
            "actions": [],
            "actions_details": {},
            "note": "",
            "enabled": False,
            "all_rows_irrelevant": False,
            "rows_removed_sample": [],
            "pending_irrelevant_retry": False,
            "irrelevant_retry_count": 0,
        }
    else:
        citizen.setdefault("feedback", {})
        citizen.setdefault("actions", [])
        citizen.setdefault("actions_details", {})
        citizen.setdefault("note", "")
        citizen.setdefault("enabled", False)
        citizen.setdefault("all_rows_irrelevant", False)
        citizen.setdefault("rows_removed_sample", [])
        citizen.setdefault("pending_irrelevant_retry", False)
        citizen.setdefault("irrelevant_retry_count", 0)
    rendering["citizen"] = citizen

    state["rendering"] = rendering


# ═══════════════════════════════════════════════════════════════════════════
# Rendering Limits Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _set_rows_limit_default(state: AgentState, value: int) -> None:
    """Setea el límite por defecto de filas."""
    _init_rendering(state)
    state["rendering"]["limits"]["default"] = value


def _get_rows_limit_default(state: AgentState) -> Optional[int]:
    """Obtiene el límite por defecto de filas."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        limits = rendering.get("limits", {})
        if isinstance(limits, dict):
            value = limits.get("default")
            if value is not None:
                return value
    return None


def _set_rows_limit_max(state: AgentState, value: int) -> None:
    """Setea el límite máximo de filas."""
    _init_rendering(state)
    state["rendering"]["limits"]["max"] = value


def _get_rows_limit_max(state: AgentState) -> Optional[int]:
    """Obtiene el límite máximo de filas."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        limits = rendering.get("limits", {})
        if isinstance(limits, dict):
            value = limits.get("max")
            if value is not None:
                return value
    return None


def _set_rows_limit_applied(state: AgentState, value: int) -> None:
    """Setea el límite aplicado de filas."""
    _init_rendering(state)
    state["rendering"]["limits"]["applied"] = value


def _get_rows_limit_applied(state: AgentState) -> Optional[int]:
    """Obtiene el límite aplicado de filas."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        limits = rendering.get("limits", {})
        if isinstance(limits, dict):
            value = limits.get("applied")
            if value is not None:
                return value
    return None


# ═══════════════════════════════════════════════════════════════════════════
# Rendering Frontend Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _set_frontend_summary(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["summary"] = value


def _get_frontend_summary(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("summary", "")
    return ""


def _set_frontend_table_markdown(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["table_markdown"] = value


def _get_frontend_table_markdown(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("table_markdown", "")
    return ""


def _set_frontend_base_notes(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["notes"] = value


def _get_frontend_base_notes(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("notes", [])
    return []


def _set_frontend_summary_raw(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["summary_raw"] = value


def _get_frontend_summary_raw(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("summary_raw", "")
    return ""


def _set_frontend_base_notes_raw(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["base_notes_raw"] = value


def _get_frontend_base_notes_raw(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        notes = frontend.get("base_notes_raw")
        if isinstance(notes, list):
            return notes
    return []


def _set_frontend_rows_raw(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["rows_raw"] = value


def _get_frontend_rows_raw(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        rows = frontend.get("rows_raw")
        if isinstance(rows, list):
            return rows
    return []


def _set_frontend_columns_meta(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["columns_meta"] = value


def _get_frontend_columns_meta(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        meta = frontend.get("columns_meta")
        if isinstance(meta, list):
            return meta
    return []


def _set_frontend_rows_filtered(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["rows_filtered"] = value


def _get_frontend_rows_filtered(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        rows = frontend.get("rows_filtered")
        if isinstance(rows, list):
            return rows
    return []


def _set_frontend_summary_improved(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["summary_improved"] = value


def _get_frontend_summary_improved(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("summary_improved", "")
    return ""


def _set_frontend_show_table(state: AgentState, value: bool) -> None:
    """Set whether the table should be displayed to the user.

    When False, the table is hidden and all data must be in the summary text.
    Typically False when rowcount == 1 (single aggregation result).
    """
    _init_rendering(state)
    state["rendering"]["frontend"]["show_table"] = value


def _get_frontend_show_table(state: AgentState) -> bool:
    """Get whether the table should be displayed. Defaults to True."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("show_table", True)
    return True


def _set_frontend_technical_notes(state: AgentState, value: list) -> None:
    """Set technical/methodology notes for the sidebar."""
    _init_rendering(state)
    state["rendering"]["frontend"]["technical_notes"] = value


def _get_frontend_technical_notes(state: AgentState) -> list:
    """Get technical notes for the sidebar."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        notes = frontend.get("technical_notes")
        if isinstance(notes, list):
            return notes
    return []


def _set_frontend_base_notes_improved(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["base_notes_improved"] = value


def _get_frontend_base_notes_improved(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        notes = frontend.get("base_notes_improved")
        if isinstance(notes, list):
            return notes
    return []


def _set_frontend_columns_filtered(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["columns_filtered"] = value


def _get_frontend_columns_filtered(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        meta = frontend.get("columns_filtered")
        if isinstance(meta, list):
            return meta
    return []


def _set_frontend_columns_removed(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["columns_removed"] = value


def _get_frontend_columns_removed(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        meta = frontend.get("columns_removed")
        if isinstance(meta, list):
            return meta
    return []


def _set_frontend_warning_priority(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["warning_priority"] = value


def _get_frontend_warning_priority(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("warning_priority", "")
    return ""


def _set_frontend_technical_details(state: AgentState, value: list | str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["technical_details"] = value


def _get_frontend_technical_details(state: AgentState):
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        return frontend.get("technical_details")
    return None


def _set_frontend_rows_removed(state: AgentState, value: list) -> None:
    """Guarda la lista de filas removidas por filtrado de relevancia con LLM."""
    _init_rendering(state)
    state["rendering"]["frontend"]["rows_removed"] = value


def _get_frontend_rows_removed(state: AgentState) -> list:
    """Obtiene la lista de filas removidas por filtrado de relevancia con LLM."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        removed = frontend.get("rows_removed")
        if isinstance(removed, list):
            return removed
    return []


def _record_duplicate_hint(state: AgentState, results_json: Any) -> None:
    """Registra indicios de duplicados en los resultados."""
    try:
        rows = (
            json.loads(results_json)
            if isinstance(results_json, str)
            else list(results_json or [])
        )
    except Exception as exc:
        logger.debug(f"FLOW ▸ FETCH duplicate_hint decode_failed={exc}")
        return

    if not isinstance(rows, list) or not rows:
        state.pop("result_duplicates", None)
        return

    sample_columns = ["id_proyecto", "ID_PROYECTO", "project_id", "ID", "id"]
    for column in sample_columns:
        values = [
            row.get(column) for row in rows if isinstance(row, dict) and row.get(column)
        ]
        if values and len(set(values)) < len(values):
            hint = {
                "column": column,
                "sample_total": len(values),
                "sample_unique": len(set(values)),
            }
            state["result_duplicates"] = hint
            logger.info(
                "FLOW ▸ FETCH duplicate_hint column={} total={} unique={}",
                column,
                hint["sample_total"],
                hint["sample_unique"],
            )
            return


def _set_frontend_table_metadata(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["frontend"]["table_metadata"] = value


def _get_frontend_table_metadata(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        frontend = rendering.get("frontend", {})
        meta = frontend.get("table_metadata")
        if isinstance(meta, str):
            return meta
    return ""


# ═══════════════════════════════════════════════════════════════════════════
# Rendering Citizen Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _set_citizen_note(state: AgentState, value: str) -> None:
    _init_rendering(state)
    state["rendering"]["citizen"]["note"] = value


def _get_citizen_note(state: AgentState) -> str:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        return citizen.get("note", "") if isinstance(citizen, dict) else ""
    return ""


def _set_citizen_feedback(state: AgentState, value: dict) -> None:
    _init_rendering(state)
    state["rendering"]["citizen"]["feedback"] = value


def _get_citizen_feedback(state: AgentState) -> dict:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        return citizen.get("feedback", {}) if isinstance(citizen, dict) else {}
    return {}


def _set_citizen_actions(state: AgentState, value: list) -> None:
    _init_rendering(state)
    state["rendering"]["citizen"]["actions"] = value


def _get_citizen_actions(state: AgentState) -> list:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        actions = citizen.get("actions")
        if isinstance(actions, list):
            return actions
    return []


def _set_citizen_actions_details(state: AgentState, value: dict) -> None:
    _init_rendering(state)
    state["rendering"]["citizen"]["actions_details"] = value


def _get_citizen_actions_details(state: AgentState) -> dict:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        details = citizen.get("actions_details")
        if isinstance(details, dict):
            return details
    return {}


def _set_feature_citizen_node(state: AgentState, value: bool) -> None:
    _init_rendering(state)
    state["rendering"]["citizen"]["enabled"] = value


def _get_feature_citizen_node(state: AgentState) -> bool:
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        return (
            bool(citizen.get("enabled", False)) if isinstance(citizen, dict) else False
        )
    return False


def _set_all_rows_irrelevant(state: AgentState, value: bool) -> None:
    """Marca que todas las filas fueron filtradas como irrelevantes."""
    _init_rendering(state)
    state["rendering"]["citizen"]["all_rows_irrelevant"] = value


def _get_all_rows_irrelevant(state: AgentState) -> bool:
    """Obtiene si todas las filas fueron filtradas como irrelevantes."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        if isinstance(citizen, dict):
            return bool(citizen.get("all_rows_irrelevant", False))
    return False


def _set_rows_removed_sample(state: AgentState, value: list) -> None:
    """Guarda una muestra de filas removidas (máx 3) con sus razones."""
    _init_rendering(state)
    state["rendering"]["citizen"]["rows_removed_sample"] = (
        value[:3] if isinstance(value, list) else []
    )


def _get_rows_removed_sample(state: AgentState) -> list:
    """Obtiene la muestra de filas removidas."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        if isinstance(citizen, dict):
            sample = citizen.get("rows_removed_sample")
            if isinstance(sample, list):
                return sample
    return []


def _set_pending_irrelevant_retry(state: AgentState, value: bool) -> None:
    """Marca que el usuario quiere reintentar con filtros ajustados."""
    _init_rendering(state)
    state["rendering"]["citizen"]["pending_irrelevant_retry"] = value


def _get_pending_irrelevant_retry(state: AgentState) -> bool:
    """Obtiene si hay un reintento pendiente."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        if isinstance(citizen, dict):
            return bool(citizen.get("pending_irrelevant_retry", False))
    return False


def _set_irrelevant_retry_count(state: AgentState, value: int) -> None:
    """Establece el contador de reintentos por filas irrelevantes."""
    _init_rendering(state)
    state["rendering"]["citizen"]["irrelevant_retry_count"] = max(0, int(value))


def _get_irrelevant_retry_count(state: AgentState) -> int:
    """Obtiene el contador de reintentos por filas irrelevantes."""
    rendering = state.get("rendering")
    if rendering and isinstance(rendering, dict):
        citizen = rendering.get("citizen", {})
        if isinstance(citizen, dict):
            return int(citizen.get("irrelevant_retry_count", 0))
    return 0


def _increment_irrelevant_retry_count(state: AgentState) -> int:
    """Incrementa el contador de reintentos y retorna el nuevo valor."""
    current = _get_irrelevant_retry_count(state)
    new_value = current + 1
    _set_irrelevant_retry_count(state, new_value)
    return new_value


# ═══════════════════════════════════════════════════════════════════════════
# Lifecycle Helpers (Consolidated retry/turn management)
# ═══════════════════════════════════════════════════════════════════════════

# Defaults
_LIFECYCLE_DEFAULTS = {
    "sql_retry_count": 0,
    "sql_max_retries": 3,
    "clarification_turn": 0,
    "clarification_max": 2,
    "irrelevant_retry_count": 0,
    "exit_reason": None,
    "frustration_count": 0,  # Consecutive zero-result queries
}


def _init_lifecycle(state: AgentState) -> None:
    """Inicializa la estructura lifecycle con defaults."""
    lifecycle = state.get("lifecycle")
    if not isinstance(lifecycle, dict):
        lifecycle = {}
        state["lifecycle"] = lifecycle
    for key, default in _LIFECYCLE_DEFAULTS.items():
        lifecycle.setdefault(key, default)


def _get_lifecycle(state: AgentState) -> Dict[str, Any]:
    """Obtiene el diccionario lifecycle completo."""
    _init_lifecycle(state)
    return state["lifecycle"]


def _get_sql_retry_count(state: AgentState) -> int:
    """Obtiene el contador de reintentos SQL."""
    # Fallback a campo legacy si existe
    legacy = state.get("retry_count")
    if legacy is not None and legacy > 0:
        return int(legacy)
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        return int(lifecycle.get("sql_retry_count", 0))
    return 0


def _increment_sql_retry_count(state: AgentState) -> int:
    """Incrementa el contador de reintentos SQL y retorna el nuevo valor."""
    _init_lifecycle(state)
    current = _get_sql_retry_count(state)
    new_value = current + 1
    state["lifecycle"]["sql_retry_count"] = new_value
    # Mantener sincronizado con legacy
    state["retry_count"] = new_value
    return new_value


def _get_sql_max_retries(state: AgentState) -> int:
    """
    Obtiene el límite máximo de reintentos SQL.

    Prioridad:
    1. Valor en state["lifecycle"]["sql_max_retries"] (si fue seteado explícitamente)
    2. Valor de config/settings (sql_max_retries desde .env)
    3. Default hardcodeado: 3
    """
    # Primero verificar si hay un valor explícito en lifecycle
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        value = lifecycle.get("sql_max_retries")
        if value is not None:
            return int(value)

    # Fallback a config/settings
    try:
        from modules.config import settings

        return getattr(settings, "sql_max_retries", 3)
    except Exception:
        return 3


def _is_sql_retry_exhausted(state: AgentState) -> bool:
    """Verifica si se agotaron los reintentos SQL."""
    return _get_sql_retry_count(state) >= _get_sql_max_retries(state)


def _get_clarification_turn(state: AgentState) -> int:
    """Obtiene el turno actual de clarificación."""
    # Fallback a user_assistance si existe
    user_assistance = state.get("user_assistance")
    if user_assistance and isinstance(user_assistance, dict):
        turn = user_assistance.get("turn")
        if turn is not None:
            return int(turn)
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        return int(lifecycle.get("clarification_turn", 0))
    return 0


def _increment_clarification_turn(state: AgentState) -> int:
    """Incrementa el turno de clarificación y retorna el nuevo valor."""
    _init_lifecycle(state)
    current = _get_clarification_turn(state)
    new_value = current + 1
    state["lifecycle"]["clarification_turn"] = new_value
    # Mantener sincronizado con user_assistance
    user_assistance = state.get("user_assistance")
    if user_assistance and isinstance(user_assistance, dict):
        user_assistance["turn"] = new_value
    return new_value


def _get_clarification_max(state: AgentState) -> int:
    """Obtiene el límite máximo de turnos de clarificación."""
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        return int(lifecycle.get("clarification_max", 2))
    return 2


def _is_clarification_exhausted(state: AgentState) -> bool:
    """Verifica si se agotaron los turnos de clarificación."""
    return _get_clarification_turn(state) >= _get_clarification_max(state)


def _set_exit_reason(state: AgentState, reason: str) -> None:
    """Setea la razón de salida del flujo."""
    _init_lifecycle(state)
    state["lifecycle"]["exit_reason"] = reason


def _get_exit_reason(state: AgentState) -> Optional[str]:
    """Obtiene la razón de salida del flujo."""
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        return lifecycle.get("exit_reason")
    return None


def _reset_lifecycle(state: AgentState) -> None:
    """Resetea todos los contadores de lifecycle (para nueva conversación)."""
    state["lifecycle"] = dict(_LIFECYCLE_DEFAULTS)
    state["retry_count"] = 0


# ═══════════════════════════════════════════════════════════════════════════
# Frustration Tracking Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _get_frustration_count(state: AgentState) -> int:
    """Obtiene el contador de consultas consecutivas sin resultados."""
    lifecycle = state.get("lifecycle")
    if lifecycle and isinstance(lifecycle, dict):
        return int(lifecycle.get("frustration_count", 0))
    return 0


def _increment_frustration_count(state: AgentState) -> int:
    """Incrementa el contador de frustración y retorna el nuevo valor."""
    _init_lifecycle(state)
    current = _get_frustration_count(state)
    new_value = current + 1
    state["lifecycle"]["frustration_count"] = new_value
    return new_value


def _reset_frustration_count(state: AgentState) -> None:
    """Resetea el contador de frustración (cuando hay resultados exitosos)."""
    _init_lifecycle(state)
    state["lifecycle"]["frustration_count"] = 0


def _get_frustration_threshold(state: AgentState) -> int:
    """Obtiene el umbral de frustración desde config."""
    try:
        from modules.config import settings

        return getattr(settings, "frustration_threshold", 2)
    except Exception:
        return 2


def _should_show_human_contact(state: AgentState) -> bool:
    """Determina si se debe mostrar contacto humano basado en frustración."""
    return _get_frustration_count(state) >= _get_frustration_threshold(state)


# ═══════════════════════════════════════════════════════════════════════════
# Session Memory Helpers (Persistent context across conversation turns)
# ═══════════════════════════════════════════════════════════════════════════
# Estructura:
# lifecycle.session_memory = {
#     "resolved_dimensions": {
#         "nombresector_proyecto": {"value": "TURISMO", "confidence": 0.95, "success_count": 1},
#         "nombreentidadejecutora_proyecto": {"value": "MINISTERIO DE TURISMO", "confidence": 0.9, "success_count": 2}
#     },
#     "last_success": {
#         "filters": [...],
#         "question": "...",
#         "rowcount": 15
#     },
#     "context_terms": ["turismo", "santo domingo"]
# }


def _init_session_memory(state: AgentState) -> Dict[str, Any]:
    """Inicializa la estructura session_memory dentro de lifecycle."""
    _init_lifecycle(state)
    lifecycle = state["lifecycle"]
    if "session_memory" not in lifecycle or not isinstance(
        lifecycle.get("session_memory"), dict
    ):
        lifecycle["session_memory"] = {
            "resolved_dimensions": {},
            "last_success": None,
            "context_terms": [],
        }
    return lifecycle["session_memory"]


def _get_session_memory(state: AgentState) -> Dict[str, Any]:
    """Obtiene la session_memory completa."""
    return _init_session_memory(state)


def _get_resolved_dimensions(state: AgentState) -> Dict[str, Dict[str, Any]]:
    """Obtiene las dimensiones resueltas exitosamente en la sesión."""
    session = _get_session_memory(state)
    return session.get("resolved_dimensions", {})


def _save_resolved_dimension(
    state: AgentState, column: str, value: str, confidence: float = 1.0
) -> None:
    """
    Guarda una dimensión resuelta exitosamente.
    Si ya existe, incrementa success_count.
    """
    if not column or not value:
        return

    session = _init_session_memory(state)
    resolved = session.setdefault("resolved_dimensions", {})

    # Normalizar column name
    col_key = column.strip().lower()

    existing = resolved.get(col_key)
    if existing and existing.get("value") == value:
        # Misma dimensión, incrementar contador
        existing["success_count"] = existing.get("success_count", 1) + 1
        existing["confidence"] = max(existing.get("confidence", 0), confidence)
    else:
        # Nueva dimensión o valor diferente
        resolved[col_key] = {
            "value": value,
            "confidence": confidence,
            "success_count": 1,
        }

    logger.debug(
        "SESSION_MEMORY ▸ saved dimension {}={} (confidence={}, count={})",
        col_key,
        value,
        confidence,
        resolved[col_key]["success_count"],
    )


def _save_success_context(
    state: AgentState,
    filters: List[Dict[str, Any]],
    question: str,
    rowcount: int,
    rows: Optional[List[Dict[str, Any]]] = None,
) -> None:
    """
    Guarda el contexto de una consulta exitosa.
    Extrae dimensiones de los filtros y las guarda.
    Opcionalmente guarda un snapshot de los resultados para referencia futura.
    """
    session = _init_session_memory(state)

    # Build result_snapshot: compact representation of top 10 rows
    # This allows LLM to resolve references like "the first one" in future turns
    result_snapshot = []
    if rows and isinstance(rows, list):
        for idx, row in enumerate(rows[:10], start=1):
            if not isinstance(row, dict):
                continue
            # Find ID column (various possible names)
            row_id = (
                row.get("id_proyecto")
                or row.get("codigo_snip")
                or row.get("id")
                or str(idx)
            )
            # Find name column (various possible names)
            row_name = (
                row.get("nombre_proyecto")
                or row.get("nombre")
                or row.get("nombresector_proyecto")
                or row.get("nombreentidadejecutora_proyecto")
                or ""
            )
            # Truncate name to 60 chars
            if isinstance(row_name, str) and len(row_name) > 60:
                row_name = row_name[:57] + "..."

            result_snapshot.append(
                {
                    "pos": idx,
                    "id": str(row_id),
                    "nombre": str(row_name) if row_name else f"Registro {idx}",
                }
            )

    # Guardar last_success
    session["last_success"] = {
        "filters": list(filters) if filters else [],
        "question": question,
        "rowcount": rowcount,
        "result_snapshot": result_snapshot,  # NEW: for resolving "the first one"
    }

    # Extraer y guardar dimensiones de catálogo (sector, entidad, estado)
    CATALOG_COLUMNS = {
        "nombresector_proyecto",
        "nombreentidadejecutora_proyecto",
        "estado_proyecto",
        "nombreprovincia_proyecto",
        "nombremunicipio_proyecto",
    }

    for flt in filters or []:
        col_raw = (flt.get("column") or "").strip().lower()
        # Normalizar: quitar prefijo de tabla (p., etc.)
        col = col_raw.split(".")[-1] if "." in col_raw else col_raw
        val = flt.get("value")
        conf = flt.get("confidence", 0.8)

        if col in CATALOG_COLUMNS and val:
            _save_resolved_dimension(state, col, str(val), conf)
            logger.debug(
                "SESSION_MEMORY ▸ resolved dimension saved: {}={} (conf={})",
                col,
                val,
                conf,
            )

    # Extraer términos clave de la pregunta
    _update_context_terms(state, question)

    logger.info(
        "SESSION_MEMORY ▸ success context saved (rowcount={}, filters={}, terms={})",
        rowcount,
        len(filters or []),
        len(session.get("context_terms", [])),
    )


def _update_context_terms(state: AgentState, question: str) -> None:
    """
    Extrae y acumula términos clave de las preguntas exitosas.
    Mantiene máximo 10 términos únicos.
    """
    import re

    session = _init_session_memory(state)
    terms = set(session.get("context_terms", []))

    # Palabras a ignorar (stopwords básicos)
    STOPWORDS = {
        "el",
        "la",
        "los",
        "las",
        "de",
        "del",
        "en",
        "con",
        "por",
        "para",
        "que",
        "cual",
        "cuales",
        "como",
        "donde",
        "cuando",
        "cuanto",
        "cuantos",
        "un",
        "una",
        "unos",
        "unas",
        "y",
        "o",
        "a",
        "al",
        "su",
        "sus",
        "me",
        "te",
        "se",
        "nos",
        "le",
        "les",
        "lo",
        "mi",
        "tu",
        "hay",
        "tiene",
        "tienen",
        "son",
        "es",
        "fue",
        "fueron",
        "ser",
        "estar",
        "proyectos",
        "proyecto",
        "mostrar",
        "ver",
        "dame",
        "dime",
        "quiero",
    }

    # Extraer palabras significativas (4+ caracteres)
    words = re.findall(r"\b[a-záéíóúñü]{4,}\b", question.lower())
    for word in words:
        if word not in STOPWORDS:
            terms.add(word)

    # Limitar a 10 términos más recientes
    session["context_terms"] = list(terms)[-10:]


def _get_context_terms(state: AgentState) -> List[str]:
    """Obtiene los términos de contexto acumulados."""
    session = _get_session_memory(state)
    return session.get("context_terms", [])


def _get_last_success(state: AgentState) -> Optional[Dict[str, Any]]:
    """Obtiene el último contexto exitoso."""
    session = _get_session_memory(state)
    return session.get("last_success")


def _format_session_memory_for_prompt(state: AgentState) -> str:
    """
    Formatea la session_memory como texto para inyectar en el prompt del analyzer/rewriter.
    Solo incluye información si hay contexto relevante.
    """
    resolved = _get_resolved_dimensions(state)
    last_success = _get_last_success(state)
    context_terms = _get_context_terms(state)

    if not resolved and not last_success and not context_terms:
        return ""

    parts = []
    parts.append("\n### 📌 SESSION CONTEXT (from previous successful queries):")

    if resolved:
        parts.append(
            "\n**Resolved Dimensions (MUST USE THESE when user refers to same concepts):**"
        )
        for col, data in resolved.items():
            val = data.get("value", "")
            count = data.get("success_count", 1)
            conf = data.get("confidence", 0)
            # col_display for human readability
            col_display = col.replace("_proyecto", "").replace("nombre", "")
            # IMPORTANTE: Incluir el nombre exacto de columna para el LLM
            parts.append(
                f'  - {col_display}: "{val}" → EMIT: column=p.{col} | operator== | value={val}'
            )
            parts.append(f"    (used {count}x, confidence {conf:.0%})")

    if context_terms:
        parts.append(f"\n**Active Context Terms:** {', '.join(context_terms)}")

    if last_success:
        q = last_success.get("question", "")
        rc = last_success.get("rowcount", 0)
        filters = last_success.get("filters", [])
        result_snapshot = last_success.get("result_snapshot", [])

        if q:
            parts.append(f'\n**Last Successful Query:** "{q}" → {rc} rows')
            if filters:
                parts.append("**Filters Used:**")
                for flt in filters:
                    col = flt.get("column", "")
                    val = flt.get("value", "")
                    if col and val:
                        parts.append(f"  - {col} = {val}")

        # NEW: Show result_snapshot for resolving references like "the first one"
        if result_snapshot:
            parts.append(
                "\n**📋 LAST TABLE RESULTS (for resolving ordinal references):**"
            )
            parts.append(
                "If user says 'el primero', 'the first one', 'el tercero', etc., use this list:"
            )
            for item in result_snapshot[:10]:
                pos = item.get("pos", "?")
                row_id = item.get("id", "?")
                nombre = item.get("nombre", "")
                parts.append(f"  {pos}. ID={row_id}: {nombre}")

    parts.append("\n**⚠️ CRITICAL INSTRUCTIONS:**")
    parts.append(
        "1. Use Resolved Dimensions when user has anaphoric references (ese, esos, lo mismo, ahí, eso)."
    )
    parts.append(
        "2. If user asks a NEW, COMPLETE question without pronouns/references, DO NOT inject previous filters!"
    )
    parts.append(
        "3. Topic switch detection: if user's new question has its own explicit criteria, treat as NEW query."
    )
    parts.append(
        "4. Example of WRONG behavior: user asks 'proyectos para mujeres' but you inject 'educación' from previous query."
    )
    parts.append(
        "5. **ADDITIVE FOLLOW-UPS**: If question starts with 'y de', 'y en', 'y para' → user wants to ADD a filter to the previous context. Use Last Successful Query + Active Context Terms to build a complete question."
    )
    parts.append(
        "   Example: Last='proyectos en Santiago', Current='y de educación' → 'proyectos de educación en Santiago'"
    )
    parts.append(
        "6. **FILTER REPLACEMENT**: If question is ONLY a category (e.g., 'educación', 'salud') → user wants to CHANGE the sector. Keep territorial context from Last Successful Query."
    )
    parts.append(
        "   Example: Last='proyectos de turismo en Santiago', Current='educación' → 'proyectos de educación en Santiago'"
    )

    return "\n".join(parts)


def _clear_session_memory(state: AgentState) -> None:
    """Limpia la session_memory (para nueva conversación)."""
    _init_lifecycle(state)
    state["lifecycle"]["session_memory"] = {
        "resolved_dimensions": {},
        "last_success": None,
        "context_terms": [],
    }


# ═══════════════════════════════════════════════════════════════════════════
# Catalog Filter State Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _get_relaxed_catalog_columns(state: AgentState) -> set[str]:
    """Obtiene las columnas de catálogo relajadas."""
    from modules.graph.helpers_texto import _normalize_column_name

    relaxed = state.get("catalog_filters_relaxed_columns") or []
    result: set[str] = set()
    for col in relaxed:
        normalized = _normalize_column_name(col or "")
        if normalized:
            result.add(normalized)
    return result


def _set_relaxed_catalog_columns(state: AgentState, columns: set[str]) -> None:
    """Setea las columnas de catálogo relajadas."""
    if columns:
        state["catalog_filters_relaxed_columns"] = sorted(columns)
    else:
        state.pop("catalog_filters_relaxed_columns", None)


def _store_catalog_applied_columns(state: AgentState, columns: set[str]) -> None:
    """Almacena las columnas de catálogo aplicadas."""
    if columns:
        state["catalog_filters_last_applied"] = sorted(columns)
    else:
        state.pop("catalog_filters_last_applied", None)


def _get_catalog_applied_columns(state: AgentState) -> set[str]:
    """Obtiene las columnas de catálogo aplicadas."""
    from modules.graph.helpers_texto import _normalize_column_name

    applied = state.get("catalog_filters_last_applied") or []
    result: set[str] = set()
    for col in applied:
        normalized = _normalize_column_name(col or "")
        if normalized:
            result.add(normalized)
    return result


def _get_blocked_catalog_tokens(state: AgentState) -> set[str]:
    """Obtiene los tokens de catálogo bloqueados."""
    tokens = state.get("catalog_filter_tokens_blocked") or []
    blocked: set[str] = set()
    for token in tokens:
        if not isinstance(token, str):
            continue
        normalized = token.strip().lower()
        if normalized:
            blocked.add(normalized)
    return blocked


# ═══════════════════════════════════════════════════════════════════════════
# Trace Metrics Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _record_citizen_metric(state: AgentState, key: str, value: Any) -> None:
    """Persiste métricas puntuales asociadas al citizen review dentro de _trace_metrics."""
    if not isinstance(state, dict):
        return
    trace = state.setdefault("_trace_metrics", {"nodes": [], "tokens": {}})
    citizen_metrics = trace.setdefault("citizen", {})
    citizen_metrics[key] = value


# ═══════════════════════════════════════════════════════════════════════════
# Fallback Keywords Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _collect_fallback_keywords(state: AgentState) -> list[str]:
    """Recopila las keywords de fallback."""
    keywords = state.get("fallback_keywords")
    if isinstance(keywords, list):
        return keywords
    return []


# ═══════════════════════════════════════════════════════════════════════════
# Exports
# ═══════════════════════════════════════════════════════════════════════════


__all__ = [
    # SQL Container
    "_ensure_sql_container",
    "_set_sql_query",
    "_get_sql_query",
    "_set_sql_execution",
    "_get_sql_rowcount",
    "_get_sql_more_than_limit",
    "_get_sql_results",
    "_get_sql_cached_results",
    "_get_sql_displayed_count",
    "_get_sql_error",
    # SQL Generation
    "_set_sql_candidates",
    "_get_sql_candidates",
    "_set_sql_scored_list",
    "_get_sql_scored_list",
    "_set_sql_best",
    # Keyword Regeneration
    "_init_keyword_regeneration",
    "_get_keyword_used",
    "_set_keyword_used",
    "_get_keyword_tokens_tried",
    "_set_keyword_tokens_tried",
    "_get_keyword_replacements",
    "_set_keyword_replacements",
    "_clear_keyword_regeneration",
    # Dimensions
    "_ensure_dimensions_container",
    "_set_dimensions_catalog",
    "_get_dimensions_catalog",
    "_ensure_dimensions_loaded",
    "_get_filtered_dimensions_for_analyzer",
    "_init_dimensions",
    "_set_dimension_suggestions",
    "_get_dimension_suggestions",
    "_clear_dimension_suggestions",
    # Analysis
    "_init_analysis",
    "_get_analysis_raw_text",
    "_set_analysis_raw_text",
    "_get_effective_analysis_text",
    "_set_analysis_filters",
    "_get_analysis_filters",
    "_get_analysis_filter_confidence_map",
    "_get_analysis_used_columns",
    "_set_analysis_tables",
    "_get_analysis_tables_list",
    "_get_analyzer_tables",
    "_set_analysis_modules",
    "_get_analysis_modules",
    "_set_complexity",
    "_get_is_complex",
    # Theme Strategy
    "_get_theme_strategy",
    "_set_theme_strategy",
    "_get_semantic_or_groups",
    "_set_semantic_or_groups",
    # Gray Zone
    "_set_gray_zone_reason",
    "_get_gray_zone_reason",
    "_set_gray_zone_decision",
    "_get_gray_zone_decision",
    "_set_gray_zone_details",
    "_get_gray_zone_details",
    "_set_gray_zone_non_mappable",
    "_get_gray_zone_non_mappable",
    "_set_gray_zone_warnings",
    "_get_gray_zone_warnings",
    "_set_uncertainty_actions",
    "_get_uncertainty_actions",
    # User Assistance
    "_init_user_assistance",
    "_get_user_assistance",
    "_get_assistance_metadata",
    "_reset_user_assistance",
    "_get_assistance_turn",
    "_increment_assistance_turn",
    "_get_assistance_needed",
    "_set_assistance_needed",
    # Rendering
    "_init_rendering",
    "_set_rows_limit_default",
    "_get_rows_limit_default",
    "_set_rows_limit_max",
    "_get_rows_limit_max",
    "_set_rows_limit_applied",
    "_get_rows_limit_applied",
    # Frontend
    "_set_frontend_summary",
    "_get_frontend_summary",
    "_set_frontend_table_markdown",
    "_get_frontend_table_markdown",
    "_set_frontend_base_notes",
    "_get_frontend_base_notes",
    "_set_frontend_summary_raw",
    "_get_frontend_summary_raw",
    "_set_frontend_base_notes_raw",
    "_get_frontend_base_notes_raw",
    "_set_frontend_rows_raw",
    "_get_frontend_rows_raw",
    "_set_frontend_columns_meta",
    "_get_frontend_columns_meta",
    "_set_frontend_rows_filtered",
    "_get_frontend_rows_filtered",
    "_set_frontend_summary_improved",
    "_get_frontend_summary_improved",
    "_set_frontend_base_notes_improved",
    "_get_frontend_base_notes_improved",
    "_set_frontend_columns_filtered",
    "_get_frontend_columns_filtered",
    "_set_frontend_columns_removed",
    "_get_frontend_columns_removed",
    "_set_frontend_warning_priority",
    "_get_frontend_warning_priority",
    "_set_frontend_technical_details",
    "_get_frontend_technical_details",
    "_set_frontend_rows_removed",
    "_get_frontend_rows_removed",
    "_set_frontend_table_metadata",
    "_get_frontend_table_metadata",
    "_set_frontend_show_table",
    "_get_frontend_show_table",
    # Citizen
    "_set_citizen_note",
    "_get_citizen_note",
    "_set_citizen_feedback",
    "_get_citizen_feedback",
    "_set_citizen_actions",
    "_get_citizen_actions",
    "_set_citizen_actions_details",
    "_get_citizen_actions_details",
    "_set_feature_citizen_node",
    "_get_feature_citizen_node",
    "_set_all_rows_irrelevant",
    "_get_all_rows_irrelevant",
    "_set_rows_removed_sample",
    "_get_rows_removed_sample",
    "_set_pending_irrelevant_retry",
    "_get_pending_irrelevant_retry",
    "_set_irrelevant_retry_count",
    "_get_irrelevant_retry_count",
    "_increment_irrelevant_retry_count",
    # Catalog Filter State
    "_get_relaxed_catalog_columns",
    "_set_relaxed_catalog_columns",
    "_store_catalog_applied_columns",
    "_get_catalog_applied_columns",
    "_get_blocked_catalog_tokens",
    # Trace Metrics
    "_record_citizen_metric",
    # Duplicates
    "_record_duplicate_hint",
    # Fallback
    "_collect_fallback_keywords",
    # Lifecycle (consolidated retry/turn management)
    "_init_lifecycle",
    "_get_lifecycle",
    "_get_sql_retry_count",
    "_increment_sql_retry_count",
    "_get_sql_max_retries",
    "_is_sql_retry_exhausted",
    "_get_clarification_turn",
    "_increment_clarification_turn",
    "_get_clarification_max",
    "_is_clarification_exhausted",
    "_set_exit_reason",
    "_get_exit_reason",
    "_reset_lifecycle",
    # Frustration Tracking
    "_get_frustration_count",
    "_increment_frustration_count",
    "_reset_frustration_count",
    "_get_frustration_threshold",
    "_should_show_human_contact",
    # Session Memory (persistent context across turns)
    "_init_session_memory",
    "_get_session_memory",
    "_get_resolved_dimensions",
    "_save_resolved_dimension",
    "_save_success_context",
    "_update_context_terms",
    "_get_context_terms",
    "_get_last_success",
    "_format_session_memory_for_prompt",
    "_clear_session_memory",
]
