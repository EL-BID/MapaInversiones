from loguru import logger
from typing import Dict, Optional

from ..config.settings_etl import get_etl_settings
from .connectors import PostgresConnector, SqlServerConnector
from modules.config import (
    settings as app_settings,
)  # Import main app settings for connection strings


class ETLOrchestrator:
    def __init__(self):
        self.settings = get_etl_settings()

        # Initialize connectors
        # We use app_settings for connection strings as they are the source of truth
        self.pg_conn = PostgresConnector(
            app_settings.postgres_conn_string,
            pool_size=self.settings.POSTGRES_POOL_SIZE,
        )
        self.sql_server_sources: Dict[str, SqlServerConnector] = {}
        self.sql_conn: Optional[SqlServerConnector] = None
        self._initialize_sql_server_sources()

    def _initialize_sql_server_sources(self):
        for alias, conn_ref in self.settings.SQL_SERVER_SOURCES.items():
            conn_string = None
            if hasattr(app_settings, conn_ref):
                conn_string = getattr(app_settings, conn_ref)
            elif isinstance(conn_ref, str) and "://" in conn_ref:
                conn_string = conn_ref

            if not conn_string:
                logger.warning(f'⚠️ SQL Server connection "{alias}" cannot be resolved.')
                continue

            connector = SqlServerConnector(
                conn_string, pool_size=self.settings.SQLSERVER_POOL_SIZE
            )
            self.sql_server_sources[alias] = connector
            logger.info(f"🔌 SQL Server connector '{alias}' registered.")

        self.sql_conn = next(iter(self.sql_server_sources.values()), None)

    def get_sql_connector(
        self, connection_ref: Optional[str] = None
    ) -> Optional[SqlServerConnector]:
        if not connection_ref:
            return self.sql_conn
        connector = self.sql_server_sources.get(connection_ref)
        if not connector:
            logger.warning(
                f"⚠️ SQL Server connection '{connection_ref}' not configured; using default."
            )
        return connector or self.sql_conn

    def test_connections(self):
        logger.info("📡 Testing Database Connections...")
        pg_ok = self.pg_conn.test_connection()
        logger.info(f"PG Connection: {'✅ OK' if pg_ok else '❌ FAILED'}")
        if not self.sql_server_sources:
            logger.warning("SQL Server Connection: ⚠️  NOT CONFIGURED")
            return pg_ok

        sql_ok = True
        for alias, connector in self.sql_server_sources.items():
            alias_ok = connector.test_connection()
            logger.info(
                f"SQL Server ({alias}) Connection: {'✅ OK' if alias_ok else '❌ FAILED'}"
            )
            sql_ok = sql_ok and alias_ok

        return pg_ok and sql_ok

    def run_stage(self, stage_name: str, **kwargs):
        """
        Dynamically imports and runs a stage module.
        Expected interface: stage_module.run(orchestrator, **kwargs)
        """
        logger.info(f"🎬 Orchestrator starting stage: {stage_name}")
        try:
            # Dynamic import based on naming convention
            # stages.01_ingest -> ingest_controller.py?
            # Or we map stage names to modules explicitly.

            import importlib

            # Map friendly names to actual modules
            STAGE_MAP = {
                "01_ingest": "app.data_ingestion.stages.01_ingest.ingest_controller",
                "02_refine": "app.data_ingestion.stages.02_refine.refine_controller",
                "03_dimensions": "app.data_ingestion.stages.03_dimensions.dim_controller",
                "04_knowledge": "app.data_ingestion.stages.04_knowledge.know_controller",
                "05_publish": "app.data_ingestion.stages.05_publish.publish_controller",
            }

            module_path = STAGE_MAP.get(stage_name)
            if not module_path:
                logger.error(f"Stage '{stage_name}' not mapped in orchestrator.")
                return

            module = importlib.import_module(module_path)
            if hasattr(module, "run"):
                module.run(self, **kwargs)
            else:
                logger.error(f"Module {module_path} does not have a 'run' function.")

        except Exception as e:
            logger.exception(f"Stage execution failed: {e}")
            raise e
