# helpers_texto.py
"""
Funciones de procesamiento de texto.

Incluye:
- Normalización de texto y columnas
- Tokenización
- Parsing de secciones del analyzer
- Manejo de stopwords
- Extracción de frases/literals

Todas las funciones son puras (sin efectos secundarios en estado).
"""

from __future__ import annotations

import json
import re
import unicodedata
import hashlib
from functools import lru_cache
from typing import Any, Dict, List, Optional, Sequence

from modules.config import settings
from modules.utils.filter_refinement import (
    _normalize_column_reference,
    TARGET_TEXT_COLUMNS,
)
from modules.utils.text_processing import process_text_like_db

# ═══════════════════════════════════════════════════════════════════════════
# Configuración desde settings
# ═══════════════════════════════════════════════════════════════════════════

FILTER_CONFIDENCE_THRESHOLD = getattr(
    settings, "analyzer_filter_confidence_threshold", 0.8
)
MAX_CLARIFICATION_TURNS = getattr(settings, "max_clarification_turns", 2)
MIN_TEXT_FILTER_TOKEN_LENGTH = getattr(settings, "min_text_filter_token_length", 4)
MIN_EXISTS_CONFIDENCE = getattr(settings, "token_exists_min_confidence", 0.8)
MAX_REFINED_FILTER_TOKENS = getattr(settings, "max_refined_filter_tokens", 3)
MAX_THEME_KEYWORDS_PROMPT = getattr(settings, "max_theme_keywords_prompt", 3)
# Fuzzy matching threshold for catalog lookups (sector, entity, territory)
FUZZY_MATCH_THRESHOLD = getattr(settings, "fuzzy_match_threshold", 0.75)

_DEFAULT_TEXT_FILTER_STOPLIST = {
    "proyecto",
    "proyectos",
    "obra",
    "obras",
    "linea",
    "lineas",
    "construccion",
}

TEXT_FILTER_TOKEN_STOPLIST = {
    token.strip().lower()
    for token in getattr(
        settings, "text_filter_stoplist", _DEFAULT_TEXT_FILTER_STOPLIST
    )
    if isinstance(token, str) and token.strip()
}

STRUCTURED_TEXT_COLUMNS = {
    "p.nombresector_proyecto",
    "p.nombreentidadejecutora_proyecto",
    "p.estado_proyecto",
    "p.tipo_proyecto",
    "p.subtipo_proyecto",
    "p.fuente_financiamiento",
}
STRUCTURED_TEXT_COLUMNS_NORM: set[str] | None = None


# ═══════════════════════════════════════════════════════════════════════════
# Stopwords y Constantes de Texto
# ═══════════════════════════════════════════════════════════════════════════

STOPWORDS = {
    "de",
    "del",
    "la",
    "el",
    "los",
    "las",
    "y",
    "o",
    "para",
    "por",
    "con",
    "en",
    "sobre",
    "un",
    "una",
    "unos",
    "unas",
    "al",
    "lo",
    "su",
    "sus",
    "que",
    "cual",
    "cuales",
    "dame",
    "mostrame",
    "muestrame",
    "mostrar",
    "muestra",
    "ahora",
    "quiero",
    "ver",
    "mayor",
    "menor",
    "mas",
    "más",
    "menos",
    "proyectos",
    "cuanto",
    "cuantos",
    "cuanta",
    "cuantas",
    "hay",
    "tienen",
    "relacionados",
    "relacionadas",
    "solo",
}

_ADDITIONAL_TOKEN_STOPWORDS = {
    "ana",
    "ane",
    "and",
    "con",
    "del",
    "sus",
    "los",
    "las",
    "por",
    "que",
}

# Mapeo de nombres amigables para filtros
FRIENDLY_FILTER_NAMES = {
    "nombresector_proyecto": "sector del proyecto",
    "nombreentidadejecutora_proyecto": "entidad ejecutora",
    "estado_proyecto": "estado del proyecto",
    "anio_fechainicio_proyecto": "año de inicio",
    "anio_fechafin_proyecto": "año de fin",
    "valor_proyecto": "monto aprobado",
}

