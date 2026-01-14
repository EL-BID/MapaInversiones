from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from modules.config import settings

# SQLAlchemy engine and session for connection pooling and session management
engine = create_engine(
    settings.postgres_conn_string,
    pool_size=settings.postgres_pool_size,
    max_overflow=settings.postgres_max_overflow,
    pool_timeout=settings.postgres_pool_timeout,
    pool_pre_ping=True,  # revive stale connections before handing them out
    pool_recycle=1800,  # recycle connections before server idle timeout
    future=True,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
