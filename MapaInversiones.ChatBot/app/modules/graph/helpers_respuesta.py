# helpers_respuesta.py
"""
Funciones de construcción de respuestas y asistencia al usuario.

Incluye:
- Construcción de payloads de asistencia
- Resúmenes para ciudadanos
- Notas técnicas y de detalle
- Inferencia de razones de zona gris
- LLM para reescritura de resúmenes

Dependencias: helpers_estado, helpers_texto, helpers_sql
"""

from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from langchain_core.prompts import PromptTemplate
from loguru import logger

from modules.config import settings
from modules.graph.state import AgentState
from modules.utils.llm_utils import get_model

# Imports de otros helpers
from modules.graph.helpers_texto import (
    FILTER_CONFIDENCE_THRESHOLD,
    MAX_CLARIFICATION_TURNS,
    FRIENDLY_FILTER_NAMES,
    DEFAULT_ALWAYS_KEEP_COLUMNS,
    QUESTION_METRIC_KEYWORDS,
    _FILTER_LINE_RE,
    _normalize_text,
    _normalize_column_name,
    _normalize_dimension_column,
    _humanize_filter_column,
    _humanize_filter_list,
    _tokenize_question,
    _column_label_matches_question,
    _tokens_from_phrase,
    _parse_analyzer_sections,
    _localize,
    _truncate_for_details,
    _extract_first_json_block,
)
from modules.graph.helpers_estado import (
    _init_user_assistance,
    _get_user_assistance,
    _get_uncertainty_actions,
    _get_gray_zone_reason,
    _get_sql_query,
    _get_sql_rowcount,
    _get_dimensions_catalog,
    _get_keyword_tokens_tried,
    _get_keyword_used,
    _get_frontend_rows_removed,
    _init_rendering,
)

# ═══════════════════════════════════════════════════════════════════════════
# Configuración desde settings
# ═══════════════════════════════════════════════════════════════════════════

REASONING_SEED = getattr(settings, "reasoning_seed", None)
REASONING_EFFORT_SQL = getattr(settings, "reasoning_effort_sql", "high")
REASONING_VERBOSITY_SQL = getattr(settings, "reasoning_verbosity_sql", "low")
REASONING_EFFORT_TEXT = getattr(settings, "reasoning_effort_text", "medium")
REASONING_VERBOSITY_TEXT = getattr(settings, "reasoning_verbosity_text", "medium")

# ═══════════════════════════════════════════════════════════════════════════
# Constantes
# ═══════════════════════════════════════════════════════════════════════════

DEFINITIONS_DIR = Path(__file__).parent.parent.parent / "data"

CLEAR_CLARIFICATION_ENDPOINTS = {
    "sector": "/api/lookup/sectors",
    "entity": "/api/lookup/entities",
}

POSTFETCH_ATTRIBUTE_SUGGESTIONS = [
    {
        "key": "entity",
        "column": "nombreentidadejecutora_proyecto",
        "label": "Filtrar por entidad ejecutora",
        "description": "Elija una entidad responsable para acotar la búsqueda.",
        "target": "entity",
        "interactive": True,
    },
    {
        "key": "sector",
        "column": "nombresector_proyecto",
        "label": "Filtrar por sector",
        "description": "Podemos enfocarnos en un sector específico de inversión.",
        "target": "sector",
        "interactive": True,
    },
    {
        "key": "objective",
        "column": "objetivo_proyecto",
        "label": "Buscar la palabra en el objetivo del proyecto",
        "description": "Revisemos los objetivos detallados por si aparece la frase allí.",
        "interactive": False,
    },
]

SYNONYM_SUGGESTIONS = {
    "pyme": ["pequeñas y medianas empresas", "mipyme"],
    "pymes": ["pequeñas y medianas empresas", "mipymes"],
    "mipyme": ["pequeñas y medianas empresas"],
    "mipymes": ["pequeñas y medianas empresas"],
}

DIMENSION_COLUMN_MAP: dict[str, tuple[str, str]] = {
    "nombresector_proyecto": ("sectors", "Sectores disponibles"),
    "nombreentidadejecutora_proyecto": ("entities", "Entidades ejecutoras disponibles"),
    "estado_proyecto": ("states", "Estados de proyecto disponibles"),
}
DIMENSION_PROMPT_VALUE_LIMIT = 15
DIMENSION_PROMPT_TOKEN_LIMIT = 30

GRAY_ZONE_REASON_MESSAGES = {
    "NO_ROWS_FILTERED": (
        "No encuentro registros con esa combinación de filtros; podrían ser demasiado específicos."
    ),
    "MISSING_DIMENSION": (
        "La dimensión solicitada no coincide con los datos disponibles para este país."
    ),
    "MISSING_CONTRACTOR_DATA": (
        "Este dataset solo incluye entidades públicas ejecutoras; no contiene datos de contratistas o proveedores."
    ),
    "UNSUPPORTED_METRIC": (
        "Esa métrica no está disponible en el dataset actual; puedo ayudarte a consultar indicadores cercanos."
    ),
    "MISSING_ATTRIBUTE": (
        "El atributo pedido no figura en el esquema actual; puedo aproximarlo con campos disponibles."
    ),
    "DATA_NOT_INGESTED": (
        "Aún no tenemos cargada esa información. Revisemos otras combinaciones mientras tanto."
    ),
    "SYSTEM_ERROR_FALLBACK": (
        "Ocurrió un problema al consultar la base. Por favor, intente nuevamente en unos minutos."
    ),
    "FALLBACK_USED": (
        "Intenté una búsqueda más amplia pero aún no encuentro resultados. Puede probar con otros filtros."
    ),
    "POSTFETCH_CLARIFICATION_EXHAUSTED": (
        "Se agotaron los intentos de aclaración. La dimensión solicitada no está disponible."
    ),
}


# ═══════════════════════════════════════════════════════════════════════════
# Definiciones y Cache
# ═══════════════════════════════════════════════════════════════════════════


@lru_cache(maxsize=1)
def _load_definitions_markdown() -> tuple[str, str]:
    """Lee el Markdown de definiciones una sola vez y lo cachea en memoria."""
    candidates = sorted(DEFINITIONS_DIR.glob("concepts_definitions_v*.md"))
    if not candidates:
        raise FileNotFoundError(
            f"No se encontró ningún archivo versionado en {DEFINITIONS_DIR}/concepts_definitions_v*.md"
        )
    chosen = candidates[-1]
    try:
        content = chosen.read_text(encoding="utf-8")
    except OSError as exc:
        raise IOError(f"No se pudo leer {chosen}: {exc}")
    logger.info(
        "FLOW ▸ DEFINITIONS_LOOKUP cache_init file={} size={} chars",
        str(chosen),
        len(content),
    )
    return content, str(chosen)


# ═══════════════════════════════════════════════════════════════════════════
# Creación de Chains LLM
# ═══════════════════════════════════════════════════════════════════════════


def create_chain(
    template,
    input_vars,
    schema=None,
    *,
    family: str = "control",
    mini: bool = True,
    effort: str | None = None,
    verbosity: str | None = None,
    seed: int | None = None,
):
    """Crea una cadena con un prompt y un modelo opcionalmente estructurado."""
    prompt = PromptTemplate(template=template, input_variables=input_vars)
    llm = get_model(
        schema=schema,
        mini=mini,
        family=family,
        effort=effort,
        verbosity=verbosity,
        seed=seed,
    )
    return prompt | llm