DEFAULT_ALWAYS_KEEP_COLUMNS = {
    "nombre_proyecto",
    "id_proyecto",
    "titulo_proyecto",
    "url_link_proyecto",
    "url_link",
    "url_proyecto",
    "project_url",
    "url",
    "link",
    "link",
    # Columnas monetarias fundamentales
    "valor_proyecto",
    "valor_vigente",
    "valor_ejecutado",
    # Dimensiones Clave (Sectores, Entidades, Territorio) - NO PODAR
    "nombresector_proyecto",
    "nombreentidadejecutora_proyecto",
    "nombre_region",
    "nombre_departamento",
    "nombre_municipio",
    "pais_iso3",
    # Aliases comunes que también deben preservarse
    "sector",
    "entidad",
    "territorio",
    "region",
    "departamento",
    "municipio",
    "provincia",
    "estado",
}

QUESTION_METRIC_KEYWORDS = {
    "monto",
    "valor",
    "total",
    "cantidad",
    "duracion",
    "duración",
    "avance",
    "inversion",
    "inversión",
    "presupuesto",
    "costo",
    "gasto",
}


# ═══════════════════════════════════════════════════════════════════════════
# Parsing del Analyzer
# ═══════════════════════════════════════════════════════════════════════════

_ANALYZER_SECTION_PREFIX = "### "
_FILTER_LINE_RE = re.compile(
    r"column=(?P<column>[^|]+)\|\s*operator=(?P<operator>[^|]+)\|\s*value=(?P<value>[^|]+)",
    flags=re.IGNORECASE,
)


def _parse_analyzer_sections(analyzer_text: str) -> dict[str, list[str]]:
    """Parsea el texto del analyzer en secciones por header."""
    sections: dict[str, list[str]] = {}
    current_key: str | None = None
    if not analyzer_text:
        return sections

    for raw_line in analyzer_text.splitlines():
        line = raw_line.rstrip()
        if not line:
            continue
        if line.startswith(_ANALYZER_SECTION_PREFIX):
            key = line[len(_ANALYZER_SECTION_PREFIX) :].strip().upper()
            current_key = key
            sections[current_key] = []
            continue
        if current_key:
            sections[current_key].append(line)
    return sections


# ═══════════════════════════════════════════════════════════════════════════
# Normalización de Texto
# ═══════════════════════════════════════════════════════════════════════════


def _normalize_text(text: str) -> str:
    """Normaliza texto: minúsculas y sin acentos."""
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKD", text.lower())
    return "".join(ch for ch in normalized if not unicodedata.combining(ch))


def _normalize_text_upper(text: str) -> str:
    """
    Normaliza texto: mayúsculas, espacios colapsados.
    Usar para comparaciones territoriales y catálogos en mayúsculas.
    """
    if not text:
        return ""
    return re.sub(r"\s+", " ", str(text)).strip().upper()


def _strip_function_wrappers(expr: str | None) -> str:
    """
    Elimina recursivamente CUALQUIER función wrapper de una expresión SQL.

    Convierte: UPPER(TRIM(LOWER(p.columna))) → p.columna
    Convierte: process_text(col) → col
    Convierte: COALESCE(x, 'default') → x, 'default'

    Esta es la función ÚNICA y CANÓNICA para eliminar wrappers.
    Usarla en lugar de versiones específicas (que solo quitan algunas funciones).
    """
    if not expr:
        return ""
    s = str(expr).strip()
    # Patrón genérico: cualquier identificador seguido de paréntesis con contenido
    # Captura el contenido interno, quitando la función wrapper
    func_pattern = re.compile(r"\b[a-z_][a-z0-9_]*\s*\(([^()]*)\)", re.IGNORECASE)

    prev = None
    while prev != s:
        prev = s
        s = func_pattern.sub(r"\1", s)

    return s.strip()


