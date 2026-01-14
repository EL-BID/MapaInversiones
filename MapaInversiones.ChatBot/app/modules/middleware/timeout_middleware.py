# app/modules/middleware/timeout_middleware.py
"""
Request timeout middleware for FastAPI.
Returns 504 Gateway Timeout if request processing exceeds configured timeout.
"""
from __future__ import annotations

import asyncio

from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from loguru import logger


class RequestTimeoutMiddleware(BaseHTTPMiddleware):
    """
    Middleware that enforces a timeout on request processing.

    If the request takes longer than `timeout_seconds`, returns a 504 response
    instead of letting the request hang indefinitely.

    Usage:
        from modules.middleware.timeout_middleware import RequestTimeoutMiddleware
        app.add_middleware(RequestTimeoutMiddleware, timeout_seconds=120)
    """

    def __init__(self, app, timeout_seconds: int = 120):
        super().__init__(app)
        self.timeout = timeout_seconds

    async def dispatch(self, request: Request, call_next) -> Response:
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            logger.warning(
                "REQUEST_TIMEOUT ▸ exceeded {}s path={} method={}",
                self.timeout,
                request.url.path,
                request.method,
            )
            return JSONResponse(
                status_code=504,
                content={
                    "detail": "La consulta tardó demasiado y fue cancelada. Intente nuevamente en unos segundos."
                },
            )