# ═══════════════════════════════════════════════════════════════════════════
# Summarize Analyzer
# ═══════════════════════════════════════════════════════════════════════════


def summarize_analyzer_for_response(analyzer_text: str, language_iso: str) -> str:
    """Resume el texto del analyzer para la respuesta al usuario."""
    if not analyzer_text:
        return ""

    sections = _parse_analyzer_sections(analyzer_text)
    if not sections:
        return ""

    parts: list[str] = []

    filter_lines = [
        line.strip().lstrip("- ").replace("  ", " ")
        for line in sections.get("FILTERS", [])
        if line.strip().startswith("- ")
    ]
    extracted_filters: list[str] = []
    for line in filter_lines:
        normalized = re.sub(r"\s*\|\s*", "|", line)
        match = _FILTER_LINE_RE.search(normalized)
        if not match:
            continue
        column = match.group("column").strip()
        operator = match.group("operator").strip()
        value = match.group("value").strip()
        extracted_filters.append(f"{column} {operator} {value}")
        if len(extracted_filters) >= 4:
            break

    if extracted_filters:
        parts.append(
            _localize(
                language_iso,
                "Filtros aplicados: " + "; ".join(extracted_filters),
                "Applied filters: " + "; ".join(extracted_filters),
            )
        )

    warnings = [
        line.strip().lstrip("- ").replace("  ", " ")
        for line in sections.get("WARNINGS", [])
        if line.strip().startswith("- ")
    ]
    if warnings:
        parts.append(
            _localize(
                language_iso,
                "Advertencias del analizador: " + "; ".join(warnings[:3]),
                "Analyzer warnings: " + "; ".join(warnings[:3]),
            )
        )

    uncertainties = [
        line.strip().lstrip("- ").replace("  ", " ")
        for line in sections.get("UNCERTAINTIES", [])
        if line.strip().startswith("- ")
    ]
    if uncertainties:
        parts.append(
            _localize(
                language_iso,
                "Dudas pendientes: " + "; ".join(uncertainties[:2]),
                "Pending questions: " + "; ".join(uncertainties[:2]),
            )
        )

    if not parts:
        return ""

    return " ".join(parts).strip()


# ═══════════════════════════════════════════════════════════════════════════
# User Assistance Builders
# ═══════════════════════════════════════════════════════════════════════════


def _build_user_assistance(
    moment: str,
    assistance_type: str,
    options: List[Dict[str, Any]],
    message: str = "",
    metadata: Dict[str, Any] = None,
) -> Dict[str, Any]:
    """Construye estructura de asistencia al usuario."""
    return {
        "needed": bool(options),
        "turn": 0,
        "max_turns": MAX_CLARIFICATION_TURNS,
        "moment": moment,
        "type": assistance_type,
        "options": options or [],
        "metadata": metadata
        or {
            "targets": [],
            "synonyms": [],
            "used_filters": [],
            "postfetch_ready": False,
            "postfetch_shown": False,
        },
        "payload": {},
        "message": message,
    }


def _find_synonym_rewrites(question: str) -> list[dict[str, str]]:
    """Encuentra reescrituras de sinónimos para una pregunta."""
    if not question:
        return []
    normalized = _normalize_text(question)
    found: list[dict[str, str]] = []
    for keyword, replacements in SYNONYM_SUGGESTIONS.items():
        if keyword in normalized:
            found.append(
                {
                    "keyword": keyword,
                    "label": f"Usar '{replacements[0]}'",
                    "replacements": replacements,
                }
            )
    return found


def _is_zero_payload(state: AgentState) -> bool:
    """Verifica si el payload de asistencia está vacío."""
    payload = state.get("user_assistance", {}).get("payload") or {}
    options = payload.get("options") or []
    targets = payload.get("targets") or []
    synonyms = payload.get("synonyms") or []
    return not (options or targets or synonyms)


