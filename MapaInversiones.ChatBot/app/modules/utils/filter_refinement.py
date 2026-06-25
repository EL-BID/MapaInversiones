from __future__ import annotations

import json
import re
from collections import defaultdict
from typing import Any, Dict, Iterable, List, Sequence

from loguru import logger
from modules.config import settings
from modules.utils.text_processing import tokenize_like_process_text

TARGET_TEXT_COLUMNS = {
    "nombre_proyecto",
    "objetivo_proyecto",
    "nombreentidadejecutora_proyecto",
}

CONFIDENCE_THRESHOLD = getattr(settings, "analyzer_filter_confidence_threshold", 0.8)

_FUNC_NAME_RE = re.compile(r"^[a-zA-Z_][\w]*$")


def _normalize_column_reference(column: str) -> str:
    """
    Remove function wrappers like process_text(...) and return a bare alias.column
    string when available.
    """
    if not column:
        return ""
    col = column.strip()
    while True:
        candidate = col.strip()
        if not candidate.endswith(")"):
            break
        first_paren = candidate.find("(")
        if first_paren == -1:
            break
        func_name = candidate[:first_paren].strip()
        if not _FUNC_NAME_RE.match(func_name):
            break
        depth = 0
        closing_idx = None
        for idx, ch in enumerate(candidate[first_paren:], start=first_paren):
            if ch == "(":
                depth += 1
            elif ch == ")":
                depth -= 1
                if depth == 0:
                    closing_idx = idx
                    break
        if closing_idx is None or candidate[closing_idx + 1 :].strip():
            break
        inner = candidate[first_paren + 1 : closing_idx].strip()
        if not inner:
            break
        col = inner
    # Remove surrounding quotes if any
    if len(col) >= 2 and ((col[0] == col[-1] == '"') or (col[0] == col[-1] == "'")):
        col = col[1:-1].strip()
    return col


def _matches_target_column(column: str) -> bool:
    """
    Check whether the analyzer column belongs to the set we want to refine.
    Accepts either qualified identifiers (alias.column) or raw column names.
    """
    if not column:
        return False
    column = _normalize_column_reference(column)
    if "." in column:
        suffix = column.split(".")[-1].lower()
    else:
        suffix = column.lower()
    # Belt-and-suspenders: eliminar paréntesis residuales o espacios.
    suffix = suffix.rstrip(")").strip()
    return suffix in TARGET_TEXT_COLUMNS


def _extract_literal(value: str) -> str:
    """
    Extract a human textual literal from the analyzer value, removing wrappers
    such as process_text(%...%) or quotes.
    """
    if not value:
        return ""
    stripped = value.strip()
    stripped = re.sub(r"^process_text\((.*)\)$", r"\1", stripped, flags=re.IGNORECASE)
    stripped = stripped.strip("%'\" ")
    stripped = stripped.replace("%", " ")
    return stripped.strip()


