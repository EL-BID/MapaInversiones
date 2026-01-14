from __future__ import annotations
from enum import Enum
from pydantic import BaseModel, Field, ConfigDict
from typing import Literal, List, Optional, Set
from datetime import date


# ══════════════════════════════════════════════════════════════════════════════
# CATÁLOGO DE TOPICS DE INCERTIDUMBRE (Business Rules)
# ══════════════════════════════════════════════════════════════════════════════
# Topics que el LLM puede emitir en UNCERTAINTIES.
# Los topics CRÍTICOS fuerzan clarificación incluso si el LLM emite proceed_with_warning.
# ══════════════════════════════════════════════════════════════════════════════


class UncertaintyTopic(str, Enum):
    """Catálogo de topics de incertidumbre reconocidos por el sistema."""

    # RULE B2: Ambigüedad de montos/valores
    VALOR_AMBIGUO = "valor_ambiguo"

    # RULE B4/B6: Ambigüedad temporal
    YEAR_SCOPE = "year_scope"

    # RULE B3: Ambigüedad territorial
    TERRITORIO = "territorio"

    # RULE B3b: Territorio genérico ("mi provincia", "donde vivo", etc.)
    TERRITORIO_AMBIGUO = "territorio_ambiguo"

    # RULE B1: Proxy/aproximación necesaria
    PROXY_AVANCE = "proxy_avance"

    # Pregunta muy amplia
    PREGUNTA_GENERAL = "pregunta_general"

    # Falta información crítica
    PREGUNTA_INCOMPLETA = "pregunta_incompleta"


# ══════════════════════════════════════════════════════════════════════════════
# UNCERTAINTY TOPIC SETS (loaded from config for flexibility)
# ══════════════════════════════════════════════════════════════════════════════
# Import settings lazily to avoid circular imports
def _get_uncertainty_topics_from_config() -> tuple[Set[str], Set[str]]:
    """
    Load blocking and non-blocking uncertainty topics from config.
    Falls back to hardcoded defaults if config is not available.
    """
    try:
        from modules.config import settings

        blocking_str = getattr(settings, "blocking_uncertainty_topics", "")
        non_blocking_str = getattr(settings, "non_blocking_uncertainty_topics", "")

        # Parse comma-separated strings into sets
        blocking = {t.strip().lower() for t in blocking_str.split(",") if t.strip()}
        non_blocking = {
            t.strip().lower() for t in non_blocking_str.split(",") if t.strip()
        }

        # If empty, use defaults
        if not blocking:
            blocking = {"pregunta_incompleta", "territorio_ambiguo"}
        if not non_blocking:
            non_blocking = {
                "valor_ambiguo",
                "year_scope",
                "territorio",
                "proxy_avance",
                "pregunta_general",
            }

        return blocking, non_blocking

    except Exception:
        # Fallback to hardcoded defaults
        return (
            {"pregunta_incompleta", "territorio_ambiguo"},
            {
                "valor_ambiguo",
                "year_scope",
                "territorio",
                "proxy_avance",
                "pregunta_general",
            },
        )


# Topics que SIEMPRE deben forzar clarificación PRE-SQL (defensa en código)
# Estos topics BLOQUEAN el flujo SQL y piden al usuario que aclare antes de continuar
# Configurable via .env: BLOCKING_UNCERTAINTY_TOPICS=pregunta_incompleta,territorio_ambiguo
_blocking, _non_blocking = _get_uncertainty_topics_from_config()
CRITICAL_UNCERTAINTY_TOPICS: Set[str] = _blocking

# Topics que generan warning pero NO bloquean (el sistema continúa con defaults)
# El citizen_review puede sugerir alternativas post-fetch
# Configurable via .env: NON_BLOCKING_UNCERTAINTY_TOPICS=valor_ambiguo,year_scope,territorio,proxy_avance,pregunta_general
NON_BLOCKING_UNCERTAINTY_TOPICS: Set[str] = _non_blocking


def is_critical_uncertainty_topic(topic: str) -> bool:
    """
    Verifica si un topic debe forzar clarificación inmediata.

    Args:
        topic: Nombre del topic de incertidumbre (ej: "territorio_ambiguo")

    Returns:
        True si el topic está en CRITICAL_UNCERTAINTY_TOPICS
    """
    if not topic:
        return False
    normalized = topic.lower().strip().replace(" ", "_")
    return normalized in CRITICAL_UNCERTAINTY_TOPICS