def _prioritize_reevaluacion(options: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Prioriza la opción de reevaluación en la lista."""
    if not options:
        return []
    prioritized = sorted(
        options,
        key=lambda opt: 0 if opt.get("target") == "reevaluacion" else 1,
    )
    return prioritized


# ═══════════════════════════════════════════════════════════════════════════
# Post-Fetch Clarification
# ═══════════════════════════════════════════════════════════════════════════


def _prepare_post_fetch_clarification(state: AgentState) -> bool:
    """Prepara opciones de clarificación post-fetch."""
    question = state.get("complete_user_question") or state.get("user_question") or ""
    used_columns = {
        _normalize_column_name(col)
        for col in state.get("used_filter_columns", [])
        if col
    }

    state["postfetch_clarification_exhausted"] = False
    state.pop("postfetch_clarification_turns", None)

    synonym_suggestions = _find_synonym_rewrites(question) if question else []

    options: list[dict[str, Any]] = []
    targets: list[str] = []
    uncertainty_actions = _get_uncertainty_actions(state)

    if synonym_suggestions:
        labels_preview = ", ".join(s["label"] for s in synonym_suggestions[:2])
        option = {
            "key": "synonym",
            "label": "Probar con otra palabra clave",
            "description": f"Variantes sugeridas: {labels_preview}.",
            "target": "synonym",
            "interactive": True,
            "suggestions": synonym_suggestions,
        }
        options.append(option)
        targets.append("synonym")

    for attribute in POSTFETCH_ATTRIBUTE_SUGGESTIONS:
        column = attribute.get("column")
        column_norm = _normalize_column_name(column) if column else ""
        if column_norm and column_norm in used_columns:
            continue
        option = {
            "key": attribute["key"],
            "label": attribute["label"],
            "description": attribute["description"],
            "target": attribute.get("target"),
            "interactive": attribute.get("interactive", False),
        }
        options.append(option)
        if option["interactive"] and option.get("target"):
            targets.append(option["target"])

    used_filters_human = _humanize_filter_list(used_columns)
    has_analyzer_prompts = bool(
        state.get("soft_missing_filters") or uncertainty_actions
    )

    if not options:
        generic_options = [
            {
                "key": "generic_sector",
                "label": "Explorar otro sector",
                "description": "Puedo intentar con un sector diferente o más amplio.",
                "target": "sector",
                "interactive": True,
                "source": "generic_postfetch",
            },
            {
                "key": "generic_spelling",
                "label": "Revisar ortografía / entidad",
                "description": "Chequeemos nombres de entidad, territorio u organismo.",
                "target": "entity",
                "interactive": True,
                "source": "generic_postfetch",
            },
        ]
        options.extend(generic_options)
        targets.extend([opt["target"] for opt in generic_options if opt.get("target")])

    ready = bool(options) or has_analyzer_prompts

    assistance_type = "relax"
    message = ""
    if options:
        options_preview = ", ".join(opt.get("label", "") for opt in options[:2])
        message = (
            "Busqué con los criterios actuales y no encuentro resultados. "
            f"Estuve revisando {', '.join(used_filters_human) if used_filters_human else 'los campos habituales'}. "
            f"¿Desea que probemos alguna de estas alternativas? {options_preview}..."
        )

    user_assistance = _build_user_assistance(
        moment="post_sql_zero",
        assistance_type=assistance_type,
        options=options,
        message=message,
        metadata={
            "targets": targets,
            "synonyms": synonym_suggestions,
            "used_filters": used_filters_human,
            "postfetch_ready": ready,
            "postfetch_shown": False,
        },
    )
    user_assistance["needed"] = ready
    state["user_assistance"] = user_assistance

    metadata = user_assistance["metadata"]
    metadata["suggestions_available"] = ready
    metadata["fallback_options"] = [
        opt for opt in options if not opt.get("interactive")
    ]

    assistance_payload = {
        "options": options,
        "targets": targets,
        "synonyms": synonym_suggestions,
        "used_filters": used_filters_human,
        "uncertainty_actions": uncertainty_actions,
    }
    user_assistance["payload"] = assistance_payload

    state["user_assistance"] = user_assistance
    logger.info(
        "ASSISTANCE ▸ POSTFETCH ready={} options={} targets={} synonyms={}",
        ready,
        len(options),
        len(targets),
        len(synonym_suggestions),
    )

    metadata["suggestions_available"] = ready
    metadata["fallback_options"] = [
        opt for opt in options if opt.get("source") == "generic_postfetch"
    ]

    metadata["postfetch_ready"] = ready
    metadata["postfetch_shown"] = False
    metadata["non_blocking_issues"] = []
    metadata["suggested_prompts"] = []

    assistance = _get_user_assistance(state)
    assistance["metadata"] = metadata
    state["user_assistance"] = assistance

    if targets:
        metadata["targets"] = list(dict.fromkeys(t.strip() for t in targets if t))
    else:
        metadata["targets"] = metadata.get("targets", [])

    metadata["synonyms"] = synonym_suggestions
    metadata["used_filters"] = used_filters_human
    metadata["fallback_options"] = [
        opt.get("key")
        for opt in options
        if opt.get("key") in CLEAR_CLARIFICATION_ENDPOINTS
    ]

    return ready


# ═══════════════════════════════════════════════════════════════════════════
# Row/Column Filtering
# ═══════════════════════════════════════════════════════════════════════════


def _filter_rows_and_columns_by_relevance(
    question: str,
    analysis: dict,
    rows_raw: list[dict[str, Any]],
    columns_meta: list[dict[str, str]],
) -> tuple[list[dict[str, Any]], list[dict[str, str]], list[dict[str, Any]]]:
    """Filtra filas y columnas por relevancia a la pregunta."""
    if not rows_raw or not columns_meta:
        return rows_raw, columns_meta, []

    question_tokens = _tokenize_question(question)
    used_columns = set()
    try:
        filters_data = analysis.get("filters") if isinstance(analysis, dict) else {}
        used_columns = {
            _normalize_column_name(col)
            for col in (filters_data or {}).get("used_columns", [])
            if col
        }
    except Exception:
        used_columns = set()

    include_names: list[str] = []
    removed_info: list[dict[str, Any]] = []

    for meta in columns_meta:
        name = meta.get("name") or ""
        label = meta.get("label") or ""
        normalized = _normalize_column_name(name)
        keep = False
        if normalized in used_columns:
            keep = True
        elif _column_label_matches_question(label, question_tokens):
            keep = True
        elif normalized in DEFAULT_ALWAYS_KEEP_COLUMNS:
            keep = True
        elif any(
            keyword in (normalized or "") or keyword in _normalize_text(label)
            for keyword in QUESTION_METRIC_KEYWORDS
            if keyword in question_tokens
        ):
            keep = True

        if keep:
            include_names.append(name)
        else:
            removed_info.append(
                {
                    "name": name,
                    "label": label,
                    "reason": "not_referenced",
                }
            )

    filtered_rows = []
    for row in rows_raw:
        filtered_row = {k: v for k, v in row.items() if k in include_names}
        filtered_rows.append(filtered_row)

    filtered_columns = [
        meta for meta in columns_meta if meta.get("name") in include_names
    ]

    return filtered_rows, filtered_columns, removed_info


# ═══════════════════════════════════════════════════════════════════════════
# Structured Text Filter Registration
# ═══════════════════════════════════════════════════════════════════════════


def _register_structured_text_filter(
    state: AgentState, column: str, value: str | None
) -> None:
    """Registra un filtro de texto estructurado en el estado."""
    from modules.graph.helpers_texto import (
        _is_structured_text_column,
        _strip_function_wrappers,
    )

    value = (value or "").strip()
    if not column or not value:
        return
    filters = state.setdefault("structured_text_filters", [])
    base_column = _strip_function_wrappers(column)
    normalized = _normalize_column_name(base_column)
    existing = next(
        (
            f
            for f in filters
            if f.get("column_norm") == normalized and f.get("value") == value
        ),
        None,
    )
    if existing:
        return
    filters.append(
        {
            "column": base_column,
            "column_norm": normalized,
            "value": value,
        }
    )
    tokens_to_block = _tokens_from_phrase(value)
    if tokens_to_block:
        existing = set(state.get("catalog_filter_tokens_blocked") or [])
        existing.update(tokens_to_block)
        state["catalog_filter_tokens_blocked"] = sorted(existing)


# ═══════════════════════════════════════════════════════════════════════════
# Dimension Suggestions
# ═══════════════════════════════════════════════════════════════════════════


def _suggest_dimension_filters_from_keywords(
    keywords: Sequence[str],
    dimension_catalog: Dict[str, Sequence[str]] | None,
) -> list[dict[str, str]]:
    """Sugiere filtros de dimensión basados en keywords."""
    if not keywords or not dimension_catalog:
        return []

    normalized_catalog: dict[str, dict[str, str]] = {}
    for catalog_key, values in dimension_catalog.items():
        if not isinstance(values, Sequence):
            continue
        mapping: dict[str, str] = {}
        for value in values:
            if not isinstance(value, str):
                continue
            normalized = _normalize_text(value)
            if normalized:
                mapping[normalized] = value
        normalized_catalog[catalog_key] = mapping

    suggestions: list[dict[str, str]] = []
    seen: set[tuple[str, str]] = set()

    for keyword in keywords:
        tokens = _tokens_from_phrase(keyword)
        if not tokens:
            continue
        for norm_kw in tokens:
            if not norm_kw:
                continue
            if len(norm_kw) < 3:
                continue
            if len(norm_kw) > DIMENSION_PROMPT_TOKEN_LIMIT:
                continue

            for column, (catalog_key, label) in DIMENSION_COLUMN_MAP.items():
                catalog_mapping = normalized_catalog.get(catalog_key) or {}
                match = catalog_mapping.get(norm_kw)
                if not match and catalog_key == "states":
                    for norm_value, original_value in catalog_mapping.items():
                        tokens_val = norm_value.split()
                        if norm_kw in tokens_val or norm_kw == norm_value:
                            match = original_value
                            break
                if not match:
                    continue
                key = (column, match.lower())
                if key in seen:
                    continue
                seen.add(key)
                suggestions.append(
                    {
                        "column": f"p.{column}",
                        "label": label,
                        "value": match,
                        "catalog_key": catalog_key,
                    }
                )

    return suggestions


def _collect_dimension_strings(catalog: dict[str, object]) -> tuple[set[str], set[str]]:
    """Recolecta strings y tokens de un catálogo de dimensiones."""
    strings: set[str] = set()
    tokens: set[str] = set()
    for key in ("sectors", "entities", "states", "funding_sources"):
        values = catalog.get(key) or []
        for value in values:
            normalized = _normalize_text(str(value))
            if not normalized:
                continue
            strings.add(normalized)
            for token in re.split(r"\s+", normalized):
                if token:
                    tokens.add(token)
    return strings, tokens


# ═══════════════════════════════════════════════════════════════════════════
# Gray Zone Inference
# ═══════════════════════════════════════════════════════════════════════════


def _collect_gray_zone_signals(state: AgentState) -> dict[str, Any]:
    """Recolecta señales del estado para inferir razones de zona gris."""
    from modules.graph.helpers_estado import _get_effective_analysis_text

    assistance = state.get("user_assistance") or {}
    if not isinstance(assistance, dict):
        assistance = {}
    metadata = assistance.get("metadata") or {}
    if not isinstance(metadata, dict):
        metadata = {}
    options_raw = assistance.get("options") or []
    options: list[dict[str, str]] = []
    if isinstance(options_raw, list):
        for opt in options_raw:
            if not isinstance(opt, dict):
                continue
            options.append(
                {
                    "key": str(opt.get("key") or "").strip().lower(),
                    "target": str(opt.get("target") or "").strip().lower(),
                    "source": str(opt.get("source") or "").strip().lower(),
                }
            )
    analysis_text = (_get_effective_analysis_text(state) or "").lower()

    rowcount = _get_sql_rowcount(state) or 0
    used_fallback = state.get("used_fallback", False)
    missing_filter_columns = state.get("missing_filter_columns") or []
    catalog_filters_relaxed = state.get("catalog_filters_relaxed_columns") or []
    postfetch_exhausted = state.get("postfetch_clarification_exhausted", False)
    postfetch_turns = state.get("postfetch_clarification_turns", 0)

    return {
        "postfetch_ready": bool(metadata.get("postfetch_ready")),
        "options": options,
        "analysis_text": analysis_text,
        "soft_missing_present": bool(state.get("soft_missing_filters")),
        "rowcount": rowcount,
        "used_fallback": used_fallback,
        "missing_filter_columns": missing_filter_columns,
        "catalog_filters_relaxed": catalog_filters_relaxed,
        "postfetch_exhausted": postfetch_exhausted,
        "postfetch_turns": postfetch_turns,
    }


def _options_match_conditions(
    conditions: dict[str, Any], options: list[dict[str, str]]
) -> bool:
    """Verifica si las opciones coinciden con las condiciones."""
    if not options:
        return False
    targets_any = {
        str(item).strip().lower() for item in conditions.get("targets_any", []) if item
    }
    sources_any = {
        str(item).strip().lower() for item in conditions.get("sources_any", []) if item
    }
    keys_any = {
        str(item).strip().lower() for item in conditions.get("keys_any", []) if item
    }

    for opt in options:
        target_ok = not targets_any or opt.get("target") in targets_any
        source_ok = not sources_any or opt.get("source") in sources_any
        key_ok = not keys_any or opt.get("key") in keys_any
        if target_ok and source_ok and key_ok:
            return True
    return False


def _gray_zone_rule_matches(rule: dict[str, Any], signals: dict[str, Any]) -> bool:
    """Evalúa si una regla de zona gris coincide con las señales actuales."""
    conditions = rule.get("when") or {}

    if conditions.get("postfetch_ready") and not signals.get("postfetch_ready"):
        return False
    if conditions.get("soft_missing_present") and not signals.get(
        "soft_missing_present"
    ):
        return False

    analysis_terms = conditions.get("analysis_contains_any") or []
    if analysis_terms:
        analysis_text = signals.get("analysis_text", "")
        if not any(term.lower() in analysis_text for term in analysis_terms if term):
            return False

    options_conditions = conditions.get("options")
    if options_conditions:
        if not _options_match_conditions(
            options_conditions, signals.get("options", [])
        ):
            return False

    if conditions.get("used_fallback") is not None:
        if conditions.get("used_fallback") != signals.get("used_fallback", False):
            return False

    rowcount_condition = conditions.get("rowcount")
    if rowcount_condition is not None:
        actual_rowcount = signals.get("rowcount", 0)
        if rowcount_condition != actual_rowcount:
            return False

    missing_columns_condition = conditions.get("missing_filter_columns")
    if missing_columns_condition is not None:
        missing_columns = signals.get("missing_filter_columns", [])
        if missing_columns_condition and not missing_columns:
            return False
        if not missing_columns_condition and missing_columns:
            return False

    if conditions.get("postfetch_exhausted") is not None:
        if conditions.get("postfetch_exhausted") != signals.get(
            "postfetch_exhausted", False
        ):
            return False

    return True


def _infer_gray_zone_reason(
    state: AgentState, analyzer_summary: Optional[Dict[str, Any]] = None
) -> str:
    """Infiere la razón de zona gris siguiendo prioridad: LLM > reglas > fallback."""
    analyzer_summary = analyzer_summary or {}

    # Prioridad 1: Razón explícita del LLM
    reason = analyzer_summary.get("reason")
    if reason:
        logger.debug(f"GRAY_ZONE ▸ REASON from LLM explicit: {reason}")
        return reason

    # Prioridad 2: Evaluar reglas declarativas
    try:
        from modules.graph.gray_zone_rules import GRAY_ZONE_RULES

        signals = _collect_gray_zone_signals(state)

        for rule in GRAY_ZONE_RULES:
            if _gray_zone_rule_matches(rule, signals):
                inferred_reason = rule.get("reason")
                logger.info(
                    f"GRAY_ZONE ▸ REASON from rule '{rule.get('name')}': {inferred_reason}"
                )
                return inferred_reason
    except Exception as e:
        logger.warning(f"GRAY_ZONE ▸ Error evaluating rules: {e}")

    logger.debug("GRAY_ZONE ▸ REASON default: NO_ROWS_FILTERED")
    return "NO_ROWS_FILTERED"


# ═══════════════════════════════════════════════════════════════════════════
# Gray Zone Notes
# ═══════════════════════════════════════════════════════════════════════════


def _summarize_dimensions(dimension_catalog: dict[str, object]) -> str:
    """Resume las dimensiones disponibles."""
    if not dimension_catalog:
        return ""

    parts: list[str] = []

    sectors = dimension_catalog.get("sectors") or []
    if sectors:
        parts.append("Sectores frecuentes: " + ", ".join(sectors[:5]))

    entities = dimension_catalog.get("entities") or []
    if entities:
        parts.append("Entidades destacadas: " + ", ".join(entities[:5]))

    states = dimension_catalog.get("states") or []
    if states:
        parts.append("Estados de proyecto disponibles: " + ", ".join(states[:5]))

    year_range = dimension_catalog.get("year_range") or {}
    start = year_range.get("start")
    end = year_range.get("end")
    if start and end:
        parts.append(f"Cobertura temporal aproximada: {start}-{end}")

    if not parts:
        return ""

    return "Dimensiones sugeridas → " + " · ".join(parts)


def _build_gray_zone_note(state: AgentState) -> str:
    """Construye una nota de zona gris para el usuario."""
    reason = _infer_gray_zone_reason(state)
    message = GRAY_ZONE_REASON_MESSAGES.get(reason, "")
    dimension_catalog = _get_dimensions_catalog(state)
    dimension_text = _summarize_dimensions(dimension_catalog)

    fragments = [fragment for fragment in (message, dimension_text) if fragment]

    missing_columns = state.get("missing_filter_columns")
    if missing_columns:
        fragments.append(
            "Campos no disponibles en la base: " + ", ".join(sorted(missing_columns))
        )

    keyword_tokens = _get_keyword_tokens_tried(state)
    if keyword_tokens and not _get_keyword_used(state):
        fragments.append(
            "Intentamos buscar coincidencias parciales con: "
            + ", ".join(keyword_tokens[:5])
        )

    if not fragments:
        return "Intente ampliar la búsqueda con otro sector, entidad, territorio o periodo disponible."

    return " ".join(fragments)


# ═══════════════════════════════════════════════════════════════════════════
# Technical Details
# ═══════════════════════════════════════════════════════════════════════════


def _format_filter_for_details(column: str, operator: str, value: str) -> str:
    """Formatea un filtro para la sección de detalles técnicos."""
    friendly = FRIENDLY_FILTER_NAMES.get(column, column)
    return f"{friendly} {operator} {value}"


def _build_technical_detail_sections(
    state: AgentState,
    signals: dict[str, Any],
    analysis_obj: dict[str, Any] | None,
    columns_removed: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Construye secciones de detalle técnico para la respuesta.

    Formato esperado por el frontend:
    [
        { "title": "Ejecución", "items": ["Filas devueltas: 5", "Límite aplicado: 100"] },
        { "title": "Filtros aplicados", "items": ["pais_iso3 = dom", "sector = EDUCACIÓN"] },
        ...
    ]
    """
    sections: list[dict[str, Any]] = []

    # ═══════════════════════════════════════════════════════════════
    # 0. SECCIÓN: Pregunta procesada (original vs completa)
    # ═══════════════════════════════════════════════════════════════
    question_items: list[str] = []

    user_question_original = state.get("user_question", "").strip()
    complete_user_question = state.get("complete_user_question", "").strip()

    if user_question_original:
        question_items.append(f"Original: {user_question_original}")

    if complete_user_question and complete_user_question != user_question_original:
        question_items.append(f"Completa: {complete_user_question}")
    elif complete_user_question:
        # Si son iguales, solo mostrar una vez
        question_items.append(f"Pregunta: {complete_user_question}")

    if question_items:
        sections.append({"title": "Pregunta procesada", "items": question_items})

    # ═══════════════════════════════════════════════════════════════
    # 1. SECCIÓN: Ejecución
    # ═══════════════════════════════════════════════════════════════
    exec_items: list[str] = []

    rowcount = signals.get("rowcount", 0) if signals else 0
    exec_items.append(f"Filas devueltas: {rowcount}")

    elapsed_time = signals.get("elapsed_time") if signals else None
    if elapsed_time:
        exec_items.append(f"Tiempo de respuesta: {elapsed_time}")

    limit_applied = state.get("rows_limit_applied") or state.get("rendering", {}).get(
        "rows_limit_applied"
    )
    if limit_applied:
        exec_items.append(f"Límite aplicado: {limit_applied}")

    if exec_items:
        sections.append({"title": "Ejecución", "items": exec_items})

    # ═══════════════════════════════════════════════════════════════
    # 2. SECCIÓN: Filtros aplicados
    # ═══════════════════════════════════════════════════════════════
    filters_items: list[str] = []

    if analysis_obj and isinstance(analysis_obj, dict):
        # Intentar obtener filtros de analysis.filters.all
        filters_container = analysis_obj.get("filters", {})
        if isinstance(filters_container, dict):
            filters_data = filters_container.get("all", [])
        elif isinstance(filters_container, list):
            filters_data = filters_container
        else:
            filters_data = []

        for flt in filters_data:
            if isinstance(flt, dict):
                column = flt.get("column", "")
                operator = flt.get("operator", "=")
                value = flt.get("value", "")
                if column and value:
                    # Limpiar nombre de columna para mostrar
                    display_col = column.split(".")[-1] if "." in column else column
                    display_col = display_col.replace("_", " ")
                    filters_items.append(f"{display_col} {operator} {value}")
            elif isinstance(flt, str) and flt.strip():
                filters_items.append(flt)

    if filters_items:
        sections.append({"title": "Filtros aplicados", "items": filters_items})

    # ═══════════════════════════════════════════════════════════════
    # 3. SECCIÓN: Modelo analizado (tablas)
    # ═══════════════════════════════════════════════════════════════
    tables_items: list[str] = []

    if analysis_obj and isinstance(analysis_obj, dict):
        tables_container = analysis_obj.get("tables", {})
        if isinstance(tables_container, dict):
            tables_list = tables_container.get("list", [])
        elif isinstance(tables_container, list):
            tables_list = tables_container
        else:
            tables_list = []

        if tables_list:
            tables_str = ", ".join(str(t) for t in tables_list if t)
            tables_items.append(f"Tablas consultadas: {tables_str}")

    if tables_items:
        sections.append({"title": "Modelo analizado", "items": tables_items})

    # ═══════════════════════════════════════════════════════════════
    # 4. SECCIÓN: Consulta ejecutada (SQL)
    # ═══════════════════════════════════════════════════════════════
    query = _get_sql_query(state) or ""
    if query and query.strip():
        # Para la query, usamos "body" en lugar de "items" para que se renderice como <pre>
        sections.append({"title": "Consulta ejecutada", "body": query.strip()})

    # ═══════════════════════════════════════════════════════════════
    # 5. SECCIÓN: Guía de columnas monetarias (transparencia)
    # Solo se muestra si la consulta involucra montos
    # ═══════════════════════════════════════════════════════════════
    query_lower = (query or "").lower()
    has_monetary_cols = any(
        col in query_lower
        for col in [
            "valor_proyecto",
            "valor_ejecutado",
            "valor_vigente",
            "sum(",
            "monto",
        ]
    )
    if has_monetary_cols:
        monetary_guide = [
            "valor_proyecto: Monto total del proyecto registrado en SNIP",
            "valor_ejecutado: Monto ya gastado (de tabla financiamiento, por año/fuente)",
            "valor_vigente: Monto vigente actual (de tabla financiamiento)",
        ]
        sections.append(
            {"title": "Guía de columnas monetarias", "items": monetary_guide}
        )

    # ═══════════════════════════════════════════════════════════════
    # 5. SECCIÓN: Notas del analizador (analysis raw text)
    # ═══════════════════════════════════════════════════════════════
    raw_text = ""
    if analysis_obj and isinstance(analysis_obj, dict):
        raw_text = analysis_obj.get("raw_text", "") or ""

    if raw_text and raw_text.strip():
        sections.append({"title": "Notas del analizador", "body": raw_text.strip()})

    # ═══════════════════════════════════════════════════════════════
    # 6. SECCIÓN: Columnas removidas (si hay)
    # ═══════════════════════════════════════════════════════════════
    if columns_removed:
        removed_items: list[str] = []
        for col in columns_removed[:10]:
            if isinstance(col, dict):
                name = col.get("name") or col.get("label") or ""
                reason = col.get("reason") or "unknown"
                if name:
                    removed_items.append(f"{name} ({reason})")
            elif isinstance(col, str):
                removed_items.append(col)

        if removed_items:
            sections.append({"title": "Columnas removidas", "items": removed_items})

    # ═══════════════════════════════════════════════════════════════
    # 7. SECCIÓN: Filas removidas (si hay)
    # ═══════════════════════════════════════════════════════════════
    removed_rows = _get_frontend_rows_removed(state)
    if removed_rows:
        removed_items: list[str] = []

        # Agregar cantidad total
        total_removed = len(removed_rows)
        removed_items.append(f"Total de filas removidas: {total_removed}")

        # Agrupar razones de eliminación
        # Las filas removidas tienen _removal_reason, necesitamos adaptarlas
        grouped_reasons: dict[str, int] = defaultdict(int)
        for row in removed_rows:
            if isinstance(row, dict):
                # Buscar razón de eliminación (puede ser _removal_reason o reason)
                reason = (
                    row.get("_removal_reason")
                    or row.get("reason")
                    or "Sin razón especificada"
                )
                grouped_reasons[reason] += 1

        # Agregar razones agrupadas
        if grouped_reasons:
            for reason, count in sorted(grouped_reasons.items(), key=lambda x: -x[1]):
                removed_items.append(
                    f"{reason}: {count} fila{'s' if count > 1 else ''}"
                )

        if removed_items:
            sections.append({"title": "Filas removidas", "items": removed_items})

    # ═══════════════════════════════════════════════════════════════
    # 8. SECCIÓN: Correcciones de fuzzy matching (si hay)
    # ═══════════════════════════════════════════════════════════════
    fuzzy_items: list[str] = []

    if analysis_obj and isinstance(analysis_obj, dict):
        filters_container = analysis_obj.get("filters", {})
        if isinstance(filters_container, dict):
            filters_data = filters_container.get("all", [])
        elif isinstance(filters_container, list):
            filters_data = filters_container
        else:
            filters_data = []

        for flt in filters_data:
            if isinstance(flt, dict) and flt.get("fuzzy_original"):
                # Este filtro fue corregido por fuzzy matching
                column = flt.get("column", "")
                original = flt.get("fuzzy_original", "")
                corrected = flt.get("value", "")
                score = flt.get("fuzzy_score", 0.0)

                if column and original and corrected:
                    # Limpiar nombre de columna para mostrar
                    display_col = column.split(".")[-1] if "." in column else column
                    display_col = display_col.replace("_", " ")
                    fuzzy_items.append(
                        f"{display_col}: '{original}' → '{corrected}' (score: {score:.2f})"
                    )

    if fuzzy_items:
        sections.append(
            {"title": "Correcciones de fuzzy matching", "items": fuzzy_items}
        )

    return sections


def _build_rows_preview(
    rows: list[dict[str, Any]], columns_meta: list[dict[str, str]], max_rows: int = 5
) -> list[dict[str, Any]]:
    """Construye un preview de filas para el frontend."""
    if not rows:
        return []
    preview: list[dict[str, Any]] = []
    column_names = [meta.get("name") or "" for meta in columns_meta]
    for row in rows[:max_rows]:
        preview_row = {name: row.get(name) for name in column_names if name in row}
        preview.append(preview_row)
    return preview


def _build_dimension_gap_notes(
    signals: dict[str, Any],
    dimension_catalog: dict[str, Any] | None,
    gray_zone_reason: str | None,
) -> tuple[str | None, dict[str, Any] | None]:
    """
    Construye notas y sección extra sobre gaps de dimensiones.

    Returns:
        (note_text, section_dict) donde:
        - note_text: texto para agregar a citizen_note
        - section_dict: sección extra para el frontend (o None)
    """
    notes: list[str] = []

    # Verificar filtros relajados
    if signals.get("catalog_filters_relaxed"):
        notes.append("Se flexibilizaron algunos filtros para obtener resultados.")

    # Verificar columnas faltantes
    missing_columns = signals.get("missing_filter_columns") or []
    if missing_columns:
        human_cols = _humanize_filter_list(missing_columns)
        notes.append(
            f"No se encontraron coincidencias exactas para: {', '.join(human_cols)}."
        )

    # Construir texto combinado
    note_text = " ".join(notes) if notes else None

    # Construir sección extra si hay notas
    section: dict[str, Any] | None = None
    if notes:
        section = {
            "type": "dimension_gap",
            "notes": notes,
            "has_relaxed_filters": bool(signals.get("catalog_filters_relaxed")),
            "missing_columns": missing_columns,
        }
        if gray_zone_reason:
            section["gray_zone_reason"] = gray_zone_reason

    return note_text, section


# ═══════════════════════════════════════════════════════════════════════════
# Group Removal Reasons
# ═══════════════════════════════════════════════════════════════════════════


def _group_removal_reasons(
    removed_info: list[dict[str, Any]],
) -> dict[str, list[str]]:
    """Agrupa las razones de eliminación de columnas."""
    grouped: dict[str, list[str]] = defaultdict(list)
    for item in removed_info:
        reason = item.get("reason") or "unknown"
        name = item.get("name") or item.get("label") or "unknown"
        grouped[reason].append(name)
    return dict(grouped)


# ═══════════════════════════════════════════════════════════════════════════
# Citizen Metrics
# ═══════════════════════════════════════════════════════════════════════════


def _record_citizen_metric(state: AgentState, metric_name: str, value: Any) -> None:
    """Registra una métrica de ciudadano en el estado."""
    metrics = state.setdefault("citizen_metrics", {})
    metrics[metric_name] = value


# ═══════════════════════════════════════════════════════════════════════════
# LLM Rewrite Summary
# ═══════════════════════════════════════════════════════════════════════════


REWRITE_SUMMARY_TEMPLATE = """
Sos un asistente que reescribe resúmenes de datos para ciudadanos.
El usuario hizo una pregunta y el sistema encontró resultados.

Pregunta del usuario:
{question}

Resumen generado automáticamente:
{summary}

Datos técnicos:
- Filas encontradas: {rowcount}
- Filtros aplicados: {filters}

Reescribí el resumen de forma clara, concisa y amigable para el ciudadano.
No incluyas información técnica como nombres de columnas o SQL.
Respondé en español rioplatense.
"""


def _rewrite_summary_with_llm(
    question: str,
    summary_raw: str,
    base_notes_raw: list[str],
    citizen_note: str,
    signals: dict[str, Any],
    actions: list[str],
    action_details: dict[str, Any],
    rows_preview: list[dict[str, Any]],
    no_data_payload: Optional[dict[str, Any]],
    original_language_iso: str,
    allow_spelling_hint: bool,
    show_table: bool = True,
    *,
    sql_query: str = "",
    analyzer_summary: str = "",
    user_question_original: str = "",
):
    """Reescribe el resumen usando LLM para hacerlo más amigable al ciudadano.

    Args:
        sql_query: El SQL ejecutado (fuente de verdad para filtros)
        analyzer_summary: Resumen del análisis previo a SQL
        user_question_original: Pregunta original del usuario SIN expansión de historial

    Returns:
        Tuple of (summary, base_notes, technical_notes)
        - summary: La respuesta directa para el usuario
        - base_notes: Notas adicionales para el usuario
        - technical_notes: Notas metodológicas para el sidebar técnico
    """
    from modules.graph.prompts_postfetch import citizen_summary_rewrite_prompt
    from modules.graph.nodes_fetch import safe_invoke

    try:
        chain = create_chain(
            citizen_summary_rewrite_prompt,
            [
                "question",
                "summary_raw",
                "base_notes_raw",
                "citizen_note",
                "rowcount",
                "rows_displayed",
                "show_table",
                "coverage_warning",
                "actions",
                "action_details",
                "rows_preview",
                "no_data_payload",
                "original_language_iso",
                "allow_spelling_hint",
                "sql_query",
                "analyzer_summary",
                "user_question_original",
            ],
            family="control",
            mini=True,
            effort=REASONING_EFFORT_TEXT,
            verbosity=REASONING_VERBOSITY_TEXT,
            seed=REASONING_SEED,
        )
        payload = {
            "question": question or "",
            "summary_raw": summary_raw or "",
            "base_notes_raw": "\n".join(str(note) for note in base_notes_raw if note),
            "citizen_note": citizen_note or "",
            "rowcount": signals.get("rowcount") or 0,
            "rows_displayed": signals.get("rows_displayed")
            or signals.get("rowcount")
            or 0,
            "show_table": show_table,
            "coverage_warning": bool(signals.get("coverage_warning")),
            "actions": ", ".join(actions or []),
            "action_details": json.dumps(action_details or {}, ensure_ascii=False),
            "rows_preview": json.dumps(rows_preview or [], ensure_ascii=False),
            "no_data_payload": json.dumps(no_data_payload or {}, ensure_ascii=False),
            "original_language_iso": original_language_iso or "es",
            "allow_spelling_hint": allow_spelling_hint,
            "sql_query": sql_query or "",
            "analyzer_summary": analyzer_summary or "",
            "user_question_original": user_question_original or "",
        }
        # Debug logging para diagnóstico de alucinaciones
        logger.debug(
            "FLOW ▸ CITIZEN rewrite_input summary_raw={} sql_query_preview={}",
            (summary_raw or "")[:150],
            (sql_query or "")[:150],
        )
        raw_output = safe_invoke(chain, payload)
        content = getattr(raw_output, "content", raw_output)
        parsed = _extract_first_json_block(content)
        if not parsed:
            return None, None, None
        summary_text = (parsed.get("summary") or "").strip()

        # Parse base_notes
        notes = parsed.get("base_notes")
        cleaned_notes: list[str] = []
        if isinstance(notes, list):
            for item in notes:
                text = (str(item) or "").strip()
                if text:
                    cleaned_notes.append(text)
        elif isinstance(notes, str) and notes.strip():
            cleaned_notes = [notes.strip()]

        # Parse technical_notes (new field for sidebar)
        tech_notes = parsed.get("technical_notes")
        cleaned_tech_notes: list[str] = []
        if isinstance(tech_notes, list):
            for item in tech_notes:
                text = (str(item) or "").strip()
                if text:
                    cleaned_tech_notes.append(text)
        elif isinstance(tech_notes, str) and tech_notes.strip():
            cleaned_tech_notes = [tech_notes.strip()]

        return summary_text, cleaned_notes, cleaned_tech_notes
    except Exception as exc:
        logger.warning("FLOW ▸ CITIZEN rewrite_failed={}", exc)
        return None, None, None


# ═══════════════════════════════════════════════════════════════════════════
# Rendering Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _build_final_response_payload(
    state: AgentState,
    summary: str,
    rows: list[dict[str, Any]],
    columns_meta: list[dict[str, str]],
    technical_details: Dict[str, Any],
) -> Dict[str, Any]:
    """Construye el payload final de respuesta para el frontend."""
    _init_rendering(state)

    rowcount = len(rows)
    gray_zone = rowcount == 0

    payload = {
        "summary": summary,
        "rowcount": rowcount,
        "gray_zone": gray_zone,
        "rows_preview": _build_rows_preview(rows, columns_meta),
        "columns": columns_meta,
        "technical_details": technical_details,
    }

    if gray_zone:
        payload["gray_zone_note"] = _build_gray_zone_note(state)
        payload["dimension_gap_notes"] = _build_dimension_gap_notes(state)

    assistance = _get_user_assistance(state)
    if assistance.get("needed"):
        payload["user_assistance"] = assistance

    removed_rows = _get_frontend_rows_removed(state)
    if removed_rows:
        payload["rows_removed"] = removed_rows
        payload["removal_reasons"] = _group_removal_reasons(removed_rows)

    return payload


