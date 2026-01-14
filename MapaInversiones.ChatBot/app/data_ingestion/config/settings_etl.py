from functools import lru_cache
from pathlib import Path
from typing import Dict

from pydantic_settings import BaseSettings


class ETLSettings(BaseSettings):
    # Paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    CONFIG_DIR: Path = BASE_DIR / "config"
    TMP_DIR: Path = BASE_DIR / "tmp"
    ARCHIVE_DIR: Path = BASE_DIR / "archive"

    SOURCES_YAML: Path = CONFIG_DIR / "sources.yaml"

    # Database (Reuse main app config or override)
    # We will import main settings dynamically to avoid circular imports if possible,
    # but for now we assume they are available in environment variables or we hardcode defaults matching .env

    # Defaults (should match .env)
    POSTGRES_POOL_SIZE: int = 10
    SQLSERVER_POOL_SIZE: int = 5
    SQL_SERVER_SOURCES: Dict[str, str] = {"AZURE_SQL_MAIN": "sqlserver_conn_string"}

    # ETL Processing Settings
    PREVIEW_ROWS: int = 15  # Number of rows to preview in few-shot validation
    SQL_EXECUTION_TIMEOUT: int = 30  # Timeout in seconds for SQL execution
    LLM_TEMPERATURE: float = 0.0  # Temperature for LLM calls

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache()
def get_etl_settings():
    return ETLSettings()
