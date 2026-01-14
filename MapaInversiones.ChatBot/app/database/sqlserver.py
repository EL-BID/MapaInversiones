# app/database/sqlserver.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from modules.config import settings

# Motor para SQL Server (origen legacy, usado en ingestiones)
sqlserver_engine = create_engine(
    settings.sqlserver_conn_string,
    pool_size=10,
    max_overflow=20,
    future=True,
    echo=False,
)

# Sesión para SQL Server
SQLServerSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=sqlserver_engine
)

# Base declarativa para SQL Server
SQLServerBase = declarative_base()