def _build_error_response_payload(
    state: AgentState,
    error_message: str,
    error_code: str = "UNKNOWN_ERROR",
) -> Dict[str, Any]:
    """Construye un payload de respuesta de error."""
    return {
        "summary": "",
        "rowcount": 0,
        "gray_zone": True,
        "gray_zone_note": error_message,
        "error": True,
        "error_code": error_code,
        "rows_preview": [],
        "columns": [],
        "technical_details": {},
    }


# ═══════════════════════════════════════════════════════════════════════════
# Validation Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _validate_response_structure(payload: Dict[str, Any]) -> tuple[bool, list[str]]:
    """Valida que el payload de respuesta tenga la estructura correcta."""
    issues: list[str] = []
    required_keys = ["summary", "rowcount", "gray_zone"]
    for key in required_keys:
        if key not in payload:
            issues.append(f"Missing required key: {key}")

    if "rowcount" in payload and not isinstance(payload["rowcount"], int):
        issues.append("rowcount must be an integer")

    if "gray_zone" in payload and not isinstance(payload["gray_zone"], bool):
        issues.append("gray_zone must be a boolean")

    if "rows_preview" in payload and not isinstance(payload["rows_preview"], list):
        issues.append("rows_preview must be a list")

    if "columns" in payload and not isinstance(payload["columns"], list):
        issues.append("columns must be a list")

    return len(issues) == 0, issues