def _normalize_column_name(column: str) -> str:
    """Normaliza el nombre de una columna eliminando prefijos, wrappers y quotes."""
    if not column:
        return ""
    raw = str(column).strip()
    raw = raw.strip(",;")

    unwrapped = _normalize_column_reference(raw) or raw

    # Usar la función genérica para quitar CUALQUIER wrapper de función
    unwrapped = _strip_function_wrappers(unwrapped)

    chars_to_strip = "\"'`[]"
    normalized = unwrapped.strip().strip(chars_to_strip)
    if "." in normalized:
        normalized = normalized.split(".")[-1]

    normalized = normalized.strip().strip(chars_to_strip)
    normalized = normalized.rstrip(") ]").lstrip("([")

    return normalized.strip().lower()


def _normalize_dimension_column(column: str) -> str:
    """Normaliza una columna de dimensión eliminando wrappers y prefijos."""
    if not column:
        return ""
    # Usar la función unificada para quitar wrappers
    value = _strip_function_wrappers(column)
    value = value.strip("\"'")
    if "." in value:
        value = value.split(".")[-1]
    return value.strip("\"'").lower()


def _norm_for_dedupe(s: str) -> str:
    """Normaliza texto para deduplicación."""
    return re.sub(r"\s+", " ", s).strip().lower()


def _normalize_literal_token(token: str) -> str:
    """Normaliza un token literal para comparación."""
    cleaned = str(token or "").strip()
    cleaned = cleaned.strip("\"'")
    cleaned = cleaned.replace("%", "")
    cleaned = cleaned.lower().strip()
    return cleaned


# ═══════════════════════════════════════════════════════════════════════════
# Tokenización
# ═══════════════════════════════════════════════════════════════════════════


def _tokenize_question(question: str) -> set[str]:
    """Tokeniza una pregunta en un conjunto de tokens normalizados."""
    normalized = _normalize_text(question or "")
    tokens = {token for token in re.split(r"[^a-z0-9]+", normalized) if token.strip()}
    return tokens


def _tokens_from_phrase(value: Any) -> list[str]:
    """Extrae tokens de una frase."""
    if not isinstance(value, str):
        return []
    normalized = _normalize_text(value)
    if not normalized:
        return []
    return [token for token in normalized.split() if token]


def _split_identifier(identifier: str) -> list[str]:
    """Divide un identificador en tokens."""
    if not identifier:
        return []
    return re.split(r"[^a-z0-9]+", identifier.lower())


def _sanitize_keyword_tokens(text: str) -> list[str]:
    """Sanitiza y extrae tokens de keywords de un texto."""
    if not text:
        return []
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    raw_tokens = re.findall(r"[a-z0-9]+", ascii_text.lower())

    tokens: list[str] = []
    seen: set[str] = set()
    for token in raw_tokens:
        if len(token) < 3:
            continue
        if token in STOPWORDS or token in _ADDITIONAL_TOKEN_STOPWORDS:
            continue
        if token in seen:
            continue
        seen.add(token)
        tokens.append(token)
    return tokens


# ═══════════════════════════════════════════════════════════════════════════
# Validación de Tokens
# ═══════════════════════════════════════════════════════════════════════════


def _is_stoplisted_token(token: str) -> bool:
    """Verifica si un token está en la stoplist."""
    if not token:
        return False
    normalized = token.strip().lower()
    return normalized in TEXT_FILTER_TOKEN_STOPLIST


def _is_viable_text_token(token: str) -> bool:
    """Verifica si un token es viable para búsqueda de texto."""
    if not token:
        return False
    normalized = token.strip().lower()
    if not normalized:
        return False
    if len(normalized) < MIN_TEXT_FILTER_TOKEN_LENGTH:
        return False
    if _is_stoplisted_token(normalized):
        return False
    return True


def _should_use_token_exists(item: Dict[str, Any]) -> bool:
    """Determina si se debe usar búsqueda EXISTS basada en tokens."""
    if not item.get("use_token_exists"):
        return False
    if item.get("literal_only"):
        return True
    token_metadata = item.get("token_metadata") or []
    max_score = 0.0
    for meta in token_metadata:
        try:
            score = float(meta.get("score", 0.0))
        except (TypeError, ValueError):
            score = 0.0
        if score > max_score:
            max_score = score
    return max_score >= MIN_EXISTS_CONFIDENCE


