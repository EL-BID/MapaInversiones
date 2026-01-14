# app/database/postgres.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from modules.config import settings
import os

# Build optional connect_args for SSL when configured (Azure Postgres requires SSL)
connect_args = {}
sslmode = getattr(settings, "postgres_sslmode", None) or os.getenv("POSTGRES_SSLMODE")
sslroot = getattr(settings, "postgres_sslrootcert", None) or os.getenv(
    "POSTGRES_SSLROOTCERT"
)
if sslmode:
    # psycopg accepts sslmode as a connection parameter
    connect_args["sslmode"] = sslmode
    if sslroot:
        # allow relative paths in env by resolving to absolute based on repo root
        if not os.path.isabs(sslroot):
            repo_root = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "..")
            )
            sslroot = os.path.normpath(os.path.join(repo_root, sslroot))
        connect_args["sslrootcert"] = sslroot

postgres_engine = create_engine(
    settings.postgres_conn_string,
    pool_size=settings.postgres_pool_size,
    max_overflow=settings.postgres_max_overflow,
    pool_timeout=settings.postgres_pool_timeout,
    pool_pre_ping=True,  # revive stale connections before handing them out
    pool_recycle=1800,  # recycle connections before server idle timeout
    future=True,
    echo=False,
    **({"connect_args": connect_args} if connect_args else {}),
)

PostgresSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=postgres_engine
)

PostgresBase = declarative_base()
