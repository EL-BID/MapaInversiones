from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    DateTime,
    func,
    ForeignKey,
    JSON,
    UniqueConstraint,
    BigInteger,
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from pgvector.sqlalchemy import Vector

from database.postgres import PostgresBase as Base
import uuid

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Union, Any
from pydantic import EmailStr


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True)
    sender_id = Column(String(255))
    created_at = Column(DateTime, server_default=func.now(), default=func.now())
    last_message_at = Column(DateTime, server_default=func.now(), default=func.now())

    # Relación con ChatMessage
    messages = relationship(
        "ChatMessage", back_populates="session", cascade="all, delete-orphan"
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True)
    conversation_sender_id = Column(String(255))
    content = Column(String(10000))
    is_system = Column(Boolean)
    session_id = Column(Integer, ForeignKey("chat_sessions.id"))
    date = Column(DateTime, server_default=func.now(), default=func.now())

    # Relación con ChatSession
    session = relationship("ChatSession", back_populates="messages")


class LangchainPGCollection(Base):
    __tablename__ = "langchain_pg_collection"

    uuid = Column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False
    )
    name = Column(String, nullable=False, unique=True)
    cmetadata = Column(JSON, nullable=True)

    # Relación con LangchainPGEmbedding
    embeddings = relationship(
        "LangchainPGEmbedding",
        back_populates="collection",
        cascade="all, delete-orphan",
    )

    def __repr__(self):
        return f"<LangchainPGCollection(uuid={self.uuid}, name={self.name})>"


class LangchainPGEmbedding(Base):
    __tablename__ = "langchain_pg_embedding"

    id = Column(String, primary_key=True, nullable=False)
    collection_id = Column(
        PG_UUID(as_uuid=True),
        ForeignKey("langchain_pg_collection.uuid", ondelete="CASCADE"),
        nullable=True,
    )
    embedding = Column(
        Vector(3072), nullable=True
    )  # Reemplaza 1536 con la dimensión correcta si es necesario
    document = Column(String, nullable=True)
    cmetadata = Column(JSONB, nullable=True)

    # Relación con LangchainPGCollection
    collection = relationship("LangchainPGCollection", back_populates="embeddings")

    def __repr__(self):
        return (
            f"<LangchainPGEmbedding(id={self.id}, collection_id={self.collection_id})>"
        )

    __table_args__ = (UniqueConstraint("id", name="langchain_pg_embedding_pkey"),)


class SystemMessage(BaseModel):
    content: str
    additional_kwargs: Dict = {}
    response_metadata: Dict = {}
    id: Optional[str] = None


class ToolCall(BaseModel):
    name: str
    args: Dict[str, Union[str, int, float, bool]]
    id: Optional[str] = None
    type: str = "tool_call"


class AIMessage(BaseModel):
    content: str
    additional_kwargs: Optional[Dict] = None
    response_metadata: Optional[Dict] = None
    id: Optional[str] = None
    tool_calls: Optional[List[ToolCall]] = None
    usage_metadata: Optional[Dict] = None


class HumanMessage(BaseModel):
    content: str
    additional_kwargs: Dict = {}
    response_metadata: Dict = {}
    id: Optional[str] = None


class ToolMessage(BaseModel):
    content: str
    name: str
    id: Optional[str] = None
    tool_call_id: Optional[str] = None


class Summary(BaseModel):
    content: str
    additional_kwargs: Dict = {}
    response_metadata: Dict = {}
    id: Optional[str] = None


class ResponseData(BaseModel):
    messages: List[Union[SystemMessage, HumanMessage, AIMessage, ToolMessage]]
    summary: List[Summary]
    country_code: str


class DimSector(Base):
    __tablename__ = "dim_sectores"

    pais_iso3 = Column(String(3), primary_key=True)
    sector_normalizado = Column(String, primary_key=True)
    sector_original = Column(String, nullable=False)
    proyectos_count = Column(Integer, nullable=False)


class DimEntidad(Base):
    __tablename__ = "dim_entidades"

    pais_iso3 = Column(String(3), primary_key=True)
    entidad_normalizada = Column(String, primary_key=True)
    entidad_original = Column(String, nullable=False)
    entidadejecutora_id = Column(BigInteger, nullable=True)
    proyectos_count = Column(Integer, nullable=False)


class AnswerRequest(BaseModel):
    """
    datos que vienen del front sobre el envio de la respuesta
    """

    # id de la respuesta a calificar
    answerId: int
    # put similarityPercentage between 0 and 100
    # similarityPercentage: float = Field(..., gt=0, le=100)
    # put isApproved True or False
    isApproved: Optional[bool] = None
    # texto comment if isApproved is False
    commentDisApproved: Optional[str] = None


class AnswerSave(BaseModel):
    country_code: str
    user_question: str
    sql_query: str
    summary: str
    assistant_content_non_md: str


class CustomFeedbackRequest(BaseModel):
    """Payload esperado desde el frontend para feedback personalizado."""

    answerId: Optional[int] = None
    feedbackText: str = Field(..., min_length=10, max_length=2000)
    userQuestion: Optional[str] = Field(default=None, max_length=1000)
    userEmail: Optional[EmailStr] = None


class ChatRequest(BaseModel):
    """Solicitud principal del chat web."""

    message: str = Field(..., min_length=1, max_length=2000)
    country_code: str = Field(
        ..., min_length=2, max_length=3, pattern=r"^[A-Za-z]{2,3}$"
    )
    currency_type: Optional[str] = Field(default=None, max_length=10)
    decimal_separator: Optional[str] = Field(default=None, max_length=5)
    amount_separator: Optional[Dict[str, Any]] = None
    pending_irrelevant_retry: Optional[bool] = Field(default=False)