def _sanitize_response_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Sanitiza el payload de respuesta para asegurar tipos correctos."""
    sanitized = dict(payload)

    if "rowcount" not in sanitized:
        sanitized["rowcount"] = 0
    elif not isinstance(sanitized["rowcount"], int):
        try:
            sanitized["rowcount"] = int(sanitized["rowcount"])
        except (ValueError, TypeError):
            sanitized["rowcount"] = 0

    if "gray_zone" not in sanitized:
        sanitized["gray_zone"] = sanitized["rowcount"] == 0
    elif not isinstance(sanitized["gray_zone"], bool):
        sanitized["gray_zone"] = bool(sanitized["gray_zone"])

    if "summary" not in sanitized:
        sanitized["summary"] = ""
    elif not isinstance(sanitized["summary"], str):
        sanitized["summary"] = str(sanitized["summary"] or "")

    if "rows_preview" not in sanitized:
        sanitized["rows_preview"] = []
    elif not isinstance(sanitized["rows_preview"], list):
        sanitized["rows_preview"] = []

    if "columns" not in sanitized:
        sanitized["columns"] = []
    elif not isinstance(sanitized["columns"], list):
        sanitized["columns"] = []

    return sanitized


# ═══════════════════════════════════════════════════════════════════════════
# Dimension Prompt Payload
# ═══════════════════════════════════════════════════════════════════════════


def _resolve_filter_confidence(
    state: AgentState, filter_entry: dict[str, Any], column_norm: str
) -> float:
    """Resuelve la confianza de un filtro."""
    from modules.graph.helpers_estado import _get_analysis_filter_confidence_map

    confidence = filter_entry.get("confidence")
    try:
        return float(confidence)
    except (TypeError, ValueError):
        pass

    column_key = column_norm or _normalize_column_name(filter_entry.get("column"))
    confidence_map = _get_analysis_filter_confidence_map(state)
    fallback = confidence_map.get(column_key)
    try:
        return float(fallback) if fallback is not None else 0.0
    except (TypeError, ValueError):
        return 0.0


def _build_dimension_prompt_payload(state: AgentState) -> dict[str, Any]:
    """Construye el payload de prompts de dimensiones."""
    from modules.graph.helpers_estado import _get_analysis_filters

    cached = state.get("_dimension_hint_cache")
    if isinstance(cached, dict):
        return cached

    dimension_catalog = _get_dimensions_catalog(state)
    analyzer_filters = _get_analysis_filters(state) or []
    if not dimension_catalog or not analyzer_filters:
        payload: dict[str, Any] = {}
        state["_dimension_hint_cache"] = payload
        return payload

    relevant_catalog: dict[str, list[str]] = {}
    summary_parts: list[str] = []

    for filt in analyzer_filters:
        column_raw = filt.get("column")
        if not column_raw:
            continue
        column_norm = _normalize_dimension_column(column_raw)
        mapping = DIMENSION_COLUMN_MAP.get(column_norm)
        if not mapping:
            continue
        dimension_key, label = mapping

        confidence = _resolve_filter_confidence(state, filt, column_norm)
        if confidence < FILTER_CONFIDENCE_THRESHOLD:
            continue

        catalog_values = dimension_catalog.get(dimension_key) or []
        if not catalog_values:
            continue

        unique_values: list[str] = []
        seen: set[str] = set()
        for item in catalog_values:
            item_str = str(item).strip()
            if not item_str:
                continue
            normalized = _normalize_text(item_str)
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            unique_values.append(item_str)
            if len(unique_values) >= DIMENSION_PROMPT_VALUE_LIMIT:
                break

        if not unique_values:
            continue

        relevant_catalog[dimension_key] = unique_values
        summary_parts.append(f"{label}: {', '.join(unique_values[:5])}")

    if not relevant_catalog:
        payload = {}
        state["_dimension_hint_cache"] = payload
        return payload

    summary_text = "Dimensiones relevantes sugeridas → " + " · ".join(summary_parts)
    strings, tokens = _collect_dimension_strings(relevant_catalog)
    vocabulary = {
        "strings": sorted(strings)[:DIMENSION_PROMPT_TOKEN_LIMIT],
        "tokens": sorted(tokens)[:DIMENSION_PROMPT_TOKEN_LIMIT],
    }

    payload = {
        "summary": summary_text,
        "catalog": relevant_catalog,
        "vocabulary": vocabulary,
    }
    state["_dimension_hint_cache"] = payload
    return payload


def _build_columns_meta_from_rows(rows: list[dict[str, Any]]) -> list[dict[str, str]]:
    """Construye metadata de columnas a partir de las filas."""
    if not rows:
        return []

    meta_keys: dict[str, set[str]] = {}
    for row in rows:
        if not isinstance(row, dict):
            continue
        for key, value in row.items():
            normalized_key = str(key or "").strip()
            if not normalized_key:
                continue
            bucket = meta_keys.setdefault(normalized_key, set())
            value_type = type(value).__name__ if value is not None else "str"
            bucket.add(value_type)

    columns_meta: list[dict[str, str]] = []
    for key, types in meta_keys.items():
        label = key.replace("_", " ").title()
        value_type = ", ".join(sorted(types)) if types else "str"
        columns_meta.append(
            {
                "name": key,
                "label": label,
                "type": value_type,
            }
        )

    return columns_meta


def _build_dimension_filter_block(suggestions: Sequence[dict[str, str]]) -> str:
    """Construye un bloque de texto con guía de filtros de catálogo."""
    if not suggestions:
        return ""
    lines = [
        "CATALOG FILTER GUIDANCE:",
        "- Usa los catálogos disponibles para filtrar por sector, entidad o estado y así reducir ruido.",
    ]
    for item in suggestions:
        lines.append(
            '- {label}: aplica {column} = "{value}".'.format(
                label=item.get("label", "Catálogo"),
                column=item.get("column", ""),
                value=item.get("value", ""),
            )
        )
    return "\n".join(lines)


# ═══════════════════════════════════════════════════════════════════════════
# Exports
# ═══════════════════════════════════════════════════════════════════════════

__all__ = [
    # Constantes
    "GRAY_ZONE_REASON_MESSAGES",
    "POSTFETCH_ATTRIBUTE_SUGGESTIONS",
    "SYNONYM_SUGGESTIONS",
    "CLEAR_CLARIFICATION_ENDPOINTS",
    "DIMENSION_COLUMN_MAP",
    "DEFINITIONS_DIR",
    # Settings
    "REASONING_SEED",
    "REASONING_EFFORT_SQL",
    "REASONING_VERBOSITY_SQL",
    "REASONING_EFFORT_TEXT",
    "REASONING_VERBOSITY_TEXT",
    # Definitions
    "_load_definitions_markdown",
    # Chain creation
    "create_chain",
    # Analyzer
    "summarize_analyzer_for_response",
    # User assistance
    "_build_user_assistance",
    "_find_synonym_rewrites",
    "_is_zero_payload",
    "_prioritize_reevaluacion",
    # Post-fetch
    "_prepare_post_fetch_clarification",
    # Row/column filtering
    "_filter_rows_and_columns_by_relevance",
    # Structured text filter
    "_register_structured_text_filter",
    # Dimension suggestions
    "_suggest_dimension_filters_from_keywords",
    "_collect_dimension_strings",
    "_resolve_filter_confidence",
    "_build_dimension_prompt_payload",
    "_build_columns_meta_from_rows",
    "_build_dimension_filter_block",
    # Gray zone
    "_collect_gray_zone_signals",
    "_options_match_conditions",
    "_gray_zone_rule_matches",
    "_infer_gray_zone_reason",
    "_summarize_dimensions",
    "_build_gray_zone_note",
    # Technical details
    "_format_filter_for_details",
    "_build_technical_detail_sections",
    "_build_rows_preview",
    "_build_dimension_gap_notes",
    # Removal reasons
    "_group_removal_reasons",
    # Citizen metrics
    "_record_citizen_metric",
    # LLM rewrite
    "_rewrite_summary_with_llm",
    # Response payload
    "_build_final_response_payload",
    "_build_error_response_payload",
    "_validate_response_structure",
    "_sanitize_response_payload",
]