class complete_user_question(BaseModel):
    """
    Schema LEGACY para generate_complete_question (flujo legacy).
    Regenera pregunta + clasificación de intents en un solo paso.
    DEPRECATED: Usar CompleteQuestion + inbox_classifier en flujo unificado.
    """

    question: str = Field(
        description="Complete user question regenerated with conversation context"
    )
    is_relevant: Literal["yes", "no"] = Field(
        description="Pregunta menciona objetos del dominio"
    )
    is_social_interaction: Literal["yes", "no"] = Field(
        description="Mensaje es saludo o frase casual"
    )
    is_support_request: Literal["yes", "no"] = Field(
        description="Pregunta expresa intención de soporte/reclamo"
    )


class CompleteQuestion(BaseModel):
    """
    Schema simplificado para generate_complete_question_v2.
    Solo regenera/reescribe la pregunta con contexto histórico.
    Los flags de clasificación (is_relevant, is_social_interaction, is_support_request)
    ya vienen determinados por inbox_classifier y se leen desde state.
    """

    question: str = Field(
        description="Complete user question regenerated with conversation context, no explanations, in the same language as the user's input."
    )


class DefinitionLookup(BaseModel):
    """
    Schema para respuesta del nodo definitions_lookup.
    Retorna concepto, definición y confianza basados exclusivamente en el documento fuente.
    """

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "required": [
                "concept",
                "definition",
                "confidence",
                "source_section",
                "notes",
            ]
        },
    )
    concept: str = Field(
        description="Nombre del concepto encontrado en el documento (exacto o más cercano)"
    )
    definition: str = Field(
        description="Definición completa extraída textualmente del documento, sin modificaciones ni interpretaciones"
    )
    confidence: Literal["high", "medium", "low", "not_found"] = Field(
        description="Nivel de confianza: high (coincidencia exacta), medium (sinónimo/relacionado), low (ambiguo), not_found (no existe en documento)"
    )
    source_section: Optional[str] = Field(
        default=None,
        description="Sección del documento donde se encontró la definición (para trazabilidad)",
    )
    notes: Optional[str] = Field(
        default=None,
        description="Notas adicionales si el concepto es ambiguo o si hay múltiples definiciones relacionadas",
    )


class sql_query(BaseModel):
    """SQL Query to execute against database."""

    sql_query: str = Field(
        description="SQL query string as a plain string, compatible with PostgreSQL generated from looking at table definitions. No backticks or semicolons."
    )


class sql_query_response(BaseModel):
    """User-friendly response based on SQL Server query results."""

    human_answer: str = Field(
        description="User-friendly answer derived from the SQL query results."
    )


class question_summary(BaseModel):
    """Summary of question."""

    summary: str = Field(description="Concise summary of the user's question.")


class ProhibitedFinding(BaseModel):
    """Hallazgo de contenido prohibido con categoría y severidad."""

    category: Literal[
        "odio",
        "hate",
        "violence",
        "sexual",
        "self_harm",
        "jailbreak",
        "protected_text",
        "protected_code",
    ]
    severity: Literal["low", "medium", "high"]
    evidence: str = Field(
        description="Fragmento de texto que evidencia el hallazgo (máx. 50 caracteres)"
    )
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={"required": ["category", "severity", "evidence"]},
    )


class pii_check(BaseModel):
    """
    Schema LEGACY para check_personal_info (solo moderación PII + contenido prohibido).
    NO incluye clasificación de intención.
    DEPRECATED: Usar InboxClassification en flujo unificado.
    """

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "required": [
                "has_pii",
                "pii_types",
                "is_prohibited",
                "prohibited_findings",
                "location_exception_applied",
                "recommended_action",
                "rationale",
            ]
        },
    )
    has_pii: Literal["yes", "no"] = Field(
        description="Detecta información personal identificable"
    )
    pii_types: Optional[
        List[
            Literal[
                "email", "phone", "id", "address", "dob", "name", "bank", "credit_card"
            ]
        ]
    ] = Field(
        default=None, description="Tipos de PII detectados (solo si has_pii='yes')"
    )
    is_prohibited: Literal["yes", "no"] = Field(
        description="Detecta contenido prohibido"
    )
    prohibited_findings: Optional[List[ProhibitedFinding]] = Field(
        default=None, description="Hallazgos de contenido prohibido"
    )
    location_exception_applied: Optional[bool] = Field(
        default=False, description="Si se aplicó excepción de entidad geográfica"
    )
    recommended_action: Literal["allow", "reprompt", "block"] = Field(
        description="Acción recomendada: allow (continuar), reprompt (PII), block (prohibido)"
    )
    rationale: Optional[str] = Field(
        default=None, description="Justificación operativa de la decisión"
    )


