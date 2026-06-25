from __future__ import annotations

import asyncio
import functools
import time
from typing import Callable, Dict, Tuple

from fastapi import Request
from fastapi.responses import JSONResponse

from modules.config import settings


class RateLimitExceeded(Exception):
    """Raised when the request exceeds the configured rate."""


class _Limit:
    __slots__ = ("max_calls", "period", "token")

    _PERIODS = {
        "s": 1,
        "sec": 1,
        "second": 1,
        "seconds": 1,
        "m": 60,
        "min": 60,
        "minute": 60,
        "minutes": 60,
        "h": 3600,
        "hour": 3600,
        "hours": 3600,
    }

    def __init__(self, value: str):
        try:
            amount, window = value.split("/", 1)
            amount = int(amount.strip())
        except (ValueError, AttributeError):
            raise ValueError(f"Invalid rate limit format: {value!r}") from None

        window_key = window.strip().lower()
        window_key = window_key.rstrip("s")
        period = self._PERIODS.get(window_key)
        if period is None:
            raise ValueError(f"Unsupported rate limit window: {window!r}")

        self.max_calls = amount
        self.period = period
        self.token = object()


class Limiter:
    def __init__(self, *, key_func: Callable[[Request], str], enabled: bool = True):
        self.enabled = enabled
        self.key_func = key_func
        import threading

        self._lock = threading.Lock()
        self._buckets: Dict[Tuple[object, str], Tuple[float, int]] = {}

    def limit(self, limit_value: str):
        limit = _Limit(limit_value)

        def decorator(func):
            if not self.enabled:
                return func

            if asyncio.iscoroutinefunction(func):

                @functools.wraps(func)
                async def async_wrapper(*args, **kwargs):
                    request = self._extract_request(args, kwargs)
                    # For async wrapper, we can call the sync check directly as it captures the lock quickly
                    self._check_and_increment(limit, request)
                    response = await func(*args, **kwargs)
                    self._attach_headers(response, limit)
                    return response

                return async_wrapper

            @functools.wraps(func)
            def sync_wrapper(*args, **kwargs):
                request = self._extract_request(args, kwargs)
                self._check_and_increment(limit, request)
                response = func(*args, **kwargs)
                self._attach_headers(response, limit)
                return response

            return sync_wrapper

        return decorator

    def _check_and_increment(self, limit: _Limit, request: Request):
        if request is None:
            raise RuntimeError("Request object is required for rate limiting")
        key = self.key_func(request)
        bucket_key = (limit.token, key)
        with self._lock:
            window_start, count = self._buckets.get(bucket_key, (0.0, 0))
            now = time.monotonic()
            if now - window_start >= limit.period:
                window_start, count = now, 0
            if count >= limit.max_calls:
                raise RateLimitExceeded
            self._buckets[bucket_key] = (window_start, count + 1)

    @staticmethod
    def _extract_request(args, kwargs) -> Request | None:
        request = kwargs.get("request")
        if request is not None:
            return request
        for arg in args:
            if isinstance(arg, Request):
                return arg
        return None

    @staticmethod
    def _attach_headers(response, limit: _Limit):
        if hasattr(response, "headers"):
            response.headers["X-RateLimit-Limit"] = str(limit.max_calls)
            response.headers["X-RateLimit-Window"] = str(limit.period)


def _rate_limit_key(request: Request) -> str:
    session = getattr(request, "session", {}) or {}
    session_id = session.get("id")
    if session_id:
        return f"session:{session_id}"
    client = request.client
    return f"ip:{client.host if client else 'unknown'}"


limiter = Limiter(
    key_func=_rate_limit_key,
    enabled=settings.rate_limit_enabled,
)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={
            "detail": "Se excedió el límite de peticiones permitidas. Intenta nuevamente en unos segundos."
        },
    )
