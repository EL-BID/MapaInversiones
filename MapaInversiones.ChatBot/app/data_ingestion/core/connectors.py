from sqlalchemy import create_engine, text
from loguru import logger
import pandas as pd
from contextlib import contextmanager


class DatabaseConnector:
    def __init__(self, conn_string: str, pool_size=5, max_overflow=10):
        self.conn_string = conn_string
        self.engine = create_engine(
            conn_string,
            pool_size=pool_size,
            max_overflow=max_overflow,
            pool_pre_ping=True,
        )

    def test_connection(self):
        try:
            with self.engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            return True
        except Exception as e:
            logger.error(f"Connection failed: {e}")
            return False

    @contextmanager
    def connect(self):
        """Yields a connection context."""
        with self.engine.connect() as conn:
            yield conn

    @contextmanager
    def begin(self):
        """Yields a transaction context."""
        with self.engine.begin() as conn:
            yield conn

    def query_to_df(self, sql: str, params=None) -> pd.DataFrame:
        """Executes a SELECT query and returns a Pandas DataFrame."""
        try:
            return pd.read_sql(sql, self.engine, params=params)
        except Exception as e:
            logger.error(f"Error reading SQL: {e}")
            raise e

    def execute(self, sql: str, params=None):
        """Executes a generic SQL command."""
        with self.begin() as conn:
            return conn.execute(text(sql), params or {})


class PostgresConnector(DatabaseConnector):
    pass


class SqlServerConnector(DatabaseConnector):
    pass
