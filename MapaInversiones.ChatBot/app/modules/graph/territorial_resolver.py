"""
Territorial Resolver Module

Resolves territorial ambiguities by querying dim_territorios_flat.
Determines if a territorial name is unique (single level) or ambiguous (multiple levels).
"""

from typing import Any
import logging
import re
from sqlalchemy import text

from modules.config import settings
from modules.graph.helpers_texto import _normalize_text_upper

logger = logging.getLogger(__name__)

# Maximum number of territory options to show in disambiguation prompts
TERRITORIAL_MAX_OPTIONS = getattr(settings, "territorial_max_options", 5)

# Alias local para claridad (usa la función centralizada)
_normalize_text = _normalize_text_upper


def _detect_explicit_territorial_level(territorio_name: str) -> tuple[str | None, str]:
    """
    Detecta si el usuario mencionó explícitamente el nivel territorial.

    Args:
        territorio_name: Nombre del territorio (ej: "provincia de Santiago")

    Returns:
        tuple: (nivel_detectado, nombre_limpio)
            - nivel_detectado: "region", "departamento", "municipio" o None
            - nombre_limpio: territorio sin prefijos (ej: "Santiago")

    Examples:
        >>> _detect_explicit_territorial_level("provincia de Santiago")
        ("departamento", "Santiago")

        >>> _detect_explicit_territorial_level("municipio Santo Domingo Este")
        ("municipio", "Santo Domingo Este")

        >>> _detect_explicit_territorial_level("Santiago")
        (None, "Santiago")
    """
    territorio_lower = territorio_name.lower().strip()

    # Patrones para detectar nivel explícito
    patterns = [
        # Formato de respuesta a clarificación: (Tipo: Valor)
        (r"^\(provincia:\s*(.+)\)$", "departamento"),
        (r"^\(departamento:\s*(.+)\)$", "departamento"),
        (r"^\(municipio:\s*(.+)\)$", "municipio"),
        (r"^\(región:\s*(.+)\)$", "region"),
        (r"^\(region:\s*(.+)\)$", "region"),
        # Formato tradicional
        (r"^provincia\s+de\s+(.+)$", "departamento"),
        (r"^provincia\s+(.+)$", "departamento"),
        (r"^departamento\s+de\s+(.+)$", "departamento"),
        (r"^departamento\s+(.+)$", "departamento"),
        (r"^departamento:\s*(.+)$", "departamento"),  # Support "Departamento: X"
        (r"^municipio\s+de\s+(.+)$", "municipio"),
        (r"^municipio\s+(.+)$", "municipio"),
        (r"^municipio:\s*(.+)$", "municipio"),  # Support "Municipio: X"
        (r"^región\s+de\s+(.+)$", "region"),
        (r"^región\s+(.+)$", "region"),
        (r"^region\s+de\s+(.+)$", "region"),
        (r"^region\s+(.+)$", "region"),
        (r"^región:\s*(.+)$", "region"),  # Support "Región: X"
        (r"^region:\s*(.+)$", "region"),  # Support "Region: X"
    ]

    for pattern, nivel in patterns:
        match = re.match(pattern, territorio_lower)
        if match:
            nombre_limpio = match.group(1).strip()
            logger.info(
                f"territorial_resolver: explicit level detected '{territorio_name}' → "
                f"nivel={nivel} nombre='{nombre_limpio}'"
            )
            return nivel, nombre_limpio

    return None, territorio_name


# ══════════════════════════════════════════════════════════════════════════════
# PATRONES DE TÉRMINOS TERRITORIALES GENÉRICOS
# ══════════════════════════════════════════════════════════════════════════════
# Estos términos NO pueden resolverse a valores de BD porque son relativos
# al usuario y no contienen un nombre geográfico específico.
# ══════════════════════════════════════════════════════════════════════════════