def build_compound_text_filters(
    analyzer_filters: Sequence[Dict[str, Any]] | None,
    *,
    question_tokens: Sequence[str] | None = None,
    theme_keyword_tokens: Sequence[str] | None = None,
) -> List[Dict[str, Any]]:
    """
    Group analyzer filters that reference long-form textual columns and enrich
    them with token scores derived from analyzer confidence, user question, and
    analyzer theme keywords.
    """
    if not analyzer_filters:
        return []

    groups: Dict[str, Dict[str, Any]] = {}
    question_tokens = [tok.lower() for tok in (question_tokens or []) if tok]
    theme_keyword_tokens = [tok.lower() for tok in (theme_keyword_tokens or []) if tok]

    for entry in analyzer_filters:
        column_raw = str(entry.get("column") or "").strip()
        if not _matches_target_column(column_raw):
            logger.info(f"REFINE ▸ SKIP column={column_raw} reason=not_target")
            continue
        column = _normalize_column_reference(column_raw) or column_raw

        literal_raw = ""
        raw_value = entry.get("value")
        if isinstance(raw_value, str):
            literal_raw = _extract_literal(raw_value)
        tokens_from_value = tokenize_like_process_text(literal_raw)
        if not tokens_from_value:
            tokens_from_value = tokenize_like_process_text(str(raw_value or ""))
        tokens_from_value = [tok.lower() for tok in tokens_from_value if tok]
        if not tokens_from_value and not question_tokens:
            continue

        confidence = entry.get("confidence")
        try:
            confidence_val = float(confidence)
        except (TypeError, ValueError):
            confidence_val = 0.0

        key = column.lower()
        alias = column.split(".")[0] if "." in column else ""
        group = groups.setdefault(
            key,
            {
                "column": column,
                "alias": alias,
                "token_stats": defaultdict(lambda: {"score": 0.0, "sources": set()}),
                "candidate_literals": set(),
                "filter_confidences": [],
                "literal_only": False,
                "literal_values_strong": set(),
            },
        )
        literal_has_space = bool(literal_raw and " " in literal_raw)
        literal_strong = bool(
            literal_has_space and confidence_val >= CONFIDENCE_THRESHOLD
        )

        if literal_raw:
            group["candidate_literals"].add(literal_raw)
        group["filter_confidences"].append(confidence_val)
        if literal_strong:
            group["literal_only"] = True
            group.setdefault("literal_values_strong", set()).add(literal_raw)

        for token in tokens_from_value:
            stats = group["token_stats"][token]
            stats["score"] = max(stats["score"], confidence_val)
            stats["sources"].add("filter")
        logger.info(
            f"REFINE ▸ CANDIDATE column={column} literal='{literal_raw}' tokens={tokens_from_value} "
            f"confidence={confidence_val:.3f} literal_strong={literal_strong}"
        )

    # Inject tokens from user question and analyzer keywords to existing groups
    for group in groups.values():
        token_stats = group["token_stats"]
        for token in question_tokens:
            stats = token_stats[token]
            stats["score"] = max(stats["score"], 0.7)
            stats["sources"].add("question")
        for token in theme_keyword_tokens:
            stats = token_stats[token]
            stats["score"] = max(stats["score"], 0.65)
            stats["sources"].add("theme")

    results: List[Dict[str, Any]] = []
    for idx, group in enumerate(groups.values()):
        token_stats = group["token_stats"]
        if not token_stats:
            continue

        literal_values = sorted(
            group.get("literal_values_strong") or group.get("candidate_literals") or []
        )
        literal_value = literal_values[0] if literal_values else ""
        literal_only = bool(group.get("literal_only", False))

        token_metadata = []
        for token, data in token_stats.items():
            score = round(min(max(data["score"], 0.0), 1.0), 3)
            token_metadata.append(
                {
                    "token": token,
                    "score": score,
                    "sources": sorted(list(data["sources"])),
                }
            )

        token_metadata.sort(key=lambda item: (-item["score"], item["token"]))
        tokens_sorted = [meta["token"] for meta in token_metadata]

        suggested_primary: List[str] = []
        if token_metadata:
            top_score = token_metadata[0]["score"]
            threshold = max(0.75, top_score - 0.05)
            suggested_primary = [
                meta["token"] for meta in token_metadata if meta["score"] >= threshold
            ]

        results.append(
            {
                "filter_id": f"{group['column']}|{idx}",
                "column": group["column"],
                "alias": group["alias"],
                "tokens": tokens_sorted,
                "token_metadata": token_metadata,
                "candidate_literals": literal_values,
                "literal_value": literal_value,
                "literal_only": literal_only,
                "raw_confidences": group["filter_confidences"],
                "suggested_primary": suggested_primary,
            }
        )
        logger.info(
            f"REFINE ▸ BUILD filter_id={group['column']}|{idx} literal_only={literal_only} "
            f"literal='{literal_value}' tokens={tokens_sorted}"
        )

    return results


def dumps_compound_filters(filters: Iterable[Dict[str, Any]]) -> str:
    """
    Convenience helper to serialise the compound filters list as pretty JSON.
    """
    data = list(filters)
    if not data:
        return "[]"
    return json.dumps(data, ensure_ascii=False, indent=2)


