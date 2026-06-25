import secrets
from typing import Any, Mapping, Optional

from itsdangerous import Signer, BadSignature
from loguru import logger
from starlette.concurrency import run_in_threadpool
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

from database.session_store import SessionStore


class _ServerSession(dict):
    def __init__(self, data: Mapping[str, Any] | None = None):
        super().__init__(data or {})
        self.modified = False

    def _mark_modified(self):
        self.modified = True

    def __setitem__(self, key, value):
        self.modified = True
        return super().__setitem__(key, value)

    def __delitem__(self, key):
        self.modified = True
        return super().__delitem__(key)

    def clear(self):
        self.modified = True
        return super().clear()

    def pop(self, k, d=None):
        self.modified = True
        return super().pop(k, d)

    def popitem(self):
        self.modified = True
        return super().popitem()

    def setdefault(self, key, default=None):
        if key not in self:
            self.modified = True
        return super().setdefault(key, default)

    def update(self, *args, **kwargs):
        if args or kwargs:
            self.modified = True
        return super().update(*args, **kwargs)


class DbSessionMiddleware(BaseHTTPMiddleware):
    """
    Server-side session middleware backed by Postgres.
    """

    def __init__(
        self,
        app,
        *,
        store: SessionStore,
        secret_key: str,
        cookie_name: str = "session",
        max_age: Optional[int] = None,
        https_only: bool = False,
    ):
        super().__init__(app)
        self.store = store
        self.cookie_name = cookie_name
        self.max_age = max_age
        self.signer = Signer(secret_key)
        self.https_only = https_only

    async def dispatch(self, request: Request, call_next):
        session_id, session_data = await self._load_session(request)
        request.scope["session"] = session_data

        response = await call_next(request)

        # Prepare session save - we need to set cookie headers before streaming starts
        # For StreamingResponse, we can't modify after the fact, so we save to DB
        # and add cookie to headers
        if session_data.modified or dict(session_data):
            # Save to database
            await run_in_threadpool(self.store.save, session_id, dict(session_data))
            logger.info(
                "SESSION ▸ SAVED session_id={} keys={}",
                session_id,
                list(session_data.keys()),
            )

            # Generate signed cookie value
            signed = self.signer.sign(session_id.encode("utf-8")).decode("utf-8")

            # Build cookie header value
            cookie_value = (
                f"{self.cookie_name}={signed}; Path=/; HttpOnly; SameSite=Lax"
            )
            if self.max_age is not None:
                cookie_value += f"; Max-Age={self.max_age}"
            if self.https_only:
                cookie_value += "; Secure"

            # Add Set-Cookie header directly to response
            response.headers.append("Set-Cookie", cookie_value)
            logger.info("SESSION ▸ COOKIE SET header for session_id={}", session_id)

        return response

    async def _load_session(self, request: Request):
        raw_cookie = request.cookies.get(self.cookie_name)
        session_id = None
        if raw_cookie:
            try:
                unsigned_value = self.signer.unsign(raw_cookie).decode("utf-8")
                # Only accept if it's a valid 32-char hex session ID
                if _is_valid_session_id(unsigned_value):
                    session_id = unsigned_value
                else:
                    # Cookie contains corrupted data (e.g., base64-encoded JSON)
                    # Treat as invalid and create new session
                    session_id = None
            except BadSignature:
                session_id = None
        if not session_id:
            session_id = secrets.token_hex(16)
            session_data = _ServerSession()
            session_data.modified = True
        else:
            data = await run_in_threadpool(self.store.load, session_id)
            session_data = _ServerSession(data)

        # Validate and fix session ID - must be a 32-char hex string
        stored_id = session_data.get("id")
        if not stored_id or not _is_valid_session_id(stored_id):
            session_data["id"] = session_id

        return session_id, session_data

    async def _save_session(
        self, response: Response, session_id: str, session_data: _ServerSession
    ):
        if getattr(response, "scope", None) is None:
            logger.debug("SESSION ▸ SKIP save (no response scope)")
            return

        # Skip only if session is empty AND not modified
        # For new sessions, modified=True, so we always save
        if not session_data.modified and not dict(session_data):
            logger.debug("SESSION ▸ SKIP save (not modified, empty)")
            return

        signed = self.signer.sign(session_id.encode("utf-8")).decode("utf-8")

        if session_data:
            await run_in_threadpool(self.store.save, session_id, dict(session_data))
            logger.info(
                "SESSION ▸ SAVED session_id={} keys={}",
                session_id,
                list(session_data.keys()),
            )
        else:
            await run_in_threadpool(self.store.delete, session_id)
            logger.info("SESSION ▸ DELETED session_id={}", session_id)

        response.set_cookie(
            self.cookie_name,
            signed,
            max_age=self.max_age,
            httponly=True,
            secure=self.https_only,
            samesite="lax",
        )
        logger.debug(
            "SESSION ▸ COOKIE SET name={} secure={} samesite=lax",
            self.cookie_name,
            self.https_only,
        )


def _is_valid_session_id(value: str) -> bool:
    """Check if value is a valid 32-character hex session ID."""
    if not isinstance(value, str):
        return False
    if len(value) != 32:
        return False
    try:
        int(value, 16)  # Check if it's valid hex
        return True
    except ValueError:
        return False
