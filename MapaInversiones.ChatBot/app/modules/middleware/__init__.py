# app/modules/middleware/__init__.py
"""Middleware package for FastAPI middlewares."""
from modules.middleware.timeout_middleware import RequestTimeoutMiddleware

__all__ = ["RequestTimeoutMiddleware"]