# ═══════════════════════════════════════════════════════════════════════════
# Columnas Estructuradas
# ═══════════════════════════════════════════════════════════════════════════


def _is_structured_text_column(column: str | None) -> bool:
    """Verifica si una columna es de texto estructurado."""
    if not column:
        return False
    global STRUCTURED_TEXT_COLUMNS_NORM
    if STRUCTURED_TEXT_COLUMNS_NORM is None:
        STRUCTURED_TEXT_COLUMNS_NORM = {
            _normalize_column_name(name)
            for name in STRUCTURED_TEXT_COLUMNS
            if isinstance(name, str) and name.strip()
        }
    normalized = _normalize_column_name(column)
    return normalized in STRUCTURED_TEXT_COLUMNS_NORM


# ═══════════════════════════════════════════════════════════════════════════
# Sanitización de Filtros
# ═══════════════════════════════════════════════════════════════════════════


def _scrub_stoplist_from_compound_filters(
    filters: Sequence[Dict[str, Any]],
) -> list[dict[str, Any]]:
    """Elimina tokens de stoplist de filtros compuestos."""
    adjustments: list[dict[str, Any]] = []

    for item in filters or []:
        removed: list[str] = []

        original_tokens = list(item.get("tokens") or [])
        item["tokens"] = []
        for token in original_tokens:
            token_str = str(token).strip()
            if token_str and _is_stoplisted_token(token_str):
                removed.append(token_str.lower())
                continue
            item["tokens"].append(token)

        token_metadata = item.get("token_metadata") or []
        item["token_metadata"] = [
            meta
            for meta in token_metadata
            if not _is_stoplisted_token(str(meta.get("token", "")))
        ]

        suggested_primary = item.get("suggested_primary") or []
        item["suggested_primary"] = [
            token for token in suggested_primary if not _is_stoplisted_token(token)
        ]

        if removed:
            adjustments.append(
                {
                    "filter_id": item.get("filter_id"),
                    "removed_tokens": sorted(set(removed)),
                }
            )

    return adjustments


def _sanitize_refined_tokens(
    tokens: Sequence[Any], token_metadata: Optional[Sequence[Dict[str, Any]]] = None
) -> list[str]:
    """Sanitiza y rankea tokens refinados."""
    if not tokens:
        return []

    score_map: dict[str, float] = {}
    if token_metadata:
        for meta in token_metadata:
            meta_token = str(meta.get("token") or "").strip().lower()
            if not meta_token:
                continue
            try:
                base_score = float(meta.get("score", 0.0))
            except (TypeError, ValueError):
                base_score = 0.0
            sources = {str(src).lower() for src in (meta.get("sources") or [])}
            if "filter" in sources:
                base_score += 0.2
            elif "question" in sources:
                base_score += 0.1
            score_map[meta_token] = max(
                base_score, score_map.get(meta_token, base_score)
            )

    ranked_tokens: list[tuple[str, float]] = []
    for idx, raw in enumerate(tokens):
        token = str(raw).strip().lower()
        if not token or not _is_viable_text_token(token):
            continue
        score = score_map.get(token, 0.0) - (idx * 0.001)
        ranked_tokens.append((token, score))

    ranked_tokens.sort(key=lambda item: item[1], reverse=True)

    sanitized: list[str] = []
    for token, _ in ranked_tokens:
        if token in sanitized:
            continue
        sanitized.append(token)
        if len(sanitized) >= MAX_REFINED_FILTER_TOKENS:
            break
    return sanitized


def _filter_keywords_for_text_search(
    keywords: Sequence[str],
    blocked_tokens: Optional[set[str]] = None,
) -> list[str]:
    """Filtra keywords para búsqueda de texto eliminando bloqueados."""
    blocked = {
        token.strip().lower()
        for token in (blocked_tokens or set())
        if isinstance(token, str)
    }
    filtered: list[str] = []
    seen: set[str] = set()
    for raw in keywords or []:
        tokens = _tokens_from_phrase(raw) or [_normalize_text(str(raw))]
        for token in tokens:
            normalized = token.strip().lower()
            if not normalized:
                continue
            if blocked and normalized in blocked:
                continue
            if normalized in seen:
                continue
            seen.add(normalized)
            filtered.append(normalized)
    return filtered