class InboxClassification(BaseModel):
    """
    Clasificación unificada de moderación e intención realizada por inbox_classifier.
    Fusiona las responsabilidades de check_personal_info (PII + contenido prohibido)
    y generate_complete_question (clasificación de flags).
    """

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "required": [
                "has_pii",
                "pii_types",
                "is_prohibited",
                "prohibited_findings",
                "location_exception_applied",
                "recommended_action",
                "rationale",
                "is_relevant",
                "is_social_interaction",
                "is_support_request",
                "is_definitions_lookup",
                "is_confirmation",
            ]
        },
    )
    # Moderación
    has_pii: Literal["yes", "no"] = Field(
        description="Detecta información personal identificable"
    )
    pii_types: Optional[
        List[
            Literal[
                "email", "phone", "id", "address", "dob", "name", "bank", "credit_card"
            ]
        ]
    ] = Field(
        default=None, description="Tipos de PII detectados (solo si has_pii='yes')"
    )
    is_prohibited: Literal["yes", "no"] = Field(
        description="Detecta contenido prohibido (odio, violencia, sexual, self-harm, jailbreak, protected material)"
    )
    prohibited_findings: Optional[List[ProhibitedFinding]] = Field(
        default=None,
        description="Hallazgos de contenido prohibido (solo si is_prohibited='yes')",
    )
    location_exception_applied: Optional[bool] = Field(
        default=False,
        description="Si se aplicó excepción de entidad geográfica para no marcar como PII",
    )
    recommended_action: Literal["allow", "reprompt", "block"] = Field(
        default="allow",
        description="Acción recomendada: allow (continuar), reprompt (solicitar reformular), block (detener)",
    )
    rationale: Optional[str] = Field(
        default=None,
        description="Justificación operativa de la decisión (máx. 40 palabras)",
    )

    # Clasificación de intención (solo si recommended_action='allow')
    # NO hay defaults: el LLM DEBE incluir estos 4 campos explícitamente en el JSON
    is_relevant: Literal["yes", "no"] = Field(
        description="Pregunta menciona objetos/atributos del dominio (obra, estado, entidad, sector, ubicación, monto, año, URL)"
    )
    is_social_interaction: Literal["yes", "no"] = Field(
        description="Mensaje es saludo, despedida o frase casual/cortesía"
    )
    is_support_request: Literal["yes", "no"] = Field(
        description="Pregunta expresa intención de reclamo/soporte/contacto/trámite (puede coexistir con is_relevant)"
    )
    # Detección explícita de consultas de definiciones/conceptos (responsabilidad del inbox)
    is_definitions_lookup: Literal["yes", "no"] = Field(
        description=(
            "Marca 'yes' cuando la entrada del usuario pide definición, significado, concepto, explicación de un término del dominio o compara dos conceptos (X vs Y, diferencia entre...)."
        ),
    )
    # Detección de confirmación/validación del usuario
    is_confirmation: Literal["yes", "no"] = Field(
        default="no",
        description=(
            "Marca 'yes' cuando el usuario CONFIRMA, RECONOCE o VALIDA algo que el bot dijo "
            "(ej: 'Confirmo', 'exacto', 'así es', 'correcto', 'tú entiendes que...'). "
            "Cuando is_confirmation='yes', NO se necesita nueva consulta SQL."
        ),
    )


class process_user_question(BaseModel):
    """Analyze the SQL query results and generate a structured response separating direct answer from technical details."""

    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "required": [
                "direct_answer",
                "technical_details",
                "follow_up",
                "monetary_columns",
            ]
        },
    )

    direct_answer: str = Field(
        description="1-2 sentences that directly answer the user's question with key numbers. NO methodology or filter explanations.",
    )
    technical_details: List[str] = Field(
        ...,
        description="List of technical details about how the answer was obtained (filters applied, methodology, scope). Goes to sidebar.",
    )
    follow_up: str = Field(
        default="",
        description="A friendly question inviting the user to explore further.",
    )
    monetary_columns: str = Field(
        default="",
        description="Comma-separated list of column names that contain monetary values, or empty string.",
    )

    # Legacy compatibility - these will be populated from direct_answer
    @property
    def summary(self) -> str:
        """Legacy compatibility: returns direct_answer as summary."""
        return self.direct_answer

    @property
    def monetary_properties(self) -> str:
        """Legacy compatibility: returns monetary_columns as monetary_properties."""
        return self.monetary_columns

    @property
    def contextual_introduction(self) -> str:
        """Legacy compatibility: returns empty string (no longer used)."""
        return ""


class YearFilterRange(BaseModel):
    start: Optional[int] = Field(None, description="Start year as four-digit integer")
    end: Optional[int] = Field(None, description="End year as four-digit integer")


class Aggregation(BaseModel):
    operator: Literal["SUM", "AVG", "MAX", "MIN", "COUNT", "LAG"]
    column: str


