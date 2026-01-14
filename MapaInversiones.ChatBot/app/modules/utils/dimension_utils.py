from __future__ import annotations

import time
from dataclasses import dataclass
from typing import Dict, List, Optional

from loguru import logger
from sqlalchemy import text
from sqlalchemy.orm import Session

"""
This script:
- Provides utilities to fetch and cache dimension data (like sectors, entities, states, funding sources, and year ranges) from a database for a given country code.
- Caches results in-memory to optimize performance and reduce database load.
- Dimensiones are then available as a dictionary with lists of values for each dimension.
- Dimension cache name : _DIMENSION_CACHE
"""

_DEFAULT_TTL_SECONDS = 30 * 60  # 30 minutes


@dataclass
class _DimensionCacheEntry:
    data: Dict[str, object]
    expires_at: float


_DIMENSION_CACHE: Dict[str, _DimensionCacheEntry] = {}


def _now() -> float:
    return time.monotonic()


def _is_expired(entry: _DimensionCacheEntry) -> bool:
    return _now() >= entry.expires_at


def _fetch_dimension_values(
    db: Session,
    sql: str,
    params: dict,
    column: str,
    limit: Optional[int] = None,
) -> List[str]:
    try:
        result = db.execute(text(sql), params)
        values: List[str] = []
        for row in result:
            value = row[0] if column not in row._mapping else row._mapping[column]
            if value:
                values.append(str(value).strip())
        if limit and len(values) > limit:
            values = values[:limit]
        return values
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.warning("Dimension query failed ({})", column, exc)
        return []


def _build_dimension_catalog(db: Session, country_code: str) -> Dict[str, object]:
    params = {"country": country_code}

    sectors = _fetch_dimension_values(
        db,
        """
        SELECT sector_original
        FROM dim_sectores
        WHERE LOWER(pais_iso3) = :country
        ORDER BY proyectos_count DESC
        """,
        params,
        column="sector_original",
    )

    entities = _fetch_dimension_values(
        db,
        """
        SELECT entidad_original
        FROM dim_entidades
        WHERE LOWER(pais_iso3) = :country
        ORDER BY proyectos_count DESC
        """,
        params,
        column="entidad_original",
    )

    states = _fetch_dimension_values(
        db,
        """
        SELECT estado_original
        FROM dim_estados
        WHERE LOWER(pais_iso3) = :country
        ORDER BY proyectos_count DESC
        """,
        params,
        column="estado_original",
    )

    try:
        year_result = db.execute(
            text(
                """
                SELECT
                    MIN(anio_fechainicio_proyecto) AS start_year,
                    MAX(anio_fechafin_proyecto)    AS end_year
                FROM stg_mapainv_proyectosaprobadosinv
                WHERE LOWER(pais_iso3) = :country
                """
            ),
            params,
        ).first()
        if year_result:
            year_range = {
                "start": year_result.start_year,
                "end": year_result.end_year,
            }
        else:
            year_range = {"start": None, "end": None}
    except Exception as exc:  # pragma: no cover - defensive logging
        logger.warning("Year range query failed: {}", exc)
        year_range = {"start": None, "end": None}

    # Fuentes de financiamiento - usar dim_fuentes_financiamiento si existe,
    # fallback a query directo si no
    try:
        funding_sources = _fetch_dimension_values(
            db,
            """
            SELECT fuente_original
            FROM dim_fuentes_financiamiento
            WHERE LOWER(pais_iso3) = :country
            ORDER BY proyectos_count DESC
            """,
            params,
            column="fuente_original",
        )
    except Exception:
        # Fallback: query directo a tabla de staging si dim no existe
        logger.warning(
            "dim_fuentes_financiamiento not found, falling back to staging table"
        )
        funding_sources = _fetch_dimension_values(
            db,
            """
            SELECT DISTINCT TRIM(
                COALESCE(organismo_financiador, fuente_financiacion)
            ) AS fuente
            FROM stg_mapainv_proyectosfuentesfinanciamiento
            WHERE LOWER(pais_iso3) = :country
              AND COALESCE(organismo_financiador, fuente_financiacion) IS NOT NULL
              AND LENGTH(TRIM(COALESCE(organismo_financiador, fuente_financiacion))) > 0
            ORDER BY fuente
            """,
            params,
            column="fuente",
        )

    # Territorios (region/departamento/municipio) - vista clave/valor
    territories = _fetch_dimension_values(
        db,
        """
        SELECT DISTINCT valor_original AS territorio
        FROM dim_territorios_flat
        WHERE LOWER(pais_iso3) = :country
          AND valor_original IS NOT NULL
          AND LENGTH(TRIM(valor_original)) > 0
        ORDER BY territorio
        """,
        params,
        column="territorio",
    )

    return {
        "sectors": sectors,
        "entities": entities,
        "states": states,
        "funding_sources": funding_sources,
        "year_range": year_range,
        "territories": territories,
    }


def get_dimension_catalog(
    country_code: str,
    db: Optional[Session] = None,
    *,
    ttl_seconds: int = _DEFAULT_TTL_SECONDS,
) -> Dict[str, object]:
    """
    Return the dimension catalog for a given country. Results are cached in-memory
    to avoid repeated database hits during a session.
    """
    if not country_code:
        return {}

    cache_key = country_code.lower()

    cached = _DIMENSION_CACHE.get(cache_key)
    if cached and not _is_expired(cached):
        return cached.data

    if db is None:
        logger.warning(
            "Dimension catalog requested for %s but no DB session provided.",
            cache_key,
        )
        return cached.data if cached else {}

    catalog = _build_dimension_catalog(db, cache_key)
    _DIMENSION_CACHE[cache_key] = _DimensionCacheEntry(
        data=catalog,
        expires_at=_now() + max(ttl_seconds, 60),
    )
    return catalog


