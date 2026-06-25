# app/database/async_postgres.py
"""
Unified async PostgreSQL engine using SQLAlchemy 2.0 + psycopg3 async driver.
This replaces the three separate sync engines in database.py, postgres.py, and db_utils.py.
"""
from __future__ import annotations

import asyncio
from typing import AsyncGenerator
from contextlib import asynccontextmanager

from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
    AsyncEngine,
)
from sqlalchemy.pool import AsyncAdaptedQueuePool
from loguru import logger

from modules.config import settings


# ═══════════════════════════════════════════════════════════════════════════
# ASYNC ENGINE CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════


def _build_async_connection_string() -> str:
    """Build async connection string for psycopg3 async driver."""
    host = settings.effective_postgres_host
    port = settings.effective_postgres_port
    return (
        f"postgresql+psycopg://{settings.postgres_user}:{settings.postgres_password}"
        f"@{host}:{port}/{settings.postgres_database}"
    )


# Statement timeout to kill hung queries (30 seconds)
_STATEMENT_TIMEOUT_MS = 30000

# Create the unified async engine
async_engine: AsyncEngine = create_async_engine(
    _build_async_connection_string(),
    # Pool configuration
    pool_size=settings.postgres_pool_size,
    max_overflow=settings.postgres_max_overflow,
    pool_timeout=settings.postgres_pool_timeout,
    pool_pre_ping=True,  # Check connection health before use
    pool_recycle=1800,  # Recycle connections every 30 minutes
    # Connection parameters
    connect_args={
        "connect_timeout": 20,
        "options": f"-c statement_timeout={_STATEMENT_TIMEOUT_MS}",
    },
    echo=False,
)


# Async session factory
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
    autocommit=False,
)


# ═══════════════════════════════════════════════════════════════════════════
# ASYNC SEMAPHORE FOR QUERY CONCURRENCY CONTROL
# ═══════════════════════════════════════════════════════════════════════════

# Limit concurrent queries to avoid overwhelming the DB
# Set to pool_size - 2 to leave headroom for other operations
_DB_SEMAPHORE_LIMIT = max(1, settings.postgres_pool_size - 2)
_db_semaphore = asyncio.Semaphore(_DB_SEMAPHORE_LIMIT)

logger.info(
    "ASYNC_DB ▸ Engine created pool_size={} max_overflow={} semaphore_limit={} statement_timeout={}ms",
    settings.postgres_pool_size,
    settings.postgres_max_overflow,
    _DB_SEMAPHORE_LIMIT,
    _STATEMENT_TIMEOUT_MS,
)


@asynccontextmanager
async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Async context manager that provides a database session with semaphore protection.
    Use this for all DB operations to ensure proper concurrency control.

    Usage:
        async with get_async_session() as session:
            result = await session.execute(text("SELECT 1"))
    """
    async with _db_semaphore:
        async with AsyncSessionLocal() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()


async def get_async_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for async database sessions.

    Usage in routes:
        @router.get("/example")
        async def example(db: AsyncSession = Depends(get_async_db)):
            result = await db.execute(text("SELECT 1"))
    """
    async with _db_semaphore:
        async with AsyncSessionLocal() as session:
            try:
                yield session
            except Exception:
                await session.rollback()
                raise


# ═══════════════════════════════════════════════════════════════════════════
# SYNC COMPATIBILITY LAYER (for gradual migration)
# ═══════════════════════════════════════════════════════════════════════════

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base
import threading


# Sync engine for backward compatibility during migration
# This will be deprecated once all callsites are async
def _build_sync_connection_string() -> str:
    host = settings.effective_postgres_host
    port = settings.effective_postgres_port
    return (
        f"postgresql+psycopg://{settings.postgres_user}:{settings.postgres_password}"
        f"@{host}:{port}/{settings.postgres_database}"
    )


sync_engine = create_engine(
    _build_sync_connection_string(),
    pool_size=settings.postgres_pool_size,
    max_overflow=settings.postgres_max_overflow,
    pool_timeout=settings.postgres_pool_timeout,
    pool_pre_ping=True,
    pool_recycle=1800,
    connect_args={
        "connect_timeout": 20,
        "options": f"-c statement_timeout={_STATEMENT_TIMEOUT_MS}",
    },
    echo=False,
)

SyncSessionLocal = sessionmaker(
    bind=sync_engine,
    autocommit=False,
    autoflush=False,
)

# Declarative base for ORM models
PostgresBase = declarative_base()


def get_sync_db():
    """
    Sync dependency for backward compatibility.
    Use get_async_db for new code.
    """
    db = SyncSessionLocal()
    try:
        yield db
    finally:
        db.close()


# Sync semaphore for LangGraph nodes (which run in thread pool)
_sync_db_semaphore = threading.BoundedSemaphore(_DB_SEMAPHORE_LIMIT)


from contextlib import contextmanager


@contextmanager
def sync_db_acquire():
    """
    Context manager to acquire the sync DB semaphore.
    Use this to wrap synchronous database operations to limit concurrency.

    Usage:
        with sync_db_acquire():
            result = db.execute(text("SELECT 1"))
    """
    acquired = _sync_db_semaphore.acquire(timeout=settings.postgres_pool_timeout)
    if not acquired:
        raise TimeoutError(
            f"Could not acquire DB semaphore within {settings.postgres_pool_timeout}s"
        )
    try:
        yield
    finally:
        _sync_db_semaphore.release()


@asynccontextmanager
async def get_sync_session_in_threadpool():
    """
    Run sync DB session in thread pool for LangGraph compatibility.
    This prevents blocking the event loop while still enforcing concurrency limits.
    """
    loop = asyncio.get_event_loop()

    # Acquire semaphore asynchronously
    async with _db_semaphore:
        # Run the sync session in thread pool
        def _get_session():
            return SyncSessionLocal()

        session = await loop.run_in_executor(None, _get_session)
        try:
            yield session
        except Exception:
            await loop.run_in_executor(None, session.rollback)
            raise
        finally:
            await loop.run_in_executor(None, session.close)