class filters(BaseModel):
    country_code: str
    keywords: List[str]
    sectors: List[str]
    territorial: Optional[str]
    year_filter_range: Optional[YearFilterRange]


from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, Extra


# ──────────────────────────────
#  SNIPPETS Y EVIDENCIAS
# ──────────────────────────────
class Evidence(BaseModel):
    """
    Fragmento de texto (de la pregunta o del contexto) que respalda
    la elección de un campo, tabla o filtro.
    """

    text: str
    field: Optional[str] = None
    confidence: Optional[float] = Field(
        default=None, ge=0, le=1, description="0-1. Puede omitirse"
    )

    class Config:
        extra = Extra.allow


# ──────────────────────────────
#  TABLAS Y JOIN PATHS
# ──────────────────────────────
class TableJoin(BaseModel):
    """
    Tabla o vista involucrada y el camino de unión sugerido.
    """

    table: str
    alias: Optional[str] = None
    join_path: Optional[str] = None


# ──────────────────────────────
#  CANDIDATOS DE FILTRO
# ──────────────────────────────
ValueType = Union[str, int, float, bool, List[Union[str, int, float, bool]]]


class FilterHint(BaseModel):
    """
    Filtro propuesto por el LLM con tipado flexible para el valor.
    """

    column: str
    operator: str
    value: ValueType
    confidence: Optional[float] = Field(
        default=None, ge=0, le=1, description="0-1. Puede omitirse"
    )


# ──────────────────────────────
#  OUTPUT GENERAL DEL ANALYZER
# ──────────────────────────────
class AnalyzerUncertainty(BaseModel):
    """
    Ambigüedades o dudas que el analizador detecta y que conviene plantear al usuario.
    """

    topic: str = Field(..., description="Tema o concepto que genera duda.")
    message: str = Field(..., description="Explicación breve de la ambigüedad.")
    action: Optional[str] = Field(
        default=None,
        description="Sugerencia directa para resolver la ambigüedad.",
    )


class NonMappableAttribute(BaseModel):
    """
    Atributos solicitados por el usuario que no existen de forma directa en el esquema.
    """

    atributo: str = Field(..., description="Nombre literal pedido por el usuario.")
    razon: str = Field(..., description="Motivo por el cual no es mapeable.")
    candidatos_proxies: List[str] = Field(
        default_factory=list,
        description="Columnas existentes que podrían actuar como proxy.",
    )
    impacto: Literal["blocking", "non_blocking"] = Field(
        ...,
        description="Define si la ausencia es bloqueante para continuar.",
    )


class ThemeStrategy(BaseModel):
    """Plan consolidado para búsquedas temáticas basadas en texto."""

    keywords: List[str] = Field(default_factory=list)
    search_fields: List[str] = Field(default_factory=list)
    territory_filters: List[str] = Field(default_factory=list)
    year_filters: Optional[YearFilterRange] = None
    notes: Optional[str] = Field(
        default=None,
        description="Aclaraciones sobre cómo combinar filtros o palabras clave.",
    )


class AnalyzerDecision(BaseModel):
    """
    Decisión principal que guía el flujo de la zona gris.
    """

    status: Literal["block", "proceed", "proceed_with_warning"]
    rationale: str = Field(..., description="Motivo resumido de la decisión.")
    suggested_user_prompts: List[str] = Field(default_factory=list)
    exposed_schema_fields: List[str] = Field(default_factory=list)
    notes: Optional[str] = Field(
        default=None,
        description="Información adicional para ingeniería o métricas internas.",
    )


class LLMAnalysis(BaseModel):  # noqa: N801
    """Payload estructurado entregado por el nodo LLM Analyzer."""

    select_fields: List[Union[str, Dict[str, Any]]] = Field(default_factory=list)
    tables_and_joins: List[TableJoin] = Field(default_factory=list)
    filters: List[FilterHint] = Field(default_factory=list)
    evidence: List[Evidence] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    uncertainties: List[AnalyzerUncertainty] = Field(default_factory=list)
    non_mappable_attributes: List[NonMappableAttribute] = Field(default_factory=list)
    theme_strategy: Optional[ThemeStrategy] = Field(
        default=None,
        alias="theme_match_strategy",
        description="Alias legacy: theme_match_strategy",
    )
    decision: Optional[AnalyzerDecision] = None

    class Config:
        extra = Extra.allow
        populate_by_name = True


# ──────────────────────────────
class SqlChoiceSchema(BaseModel):
    """
    Elección del LLM sobre la mejor consulta.
    """

    best_idx: int = Field(
        ..., ge=0, description="Índice 0-based de la mejor SQL dentro de sql_list."
    )
    rationale: str = Field(..., description="Breve justificación (≤50 palabras).")
