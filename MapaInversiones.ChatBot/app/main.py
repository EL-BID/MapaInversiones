from fastapi import FastAPI, Request, status

# Frontend calls
from fastapi.staticfiles import StaticFiles
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import mimetypes
import os
import json  # NEW: for schema stats logging
from modules.config import settings  # old app.utils imports
from modules.services.chat_service import preload_autosuggest_cache

# routes
from routes import chat, home, history, lookup

# Session Middleware for FastAPI
from starlette.middleware.sessions import SessionMiddleware

# CORS
from fastapi.middleware.cors import CORSMiddleware

# LOGS
from modules.utils.logging_config import setup_logging
from modules.utils.nltk_utils import schedule_nltk_resource
from database.session_store import SessionStore
from database.postgres import postgres_engine
from middleware.db_session import DbSessionMiddleware
from middleware.timeout import RequestTimeoutMiddleware
from middleware.security import SecurityMiddleware
from modules.rate_limit import limiter, rate_limit_exceeded_handler, RateLimitExceeded

setup_logging()
from loguru import logger  # Import after setup_logging to ensure configuration

logger.disable("sqlfluff")
logger.disable("sqlfluff.cli.commands")
logger.disable("sqlfluff.linter")
logger.disable("sqlfluff.fix")


from starlette.middleware.base import BaseHTTPMiddleware
import time
import asyncio

safe_exporter = None
# This file is the entry point for the FastAPI application.
# It contains the FastAPI application instance and the routes that are included in the application.
# The FastAPI application instance is created and configured here.
# The routes are included from the routes directory.
# TODO: Modularity: Can the routes be included in a more modular way?
# TODO: CORS for deploy in production: origins must be updated?
# TODO: Secret Key for Session Middleware: Rotation enabled?

# Tracer Arize
logger.info("Arize Tracing enabled: {}", settings.arize_enabled)
if settings.arize_enabled == "1":
    logger.info("Arize Tracing enabled, initializing...")
    from openinference.instrumentation.langchain import LangChainInstrumentor
    from modules.tracing.tracing import tracer_provider

    LangChainInstrumentor().instrument(tracer_provider=tracer_provider)

    # --- Protect exporter with circuit‑breaker ---
    from modules.tracing.tracing import (
        init_tracing,
    )  # wraps the OTLP exporter with safe_exporter

    safe_exporter = init_tracing()

from typing import Optional

app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

import os

# ---------------------------------------------------------------------addon dynamic ddls
# if modules.utils.build_schema_enriched exists then import:
if os.path.exists(
    os.path.join(
        os.path.dirname(__file__), "modules", "utils", "build_schema_enriched.py"
    )
):
    from modules.utils.build_schema_enriched import build_enriched
else:
    logger.info(
        "⚠️ modules.utils.build_schema_enriched no encontrado — se omite la generación del schema enriquecido en startup"
    )


