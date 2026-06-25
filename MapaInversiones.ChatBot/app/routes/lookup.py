from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from database.dependencies import get_postgres_db
from modules.services.lookup_service import list_sectors, list_entities
from modules.config import settings
from modules.rate_limit import limiter

router = APIRouter(prefix="/api/lookup", tags=["lookup"])


@router.get("/sectors")
@limiter.limit("30/minute")
def get_sectors(
    request: Request,
    country_code: str = Query(..., min_length=3, max_length=3, alias="country_code"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_postgres_db),
):
    """Return available sectors for the given country."""
    items = list_sectors(db, country_code, limit)
    return {"items": [item.model_dump() for item in items]}


@router.get("/entities")
@limiter.limit("30/minute")
def get_entities(
    request: Request,
    country_code: str = Query(..., min_length=3, max_length=3, alias="country_code"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_postgres_db),
):
    """Return available executing entities for the given country."""
    items = list_entities(db, country_code, limit)
    return {"items": [item.model_dump() for item in items]}