# ═══════════════════════════════════════════════════════════════════════════
# Extracción de Literales
# ═══════════════════════════════════════════════════════════════════════════


def _extract_search_literal(val_raw: Any) -> str:
    """Extrae el literal de búsqueda de un valor SQL."""
    try:
        if val_raw is None:
            return ""
        val = str(val_raw).strip()
        m = re.match(r"(?i)\s*(?:process_text|lower)\s*\(\s*'([^']*)'\s*\)\s*$", val)
        if m:
            inner = m.group(1)
            return inner.strip("%").strip()
        m = re.match(r"^\s*'([^']*)'\s*$", val)
        if m:
            inner = m.group(1)
            return inner.strip("%").strip()
        if val.startswith("%") and val.endswith("%"):
            return val.strip("%").strip()
        return val.strip("%").strip()
    except Exception:
        return ""


def _extract_question_phrases(text: str) -> list[str]:
    """Extrae frases significativas de un texto de pregunta."""
    normalized = _normalize_text(text)
    if not normalized:
        return []
    raw_tokens = [
        token
        for token in re.split(r"[^a-z0-9]+", normalized)
        if token and len(token) > 2 and token not in STOPWORDS
    ]
    if not raw_tokens:
        return []

    phrases: list[str] = []
    seen: set[str] = set()

    for i in range(len(raw_tokens) - 1):
        bi = f"{raw_tokens[i]} {raw_tokens[i + 1]}"
        if bi not in seen:
            phrases.append(bi)
            seen.add(bi)

    for token in raw_tokens:
        if token not in seen:
            phrases.append(token)
            seen.add(token)

    return phrases


# ═══════════════════════════════════════════════════════════════════════════
# Utilidades de Nombres
# ═══════════════════════════════════════════════════════════════════════════


def _humanize_filter_column(column: str) -> str:
    """Convierte un nombre de columna a formato legible."""
    if not column:
        return "el dato solicitado"
    clean = _normalize_column_name(column)
    if not clean:
        clean = column.strip()
    return FRIENDLY_FILTER_NAMES.get(clean, clean.replace("_", " "))


def _humanize_filter_list(columns: set[str]) -> list[str]:
    """Convierte un set de columnas a nombres legibles."""
    names: list[str] = []
    for col in sorted(columns):
        friendly = FRIENDLY_FILTER_NAMES.get(col, col.replace("_", " "))
        names.append(friendly)
    return names


def _column_label_matches_question(label: str, tokens: set[str]) -> bool:
    """Verifica si un label de columna coincide con tokens de pregunta."""
    if not label or not tokens:
        return False
    normalized_label = _normalize_text(label)
    return any(token in normalized_label for token in tokens)


# ═══════════════════════════════════════════════════════════════════════════
# Schema Helpers
# ═══════════════════════════════════════════════════════════════════════════


def _get_schema_column_names() -> set[str]:
    """Obtiene todos los nombres de columna del schema."""
    from modules.utils.build_schema_enriched import SCHEMA_JSON_GLOBAL

    try:
        schema_data = json.loads(SCHEMA_JSON_GLOBAL)
    except (json.JSONDecodeError, TypeError):
        return set()

    columns: set[str] = set()
    for table_meta in schema_data.values():
        for column_name in (table_meta.get("columns") or {}).keys():
            columns.add(_normalize_column_name(column_name))
    return columns


def _get_schema_column_tokens() -> list[set[str]]:
    """Obtiene tokens de columnas del schema."""
    from modules.utils.build_schema_enriched import SCHEMA_JSON_GLOBAL

    schema_tokens: list[set[str]] = []
    try:
        schema_data = json.loads(SCHEMA_JSON_GLOBAL)
    except (json.JSONDecodeError, TypeError):
        return schema_tokens

    for table_meta in schema_data.values():
        columns_meta = table_meta.get("columns") or {}
        for column_name in columns_meta.keys():
            identifier = _normalize_column_name(column_name)
            tokens = set(_split_identifier(identifier))
            if tokens:
                schema_tokens.append(tokens)
    return schema_tokens