@app.on_event("startup")
def dump_schema_cache():
    # Precalentar recursos NLTK que se usan en background
    schedule_nltk_resource("stopwords")
    schedule_nltk_resource("punkt")

    logger.info("🔄 Generando schema enriquecido…")
    try:
        t0 = time.perf_counter()
        path = build_enriched()
        elapsed_ms = (time.perf_counter() - t0) * 1000

        # Reactivate exporter in case it had been muted by network failures
        global safe_exporter
        if safe_exporter is not None:
            safe_exporter._enabled = True
        # Launch background watchdog (once per process)
        loop = asyncio.get_event_loop()
        loop.create_task(_exporter_watchdog())

        if path and os.path.exists(path):
            size_kib = os.path.getsize(path) / 1024.0
            tables = "?"
            columns = "?"
            try:
                with open(path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                # Best-effort: detectar conteos si el JSON expone estructura de tablas
                if isinstance(data, dict):
                    maybe_tables = (
                        data.get("tables")
                        or data.get("schemas")
                        or data.get("tables_by_name")
                    )
                    if isinstance(maybe_tables, dict):
                        tables = len(maybe_tables)
                        try:
                            columns = sum(
                                (
                                    len(tbl.get("columns", {}))
                                    if isinstance(tbl.get("columns", {}), dict)
                                    else (
                                        len(tbl.get("columns", []))
                                        if isinstance(tbl.get("columns", list))
                                        else 0
                                    )
                                )
                                for tbl in maybe_tables.values()
                            )
                        except Exception:
                            columns = "?"
            except Exception:
                # Si no se puede parsear, igual reportamos tamaño y tiempo
                pass

            # Log final de éxito con métricas
            logger.info(
                "✅ Schema enriquecido OK → {} ({:.1f} KiB, tablas={}, columnas≈{}) en {:.0f} ms",
                path,
                size_kib,
                tables,
                columns,
                elapsed_ms,
            )
        else:
            logger.error(
                "❌ build_enriched() no generó archivo válido (path={!r})", path
            )
    except Exception as e:
        logger.exception("💥 Error generando schema enriquecido: {}", e)
    # Pre‑load the user‑facing schema summary into memory (from routes.chat cache loader)
    try:
        if hasattr(chat, "_load_schema_summary"):
            summary = chat._load_schema_summary()
            logger.info(
                "✅ Schema summary precargado en memoria ({} bytes)",
                len(summary.encode("utf-8")),
            )
        else:
            logger.info(
                "⚠️ routes.chat no expone _load_schema_summary; se omite precarga de resumen de esquema"
            )
    except Exception as exc:
        logger.warning("No se pudo precargar schema_summary.md: {}", exc)

    # Preload autosuggest questions to avoid per-keystroke DB hits
    try:
        stats = preload_autosuggest_cache()
        if stats:
            total = sum(stats.values())
            logger.info(
                "✅ Autosuggest precargado en memoria (paises={}, preguntas={})",
                len(stats),
                total,
            )
    except Exception as exc:
        logger.warning("No se pudo precargar autosuggest en startup: {}", exc)


# --------------------------------------------------------------------


@app.on_event("shutdown")
def reset_safe_exporter() -> None:
    """
    Ensure the safe_exporter is re‑enabled on graceful shutdown so that a
    new process starts with tracing active.
    """
    global safe_exporter
    if safe_exporter is not None:
        safe_exporter._enabled = True


# Exporter watchdog coroutine
async def _exporter_watchdog() -> None:
    """
    Background task that checks every 100 s if the SafeOTLPExporter
    was muted due to a network error and, if so, re‑enables it.
    """
    global safe_exporter
    while True:
        await asyncio.sleep(100)  # run every 100 seconds
        if safe_exporter is not None and not getattr(safe_exporter, "_enabled", True):
            safe_exporter._enabled = True


session_store = SessionStore(postgres_engine)

# ═══════════════════════════════════════════════════════════════════════════
# SESSION MIDDLEWARE: Siempre usar DbSessionMiddleware (persiste a Postgres)
# Esto garantiza que la sesión no se pierda entre requests y soporta
# historial de conversación ilimitado (sin el límite de 4KB de cookies)
# ═══════════════════════════════════════════════════════════════════════════
app.add_middleware(
    DbSessionMiddleware,
    store=session_store,
    secret_key=settings.session_secret_key,
    max_age=settings.session_max_age,
    cookie_name="session",
    https_only=settings.session_cookie_secure,
)

if settings.env == "production":
    app.add_middleware(
        RequestTimeoutMiddleware,
        timeout_seconds=settings.request_timeout_seconds,
    )

# FRONT
origins = [
    "http://localhost:8000",  # Ajusta esto según sea necesario
    "http://127.0.0.1:8000",
    "localhost:8000",
    "0.0.0.0:8000",
    # Agrega otras URL de orígenes permitidos aquí
]
# Agregar CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SECURITY MIDDLEWARE
# Blocks malicious scanning attempts (directory traversal, known vulns)
# Added last so it executes FIRST (FastAPI middleware stack order)
app.add_middleware(SecurityMiddleware)


# this exception_handler will catch all RequestValidationError exceptions that will be raised by FastAPI
# when a request has invalid data (e.g. missing required fields, invalid data types, etc.)
# and return a JSONResponse with the status code 422 Unprocessable Entity and the validation error details
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    )


# Asegurarse de que el tipo MIME de .woff2 es correcto
mimetypes.add_type("font/woff2", ".woff2")

# Montar el directorio de archivos estáticos en la ruta /static
app.mount("/static", StaticFiles(directory="static"), name="static")


# Add the moderation middleware to the FastAPI app
# Only when flag is set to True
if settings.middleware_openai_moderation:
    # Import the OpenAI Moderation Middleware
    from middleware.moderation import OpenAIModerationMiddleware

    app.add_middleware(
        OpenAIModerationMiddleware, api_key=settings.openai_moderation_api_key
    )

# FastApi routes
app.include_router(chat.router)

# Incluir las rutas en la aplicación de FastAPI
app.include_router(home.router)

# history, historial de pregunta
app.include_router(history.router)

# lookup endpoints
app.include_router(lookup.router)


# Check the health of the application
@app.get("/health")
async def health_check():
    """
    Endpoint para verificar la salud de la aplicación. Devuelve un JSON con el estado "ok".
    """
    return {"status": "healthy"}


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        logger.info(
            f"{request.method} {request.url} completed_in={process_time:.2f}ms status_code={response.status_code}"
        )
        return response


if __name__ == "__main__":
    # Importar uvicorn
    import uvicorn

    ENV = os.getenv("ENV", "dev")
    print(f"ENV: {ENV}")

    # correct cli call:
    # uvicorn main:app --reload --log-level debug
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True,  # Desactivar logs de acceso si no los necesitas
    )
