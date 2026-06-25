from __future__ import annotations

from typing import List

from sqlalchemy.orm import Session

from modules.models import DimSector, DimEntidad
from modules.schemas.db_schemas import SectorModel, EntidadModel


def list_sectors(db: Session, country_code: str, limit: int = 50) -> List[SectorModel]:
    """Return top sectors for a given ISO3 country code."""
    query = (
        db.query(DimSector)
        .filter(DimSector.pais_iso3 == country_code.lower())
        .order_by(DimSector.proyectos_count.desc(), DimSector.sector_original.asc())
        .limit(limit)
    )
    return [SectorModel.model_validate(row) for row in query]


def list_entities(
    db: Session, country_code: str, limit: int = 50
) -> List[EntidadModel]:
    """Return top executing entities for a given ISO3 country code."""
    query = (
        db.query(DimEntidad)
        .filter(DimEntidad.pais_iso3 == country_code.lower())
        .order_by(DimEntidad.proyectos_count.desc(), DimEntidad.entidad_original.asc())
        .limit(limit)
    )
    return [EntidadModel.model_validate(row) for row in query]
