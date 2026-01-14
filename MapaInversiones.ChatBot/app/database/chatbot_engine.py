"""
Dedicated AUTOCOMMIT engine for chatbot SQL execution.
Avoids idle-in-transaction timeouts during LLM waits.

This engine should be used for read-only SELECT queries in the chatbot flow,
where transactions are not needed and can cause issues when LLM calls block.
"""

from sqlalchemy import create_engine
from modules.config import settings

# AUTOCOMMIT engine for chatbot queries - no transactions!
# This prevents IdleInTransactionSessionTimeout when LLM calls block
chatbot_engine = create_engine(
    settings.postgres_conn_string,
    pool_size=10,
    max_overflow=5,
    pool_timeout=30,
    pool_pre_ping=True,
    pool_recycle=600,  # Recycle connections every 10 minutes
    isolation_level="AUTOCOMMIT",  # Key: no transaction wrapping
    echo=False,
)