GENERIC_TERRITORY_PATTERNS = [
    # ─── Posesivos con nivel territorial ───
    r"^mi\s+(provincia|departamento|municipio|regi[oó]n|zona|localidad|[aá]rea|ciudad|pueblo|comunidad)$",
    r"^(provincia|departamento|municipio|regi[oó]n|zona|ciudad)\s+m[ií]a?$",
    r"^nuestra?\s+(provincia|departamento|municipio|regi[oó]n|zona)$",
    # ─── Ubicación relativa ───
    r"^donde\s+(vivo|estoy|resido|trabajo|nac[ií])$",
    r"^(por\s+)?(ac[aá]|aqu[ií]|cerca\s+de\s+m[ií])$",
    r"^cerca\s+de\s+(donde\s+)?(vivo|estoy|resido)$",
    r"^en\s+mi\s+(zona|[aá]rea|localidad|lugar|sector)$",
    r"^por\s+(mi\s+)?(casa|barrio|sector|zona)$",
    # ─── Demostrativos sin nombre específico ───
    r"^(esta?|esa?|aquel(la)?)\s+(provincia|departamento|municipio|regi[oó]n|zona|ciudad)$",
    r"^(esta?|esa?)\s+(zona|[aá]rea|localidad)$",
    # ─── Genéricos puros ───
    r"^(la|el)\s+(zona|[aá]rea|localidad|lugar|sector)$",
    r"^mi\s+(zona|[aá]rea|localidad|lugar|sector|barrio|comunidad)$",
    # ─── Frases contextuales que indican ubicación relativa ───
    r"^la\s+provincia\s+donde\s+(vivo|estoy|resido)$",
    r"^el\s+(departamento|municipio)\s+donde\s+(vivo|estoy)$",
]

# Tokens individuales que por sí solos son genéricos (para match parcial)
GENERIC_SINGLE_TOKENS = {
    "mi",
    "mia",
    "mío",
    "nuestra",
    "nuestro",
    "aquí",
    "aqui",
    "acá",
    "aca",
    "allí",
    "alli",
    "cerca",
    "donde",
    "vivo",
    "estoy",
}


def _is_generic_territory_term(term: str) -> bool:
    """
    Detecta si un término territorial es genérico/relativo y no puede resolverse.

    Esta función es un SAFETY NET que captura casos donde el LLM generó
    territory_filters con términos que no son nombres geográficos reales.

    Args:
        term: Término a verificar (ej: "mi provincia", "donde vivo")

    Returns:
        True si es un término genérico que requiere clarificación

    Examples:
        >>> _is_generic_territory_term("mi provincia")
        True
        >>> _is_generic_territory_term("Santiago")
        False
        >>> _is_generic_territory_term("donde vivo")
        True
        >>> _is_generic_territory_term("La Romana")
        False
    """
    if not term:
        return False

    term_clean = term.lower().strip()

    # Verificar patrones completos primero
    for pattern in GENERIC_TERRITORY_PATTERNS:
        if re.match(pattern, term_clean, re.IGNORECASE):
            return True

    # Verificar si el término es MUY corto y contiene solo tokens genéricos
    tokens = term_clean.split()
    if len(tokens) <= 2:
        if all(tok in GENERIC_SINGLE_TOKENS for tok in tokens):
            return True

    return False