def clear_dimension_cache() -> None:
    """Utility for tests or reloads."""
    _DIMENSION_CACHE.clear()


# ============================================================================
# Resolución de territorios con fuzzy matching
# ============================================================================


@dataclass
class TerritoryMatch:
    """Resultado de la resolución de un territorio."""

    tipo_territorio: str  # 'region', 'departamento', 'municipio'
    valor_original: str  # Nombre tal cual está en la tabla fuente
    valor_normalizado: str  # Nombre normalizado con process_text()
    columna_filtro: str  # 'nombre_region', 'nombre_departamento', 'nombre_municipio'
    jerarquia_nivel: int  # 1=region, 2=departamento, 3=municipio
    similitud: float  # Score de similitud (0.0 - 1.0)
    proyectos_count: int  # Cantidad de proyectos asociados


def resolve_territory(
    db: Session,
    country_code: str,
    user_input: str,
    min_similarity: float = 0.6,
    limit: int = 1,
) -> Optional[TerritoryMatch]:
    """
    Resuelve un término de territorio del usuario al mejor match en la base de datos.

    Usa la función SQL resolve_territory_column() que:
    - Normaliza el input con process_text()
    - Busca en dim_territorios_flat (regiones + departamentos + municipios)
    - Ordena por similitud DESC, nivel jerárquico ASC, proyectos_count DESC

    Args:
        db: Sesión de SQLAlchemy
        country_code: Código ISO3 del país (ej: 'dom', 'pry')
        user_input: El término que escribió el usuario (ej: 'santo domingo')
        min_similarity: Umbral mínimo de similitud (default 0.6)
        limit: Cantidad de resultados a retornar (default 1 = mejor match)

    Returns:
        TerritoryMatch con el mejor resultado, o None si no hay matches.

    Example:
        >>> match = resolve_territory(db, 'dom', 'santo domingo')
        >>> if match:
        ...     print(f"Usar columna: {match.columna_filtro} = '{match.valor_original}'")
        ...     # → "Usar columna: nombre_departamento = 'Santo Domingo'"
    """
    if not user_input or not country_code:
        return None

    try:
        sql = text(
            """
            SELECT 
                tipo_territorio,
                valor_original,
                valor_normalizado,
                columna_filtro,
                jerarquia_nivel,
                similitud,
                proyectos_count
            FROM resolve_territory_column(:country, :user_input, :min_sim)
            LIMIT :lim
        """
        )

        result = db.execute(
            sql,
            {
                "country": country_code.lower(),
                "user_input": user_input.strip(),
                "min_sim": min_similarity,
                "lim": limit,
            },
        )

        row = result.fetchone()
        if not row:
            logger.debug(
                "No territory match found for '%s' in country '%s' (min_sim=%.2f)",
                user_input,
                country_code,
                min_similarity,
            )
            return None

        return TerritoryMatch(
            tipo_territorio=row.tipo_territorio,
            valor_original=row.valor_original,
            valor_normalizado=row.valor_normalizado,
            columna_filtro=row.columna_filtro,
            jerarquia_nivel=row.jerarquia_nivel,
            similitud=row.similitud,
            proyectos_count=row.proyectos_count,
        )
    except Exception as e:
        logger.warning("Error resolving territory '{}': {}", user_input, e)
        return None


def resolve_territory_all_matches(
    db: Session,
    country_code: str,
    user_input: str,
    min_similarity: float = 0.5,
    limit: int = 5,
) -> List[TerritoryMatch]:
    """
    Similar a resolve_territory pero retorna múltiples matches para desambiguación.

    Útil cuando el usuario escribe algo ambiguo como 'Santiago' que puede ser:
    - Región: Santiago
    - Departamento: Santiago
    - Municipio: Santiago de los Caballeros

    Returns:
        Lista de TerritoryMatch ordenados por relevancia.
    """
    if not user_input or not country_code:
        return []

    try:
        sql = text(
            """
            SELECT 
                tipo_territorio,
                valor_original,
                valor_normalizado,
                columna_filtro,
                jerarquia_nivel,
                similitud,
                proyectos_count
            FROM resolve_territory_column(:country, :user_input, :min_sim)
            LIMIT :lim
        """
        )

        result = db.execute(
            sql,
            {
                "country": country_code.lower(),
                "user_input": user_input.strip(),
                "min_sim": min_similarity,
                "lim": limit,
            },
        )

        matches = []
        for row in result:
            matches.append(
                TerritoryMatch(
                    tipo_territorio=row.tipo_territorio,
                    valor_original=row.valor_original,
                    valor_normalizado=row.valor_normalizado,
                    columna_filtro=row.columna_filtro,
                    jerarquia_nivel=row.jerarquia_nivel,
                    similitud=row.similitud,
                    proyectos_count=row.proyectos_count,
                )
            )

        return matches
    except Exception as e:
        logger.warning("Error resolving territories for '{}': {}", user_input, e)
        return []