# --- NEW FUNCTION: detect_semantic_or_groups ---
def detect_semantic_or_groups(
    compound_filters: Sequence[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Detecta grupos candidatos a OR semántico entre filtros de columnas de texto largo
    (`p.nombre_proyecto` y `p.objetivo_proyecto`) cuando presentan confianzas altas
    y parejas. No ejecuta SQL ni depende de anclas; sólo marca candidatos para que
    el pipeline posterior decida si aplica OR/UNION según contexto (por ejemplo,
    presencia de ancla territorial).

    Devuelve una lista de grupos. Cada grupo tiene:
    - columns: columnas involucradas (subset de {p.nombre_proyecto, p.objetivo_proyecto})
    - literals: lista de literales detectados (si los hubo)
    - tokens: lista de listas de tokens (por candidato)
    - confidences: confianzas máximas por candidato

    Criterios (conservadores):
    - conf_min = settings.semantic_or_conf_min (default = analyzer_filter_confidence_threshold, típicamente 0.80)
    - conf_delta = settings.semantic_or_conf_delta (default = 0.05)
    - max_group_size = settings.semantic_or_max_group_size (default = 3)
    - Sólo columnas: p.nombre_proyecto / p.objetivo_proyecto
    """
    try:
        conf_min = float(
            getattr(settings, "semantic_or_conf_min", CONFIDENCE_THRESHOLD)
        )
    except Exception:
        conf_min = CONFIDENCE_THRESHOLD

    try:
        conf_delta = float(getattr(settings, "semantic_or_conf_delta", 0.05))
    except Exception:
        conf_delta = 0.05

    try:
        max_group_size = int(getattr(settings, "semantic_or_max_group_size", 3))
    except Exception:
        max_group_size = 3

    # Filtrar candidatos válidos sobre columnas objetivo
    candidates: List[Dict[str, Any]] = []
    for item in compound_filters or []:
        col = _normalize_column_reference(str(item.get("column") or ""))
        if "." in col:
            col_suffix = col.split(".")[-1].lower()
        else:
            col_suffix = col.lower()
        if col_suffix not in {"nombre_proyecto", "objetivo_proyecto"}:
            continue

        confidences = item.get("raw_confidences") or []
        try:
            cmax = max(float(c or 0.0) for c in confidences) if confidences else 0.0
        except Exception:
            cmax = 0.0
        if cmax < conf_min:
            continue

        literal = item.get("literal_value") or ""
        if not literal:
            cand_lits = item.get("candidate_literals") or []
            literal = cand_lits[0] if cand_lits else ""

        # Tokens de mayor puntaje primero; si no hay suggested_primary, usa tokens completos.
        toks = item.get("suggested_primary") or item.get("tokens") or []
        toks = [t for t in toks if t]

        candidates.append(
            {
                "column": col,
                "confidence": cmax,
                "tokens": toks[:3],  # limitar ruido
                "literal": literal,
            }
        )

    # Ordenar por confianza descendente
    candidates.sort(key=lambda x: -x["confidence"])
    if len(candidates) < 2:
        logger.info("REFINE ▸ SEMANTIC_OR_CAND groups=0 reason=insufficient_candidates")
        return []

    # Construir un grupo con los primeros elementos de confianza pareja
    base_conf = candidates[0]["confidence"]
    group_elems = [candidates[0]]
    for it in candidates[1:]:
        if abs(base_conf - it["confidence"]) <= conf_delta:
            group_elems.append(it)
        if len(group_elems) >= max_group_size:
            break

    if len(group_elems) < 2:
        logger.info("REFINE ▸ SEMANTIC_OR_CAND groups=0 reason=delta_too_high")
        return []

    group = {
        "columns": sorted(list({g["column"] for g in group_elems})),
        "literals": [g["literal"] for g in group_elems if g.get("literal")],
        "tokens": [g.get("tokens", []) for g in group_elems],
        "confidences": [g.get("confidence", 0.0) for g in group_elems],
    }
    logger.info("REFINE ▸ SEMANTIC_OR_CAND groups=1 detail={}", group)
    return [group]


def sanitise_refined_filters(
    compound_filters: Sequence[Dict[str, Any]],
    refined_filters: Sequence[Dict[str, Any]] | None,
    known_acronyms: Iterable[str] | None = None,
) -> List[Dict[str, Any]]:
    """
    Validate and normalise the refined filters returned by the LLM.
    Keeps only tokens suggested in the original compound filter and ensures we
    don't propagate arbitrary acronyms.
    """
    if not refined_filters:
        return []

    by_id = {item["filter_id"]: item for item in compound_filters}
    allowed_acronyms = {acro.lower() for acro in (known_acronyms or [])}

    sanitised: List[Dict[str, Any]] = []
    for entry in refined_filters:
        filter_id = entry.get("filter_id")
        if not filter_id or filter_id not in by_id:
            continue

        base = by_id[filter_id]
        base_tokens = set(base.get("tokens", []))
        literal_only = bool(base.get("literal_only", False))
        literal_value = base.get("literal_value") or ", ".join(
            base.get("candidate_literals", [])
        )

        def _clean_token_list(values: Sequence[Any]) -> List[str]:
            cleaned: List[str] = []
            for value in values or []:
                if not isinstance(value, str):
                    continue
                token = value.strip().lower()
                if token and token in base_tokens and token not in cleaned:
                    cleaned.append(token)
            return cleaned

        primary_tokens = _clean_token_list(
            entry.get("primary_tokens") or entry.get("tokens")
        )
        additional_tokens = _clean_token_list(entry.get("additional_tokens"))

        include_literal = bool(entry.get("include_literal", True)) or literal_only
        use_token_exists = bool(entry.get("use_token_exists", False))
        if literal_only:
            primary_tokens = []
            additional_tokens = []
            use_token_exists = False

        include_acronyms = bool(entry.get("include_acronyms", False))

        acronyms_raw = entry.get("acronyms") or []
        acronyms: List[str] = []
        for value in acronyms_raw:
            if not isinstance(value, str):
                continue
            token = value.strip().lower()
            if not token:
                continue
            if allowed_acronyms and token not in allowed_acronyms:
                continue
            if token not in acronyms:
                acronyms.append(token)

        sanitised.append(
            {
                "filter_id": filter_id,
                "column": base["column"],
                "alias": base.get("alias", ""),
                "value": literal_value,
                "tokens": base.get("tokens", []),
                "token_metadata": base.get("token_metadata", []),
                "suggested_primary": base.get("suggested_primary", []),
                "literal_only": literal_only,
                "literal_value": literal_value,
                "primary_tokens": primary_tokens,
                "additional_tokens": additional_tokens,
                "include_literal": include_literal,
                "use_token_exists": use_token_exists and bool(primary_tokens),
                "include_acronyms": include_acronyms and bool(acronyms),
                "acronyms": acronyms,
                "notes": entry.get("notes", ""),
            }
        )

    return sanitised


def build_filter_guidance_block(
    refined_filters: Sequence[Dict[str, Any]],
) -> str:
    """
    Build a textual helper block that the SQL-generation prompt can consume.
    """
    if not refined_filters:
        return ""

    lines: List[str] = [
        "FILTER REFINEMENT GUIDANCE:",
        "- Usa estas instrucciones para construir las cláusulas WHERE sobre columnas de texto largo.",
        "- Cuando `use_token_exists` sea verdadero, añade condiciones con ILIKE + process_text para cada token prioritario.",
        "- Mantén siempre process_text() en ambos lados de las comparaciones textuales.",
    ]

    for item in refined_filters:
        column = item.get("column", "")
        value = item.get("value", "")
        primary_tokens = item.get("primary_tokens") or []
        additional_tokens = item.get("additional_tokens") or []
        include_literal = item.get("include_literal", True)
        use_token_exists = item.get("use_token_exists", False)
        include_acronyms = item.get("include_acronyms", False)
        acronyms = item.get("acronyms") or []
        token_metadata = item.get("token_metadata") or []
        suggested_primary = item.get("suggested_primary") or []
        literal_only = item.get("literal_only", False)

        descriptor = f'- {column} ↦ frase base "{value}".'
        if include_literal:
            descriptor += " Mantén un filtro literal (ILIKE + process_text) para la frase completa."
        else:
            descriptor += " No mantengas el literal exacto; apóyate en tokens clave."

        if literal_only:
            descriptor += " (Marcado como literal fuerte; usa el literal tal cual y sólo considera tokens en caso de fallback tras 0 filas.)"

        if token_metadata:
            scores_text = ", ".join(
                f"{meta['token']}:{meta.get('score', 0)}"
                for meta in token_metadata
                if meta.get("token")
            )
            if scores_text:
                descriptor += f" (puntajes tokens → {scores_text})"
        if suggested_primary:
            descriptor += (
                f" Tokens recomendados (alto puntaje): {', '.join(suggested_primary)}."
            )

        if use_token_exists and primary_tokens:
            descriptor += f" Requiere coincidencias exactas de tokens: {', '.join(primary_tokens)}."
            if additional_tokens:
                descriptor += (
                    f" Tokens secundarios sugeridos: {', '.join(additional_tokens)}."
                )
            descriptor += " Implementa condiciones con process_text(col) ILIKE '%' || process_text('token') || '%'."

        if include_acronyms and acronyms:
            descriptor += f" Añade OR con acrónimos autorizados: {', '.join(acronyms)}."

        lines.append(descriptor)

    return "\n".join(lines)


def build_default_refined_filters(
    compound_filters: Sequence[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Fallback deterministic refined filters when the LLM output is unusable.
    For each compound filter we keep the literal and promote the highest scoring
    tokens as primary tokens enforced through EXISTS.
    """
    results: List[Dict[str, Any]] = []
    for item in compound_filters:
        filter_id = item.get("filter_id")
        if not filter_id:
            continue

        tokens = list(item.get("tokens", []))
        token_metadata = item.get("token_metadata", [])
        literal_only = bool(item.get("literal_only", False))
        literal_value = (
            item.get("literal_value")
            or ", ".join(item.get("candidate_literals", []))
            or ""
        )

        suggested_primary = list(item.get("suggested_primary") or [])
        primary_tokens: List[str] = [tok for tok in suggested_primary if tok] or [
            tok for tok in tokens[:3] if tok
        ]
        additional_tokens = [
            tok for tok in tokens if tok and tok not in primary_tokens
        ][:3]

        use_token_exists = bool(primary_tokens) and not literal_only

        results.append(
            {
                "filter_id": filter_id,
                "column": item.get("column"),
                "alias": item.get("alias", ""),
                "value": literal_value,
                "tokens": tokens,
                "token_metadata": token_metadata,
                "suggested_primary": item.get("suggested_primary", []),
                "literal_only": literal_only,
                "literal_value": literal_value,
                "primary_tokens": primary_tokens,
                "additional_tokens": additional_tokens,
                "include_literal": True,
                "use_token_exists": use_token_exists,
                "include_acronyms": False,
                "acronyms": [],
                "notes": "",
            }
        )

    return results
