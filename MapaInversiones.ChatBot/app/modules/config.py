from pydantic_settings import BaseSettings
from pydantic import Field, field_validator, model_validator
from dotenv import load_dotenv
import multiprocessing
import os
from typing import Optional

# Cargar el .env desde la raíz del proyecto
BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
ENV_PATH = os.path.join(BASE_DIR, "../../.env")
load_dotenv(ENV_PATH, verbose=True)


class Settings(BaseSettings):
    # App metadata
    app_version: str = Field(default="Versión 1.0")
    data_cutoff_file: str = Field(default="app/data/data_cutoff.json")

    # sql row limits
    sql_rows_limit: int
    sql_rows_limit_max: int = Field(default=50)
    feature_citizen_node: bool = Field(default=True)
    # FLAG FOR CITIZEN TECHNICAL DETAILS ON OFF:
    feature_citizen_technical_details: bool = Field(default=True)
    # FLAG FOR CITIZEN ROW FILTERING WITH LLM:
    feature_filter_rows_llm: bool = Field(default=True)
    # ROW FILTERING CONFIGURATION:
    rows_llm_max: int = Field(default=20)  # Maximum rows to evaluate with LLM
    rows_llm_threshold: float = Field(
        default=0.7
    )  # Confidence threshold (0.0-1.0) to filter rows

    # Enviroment
    env: str

    # Normaliza ENV para tratar alias comunes.
    @field_validator("env", mode="before")
    @classmethod
    def _normalize_env(cls, value):
        if value is None:
            return "development"
        env_str = str(value).strip().lower()
        if env_str in {"dev", "development"}:
            return "development"
        if env_str in {"prod", "production", "prd"}:
            return "production"
        return env_str

    # Logging
    LOG_DIR: str = "logs"
    # Log level: DEBUG, INFO, WARNING, ERROR (override env-based default)
    log_level: str = Field(default="")

    # Resource budgeting (shared percent target ~75%)
    resource_cpu_cores: int = Field(
        default_factory=lambda: max(1, multiprocessing.cpu_count())
    )
    resource_memory_gb: int = Field(default=32)
    resource_utilization_percent: int = Field(default=75)
    gunicorn_worker_memory_estimate_gb: float = Field(default=1.0)
    gunicorn_workers_percent: int = Field(default=75)
    gunicorn_threads_per_worker: int = Field(default=4)

    # Embed and trace configurations
    embedding_model: str

    # Frontend API Key
    frontend_api_key: str

    # Cache configurations
    cache_enabled: bool = Field(default=False)
    cache_enable_postgres_search: bool = Field(default=True)
    cache_enable_vector_search: bool = Field(default=True)
    cache_semantic_threshold: float = Field(
        default=0.1,
        description="Threshold for semantic cache hit (distance, lower is stricter)",
    )

    # arize configurations
    tracing_endpoint: str
    arize_enabled: str

    # Original Openai Configurations
    openai_api_key: str
    openai_model: str
    openai_model_mini: str
    openai_model_moderation: str
    openai_moderation_api_key: str

    # Cloud Setup
    cloud_selector: str

    # Azure OpenAI Configurations
    azure_openai_api_key: str
    azure_openai_endpoint: str
    azure_openai_api_version: str

    # GPT 4o
    azure_openai_chat_deployment_name_4: str
    azure_openai_chat_deployment_name_4_model: str

    # GPT 4o Mini
    azure_openai_chat_deployment_name_4mini: str
    azure_openai_chat_deployment_name_4mini_model: str

    # GPT 4.1 Mini
    azure_openai_chat_deployment_name_41mini: str
    azure_openai_chat_deployment_name_41mini_model: str
    azure_openai_api_version_41mini: str

    # GPT 5 Mini
    azure_openai_chat_deployment_name_5: str
    azure_openai_chat_deployment_name_5_model: str
    azure_openai_api_version_5: str

    # Azure Embedding model
    # Unique name
    azure_openai_embedding_name: str
    azure_openai_embedding_dimensions: int

    """
    # Large
    azure_openai_embedding_large_name: str
    azure_openai_embedding_large_dimensions: int

    # Small
    azure_openai_small_name= str
    azure_openai_small_dimensions: int
    azure_openai_embedding_small_key: str
    azure_openai_embedding_small_url: str
    azure_openai_embedding_small_version: str
    azure_openai_embedding_small_name: str
    """

    # Azure SQL Database Configurations
    azure_sql_host: str
    azure_sql_username: str
    azure_sql_password: str
    azure_sql_database: str

    # Azure AISearch Configurations
    azure_search_endpoint: str
    azure_search_index: str
    azure_search_api_key: str
    azure_search_semantic_config: str

    # Postgres Vector Database Configurations
    # Postgres Database Configurations
    postgres_host: str
    postgres_port: str
    postgres_user: str
    postgres_password: str
    postgres_database: str
    postgres_pool_size: int = Field(default=10)
    postgres_max_overflow: int = Field(default=10)
    postgres_pool_timeout: int = Field(default=60)
    postgres_max_connections: int = Field(default=200)
    postgres_pool_percent: int = Field(default=75)
    postgres_overflow_percent: int = Field(default=25)

    @model_validator(mode="after")
    def _apply_env_pool_defaults(self):
        """
        Ajusta defaults de pool según entorno solo cuando no vienen definidos
        en variables de entorno. Si el usuario los setea en .env/ENV vars, se respetan.
        """
        env = getattr(self, "env", "development")

        if os.getenv("POSTGRES_POOL_SIZE") is None:
            self.postgres_pool_size = max(
                1,
                int(
                    self.postgres_max_connections
                    * min(self.postgres_pool_percent, 100)
                    / 100
                ),
            )

        if os.getenv("POSTGRES_MAX_OVERFLOW") is None:
            overflow_pool = max(
                1,
                self.postgres_max_connections - self.postgres_pool_size,
            )
            self.postgres_max_overflow = max(
                1,
                int(overflow_pool * min(self.postgres_overflow_percent, 100) / 100),
            )

        if os.getenv("POSTGRES_POOL_TIMEOUT") is None:
            # 60s para dar margen en colas de conexión
            self.postgres_pool_timeout = 60 if env == "production" else 30

        return self

    @model_validator(mode="after")
    def _apply_env_feature_flags(self):
        env = getattr(self, "env", "development")
        if env == "production":
            if os.getenv("RATE_LIMIT_ENABLED") is None:
                self.rate_limit_enabled = True
            if os.getenv("REQUEST_TIMEOUT_SECONDS") is None:
                self.request_timeout_seconds = 180  # Aligned with Gunicorn timeout
            if os.getenv("LLM_MAX_CONCURRENCY") is None:
                self.llm_max_concurrency = max(self.llm_max_concurrency, 15)
            if os.getenv("LLM_QUEUE_TIMEOUT_SECONDS") is None:
                self.llm_queue_timeout_seconds = max(self.llm_queue_timeout_seconds, 90)
            if os.getenv("USE_PGBOUNCER") is None:
                self.use_pgbouncer = True
            if os.getenv("REQUIRE_FRONTEND_API_KEY") is None:
                self.require_frontend_api_key = True
            if os.getenv("ENFORCE_FRONTEND_REFERRER") is None:
                self.enforce_frontend_referrer = False
        return self

    @model_validator(mode="after")
    def _apply_session_cookie_defaults(self):
        """
        Default to secure cookies in production; allow HTTP cookies elsewhere unless the user overrides.
        """
        if getattr(self, "session_cookie_secure", None) is None:
            self.session_cookie_secure = self.env == "production"
        return self

    # Flags using boolean
    middleware_openai_moderation: bool

    # Session
    session_secret_key: str
    session_max_age: int
    session_max_time: int
    # Max number of questions in a session
    session_max_question: int
    # Max number of history length in a llm completion
    session_max_history_length: int
    # Mantain all history in session
    session_mantain_questions: bool
    # HTTPS-only cookie flag (None lets defaults kick in)
    session_cookie_secure: bool | None = None
    # WhatsApp Webhook
    facebook_webhook_verify_token: str
    facebook_whatsapp_token: str
    facebook_whatsapp_api_url: str
    facebook_app_secret: str

    # Rate limiting
    rate_limit_enabled: bool = Field(default=False)
    rate_limit_chat: str = Field(default="10/minute")
    rate_limit_feedback: str = Field(default="5/minute")
    rate_limit_approve: str = Field(default="20/minute")

    # Request timeout - 180s para requests complejas con LLM + SQL
    request_timeout_seconds: int = Field(default=180)
    require_frontend_api_key: bool = Field(default=False)
    enforce_frontend_referrer: bool = Field(default=False)
    frontend_allowed_referrers: str | None = None
    use_pgbouncer: bool = Field(default=False)
    pgbouncer_host: str = Field(default="pgbouncer")
    pgbouncer_port: int = Field(default=6432)
    llm_max_concurrency: int = Field(default=50)
    llm_queue_timeout_seconds: int = Field(default=90)

    # ═══════════════════════════════════════════════════════════════════════════
    # LLM GUARDRAILS - Concurrency, Circuit Breaker, Retry Settings
    # ═══════════════════════════════════════════════════════════════════════════
    llm_concurrency_limit: int = Field(
        default=50,  # Increased to 50 to utilize server resources (monitor Azure Rate Limits)
        description="Maximum concurrent LLM calls (semaphore limit)",
    )
    llm_semaphore_timeout_seconds: int = Field(
        default=90, description="Timeout waiting for LLM semaphore slot"
    )
    llm_semaphore_log_threshold_ms: int = Field(
        default=1000,
        description="Log warning if semaphore wait exceeds this threshold (ms)",
    )
    llm_circuit_breaker_fail_max: int = Field(
        default=5, description="Consecutive failures before opening circuit breaker"
    )
    llm_circuit_breaker_reset_timeout: int = Field(
        default=30, description="Seconds to wait before retrying after circuit opens"
    )
    llm_guardrail_retry_attempts: int = Field(
        default=3, description="Number of retry attempts for transient LLM errors"
    )
    llm_retry_backoff_max_seconds: int = Field(
        default=10, description="Maximum exponential backoff in seconds"
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # CONVERSATIONAL CONTEXT SETTINGS
    # ═══════════════════════════════════════════════════════════════════════════
    history_window_seconds: int = Field(
        default=300,
        description="Time window in seconds to consider messages as recent history (default 5 min)",
    )
    enable_history_context: bool = Field(
        default=False,
        description="If True, passes recent message history to LLM for rewriting and analysis",
    )
    enable_session_memory_context: bool = Field(
        default=False,
        description="If True, passes session memory (filters, dimensions) to LLM",
    )

    # graph recursion limit
    graph_recursion_limit: int

    # Feature flags
    enable_dynamic_fewshots: bool = True  # TEST
    trace_metrics: bool = False
    enable_norows_gray_zone: bool = Field(default=True)
    enable_analyzer_gray_zone: bool = Field(default=True)
    enable_complexity_routing: bool = Field(default=False)
    use_unified_inbox: bool = Field(
        default=True
    )  # FASE 4: Inbox refactor rollback flag
    analyzer_gray_zone_min_coverage: float = Field(default=0.5)
    analyzer_filter_confidence_threshold: float = Field(default=0.8)
    max_clarification_turns: int = Field(default=2)
    sql_max_retries: int = Field(
        default=3,
        description="Maximum SQL regeneration attempts before returning error to user (anti-loop protection)",
    )
    semantic_distance_threshold: float = Field(default=0.35)
    semantic_distance_relax_step: float = Field(default=0.05)
    keyword_min_rank: float = Field(default=0.05)
    keyword_rank_relax_step: float = Field(default=0.02)
    # Maximum number of fields to expand per keyword when generating token-level EXISTS
    # Can be overridden via .env: MAX_KEYWORD_FIELDS=3
    max_keyword_fields: int = Field(default=3)
    # FlashRank citizen reranker
    feature_flashrank_citizen: bool = Field(default=True)
    flashrank_high_threshold: float = Field(default=0.75)
    flashrank_low_threshold: float = Field(default=0.20)
    flashrank_max_llm_rows: int = Field(default=5)
    flashrank_cache_dir: str = Field(
        default=os.path.join(BASE_DIR, "app/.cache/flashrank"),
        description="Directory to cache FlashRank models. Defaults to app/.cache/flashrank relative to project root.",
    )

    # SQL text search optimization
    max_sql_keywords: int = Field(
        default=3,
        description="Maximum keywords to include in SQL WHERE clause (rest handled semantically by Flashrank)",
    )
    max_sql_columns: int = Field(
        default=2,
        description="Maximum text columns to search in SQL (reduces query complexity)",
    )
    sql_priority_columns: list[str] = Field(
        default=["nombre_proyecto", "objetivo_proyecto"],
        description="Priority columns for SQL text search (in order of importance)",
    )

    # FlashRank bypass threshold
    flashrank_min_text_length: int = Field(
        default=20,
        description="Minimum combined text length (chars) to enable FlashRank. Below this, FlashRank is skipped for aggregated responses.",
    )

    # Territorial disambiguation
    use_territorial_disambiguation: bool = Field(
        default=True,
        description="Enable territorial disambiguation (single column filter vs OR triple). Set to True to use resolved column from dim_territorios_flat.",
    )

    # Additive dimension search (funding, sector, entity)
    enable_additive_dimension_search: bool = Field(
        default=True,
        description="Enable additive search across dimensions (funding sources, sectors, entities). When True, keywords matching dimension catalogs add OR conditions to SQL.",
    )
    territorial_max_options: int = Field(
        default=5,
        description="Maximum number of territory options to show in disambiguation prompts",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # UNCERTAINTY TOPICS (Business Logic Control)
    # ═══════════════════════════════════════════════════════════════════════════
    # Topics that BLOCK SQL generation and require user clarification
    blocking_uncertainty_topics: str = Field(
        default="pregunta_incompleta,territorio_ambiguo",
        description="Comma-separated list of uncertainty topics that block SQL generation and require clarification",
    )
    # Topics that generate warnings but continue with defaults (non-blocking)
    non_blocking_uncertainty_topics: str = Field(
        default="valor_ambiguo,year_scope,territorio,proxy_avance,pregunta_general",
        description="Comma-separated list of uncertainty topics that continue with defaults (citizen_review may suggest alternatives)",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # TEXT MATCHING THRESHOLDS
    # ═══════════════════════════════════════════════════════════════════════════
    fuzzy_match_threshold: float = Field(
        default=0.75,
        description="Minimum similarity score (0.0-1.0) for fuzzy matching against catalogs (sector, entity, territory)",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # SEARCH STRATEGY FLAGS (CASCADING SEARCH)
    # ═══════════════════════════════════════════════════════════════════════════
    search_enable_semantic: bool = Field(
        default=True,
        description="Enable Semantic Layer (process_text ILIKE process_text)",
    )
    search_enable_trigram: bool = Field(
        default=True, description="Enable Trigram Layer (pg_trgm fuzzy matching)"
    )
    search_cascade_mode: bool = Field(
        default=True,
        description="TRUE=Sequential Cascade (Semantic -> Fail -> Trigram). FALSE=All Active.",
    )
    search_trigram_threshold: float = Field(
        default=0.3,
        description="Similarity threshold for trigram matching (low/permissive)",
    )
    search_trigram_threshold_high: float = Field(
        default=0.5,
        description="Similarity threshold for trigram matching (high/strict, tried first)",
    )
    search_enable_fts: bool = Field(
        default=True,
        description="Enable Full-Text Search layer (to_tsvector @@ tsquery with stemming)",
    )
    fts_language: str = Field(
        default="spanish",
        description="Language configuration for Full-Text Search stemming",
    )
    catalog_relax_enabled: bool = Field(
        default=True,
        description="If exact catalog match returns 0 rows, retry with ILIKE before cascade",
    )

    # Dimension reranking for Analyzer 1 optimization
    dimension_rerank_min_score: float = Field(
        default=0.5,
        description="Minimum FlashRank score (0.0-1.0) for dimension filtering in Analyzer 1. Lower = more permissive. Use 0.5 for permissive, 0.65 for moderate.",
    )
    dimension_rerank_max_items: int = Field(
        default=10,
        description="Maximum items per dimension category (sectors, entities, states) to send to Analyzer 1",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # TABLE VISIBILITY THRESHOLDS
    # ═══════════════════════════════════════════════════════════════════════════
    hide_table_max_rows: int = Field(
        default=1,
        description="Hide table if rowcount <= this value AND columns <= hide_table_max_cols. Set to 0 to always show table.",
    )
    hide_table_max_cols: int = Field(
        default=2,
        description="Hide table if columns <= this value AND rows <= hide_table_max_rows. Set to 0 to always show table.",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # CONVERSATIONAL FLOW PARAMETERS
    # ═══════════════════════════════════════════════════════════════════════════
    history_truncate_chars: int = Field(
        default=1500,
        description="Maximum characters to keep from assistant responses in conversation history. Higher values preserve more context but increase token usage.",
    )
    frustration_threshold: int = Field(
        default=2,
        description="Number of consecutive zero-result queries before offering human contact",
    )

    # ═══════════════════════════════════════════════════════════════════════════
    # LLM TIMEOUT SETTINGS (Anti-Hang Protection)
    # ═══════════════════════════════════════════════════════════════════════════
    llm_request_timeout: int = Field(
        default=60,
        description="Timeout in seconds for individual LLM API calls. Prevents workers from hanging on slow Azure/OpenAI responses.",
    )
    llm_max_retries: int = Field(
        default=2,
        description="Internal retries by OpenAI SDK for transient errors. Applied BEFORE safe_invoke backoff.",
    )
    safe_invoke_max_time: int = Field(
        default=120,
        description="Total timeout in seconds for all safe_invoke retry attempts combined.",
    )

    # Reasoning model parameters
    reasoning_seed: Optional[int] = Field(default=None)
    reasoning_effort_sql: str = Field(default="high")
    reasoning_verbosity_sql: str = Field(default="low")
    reasoning_effort_text: str = Field(default="medium")
    reasoning_verbosity_text: str = Field(default="medium")

    # google translate
    google_application_credentials_path: str = Field(
        ..., env="GOOGLE_APPLICATION_CREDENTIALS_PATH"
    )

    google_translate_flag: bool

    @field_validator("cache_enabled", mode="before")
    @classmethod
    def _coerce_cache_enabled(cls, value):
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        if value is None:
            return False
        return bool(value)

    @field_validator("rate_limit_enabled", mode="before")
    @classmethod
    def _coerce_rate_limit_enabled(cls, value):
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        if value is None:
            return False
        return bool(value)

    @field_validator("use_pgbouncer", mode="before")
    @classmethod
    def _coerce_use_pgbouncer(cls, value):
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        if value is None:
            return False
        return bool(value)

    @field_validator("require_frontend_api_key", mode="before")
    @classmethod
    def _coerce_require_frontend_api_key(cls, value):
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        if value is None:
            return False
        return bool(value)

    @field_validator("enforce_frontend_referrer", mode="before")
    @classmethod
    def _coerce_enforce_frontend_referrer(cls, value):
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "yes", "on"}
        if value is None:
            return False
        return bool(value)

    class Config:
        # Conservamos la ruta explícita al .env para compatibilidad/claridad.
        # Nota: En Pydantic v2 prevalece model_config, pero mantener esto no afecta
        # y deja explícita la ruta dentro de la clase.
        env_file = ENV_PATH
        env_file_encoding = "utf-8"

    @property
    def sqlserver_conn_string(self) -> str:
        # Connection string for the legacy SQL Server source (pyodbc)
        return (
            f"mssql+pyodbc://{self.azure_sql_username}:{self.azure_sql_password}"
            f"@{self.azure_sql_host}/{self.azure_sql_database}"
            "?driver=ODBC+Driver+18+for+SQL+Server"
            "&Encrypt=YES&TrustServerCertificate=YES"
        )

    @property
    def sqlserverdata_conn_string(self) -> str:
        """
        Alias mantenido por compatibilidad; preferir `sqlserver_conn_string`.
        """
        return self.sqlserver_conn_string

    @property
    def data_conn_string(self) -> str:
        """
        Alias histórico utilizado por procesos de ingestión que aún esperan la
        conexión a SQL Server. Preferir `sqlserver_conn_string` en código nuevo.
        """
        return self.sqlserver_conn_string

    @property
    def postgres_conn_string(self) -> str:
        host = self.effective_postgres_host
        port = self.effective_postgres_port
        return (
            f"postgresql+psycopg://{self.postgres_user}:{self.postgres_password}"
            f"@{host}:{port}/{self.postgres_database}"
        )

    @property
    def psycopg_conn_string(self) -> str:
        host = self.effective_postgres_host
        port = self.effective_postgres_port
        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{host}:{port}/{self.postgres_database}"
        )

    @property
    def effective_postgres_host(self) -> str:
        return self.pgbouncer_host if self.use_pgbouncer else self.postgres_host

    @property
    def effective_postgres_port(self) -> str:
        if self.use_pgbouncer:
            return str(self.pgbouncer_port)
        return self.postgres_port

    @property
    def parsed_frontend_referrers(self) -> list[str]:
        """
        Returns the list of allowed referrers/origins defined via the
        FRONTEND_ALLOWED_REFERRERS env var (comma-separated).
        """
        if not self.frontend_allowed_referrers:
            return []
        return [
            ref.strip()
            for ref in self.frontend_allowed_referrers.split(",")
            if ref.strip()
        ]

    @property
    def absolute_google_credentials_path(self) -> str:
        # If the path is relative, make it absolute based on the current file's directory
        if not os.path.isabs(self.google_application_credentials_path):
            base_dir = os.path.dirname(os.path.abspath(__file__))
            return os.path.join(base_dir, self.google_application_credentials_path)
        return self.google_application_credentials_path

    @property
    def data_cutoff_path(self) -> str:
        """Absolute path to the file that stores the last data cutoff date."""
        if os.path.isabs(self.data_cutoff_file):
            return self.data_cutoff_file
        # __file__ points to app/modules/config.py; go up two levels to reach repo root
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
        return os.path.normpath(os.path.join(repo_root, self.data_cutoff_file))

    # Messages

    # Error messages
    def staticmessages(self, type: str, info: str = None) -> str:
        """
        Objective: Centralized the static messages for the application
        inputs:
        type: str
            type of error
        error: str (optional)
            error message
        """

        if type == "error_sqlquery":
            msg = "Error al procesar la consulta SQL: " + info

        if type == "missing_data":
            msg = "Faltan datos necesarios para generar la consulta SQL: " + info

        # html tags over the message
        msg = "<div id='respuesta_texto' class='respuesta-text'>" + msg + "</div>"

        return msg


settings = Settings()
