import json
from typing import Any, Dict

from sqlalchemy import (
    Column,
    DateTime,
    MetaData,
    Table,
    Text as SAText,
    select,
    func,
)
from sqlalchemy import update as sa_update
from sqlalchemy.exc import ProgrammingError
from sqlalchemy.dialects.postgresql import JSONB, insert as pg_insert
from sqlalchemy.engine import Engine


class SessionStore:
    """
    Minimal session store backed by Postgres.
    """

    def __init__(self, engine: Engine):
        self._engine = engine
        metadata = MetaData()
        # Define minimal table metadata (extend_existing to avoid conflicts if reflected elsewhere)
        self._table = Table(
            "chat_session_state",
            metadata,
            Column("session_id", SAText, primary_key=True),
            Column("payload", JSONB),
            Column("updated_at", DateTime),
            extend_existing=True,
        )

    def load(self, session_id: str) -> Dict[str, Any]:
        if not session_id:
            return {}
        with self._engine.connect() as conn:
            stmt = select(self._table.c.payload).where(
                self._table.c.session_id == session_id
            )
            row = conn.execute(stmt).scalar_one_or_none()
        if row is None:
            return {}
        if isinstance(row, dict):
            return row
        if isinstance(row, str):
            try:
                return json.loads(row)
            except json.JSONDecodeError:
                return {}
        return row or {}

    def save(self, session_id: str, payload: Dict[str, Any]) -> None:
        if not session_id:
            return
        payload_data = payload or {}
        insert_stmt = pg_insert(self._table).values(
            session_id=session_id,
            payload=payload_data,
        )
        upsert_stmt = insert_stmt.on_conflict_do_update(
            index_elements=[self._table.c.session_id],
            set_={
                "payload": insert_stmt.excluded.payload,
                "updated_at": func.now(),
            },
        )

        from loguru import logger

        try:
            with self._engine.begin() as conn:
                conn.execute(upsert_stmt)
            logger.info(
                "SESSION_STORE ▸ SAVED session_id={} payload_size={}",
                session_id,
                len(json.dumps(payload_data, ensure_ascii=False)),
            )
        except ProgrammingError as pe:
            # Fallback for databases where the table exists but lacks a UNIQUE/PK
            # on session_id (e.g., migrated or pre-existing schema). Perform a
            # safe UPDATE then INSERT if no row was updated.
            msg = str(pe)
            if "no unique or exclusion constraint" in msg.lower():
                logger.warning(
                    "SESSION_STORE ▸ Upsert failed due to missing constraint, falling back to update/insert: {}",
                    session_id,
                )
                with self._engine.begin() as conn:
                    upd = (
                        sa_update(self._table)
                        .where(self._table.c.session_id == session_id)
                        .values(payload=payload_data, updated_at=func.now())
                    )
                    res = conn.execute(upd)
                    if getattr(res, "rowcount", 0) == 0:
                        # no existing row - perform insert without on_conflict
                        conn.execute(insert_stmt)
                logger.info(
                    "SESSION_STORE ▸ SAVED(fallback) session_id={} payload_size={}",
                    session_id,
                    len(json.dumps(payload_data, ensure_ascii=False)),
                )
            else:
                logger.error(
                    "SESSION_STORE ▸ SAVE FAILED session_id={} error={}",
                    session_id,
                    msg,
                )
                raise
        except Exception as e:
            logger.error(
                "SESSION_STORE ▸ SAVE FAILED session_id={} error={}",
                session_id,
                str(e),
            )
            raise

    def delete(self, session_id: str) -> None:
        if not session_id:
            return
        with self._engine.begin() as conn:
            stmt = self._table.delete().where(self._table.c.session_id == session_id)
            conn.execute(stmt)