def _get_schema_allowed_strings() -> tuple[set[str], set[str]]:
    """Obtiene strings permitidos del schema."""
    from modules.utils.build_schema_enriched import SCHEMA_JSON_GLOBAL

    strings: set[str] = set()
    tokens: set[str] = set()
    try:
        schema_data = json.loads(SCHEMA_JSON_GLOBAL)
    except (json.JSONDecodeError, TypeError):
        return strings, tokens

    for table_meta in schema_data.values():
        columns_meta = table_meta.get("columns") or {}
        for column_name in columns_meta.keys():
            normalized = _normalize_text(column_name.replace("_", " "))
            if not normalized:
                continue
            strings.add(normalized)
            for token in re.split(r"\s+", normalized):
                if token:
                    tokens.add(token)
    return strings, tokens


def _phrase_matches_catalog(
    phrase: str,
    allowed_strings: set[str],
    allowed_tokens: set[str],
) -> bool:
    """Verifica si una frase coincide con el catálogo permitido."""
    if not phrase:
        return False
    if phrase in allowed_strings or phrase in allowed_tokens:
        return True
    for candidate in allowed_strings:
        if phrase in candidate:
            return True
    if len(phrase.split()) > 1:
        return all(
            _phrase_matches_catalog(token, allowed_strings, allowed_tokens)
            for token in phrase.split()
        )
    return any(phrase in candidate for candidate in allowed_strings)


def _get_catalog_hash(catalog: Sequence[str]) -> str:
    """Genera un hash estable para usar en el cache de catálogos normalizados."""
    catalog_str = "|".join(sorted(str(item) for item in catalog))
    return hashlib.md5(catalog_str.encode()).hexdigest()[:16]


@lru_cache(maxsize=64)
def _get_normalized_catalog_cached(
    catalog_hash: str, catalog_tuple: tuple
) -> list[tuple[str, str]]:
    """Cachea catálogo normalizado como [(original, normalizado)]."""
    return [
        (item, process_text_like_db(item))
        for item in catalog_tuple
        if process_text_like_db(item)
    ]


def _fuzzy_match_difflib_fallback(
    value: str, catalog: Sequence[str], threshold: float
) -> tuple[str, float]:
    """Replica el comportamiento previo usando difflib."""
    import difflib

    clean_value = _strip_function_wrappers(value)
    clean_value = clean_value.strip("'\" \t\n\r")
    if not clean_value:
        return value, 0.0

    target_norm = process_text_like_db(clean_value)
    if not target_norm:
        return clean_value, 0.0

    best = clean_value
    best_score = 0.0
    for item in catalog:
        item_norm = process_text_like_db(item)
        if not item_norm:
            continue
        score = difflib.SequenceMatcher(None, target_norm, item_norm).ratio()
        if score > best_score:
            best_score = score
            best = item
    if best_score >= threshold:
        return best, best_score
    return clean_value, 0.0


def _fuzzy_match_from_catalog(
    value: str, catalog: Sequence[str], *, threshold: float = None
) -> tuple[str, float]:
    """
    Encuentra el ítem más parecido en un catálogo usando similitud sobre el texto
    normalizado (process_text_like_db). Usa rapidfuzz si está disponible, con
    fallback a difflib. Retorna (best_match, score) o (valor_original, 0) si
    no supera el umbral.

    Args:
        value: Valor a buscar en el catálogo
        catalog: Lista de valores del catálogo
        threshold: Umbral de similitud (default: FUZZY_MATCH_THRESHOLD from config)
    """
    # Use config threshold if not explicitly provided
    if threshold is None:
        threshold = FUZZY_MATCH_THRESHOLD

    if not value or not catalog:
        return value, 0.0

    clean_value = _strip_function_wrappers(value)
    clean_value = clean_value.strip("'\" \t\n\r")
    if not clean_value:
        return value, 0.0

    target_norm = process_text_like_db(clean_value)
    if not target_norm:
        return clean_value, 0.0

    try:
        from rapidfuzz import fuzz, process  # type: ignore
    except Exception:
        return _fuzzy_match_difflib_fallback(value, catalog, threshold)

    catalog_tuple = tuple(catalog)
    catalog_hash = _get_catalog_hash(catalog)
    normalized_catalog = _get_normalized_catalog_cached(catalog_hash, catalog_tuple)
    if not normalized_catalog:
        return clean_value, 0.0

    result = process.extractOne(
        target_norm,
        [norm for _, norm in normalized_catalog],
        scorer=fuzz.ratio,
        score_cutoff=int(threshold * 100),
    )

    # Defensive: extractOne returns None if no match above score_cutoff
    if result is None:
        return clean_value, 0.0

    best_item, score_100, _ = result

    for orig_item, norm_item in normalized_catalog:
        if norm_item == best_item:
            return orig_item, score_100 / 100.0
    return clean_value, 0.0