def resolve_territorial_ambiguity(
    territorio_name: str, pais: str, db_connection, force_level: str | None = None
) -> dict[str, Any]:
    """
    Consulta dim_territorios_flat para detectar ambigüedad territorial.

    Args:
        territorio_name: Nombre del territorio (ej: "Santo Domingo" o "provincia de Santiago")
        pais: Código ISO3 del país (ej: "dom")
        db_connection: Conexión a base de datos

    Returns:
        dict con:
            - resolved: bool - Si se pudo resolver a un único nivel
            - column: str | None - Columna a usar (ej: "nombre_departamento")
            - columna_filtro: str | None - Alias para column (compatibilidad)
            - value: str | None - Valor normalizado
            - valor_original: str | None - Valor original de la BD
            - tipo: str | None - Tipo de territorio
            - needs_clarification: bool - Si necesita clarificación del usuario
            - options: list - Opciones disponibles si es ambiguo
            - reason: str - Razón (not_found, ambiguous, error, explicit_level, generic_term)
            - has_homonyms: bool - Si existen homónimos en otros niveles

    Examples:
        >>> # Caso único
        >>> resolve_territorial_ambiguity("La Romana", "dom", db)
        {
            "resolved": True,
            "column": "nombre_departamento",
            "columna_filtro": "nombre_departamento",
            "value": "LA ROMANA",
            "valor_original": "La Romana",
            "tipo": "departamento",
            "needs_clarification": False,
            "has_homonyms": False
        }

        >>> # Caso ambiguo
        >>> resolve_territorial_ambiguity("Santo Domingo", "dom", db)
        {
            "resolved": False,
            "needs_clarification": True,
            "reason": "ambiguous",
            "has_homonyms": True,
            "options": [
                {"tipo": "departamento", "valor": "SANTO DOMINGO",
                 "valor_original": "Santo Domingo", "columna_filtro": "nombre_departamento"},
                {"tipo": "municipio", "valor": "SANTO DOMINGO NORTE",
                 "valor_original": "Santo Domingo Norte", "columna_filtro": "nombre_municipio"},
                ...
            ]
        }

        >>> # Caso con nivel explícito
        >>> resolve_territorial_ambiguity("provincia de Santiago", "dom", db)
        {
            "resolved": True,
            "column": "nombre_departamento",
            "value": "SANTIAGO",
            "reason": "explicit_level",
            "needs_clarification": False
        }
    """
    logger.info(
        f"════════ TERRITORIAL_RESOLVER ▸ START territorio='{territorio_name}' pais={pais} force_level={force_level}"
    )

    def _log_end(res: dict[str, Any], matches_len: int | None = None) -> None:
        logger.info(
            f"════════ TERRITORIAL_RESOLVER ▸ END resolved={res.get('resolved')} reason={res.get('reason')} column={res.get('columna_filtro') or res.get('column')} value={res.get('value')} needs_clarification={res.get('needs_clarification')} matches={matches_len}"
        )

    # ═══════════════════════════════════════════════════════════════════════════
    # SAFETY NET: Detectar términos genéricos ANTES de consultar la BD
    # ═══════════════════════════════════════════════════════════════════════════
    if _is_generic_territory_term(territorio_name):
        logger.warning(
            f"territorial_resolver: GENERIC TERM DETECTED '{territorio_name}' → needs_clarification"
        )
        result = {
            "resolved": False,
            "needs_clarification": True,
            "reason": "generic_term",
            "has_homonyms": False,
            "options": [],
            "message": "Por favor, indique el nombre específico de su provincia, departamento o municipio.",
        }
        _log_end(result, matches_len=0)
        return result

    # Detectar si el usuario mencionó nivel explícito
    if force_level:
        nivel_explicito = force_level
        nombre_limpio = territorio_name
        logger.info(
            f"territorial_resolver: forced level '{force_level}' for '{territorio_name}'"
        )
    else:
        nivel_explicito, nombre_limpio = _detect_explicit_territorial_level(
            territorio_name
        )

    # Mapear nivel a tipo de territorio en BD
    nivel_to_tipo = {
        "region": "region",
        "departamento": "departamento",
        "municipio": "municipio",
    }

    tipo_filtro = nivel_to_tipo.get(nivel_explicito) if nivel_explicito else None

    # Construir query de candidatos (coincidencia parcial) y filtrar exacto en Python
    query = text(
        """
        SELECT 
            tipo_territorio,
            valor_original,
            valor_normalizado,
            columna_filtro,
            jerarquia_nivel
        FROM dim_territorios_flat
        WHERE pais_iso3 = :pais
          AND (CAST(:tipo AS TEXT) IS NULL OR tipo_territorio = CAST(:tipo AS TEXT))
          AND (
            valor_normalizado ILIKE '%' || :term || '%'
            OR valor_original ILIKE '%' || :term || '%'
          )
    """
    )

    # Usamos nombre_limpio para búsqueda inicial (puede ser parcial)
    search_term = _normalize_text(nombre_limpio)

    try:
        params = {
            "pais": pais,
            "tipo": tipo_filtro if tipo_filtro else None,
            "term": search_term,
        }
        result = db_connection.execute(query, params)
        matches = [dict(row) for row in result.mappings()]

        if not matches:
            logger.warning(
                f"territorial_resolver: no matches for '{territorio_name}' in {pais}"
            )
            result = {
                "resolved": False,
                "needs_clarification": True,
                "reason": "not_found",
                "has_homonyms": False,
                "options": [],
            }
            _log_end(result, matches_len=0)
            return result

        # Verificar si hay match exacto (case-insensitive)
        compare_value = nombre_limpio if nivel_explicito else territorio_name
        target_norm = _normalize_text(compare_value)

        logger.info(
            f"territorial_resolver: comparing '{target_norm}' against {[m.get('valor_original') for m in matches]}"
        )

        # Estrategia de "Mejor Match" con JERARQUÍA
        # 1. Buscar coincidencia exacta
        exact_matches = []
        for m in matches:
            # Normalizamos el valor original de la BD al vuelo
            db_val_norm = _normalize_text(m.get("valor_original", ""))

            if db_val_norm == target_norm:
                exact_matches.append(m)

        # SI hay matches exactos, priorizamos por jerarquia (1=Region, 2=Dept, 3=Mun)
        if exact_matches:
            # Ordenar por jerarquía ASC (menor numero = mayor jerarquia)
            exact_matches.sort(key=lambda x: x.get("jerarquia_nivel", 99))

            # Tomamos el ganador (Highest Hierarchy)
            match = exact_matches[0]

            # Loguear si hubo resolución automática de colisión
            if len(exact_matches) > 1:
                logger.info(
                    f"territorial_resolver: collision detected {len(exact_matches)} matches. "
                    f"Auto-promoted higher hierarchy: {match['tipo_territorio']} ({match['valor_original']})"
                )

            logger.info(
                f"territorial_resolver: exact match found '{territorio_name}' → "
                f"{match['tipo_territorio']} ({match['columna_filtro']})"
            )
            result = {
                "resolved": True,
                "column": match["columna_filtro"],
                "columna_filtro": match["columna_filtro"],
                "value": match["valor_normalizado"],
                "valor_original": match.get("valor_original"),
                "tipo": match["tipo_territorio"],
                "needs_clarification": False,
                "has_homonyms": len(matches) > 1,
                "reason": "exact_match",
            }
            _log_end(result, matches_len=len(matches))
            return result

        # 2. Si no hay exacto, y hay nivel explícito, buscar por inicio (startswith)
        if nivel_explicito and not exact_matches:
            prefix_matches = []
            for m in matches:
                db_val_norm = _normalize_text(m.get("valor_original", ""))
                if db_val_norm.startswith(target_norm):
                    prefix_matches.append(m)

            if len(prefix_matches) == 1:
                match = prefix_matches[0]
                logger.info(
                    f"territorial_resolver: prefix match '{territorio_name}' → {match['valor_original']}"
                )
                result = {
                    "resolved": True,
                    "column": match["columna_filtro"],
                    "columna_filtro": match["columna_filtro"],
                    "value": match["valor_normalizado"],
                    "valor_original": match.get("valor_original"),
                    "tipo": match["tipo_territorio"],
                    "needs_clarification": False,
                    "has_homonyms": len(matches) > 1,
                    "reason": "explicit_prefix",
                }
                _log_end(result, matches_len=len(matches))
                return result

        if len(matches) == 1:
            # Único match (no exacto, pero único) → Resolver automáticamente
            match = matches[0]
            logger.info(
                f"territorial_resolver: unique match '{territorio_name}' → "
                f"{match['tipo_territorio']} ({match['columna_filtro']})"
            )
            result = {
                "resolved": True,
                "column": match["columna_filtro"],
                "columna_filtro": match["columna_filtro"],
                "value": match["valor_normalizado"],
                "valor_original": match.get("valor_original"),
                "tipo": match["tipo_territorio"],
                "needs_clarification": False,
                "has_homonyms": False,
                "reason": "explicit_level" if nivel_explicito else "unique",
            }
            _log_end(result, matches_len=len(matches))
            return result

        # Múltiples matches → Pedir clarificación
        logger.info(
            f"territorial_resolver: ambiguous '{territorio_name}' → "
            f"{len(matches)} matches: {[m['tipo_territorio'] for m in matches]}"
        )

        # Limitar opciones al máximo configurado
        limited_matches = matches[:TERRITORIAL_MAX_OPTIONS]
        has_more = len(matches) > TERRITORIAL_MAX_OPTIONS

        result = {
            "resolved": False,
            "needs_clarification": True,
            "reason": "ambiguous",
            "has_homonyms": True,
            "total_matches": len(matches),
            "options": [
                {
                    "tipo": m["tipo_territorio"],
                    "valor": m["valor_normalizado"],
                    "valor_original": m.get("valor_original"),
                    "columna_filtro": m["columna_filtro"],
                }
                for m in limited_matches
            ],
        }
        if has_more:
            result["truncated"] = True
            result["shown"] = TERRITORIAL_MAX_OPTIONS

        _log_end(result, matches_len=len(matches))
        return result

    except Exception as e:
        logger.error(
            f"territorial_resolver: error resolving '{territorio_name}': {e}",
            exc_info=True,
        )
        result = {
            "resolved": False,
            "needs_clarification": False,
            "reason": "error",
            "error": str(e),
            "has_homonyms": False,
            "options": [],
        }
        _log_end(result, matches_len=None)
        return result
