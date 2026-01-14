from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ChatMessageModel(BaseModel):
    id: Optional[int]
    conversation_sender_id: str
    content: str
    is_system: bool
    session_id: int

    class Config:
        from_attributes = True


class SessionModel(BaseModel):
    id: Optional[int]
    sender_id: str
    created_at: datetime
    last_message_at: datetime

    class Config:
        from_attributes = True


class AllowedNumberModel(BaseModel):
    id: int
    name: str
    number: str

    class Config:
        from_attributes = True


class SectorModel(BaseModel):
    pais_iso3: str
    sector_original: str
    sector_normalizado: str
    proyectos_count: int

    class Config:
        from_attributes = True


class EntidadModel(BaseModel):
    pais_iso3: str
    entidad_original: str
    entidad_normalizada: str
    entidadejecutora_id: Optional[int] = None
    proyectos_count: int

    class Config:
        from_attributes = True