# ═══════════════════════════════════════════════════════════════════════════
# JSON Extraction
# ═══════════════════════════════════════════════════════════════════════════


def extract_json_rows(sql_response: str):
    """
    Extrae filas en formato JSON desde la respuesta SQL.
    Busca todos los bloques que parezcan arreglos JSON y retorna el primero que se pueda parsear.
    """
    json_blocks = re.findall(r"\[.*?\]", sql_response, re.DOTALL)
    for block in json_blocks:
        try:
            data = json.loads(block)
            return data
        except json.JSONDecodeError:
            continue
    return None


def _extract_first_json_block(text: str) -> dict[str, Any]:
    """Extrae el primer bloque JSON de un texto."""
    if not text:
        return {}
    if isinstance(text, dict):
        return text
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        pass
    match = re.search(r"\{.*\}", str(text), flags=re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return {}
    return {}


# ═══════════════════════════════════════════════════════════════════════════
# Localización
# ═══════════════════════════════════════════════════════════════════════════


def _localize(iso: str, es_text: str, en_text: str) -> str:
    """Localiza texto según código ISO de idioma."""
    iso = (iso or "").lower()
    if iso.startswith("en"):
        return en_text
    if iso.startswith("pt"):
        return es_text
    return es_text


# ═══════════════════════════════════════════════════════════════════════════
# Texto Auxiliar
# ═══════════════════════════════════════════════════════════════════════════


def _truncate_for_details(value: str, limit: int = 1200) -> str:
    """Reduce textos extensos para que entren en el modal de detalles."""
    if not value:
        return ""
    clean_value = str(value).strip()
    if len(clean_value) <= limit:
        return clean_value
    return f"{clean_value[: limit - 3].rstrip()}..."


def _replace_keyword_case_insensitive(text: str, keyword: str, replacement: str) -> str:
    """Reemplaza keyword case-insensitive."""
    pattern = re.compile(re.escape(keyword), re.IGNORECASE)
    return pattern.sub(replacement, text, count=1)


def _ensure_question_suffix(text: str) -> str:
    """Asegura que el texto termine con signo de pregunta."""
    stripped = text.rstrip()
    return stripped if stripped.endswith(("?", "¿")) else stripped + "?"


# ═══════════════════════════════════════════════════════════════════════════
# Acrónimos y Few-shots
# ═══════════════════════════════════════════════════════════════════════════


def _resolve_known_acronyms(country_code: str) -> dict[str, list[str]]:
    """Combina acrónimos globales y específicos de país definidos en settings."""
    result: dict[str, list[str]] = {}
    data = getattr(settings, "domain_acronyms", None) or {}
    global_acronyms = data.get("global") or {}
    country_acronyms = data.get((country_code or "").lower()) or {}

    def _ingest(source: dict[str, Any]):
        for key, values in (source or {}).items():
            if not key:
                continue
            cleaned_key = str(key).strip().lower()
            if not cleaned_key:
                continue
            bucket: list[str] = []
            for value in values or []:
                if not isinstance(value, str):
                    continue
                cleaned_val = value.strip()
                if cleaned_val:
                    bucket.append(cleaned_val)
            if bucket:
                result[cleaned_key] = bucket

    _ingest(global_acronyms)
    _ingest(country_acronyms)
    return result


def _format_fewshot_items(items: Sequence[Any]) -> str:
    """Convierte la lista estructurada de few-shots en un bloque textual."""
    if not items:
        return ""

    fragments: list[str] = []
    for idx, item in enumerate(items, start=1):
        if isinstance(item, dict):
            title = str(item.get("title") or "").strip()
            sql = str(item.get("sql") or "").strip()
        else:
            title = ""
            sql = str(item or "").strip()

        if not sql:
            continue

        lines = [f"FewShot {idx}:"]
        if title:
            lines.append(f"Question: {title}")
        lines.append(f"SQL: {sql}")
        fragments.append("\n".join(lines))

    return "\n\n".join(fragments).strip()


def _infer_topic_from_column(column: str) -> str:
    """Infiere el tópico de una columna basado en su nombre."""
    if not column:
        return "general"
    col = column.lower()
    if any(
        token in col
        for token in (
            "municipio",
            "provincia",
            "depart",
            "territorio",
            "region",
            "región",
        )
    ):
        return "territorio"
    if any(token in col for token in ("anio", "año", "fecha", "periodo", "período")):
        return "fecha"
    if "entidadejecutora" in col or "ejecutora" in col or "entidad" in col:
        return "entidad"
    if "sector" in col:
        return "sector"
    if "estado" in col:
        return "estado"
    if "objetivo" in col:
        return "objetivo"
    if "tipo" in col:
        return "tipo"
    if "id_proyecto" in col or "nombre_proyecto" in col:
        return "proyecto"
    return "general"


# ═══════════════════════════════════════════════════════════════════════════
# Exports
# ═══════════════════════════════════════════════════════════════════════════


__all__ = [
    # Constantes
    "FILTER_CONFIDENCE_THRESHOLD",
    "MAX_CLARIFICATION_TURNS",
    "MIN_TEXT_FILTER_TOKEN_LENGTH",
    "MIN_EXISTS_CONFIDENCE",
    "MAX_REFINED_FILTER_TOKENS",
    "MAX_THEME_KEYWORDS_PROMPT",
    "FUZZY_MATCH_THRESHOLD",
    "TEXT_FILTER_TOKEN_STOPLIST",
    "STRUCTURED_TEXT_COLUMNS",
    "STOPWORDS",
    "FRIENDLY_FILTER_NAMES",
    "DEFAULT_ALWAYS_KEEP_COLUMNS",
    "QUESTION_METRIC_KEYWORDS",
    # Regex patterns
    "_FILTER_LINE_RE",
    # Parsing
    "_parse_analyzer_sections",
    # Normalización
    "_normalize_text",
    "_normalize_text_upper",
    "_normalize_column_name",
    "_strip_function_wrappers",
    "_normalize_dimension_column",
    "_norm_for_dedupe",
    "_normalize_literal_token",
    # Tokenización
    "_tokenize_question",
    "_tokens_from_phrase",
    "_split_identifier",
    "_sanitize_keyword_tokens",
    # Validación
    "_is_stoplisted_token",
    "_is_viable_text_token",
    "_should_use_token_exists",
    "_is_structured_text_column",
    # Sanitización
    "_scrub_stoplist_from_compound_filters",
    "_sanitize_refined_tokens",
    "_filter_keywords_for_text_search",
    # Extracción
    "_extract_search_literal",
    "_extract_question_phrases",
    "extract_json_rows",
    "_extract_first_json_block",
    # Nombres
    "_humanize_filter_column",
    "_humanize_filter_list",
    "_column_label_matches_question",
    # Schema
    "_get_schema_column_names",
    "_get_schema_column_tokens",
    "_get_schema_allowed_strings",
    "_phrase_matches_catalog",
    "_fuzzy_match_from_catalog",
    # Localización
    "_localize",
    # Auxiliar
    "_truncate_for_details",
    "_replace_keyword_case_insensitive",
    "_ensure_question_suffix",
    # Acrónimos y Few-shots
    "_resolve_known_acronyms",
    "_format_fewshot_items",
    "_infer_topic_from_column",
]
