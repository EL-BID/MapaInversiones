from typing import Generator
from database.sqlserver import SQLServerSessionLocal
from database.postgres import PostgresSessionLocal


def get_sqlserver_db() -> Generator:
    db = SQLServerSessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_postgres_db() -> Generator:
    db = PostgresSessionLocal()
    try:
        yield db
    finally:
        db.close()
