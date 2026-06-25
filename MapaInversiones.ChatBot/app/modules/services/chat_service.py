from time import time
import json
import pandas as pd
from threading import Lock
from typing import Dict, List

from fastapi import HTTPException, Request

from langgraph.errors import GraphRecursionError

from sqlalchemy import text
from sqlalchemy.orm import Session

from modules.config import settings
from modules.utils.db_utils import add_question
from modules.graph.graph import graph
from modules.graph.helpers_estado import (
    _get_sql_query,
    _get_sql_rowcount,
    _set_sql_query,
    _set_sql_execution,
    _set_dimensions_catalog,
    _get_user_assistance,
    _get_gray_zone_details,
)
from constants.nodes import SAFE_RESPONSE
from modules.utils.utils import (
    convert_floats_to_int,
    log_session_info,
    prepare_message_history,
)
from modules.utils.markdown_utils import unmark_element, unmark
from modules.utils.html_utils import (
    create_assistant_content_html,
    create_user_question_html,
    create_user_complete_question_html,
)
from modules.utils.translation_utils import translate_markdown, detect_language_google

from datetime import datetime

# remove markdown from original markdown answer
from markdown import Markdown

from loguru import logger

from google.cloud import translate_v2 as translate
from modules.utils.translation_utils import detect_language, translate_text
import re
from modules.utils.cache_utils import get_cache_hit, get_cache_hit_sql
from modules.utils.markdown_utils import format_table_markdown

from modules.utils.cache_utils import get_cache_hit
from modules.utils.history_utils import build_history_for_prompt
from modules.utils.concurrency import llm_concurrency_slot, LLMQueueTimeout
from modules.graph.nodes_fetch import RateLimitExhausted

import traceback
from types import MappingProxyType

from database.postgres import PostgresSessionLocal


# ────────────────────────────────────────────────────────────────────
# Autosuggest cache (in-memory, shared by worker process)
# ────────────────────────────────────────────────────────────────────
_SUGGESTIONS_CACHE: Dict[str, List[str]] = {}
_SUGGESTIONS_CACHE_LOADED = False
_SUGGESTIONS_CACHE_LOCK = Lock()


# ────────────────────────────────────────────────────────────────────
# Respuesta: metadatos de causa y avisos cortos
# ────────────────────────────────────────────────────────────────────
def _build_response_notice(
    cause: str | None, allowed_questions: int | None = None
) -> str | None:
    """
    Solo emitimos avisos para la cuota de sesión:
    - Si quedan pocas (<=3), avisamos el remanente.
    - Si se alcanzó el límite, avisamos el corte.
    """
    remaining = None
    if allowed_questions is not None:
        try:
            remaining = max(0, int(allowed_questions))
        except Exception:
            remaining = None

    if remaining is not None and remaining <= 3:
        if remaining > 0:
            return f"Le quedan {remaining} preguntas en esta sesión."
        return "Ha llegado al límite de preguntas de esta sesión."

    if cause == "session_limit":
        rem = remaining if remaining is not None else 0
        return f"Ha llegado al límite de preguntas de esta sesión. Le quedan {rem}."

    return None


def _attach_response_meta(
    payload: dict, *, cause: str | None, allowed_questions: int | None = None
) -> dict:
    """Agrega response_cause/response_notice sin modificar el resto del payload."""
    payload["response_cause"] = cause
    payload["response_notice"] = _build_response_notice(cause, allowed_questions)
    return payload


def _detect_response_cause(
    *,
    graph_response_type: str | None,
    response_state: dict | None,
    cache_info: dict | None,
    used_fallback: bool,
    rowcount: int | None,
    has_pii: bool,
) -> str | None:
    """Heuristica para etiquetar la causa principal de la respuesta."""
    grt = (graph_response_type or "").strip().lower()
    cache_hit = (cache_info or {}).get("is_cache_hit")
    cache_recent = (cache_info or {}).get("is_recent_cache_hit")

    if has_pii or grt.startswith("moderation"):
        return "moderation"
    if response_state and response_state.get("fetch_failed"):
        return "sql_error"
    if grt.startswith("gray_zone"):
        return "gray_zone"
    if used_fallback:
        return "fallback_used"
    if cache_hit and cache_recent:
        return "cache_used"
    if rowcount == 0 or (response_state or {}).get("no_data"):
        return "no_data"
    return None


def _fetch_all_autosuggest_questions(db: Session) -> Dict[str, List[str]]:
    """Fetch all autosuggest questions grouped by ISO3 country code."""
    statement = text(
        "SELECT pais_iso3, fs_question "
        "FROM vw_autosuggest_fewshots "
        "ORDER BY pais_iso3, fs_question"
    )
    rows = db.execute(statement).fetchall()
    grouped: Dict[str, List[str]] = {}

    for row in rows:
        mapping = row._mapping if hasattr(row, "_mapping") else None
        iso = (mapping["pais_iso3"] if mapping else row[0]) if row else None
        question = (mapping["fs_question"] if mapping else row[1]) if row else None
        iso_key = str(iso or "").strip().upper()
        question_text = str(question or "").strip()
        if not iso_key or not question_text:
            continue
        grouped.setdefault(iso_key, []).append(question_text)

    return grouped


def _ensure_autosuggest_cache(db: Session, *, force_reload: bool = False) -> None:
    """Populate the autosuggest cache if it's empty or when a reload is requested."""
    global _SUGGESTIONS_CACHE_LOADED, _SUGGESTIONS_CACHE

    if _SUGGESTIONS_CACHE_LOADED and not force_reload:
        return

    with _SUGGESTIONS_CACHE_LOCK:
        if _SUGGESTIONS_CACHE_LOADED and not force_reload:
            return

        was_loaded = _SUGGESTIONS_CACHE_LOADED
        data = _fetch_all_autosuggest_questions(db)
        _SUGGESTIONS_CACHE = data
        _SUGGESTIONS_CACHE_LOADED = True

        total_questions = sum(len(items) for items in data.values())
        action = "recargado" if was_loaded else "precargado"
        logger.info(
            "Autosuggest {} en memoria (paises={}, preguntas={})",
            action,
            len(data),
            total_questions,
        )


def preload_autosuggest_cache() -> Dict[str, int]:
    """Load the autosuggest questions into memory at startup.

    Returns a dictionary with ISO3 codes and the number of cached questions per country.
    """
    session = PostgresSessionLocal()
    try:
        _ensure_autosuggest_cache(session, force_reload=True)
        with _SUGGESTIONS_CACHE_LOCK:
            return {iso: len(items) for iso, items in _SUGGESTIONS_CACHE.items()}
    except Exception as exc:
        logger.warning("No se pudo precargar autosuggest: {}", exc)
        return {}
    finally:
        session.close()


def _debug_safe(val):
    """
    Helper used only for debug‑logging: tries to json‑serialise any value,
    falls back to string() representation otherwise.
    """
    try:
        json.dumps(val)
        return val
    except TypeError:
        return str(val)


def initialize_session(request: Request):
    try:
        if "history" not in request.session:
            request.session["history"] = []
            logger.info("CHAT ▸ SESSION history initialized")
        else:
            logger.info(
                "CHAT ▸ SESSION history reused (len={})",
                len(request.session["history"]),
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al manejar las cookies o la sesión: {str(e)}",
        )


def get_autosuggest_suggestions(
    db: Session,
    query: str,
    country_code: str,
    *,
    limit: int = 20,
    force_reload: bool = False,
) -> list[str]:
    """Return up to `limit` autosuggest questions for the given ISO3 country code."""
    normalized_iso = (country_code or "").strip().upper() or "DOM"
    trimmed_query = (query or "").strip()
    limit = max(1, min(limit, 255))

    _ensure_autosuggest_cache(db, force_reload=force_reload)

    with _SUGGESTIONS_CACHE_LOCK:
        suggestions_pool = list(_SUGGESTIONS_CACHE.get(normalized_iso, []))
        if not suggestions_pool and normalized_iso != "DOM":
            suggestions_pool = list(_SUGGESTIONS_CACHE.get("DOM", []))

    if len(trimmed_query) >= 2:
        pattern = trimmed_query.casefold()
        filtered = [item for item in suggestions_pool if pattern in item.casefold()]
    else:
        filtered = suggestions_pool

    return filtered[:limit]


def _check_hybrid_cache(q: str, country: str):
    """
    Helper para probar SQL y luego Vector según configuración.
    """
    if not q:
        return None

    # Global Kill Switch
    if not settings.cache_enabled:
        return None

    # TIER 0: SQL Exact/Flexible
    if settings.cache_enable_postgres_search:
        info = get_cache_hit_sql(q, country)
        if info and info["is_cache_hit"]:
            logger.info(f"FAST_PATH ▸ CACHE HIT (Tier 0 - SQL) query='{q[:50]}...'")
            return info

    # TIER 1: Vector Search
    if settings.cache_enable_vector_search:
        info = get_cache_hit(q, country)
        if info and info["is_cache_hit"]:
            logger.info(f"FAST_PATH ▸ CACHE HIT (Tier 1 - Vector) query='{q[:50]}...'")
            return info

    return None


def process_chat(
    message: str,
    country_code: str,
    currency_type: str,
    request: Request,
    db: Session,
    translate_client: translate.Client | None,
):
    # ═══════════════════════════════════════════════════════════════════════
    # PHASE G: CONCURRENCY OPTIMIZATION - FAST PATH
    # Check cache BEFORE acquiring the LLM semaphore.
    # ═══════════════════════════════════════════════════════════════════════
    cache_info = _check_hybrid_cache(message, country_code)

    if cache_info and cache_info["is_cache_hit"]:
        logger.info("FAST_PATH ▸ CACHE HIT found! Bypassing LLM semaphore.")
        # We need to construct a response that resembles what the graph would return
        # but completely skipping the semaphore and the graph invocation.
        return _process_chat_fast_hit(
            message,
            country_code,
            currency_type,
            request,
            db,
            translate_client,
            cache_info,
        )

    try:
        with llm_concurrency_slot(
            timeout_seconds=settings.llm_queue_timeout_seconds
        ) as wait_ms:

            request.state.llm_queue_wait_ms = wait_ms
            if wait_ms >= 1000:
                logger.warning(
                    "CHAT ▸ SEMAPHORE acquired after %.0f ms session=%s",
                    wait_ms,
                    request.session.get("id"),
                )
            return _process_chat_impl(
                message, country_code, currency_type, request, db, translate_client
            )
    except LLMQueueTimeout:
        logger.error(
            "CHAT ▸ SEMAPHORE timeout session=%s",
            request.session.get("id"),
        )
        raise HTTPException(
            status_code=503,
            detail="El servicio está atendiendo otras consultas. Intenta nuevamente en unos segundos.",
        )


def _process_chat_fast_hit(
    message: str,
    country_code: str,
    currency_type: str,
    request: Request,
    db: Session,
    translate_client: translate.Client | None,
    cache_info: Dict,
):
    """
    Manejo optimizado para Cache Hits sin tocar el semáforo ni el grafo.
    Replica la estructura de respuesta de _process_chat_impl pero sin steps de LLM.
    """
    start_time = time()
    logger.info("FAST_PATH ▸ Processing cache hit response...")

    # 1. Sesión básica
    initialize_session(request)
    if "count" not in request.session:
        request.session["count"] = 0
    # NOTE: Cache Hits do NOT increment the question counter (Bonus)

    # Calculate limits
    max_questions = settings.session_max_question
    current_count = request.session["count"]
    allowed_questions = max(0, max_questions - current_count)

    # 2. Preparar datos
    cached_sql = cache_info.get("sql_query") or ""
    results = cache_info.get("results") or []
    question = cache_info.get("question") or message

    # 3. Generar Tabla Markdown
    table_markdown = ""
    if results and isinstance(results, list):
        try:
            # Usar format_table_markdown util (requiere lista de dicts con claves normalizadas)
            # Primero normalizamos keys para que se vean bonitas
            normalized_results = []
            for row in results:
                normalized_results.append(
                    {k.replace("_", " ").title(): v for k, v in row.items()}
                )

            # FIX: Pass required currency_code and monetary_properties
            # Using defaults from settings or empty string if not available
            cur_code = currency_type if currency_type else "USD"
            mon_props = getattr(
                settings, "monetary_columns", "monto_total_inversion,monto_aprobado"
            )

            table_markdown = format_table_markdown(
                normalized_results, cur_code, mon_props
            )
        except Exception as e:
            logger.error(f"FAST_PATH ▸ Error generating table: {e}")
            table_markdown = ""

    # 4. Generar Resumen Estático
    # Para cache hits, usamos un resumen estándar amable
    summary_text = (
        f"Encontré {len(results)} registros que coinciden con tu consulta "
        f"sobre : '{question}'."
    )

    # 5. Construir HTML response structure (User + Assistant)
    # FIX: create_user_question_html takes only 1 argument (message)
    user_question_html = create_user_question_html(message)

    # Assistant content needs to handle Markdown properly
    # We combine summary + table + technical details
    content_md = f"{summary_text}\n\n{table_markdown}"
    assistant_content_html = create_assistant_content_html(content_md)

    # 6. Technical Details (Reasoning Simulation)
    elapsed = time() - start_time

    updated_at = cache_info.get("updated_at")
    date_str = "Desconocida"
    if updated_at:
        try:
            if isinstance(updated_at, str):
                dt = pd.to_datetime(updated_at)
                date_str = dt.strftime("%d/%m/%Y")
            elif hasattr(updated_at, "strftime"):
                date_str = updated_at.strftime("%d/%m/%Y")
            else:
                date_str = str(updated_at)
        except Exception:
            date_str = str(updated_at)

    tech_details = [
        {
            "title": "Paso 1: Identificación",
            "items": [
                "Pregunta identificada en Base de Conocimiento.",
                "Similitud semántica: 100% (Cache Hit)",
            ],
        },
        {
            "title": "Paso 2: Estrategia",
            "items": [
                "Reutilizando Query SQL Optimizado.",
                "Omite generación de nueva consulta.",
            ],
        },
        {
            "title": "Ejecución",
            "items": [
                f"Filas devueltas: {len(results)}",
                f"Tiempo de respuesta: {elapsed:.2f}s",
            ],
        },
        {
            "title": "Paso 3: Vigencia",
            "items": [f"Datos verificados al {date_str}.", "Fuente: Memoria Caché."],
        },
        {
            "title": "Uso de Sesión",
            "items": [
                f"Preguntas realizadas: {current_count}",
                f"Preguntas disponibles: {allowed_questions}",
            ],
        },
    ]

    # 7. Persistence & Session Update
    # Mirroring normal flow behavior to enable follow-up questions
    try:
        fecha_actual = datetime.now().strftime("%Y-%m-%d")

        # We use a summary as the non-md content, similar to normal flow
        assistant_content_non_md = summary_text

        question_id = add_question(
            country_code,
            message,  # User question
            cached_sql,
            assistant_content_non_md,
            fecha_actual,
            "IA",
            "",  # Profile string not strictly needed for cache hit logic but could be added if available
            "",
            0,
            0,
            0,
            0,  # IDs for entities/projects not extracted in fast path
            request.session.get("id", None),
            assistant_content_html,
            summary_text,  # Frontend summary
        )

        # FIX: Include country_code and timestamp so prepare_message_history relies on them
        ts = int(time())
        request.session["history"].append(
            {
                "role": "user",
                "content": message,
                "country_code": country_code,
                "timestamp": ts,
            }
        )
        request.session["history"].append(
            {
                "role": "assistant",
                "content": f"ANSWER_IA:{assistant_content_non_md}",
                "country_code": country_code,
                "timestamp": ts,
            }
        )

        # 7.1 Update Session Memory (Context Preservation)
        if "session_memory" not in request.session:
            request.session["session_memory"] = {}

        session_mem = request.session["session_memory"]

        # --- HYDRATION: Extract Dimensions from SQL ---
        # Since we skipped the Analyzer, we need to infer context from the cached SQL
        # so follow-up questions (e.g., "y en santo domingo?") know we are filtering by Sector/Entity.

        extracted_dims = session_mem.get("resolved_dimensions", {})
        extracted_filters = []

        if cached_sql:
            # Simple Regex Parser for common columns
            patterns = [
                (r"nombresector_proyecto\s*=\s*'([^']+)'", "nombresector_proyecto"),
                (
                    r"nombreentidadejecutora_proyecto\s*=\s*'([^']+)'",
                    "nombreentidadejecutora_proyecto",
                ),
                (r"nombre_departamento\s*=\s*'([^']+)'", "nombre_departamento"),
                (r"nombre_municipio\s*=\s*'([^']+)'", "nombre_municipio"),
                (r"pais_iso3\s*=\s*'([^']+)'", "pais_iso3"),
            ]

            for pattern, col_name in patterns:
                matches = re.findall(pattern, cached_sql, re.IGNORECASE)
                for val in matches:
                    # Validate It's not a parameter placeholder
                    if val and not val.startswith("{"):
                        # Add to Dimensions
                        if col_name not in extracted_dims:
                            extracted_dims[col_name] = {
                                "value": val.upper(),
                                "confidence": 1.0,
                                "success_count": 1,
                            }

                        # Add to Filters (for last_success)
                        # We reconstruct a mimicking filter object
                        extracted_filters.append(
                            {
                                "column": (
                                    f"p.{col_name}"
                                    if "proyecto" in col_name
                                    else f"t.{col_name}"
                                ),
                                "operator": "=",
                                "value": val.upper(),
                                "confidence": 1.0,
                            }
                        )

        session_mem["resolved_dimensions"] = extracted_dims

        # Build Result Snapshot (first 5 items)
        result_snapshot = []
        for idx, row in enumerate(results[:5], start=1):
            if isinstance(row, dict):
                # Try to find a name-like field
                row_name = (
                    row.get("nombre_proyecto")
                    or row.get("nombre")
                    or row.get("project_name")
                    or list(row.values())[0]  # Fallback to first value
                )
                result_snapshot.append(
                    {
                        "pos": idx,
                        "id": str(idx),  # No ID in standard cache, use pos
                        "nombre": str(row_name)[:60],
                    }
                )

        session_mem["last_success"] = {
            "filters": extracted_filters,  # Now populated!
            "question": message,
            "rowcount": len(results),
            "result_snapshot": result_snapshot,
        }

        request.session["session_memory"] = session_mem

        logger.info(
            "FAST_PATH ▸ PERSIST\n"
            "   ↳ question_id={}\n"
            "   ↳ session={}\n"
            "   ↳ stored_at={}",
            question_id,
            request.session.get("id"),
            fecha_actual,
        )
    except Exception as e:
        logger.error(f"FAST_PATH ▸ Error persisting question: {e}")

    # 8. Final Response Object
    return {
        "user_question": user_question_html,
        "complete_question": question,
        "response": assistant_content_html,
        "session_count": current_count,  # Return current count (not incremented)
        "allowed_questions": allowed_questions,  # Return remaining quota
        "sql_query": cached_sql,
        "session_id": request.session.get("id"),
        "response_id": int(question_id or 0),
        "is_relevant": "yes",
        "assistant_content_non_md": content_md,
        "technical_details": tech_details,
        "suggested_questions": [],  # Could optionally fetch suggestions from vector store
        "frontend_summary": summary_text,
        "frontend_table_markdown": table_markdown,
        "frontend_base_notes": [
            "Respuesta obtenida desde memoria caché (alta velocidad)."
        ],
    }


def _process_chat_impl(
    message: str,
    country_code: str,
    currency_type: str,
    request: Request,
    db: Session,
    translate_client: translate.Client | None,
):
    """
    Service function to handle chat logic.
    """
    execution_start_time = time()
    logger.info(
        "CHAT ▸ START message='{}' country={} session={}",
        message[:80],
        country_code,
        request.session.get("id"),
    )
    logger.debug("CHAT ▸ SESSION snapshot={}", dict(request.session))

    # Handle session history
    initialize_session(request)
    # ── Ensure we have a persistent session‑id so we can fetch DB history ──
    session_id = request.session.get("id")
    if not session_id:
        import secrets

        session_id = secrets.token_hex(16)  # 32‑char random ID
        request.session["id"] = session_id
        logger.info("CHAT ▸ SESSION new session_id={}", session_id)
    # ── Ensure session counters exist ──────────────────────────────
    if "count" not in request.session:
        request.session["count"] = 0
    if "start_time" not in request.session:
        request.session["start_time"] = int(time())

    language_code = "undetected"
    # 📌 Solo ejecutar detección/traducción si `google_translate_flag` está activado
    if translate_client and settings.google_translate_flag:
        try:
            language_code = detect_language(message)
            logger.info("CHAT ▸ TRANSLATE detected_language={}", language_code)

            if language_code == "undetected":
                message = translate_text(message, "es", translate_client)
                logger.info("CHAT ▸ TRANSLATE message_translated -> '{}'", message[:80])

        except Exception as e:
            logger.error(
                f"Error en la detección de lenguaje o traducción: {str(e)}",
                exc_info=True,
            )

    else:
        logger.info("CHAT ▸ TRANSLATE auto_translation_enabled=False")

    # Handle question count and session timing
    try:
        count = request.session.get("count", 0)
        start_time = request.session.get("start_time", None)
        current_time = int(time())

        if not start_time:
            start_time = current_time

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al manejar el contador de preguntas de la sesión: {str(e)}",
        )

    # Check session limits
    try:
        if count >= settings.session_max_question:
            elapsed_time = current_time - start_time
            if elapsed_time > settings.session_max_time:
                log_session_info(
                    "Estado de la sesión antes de limpiar:", request.session
                )
                logger.info(
                    "CHAT ▸ LIMIT expired wait window -> resetting session session_id={}",
                    request.session.get("id"),
                )
                request.session.clear()
                logger.info(
                    "Se ha excedido el tiempo máximo de espera para volver a preguntar de la sesión. Se han restablecido los valores."
                )
                log_session_info(
                    "Estado de la sesión después de limpiar:", request.session
                )
                logger.info(
                    f"request.session.get('id'): {request.session.get('id', None)}"
                )
            else:
                logger.info(
                    "CHAT ▸ LIMIT max_questions reached session_id={}",
                    request.session.get("id"),
                )
                allowed_remaining = max(0, settings.session_max_question - count)
                return _attach_response_meta(
                    {
                        "response": "Se ha excedido el número máximo de preguntas por sesión y no se ha cumplido con el tiempo para volver a preguntar. Por favor, inicia una nueva sesión si deseas continuar.",
                        "response_cause": None,
                        "response_notice": None,
                        "allowed_questions": allowed_remaining,
                    },
                    cause="session_limit",
                    allowed_questions=allowed_remaining,
                )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al manejar la limpieza de la sesión: {str(e)}",
        )

    # ------------------------------------------------------------------
    #  Build FULL history for the prompt:
    #     • db_hist  → últimos turnos guardados en BD (por session_id)
    #     • cookie   → el par (user,assistant) más reciente
    #     • full_hist= db_hist + cookie  (cortado al límite lógico)
    # ------------------------------------------------------------------
    try:
        cookie_hist = request.session.get("history", [])
        db_hist = build_history_for_prompt(
            db, session_id, limit=settings.session_max_history_length
        )
        full_hist = (db_hist + cookie_hist)[-settings.session_max_history_length :]

        logger.info("CHAT ▸ HISTORY total_turns={}", len(full_hist))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al reconstruir historial: {str(e)}",
        )

    # if language_code is empty, set it to "undetected"
    if not language_code:
        language_code = "Undetected. Default: Spanish."

    if not settings.cache_enabled:
        logger.info("CHAT ▸ CACHE enabled=False")
        cache_info = {
            "is_cache_hit": False,
            "is_recent_cache_hit": False,
            "sql_query": None,
            "results": None,
            "question": None,
        }
    else:
        logger.info("CHAT ▸ CACHE enabled=True")
        cache_info = get_cache_hit(message, country_code)
        logger.debug("CHAT ▸ CACHE snapshot={}", cache_info)

    # OPTIMIZACIÓN: NO cargar dimensions automáticamente.
    # Se cargarán lazy en llm_analyzer solo si is_relevant="yes"
    # Esto evita queries innecesarias en saludos, soporte, definiciones (40% del tráfico)
    # dimension_catalog = get_dimension_catalog(country_code, db)  # ← REMOVIDO

    # Prepare inputs for the graph
    from modules.graph.helpers_estado import (
        _set_rows_limit_default,
        _set_rows_limit_max,
        _set_rows_limit_applied,
        _set_feature_citizen_node,
    )
    from modules.graph.helpers_estado import (
        _init_session_memory,
        _get_session_memory,
    )

    inputs = {
        "messages": prepare_message_history(full_hist, country_code),
        "country_code": country_code,
        "user_question": message,
        "db": db,
        "retry_count": 0,
        "source": "front",
        "original_language_iso": language_code,
        "is_cache_hit": cache_info["is_cache_hit"],
        "is_recent_cache_hit": cache_info["is_recent_cache_hit"],
        "currency_code": currency_type,
        "execution_start_time": execution_start_time,
    }

    # ═══════════════════════════════════════════════════════════════════════
    # SESSION MEMORY PRESERVATION: Restore from previous turn if available
    # ═══════════════════════════════════════════════════════════════════════
    prev_session_memory = request.session.get("session_memory")
    if prev_session_memory and isinstance(prev_session_memory, dict):
        # Initialize lifecycle and inject previous session_memory
        if "lifecycle" not in inputs:
            inputs["lifecycle"] = {}
        inputs["lifecycle"]["session_memory"] = prev_session_memory
        logger.info(
            "\n"
            "╔══════════════════════════════════════════════════════════════════════════╗\n"
            "║  🧠 SESSION MEMORY RESTAURADA (desde cookie HTTP)                        ║\n"
            "╠══════════════════════════════════════════════════════════════════════════╣\n"
            "║  📦 resolved_dimensions: {}\n"
            "║  📦 last_success: {}\n"
            "║  📦 context_terms: {}\n"
            "╚══════════════════════════════════════════════════════════════════════════╝",
            prev_session_memory.get("resolved_dimensions", {}),
            prev_session_memory.get("last_success", {}),
            prev_session_memory.get("context_terms", []),
        )
    else:
        logger.info(
            "\n"
            "╔══════════════════════════════════════════════════════════════════════════╗\n"
            "║  🧠 SESSION MEMORY: (vacía - primer turno de conversación)              ║\n"
            "╚══════════════════════════════════════════════════════════════════════════╝"
        )

    # Detectar si viene de un reintento por filas irrelevantes
    # El flag viene del frontend cuando el usuario hace clic en "reintentar_con_filtros_ajustados"
    from modules.graph.helpers_estado import _set_pending_irrelevant_retry

    pending_retry = getattr(request, "pending_irrelevant_retry", False)
    if pending_retry:
        _set_pending_irrelevant_retry(inputs, True)
        logger.info("CHAT ▸ FLAG pending_irrelevant_retry=True set from frontend")

    # OPTIMIZACIÓN: NO inyectar dimensions aquí.
    # Se cargarán lazy cuando llm_analyzer las necesite (solo si is_relevant="yes")
    # _set_dimensions_catalog(inputs, dimension_catalog)  # ← REMOVIDO

    # Set rendering limits using helpers (dual-write)
    _set_rows_limit_default(inputs, settings.sql_rows_limit)
    _set_rows_limit_max(inputs, settings.sql_rows_limit_max)
    _set_rows_limit_applied(inputs, settings.sql_rows_limit)
    _set_feature_citizen_node(inputs, settings.feature_citizen_node)

    # If cache hit, add the required fields to the inputs
    if cache_info["is_cache_hit"]:
        cached_question = cache_info.get("question") or message
        cached_sql = cache_info.get("sql_query") or ""
        if cached_sql:
            cleaned_sql = cached_sql.strip()
            _set_sql_query(inputs, cleaned_sql, raw=cached_sql)
        inputs["user_question"] = cached_question
        inputs["complete_user_question"] = cached_question
        _set_sql_execution(inputs, cached_results=cache_info.get("results"))

    question_id = 0

    # request.session["history"].append({"role": "user", "content": message, "country_code": country_code})
    # (user/assistant turns will be updated after graph call; keep only latest in cookie)

    try:
        # Adjust recursion limit based on cache status
        if settings.cache_enabled and cache_info["is_cache_hit"]:
            if cache_info["is_recent_cache_hit"]:
                recursion_limit = max(1, settings.graph_recursion_limit - 1)
            else:
                recursion_limit = max(1, settings.graph_recursion_limit - 2)
        else:
            recursion_limit = settings.graph_recursion_limit

        # DEBUG – log a JSON‑serialisable snapshot (truncate to 2 KB)
        inputs_snapshot = {k: _debug_safe(v) for k, v in inputs.items()}
        logger.debug(
            "[graph‑invoke] inputs snapshot ⇩\n{}",
            json.dumps(inputs_snapshot, default=str, indent=2)[:2048],
        )

        # ═══════════════════════════════════════════════════════════════════════
        # SYNCHRONOUS GRAPH INVOCATION: Executing directly in the current thread
        # ═══════════════════════════════════════════════════════════════════════
        response_state = graph.invoke(inputs, {"recursion_limit": recursion_limit})

        # ═══════════════════════════════════════════════════════════════════════
        # SESSION MEMORY PRESERVATION: Save for next turn
        # ═══════════════════════════════════════════════════════════════════════
        try:
            updated_session_memory = _get_session_memory(response_state)
            if updated_session_memory and isinstance(updated_session_memory, dict):
                # Only save if there's meaningful data
                has_data = (
                    updated_session_memory.get("resolved_dimensions")
                    or updated_session_memory.get("last_success")
                    or updated_session_memory.get("context_terms")
                )
                if has_data:
                    request.session["session_memory"] = updated_session_memory
                    logger.info(
                        "\n"
                        "╔══════════════════════════════════════════════════════════════════════════╗\n"
                        "║  💾 SESSION MEMORY GUARDADA (para próximo turno)                        ║\n"
                        "╠══════════════════════════════════════════════════════════════════════════╣\n"
                        "║  📦 resolved_dimensions: {}\n"
                        "║  📦 last_success: {}\n"
                        "║  📦 context_terms: {}\n"
                        "╚══════════════════════════════════════════════════════════════════════════╝",
                        updated_session_memory.get("resolved_dimensions", {}),
                        updated_session_memory.get("last_success", {}),
                        updated_session_memory.get("context_terms", []),
                    )
                else:
                    logger.info(
                        "\n"
                        "╔══════════════════════════════════════════════════════════════════════════╗\n"
                        "║  💾 SESSION MEMORY: (sin datos nuevos para guardar)                     ║\n"
                        "╚══════════════════════════════════════════════════════════════════════════╝"
                    )
        except Exception as sm_err:
            logger.warning(f"CHAT ▸ SESSION_MEMORY save error: {sm_err}")

        # NORMALIZE citizen-related fields to canonical shapes so callers (and the frontend)
        # can safely assume types. This is a minimal, low-risk normalization applied
        # immediately after the graph invocation.
        from modules.graph.helpers_estado import (
            _get_citizen_actions,
            _get_citizen_actions_details,
            _get_citizen_feedback,
            _get_citizen_note,
            _get_frontend_summary,
            _get_frontend_warning_priority,
            _get_assistance_turn,
            _set_citizen_actions,
            _set_citizen_actions_details,
            _set_citizen_feedback,
            _set_frontend_warning_priority,
        )

        try:
            # citizen_actions -> always a list
            _ca = _get_citizen_actions(response_state)
            if _ca is None:
                ca_norm = []
            elif isinstance(_ca, list):
                ca_norm = _ca
            else:
                # single string or single action -> wrap
                ca_norm = [_ca]

            # citizen_actions_details -> always a dict
            _cad = _get_citizen_actions_details(response_state)
            if _cad is None:
                cad_norm = {}
            elif isinstance(_cad, dict):
                cad_norm = _cad
            else:
                try:
                    cad_norm = json.loads(_cad)
                    if not isinstance(cad_norm, dict):
                        cad_norm = {}
                except Exception:
                    cad_norm = {}

            # citizen_feedback -> always a dict (may contain 'summary'/'note' keys)
            _cf = _get_citizen_feedback(response_state)
            if _cf is None:
                cf_norm = {}
            elif isinstance(_cf, dict):
                cf_norm = _cf
            else:
                # try parse JSON string or wrap into { summary: str }
                try:
                    parsed = json.loads(_cf)
                    cf_norm = (
                        parsed if isinstance(parsed, dict) else {"summary": str(_cf)}
                    )
                except Exception:
                    cf_norm = {"summary": str(_cf)}

            # frontend_warning_priority -> string/enum or None
            _fwp = _get_frontend_warning_priority(response_state)
            fwp_norm = None
            if isinstance(_fwp, str):
                fwp_norm = _fwp.strip() or None
            elif _fwp is not None:
                fwp_norm = str(_fwp).strip() or None

            # suggested_user_prompts -> always a list
            _sups = response_state.get("suggested_user_prompts", None)
            if _sups is None:
                sups_norm = []
            elif isinstance(_sups, list):
                sups_norm = _sups
            else:
                sups_norm = [_sups]

            # write back canonical shapes so subsequent code can safely .get()
            try:
                _set_citizen_actions(response_state, ca_norm)
                _set_citizen_actions_details(response_state, cad_norm)
                _set_citizen_feedback(response_state, cf_norm)
                _set_frontend_warning_priority(response_state, fwp_norm)
                response_state["suggested_user_prompts"] = sups_norm
            except Exception:
                # if response_state is an immutable mapping, keep local vars available
                pass

        except Exception:
            logger.debug(
                "CHAT ▸ WARN normalization of citizen fields failed", exc_info=True
            )
        # NORMALIZE and SAFETY GUARD: If any moderation step flagged PII (has_pii),
        # block the response regardless of the graph's recommended action.
        # This avoids cases where the moderation model returns has_pii=True but
        # recommended_action='allow' and an assistant answer would leak PII.
        has_pii_val = response_state.get("has_pii", None)
        if isinstance(has_pii_val, bool):
            has_pii_flag_early = has_pii_val
        else:
            has_pii_flag_early = str(has_pii_val).strip().lower() in {
                "yes",
                "true",
                "1",
            }

        if has_pii_flag_early:
            logger.warning(
                "CHAT ▸ EARLY-MODERATION GUARD triggered: has_pii={}", has_pii_val
            )
            assistant_content = SAFE_RESPONSE
            # Optionally translate assistant content if enabled
            if translate_client and settings.google_translate_flag:
                if language_code == "undetected":
                    language_code = detect_language_google(message, translate_client)
                    assistant_content = translate_markdown(
                        assistant_content, language_code, translate_client
                    )

            assistant_content_html = create_assistant_content_html(assistant_content)
            allowed_questions = max(
                0, settings.session_max_question - request.session.get("count", 0)
            )
            logger.info(
                "CHAT ▸ END type=early_moderation session={} clarification=False rows=0 fallback={}",
                request.session.get("id"),
                False,
            )
            return _attach_response_meta(
                {
                    "user_question": create_user_question_html(message),
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session["count"],
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": None,
                    "is_relevant": response_state.get("is_relevant", None),
                    "is_social_interaction": response_state.get(
                        "is_social_interaction", None
                    ),
                    "is_support_request": response_state.get(
                        "is_support_request", None
                    ),
                    "has_pii": True,
                    "summary": None,
                    "original_language_iso": response_state.get(
                        "original_language_iso", None
                    ),
                    "allowed_questions": allowed_questions,
                    "assistant_content_non_md": None,
                    "clarification": None,
                    "response_type": "moderation_reprompt",
                    "gray_zone_details": _get_gray_zone_details(response_state),
                    "used_fallback": False,
                    "fallback_rows": None,
                    "citizen_feedback": _get_citizen_feedback(response_state),
                    "citizen_actions": _get_citizen_actions(response_state),
                    "citizen_note": _get_citizen_note(response_state),
                    "frontend_warning_priority": _get_frontend_warning_priority(
                        response_state
                    ),
                    "citizen_actions_details": _get_citizen_actions_details(
                        response_state
                    ),
                },
                cause="moderation",
                allowed_questions=allowed_questions,
            )
        logger.info(f"---------- Graph response state: {response_state}")

        response_snapshot = {
            k: _debug_safe(v) for k, v in response_state.items() if k != "messages"
        }  # avoid huge msgs
        logger.debug(
            "[graph‑invoke] response snapshot ⇩\n{}",
            json.dumps(response_snapshot, default=str, indent=2)[:2048],
        )

        # Fallback metadata (si hubo plan B en fetch_data)
        used_fallback = bool(response_state.get("used_fallback", False))
        fallback_rows = response_state.get("fallback_rows", None)
        if used_fallback:
            try:
                logger.info(
                    "⚙️ Fallback activado en fetch_data → {} filas de respaldo",
                    (
                        len(fallback_rows)
                        if hasattr(fallback_rows, "__len__")
                        else "desconocidas"
                    ),
                )
            except Exception:
                logger.info("⚙️ Fallback activado en fetch_data (conteo no disponible)")

        assistant_message = response_state["messages"][-1]
        assistant_content = assistant_message.content
        user_question = response_state["user_question"]

        # ═══════════════════════════════════════════════════════════════
        # Extraer user_assistance (nuevo sistema)
        # ═══════════════════════════════════════════════════════════════
        user_assistance = (
            response_state.get("user_assistance")
            if isinstance(response_state.get("user_assistance"), dict)
            else None
        )
        clarification_payload = None
        if user_assistance and user_assistance.get("needed"):
            clarification_payload = user_assistance.get("payload")

        gray_zone_details = _get_gray_zone_details(response_state)
        graph_response_type = response_state.get("response_type")

        # Construir profile string con flags is_* detectados (función reutilizable)
        def _build_profile_string(state):
            """Construye string de profile con flags is_* separados por coma."""
            parts = []
            if state.get("is_relevant") == "yes":
                parts.append("is_relevant")
            if state.get("is_social_interaction") == "yes":
                parts.append("is_social_interaction")
            if state.get("is_support_request") == "yes":
                parts.append("is_support_request")
            if state.get("is_definitions_lookup") == "yes":
                parts.append("is_definitions_lookup")
            return ",".join(parts) if parts else ""

        # ─────────────────────────────────────────────────────────────
        # Moderation: reprompt / blocked → guardar igual para feedback
        # ─────────────────────────────────────────────────────────────
        if graph_response_type in {"moderation_reprompt", "moderation_blocked"}:
            # Optionally translate assistant content if enabled
            if translate_client and settings.google_translate_flag:
                if language_code == "undetected":
                    language_code = detect_language_google(message, translate_client)
                    assistant_content = translate_markdown(
                        assistant_content, language_code, translate_client
                    )

            assistant_content_html = create_assistant_content_html(assistant_content)

            # Preparar contenido para guardar en DB
            Markdown.output_formats["plain"] = unmark_element
            __md = Markdown(output_format="plain")
            __md.stripTopLevelTags = False
            assistant_content_non_md = unmark(assistant_content, __md)
            assistant_content_non_md = (
                assistant_content_non_md.replace("'", " ")
                .replace('"', " ")
                .replace("\n", " ")
                .replace("\r", " ")
                .replace("\t", " ")
            )

            # Guardar en DB para que el feedback funcione
            fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            profile_string = _build_profile_string(response_state)

            try:
                question_id = add_question(
                    country_code,
                    user_question,
                    "",
                    assistant_content_non_md,
                    fecha_actual,
                    "IA",
                    profile_string,
                    "",
                    0,
                    0,
                    0,
                    0,
                    request.session.get("id", None),
                    assistant_content_html,
                    None,
                )
                logger.info(
                    "CHAT ▸ PERSIST moderation\n"
                    "   ↳ question_id={}\n"
                    "   ↳ session={}\n"
                    "   ↳ profile={}\n"
                    "   ↳ stored_at={}",
                    id,
                    session_id,
                    profile_string,
                    fecha_actual,
                )
            except Exception as add_err:
                logger.error(
                    f"Fallo al registrar pregunta de moderación en add_question: {add_err}"
                )
                question_id = 0

            count = request.session.get("count", 0) + 1
            request.session["count"] = count
            allowed_questions = max(0, settings.session_max_question - count)

            logger.info(
                "CHAT ▸ END type={} session={} clarification=False rows=0 fallback={}",
                graph_response_type,
                session_id,
                used_fallback,
            )

            return _attach_response_meta(
                {
                    "user_question": create_user_question_html(user_question),
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session["count"],
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": question_id,
                    "is_relevant": response_state.get("is_relevant", None),
                    "is_social_interaction": response_state.get(
                        "is_social_interaction", None
                    ),
                    "is_support_request": response_state.get(
                        "is_support_request", None
                    ),
                    "has_pii": response_state.get("has_pii", None),
                    "summary": _get_frontend_summary(response_state),
                    "original_language_iso": response_state.get(
                        "original_language_iso", None
                    ),
                    "allowed_questions": allowed_questions,
                    "assistant_content_non_md": None,
                    "clarification": None,
                    "response_type": graph_response_type,
                    "gray_zone_details": _get_gray_zone_details(response_state),
                    "used_fallback": used_fallback,
                    "fallback_rows": fallback_rows,
                    "user_assistance": _get_user_assistance(response_state),
                    "rendering": response_state.get("rendering", {}),
                },
                cause="moderation",
                allowed_questions=allowed_questions,
            )

        def extract_summary(text: str) -> str:
            """
            1) Quita la tabla Markdown (todo lo que empieza con '|').
            2) Devuelve sólo el párrafo a partir de la línea que contiene 'Resumen:'.
            """
            # 1. Quitar tabla
            no_table = re.split(r"\r?\n(?=\|)", text, maxsplit=1)[0]

            # 2. Buscar la línea que contiene 'Resumen:' (ignora mayúsculas/minúsculas)
            lines = no_table.splitlines()
            for i, line in enumerate(lines):
                # Busca la línea que contiene 'Resumen:'
                if "resumen:" in line.lower():
                    # si la encuentra, limpia la línea
                    # Devuelve todo lo que viene después de esa línea
                    return "\n".join(lines[i + 1 :]).strip()

            # Si no encuentra "Resumen:", devuelve todo el texto limpio
            return no_table.strip()

        # strip markdown table from assistant content
        assistant_content_notable = "ANSWER_IA:" + extract_summary(assistant_content)

        # ⬇️  Mantén la cookie liviana: guarda solo el último par (user,assistant)
        now = int(time())
        request.session["history"] = [
            {
                "role": "user",
                "content": message,
                "country_code": country_code,
                "timestamp": now,
            },
            {
                "role": "assistant",
                "content": assistant_content_notable,
                "country_code": country_code,
                "timestamp": now,
            },
        ]

        # Patching Markdown
        Markdown.output_formats["plain"] = unmark_element
        __md = Markdown(output_format="plain")
        __md.stripTopLevelTags = False

        # remove markdown from original markdown answer to save in db
        assistant_content_non_md = unmark(assistant_content, __md)

        # clean special chars for db insert being safe from break add_question
        assistant_content_non_md = (
            assistant_content_non_md.replace("'", " ")
            .replace('"', " ")
            .replace("\n", " ")
            .replace("\r", " ")
            .replace("\t", " ")
        )

        if clarification_payload:
            if translate_client and settings.google_translate_flag:
                if language_code == "undetected":
                    language_code = detect_language_google(message, translate_client)
                    assistant_content = translate_markdown(
                        assistant_content, language_code, translate_client
                    )

            assistant_content_html = create_assistant_content_html(assistant_content)
            user_question_html = create_user_question_html(user_question)

            request.session["history"] = [
                {
                    "role": "user",
                    "content": message,
                    "country_code": country_code,
                    "timestamp": now,
                },
                {
                    "role": "assistant",
                    "content": assistant_content_notable,
                    "country_code": country_code,
                    "timestamp": now,
                },
            ]

            # Guardar en DB para que el feedback funcione
            fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            profile_string = _build_profile_string(response_state)

            try:
                question_id = add_question(
                    country_code,
                    user_question,
                    _get_sql_query(response_state) or "",
                    assistant_content_non_md,
                    fecha_actual,
                    "IA",
                    profile_string,
                    "",
                    0,
                    0,
                    0,
                    0,
                    request.session.get("id", None),
                    assistant_content_html,
                    _get_frontend_summary(response_state),
                )
                logger.info(
                    "CHAT ▸ PERSIST clarification\n"
                    "   ↳ question_id={}\n"
                    "   ↳ session={}\n"
                    "   ↳ profile={}\n"
                    "   ↳ stored_at={}",
                    id,
                    session_id,
                    profile_string,
                    fecha_actual,
                )
            except Exception as add_err:
                logger.error(
                    f"Fallo al registrar pregunta de clarificación en add_question: {add_err}"
                )
                question_id = 0

            count += 1
            request.session["count"] = count
            allowed_questions = max(0, settings.session_max_question - count)

            logger.info(
                "CHAT ▸ END type=clarification session={} clarification_turn={} options={}",
                session_id,
                _get_assistance_turn(response_state),
                bool(
                    clarification_payload.get("options")
                    if isinstance(clarification_payload, dict)
                    else None
                ),
            )

            rowcount = _get_sql_rowcount(response_state)
            cause = _detect_response_cause(
                graph_response_type=graph_response_type,
                response_state=response_state,
                cache_info=cache_info,
                used_fallback=used_fallback,
                rowcount=rowcount,
                has_pii=bool(response_state.get("has_pii", False)),
            )

            return _attach_response_meta(
                {
                    "user_question": user_question_html,
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session["count"],
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": question_id,
                    "is_relevant": response_state.get("is_relevant", None),
                    "is_social_interaction": response_state.get(
                        "is_social_interaction", None
                    ),
                    "is_support_request": response_state.get(
                        "is_support_request", None
                    ),
                    "has_pii": response_state.get("has_pii", None),
                    "summary": _get_frontend_summary(response_state),
                    "original_language_iso": response_state.get(
                        "original_language_iso", None
                    ),
                    "allowed_questions": allowed_questions,
                    "assistant_content_non_md": assistant_content_non_md,
                    "clarification": None,
                    "response_type": "clarification",
                    "gray_zone_details": _get_gray_zone_details(response_state),
                    "used_fallback": used_fallback,
                    "fallback_rows": fallback_rows,
                    "citizen_feedback": _get_citizen_feedback(response_state),
                    "citizen_actions": _get_citizen_actions(response_state),
                    "citizen_note": _get_citizen_note(response_state),
                    "frontend_warning_priority": _get_frontend_warning_priority(
                        response_state
                    ),
                    "citizen_actions_details": _get_citizen_actions_details(
                        response_state
                    ),
                    "user_assistance": _get_user_assistance(response_state),
                    "rendering": response_state.get("rendering", {}),
                },
                cause=cause,
                allowed_questions=allowed_questions,
            )

        if graph_response_type and str(graph_response_type).startswith("gray_zone"):
            if translate_client and settings.google_translate_flag:
                if language_code == "undetected":
                    language_code = detect_language_google(message, translate_client)
                    assistant_content = translate_markdown(
                        assistant_content, language_code, translate_client
                    )

            assistant_content_html = create_assistant_content_html(assistant_content)
            user_question_html = create_user_question_html(user_question)

            from modules.graph.helpers_estado import _get_gray_zone_reason

            # Guardar en DB para que el feedback funcione
            fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            profile_string = _build_profile_string(response_state)

            try:
                question_id = add_question(
                    country_code,
                    user_question,
                    _get_sql_query(response_state) or "",
                    assistant_content_non_md,
                    fecha_actual,
                    "IA",
                    profile_string,
                    "",
                    0,
                    0,
                    0,
                    0,
                    request.session.get("id", None),
                    assistant_content_html,
                    _get_frontend_summary(response_state),
                )
                logger.info(
                    "CHAT ▸ PERSIST gray_zone\n"
                    "   ↳ question_id={}\n"
                    "   ↳ session={}\n"
                    "   ↳ profile={}\n"
                    "   ↳ stored_at={}",
                    id,
                    session_id,
                    profile_string,
                    fecha_actual,
                )
            except Exception as add_err:
                logger.error(
                    f"Fallo al registrar pregunta de gray_zone en add_question: {add_err}"
                )
                question_id = 0

            count += 1
            request.session["count"] = count
            allowed_questions = max(0, settings.session_max_question - count)

            logger.info(
                "CHAT ▸ END type={} session={} gray_reason={}",
                graph_response_type,
                session_id,
                _get_gray_zone_reason(response_state),
            )

            return _attach_response_meta(
                {
                    "user_question": user_question_html,
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session["count"],
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": question_id,
                    "is_relevant": response_state.get("is_relevant", None),
                    "is_social_interaction": response_state.get(
                        "is_social_interaction", None
                    ),
                    "is_support_request": response_state.get(
                        "is_support_request", None
                    ),
                    "has_pii": response_state.get("has_pii", None),
                    "summary": _get_frontend_summary(response_state),
                    "original_language_iso": response_state.get(
                        "original_language_iso", None
                    ),
                    "allowed_questions": allowed_questions,
                    "assistant_content_non_md": assistant_content_non_md,
                    "response_type": graph_response_type,
                    "gray_zone_details": gray_zone_details,
                    "used_fallback": used_fallback,
                    "fallback_rows": fallback_rows,
                    "citizen_feedback": _get_citizen_feedback(response_state),
                    "citizen_actions": _get_citizen_actions(response_state),
                    "citizen_note": _get_citizen_note(response_state),
                    "frontend_warning_priority": _get_frontend_warning_priority(
                        response_state
                    ),
                    "citizen_actions_details": _get_citizen_actions_details(
                        response_state
                    ),
                    "user_assistance": _get_user_assistance(response_state),
                    "rendering": response_state.get("rendering", {}),
                },
                cause="gray_zone",
                allowed_questions=allowed_questions,
            )

        # translate assistant content only if google_translate_flag is active
        if translate_client and settings.google_translate_flag:
            if language_code == "undetected":
                language_code = detect_language_google(message, translate_client)
                # translate assistant content
                assistant_content = translate_markdown(
                    assistant_content, language_code, translate_client
                )

        # create assistant_content_html to show in front-end response
        assistant_content_html = create_assistant_content_html(assistant_content)

        # user question html to show in front-end response
        user_question_html = create_user_question_html(user_question)

        # user complete question html to show in front-end response
        user_complete_question_html = create_user_complete_question_html(
            response_state.get("complete_user_question", None)
        )

        # Guardar TODAS las preguntas para que el feedback funcione
        fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        profile_string = _build_profile_string(response_state)

        logger.info(
            "CHAT ▸ FLAGS\n"
            "   ↳ is_relevant={}\n"
            "   ↳ is_social_interaction={}\n"
            "   ↳ is_support_request={}\n"
            "   ↳ is_definitions_lookup={}\n"
            "   ↳ profile={}",
            response_state.get("is_relevant"),
            response_state.get("is_social_interaction"),
            response_state.get("is_support_request"),
            response_state.get("is_definitions_lookup"),
            profile_string,
        )

        try:
            question_id = add_question(
                country_code,
                user_question,
                _get_sql_query(response_state) or "",
                assistant_content_non_md,
                fecha_actual,
                "IA",
                profile_string,
                "",
                0,
                0,
                0,
                0,
                request.session.get("id", None),
                assistant_content_html,
                _get_frontend_summary(response_state),
            )
            logger.info(
                "CHAT ▸ PERSIST\n"
                "   ↳ question_id={}\n"
                "   ↳ session={}\n"
                "   ↳ profile={}\n"
                "   ↳ stored_at={}",
                question_id,
                session_id,
                profile_string,
                fecha_actual,
            )
        except Exception as add_err:
            logger.error(f"Fallo al registrar la pregunta en add_question: {add_err}")
            question_id = 0

        count += 1
        request.session["count"] = count
        allowed_questions = max(0, settings.session_max_question - count)

        # ═══════════════════════════════════════════════════════════════
        # Extract non-blocking suggestions (nuevo sistema)
        # ═══════════════════════════════════════════════════════════════
        suggestions = None
        user_assistance = response_state.get("user_assistance")
        if user_assistance and isinstance(user_assistance, dict):
            metadata = user_assistance.get("metadata", {})
            if metadata.get("suggestions_available"):
                suggestions = {
                    "type": "non_blocking",
                    "prompts": metadata.get("suggested_prompts", []),
                    "issues": metadata.get("non_blocking_issues", []),
                    "message": "Continué con la consulta, pero tengo algunas sugerencias para mejorar la precisión.",
                }
                logger.info(
                    "[SUGGESTIONS] Non-blocking suggestions available: prompts={}",
                    len(suggestions.get("prompts", [])),
                )

        rowcount = _get_sql_rowcount(response_state)
        cause = _detect_response_cause(
            graph_response_type=graph_response_type,
            response_state=response_state,
            cache_info=cache_info,
            used_fallback=used_fallback,
            rowcount=rowcount,
            has_pii=bool(response_state.get("has_pii", False)),
        )

        logger.info(
            "CHAT ▸ END type={} session={} cache_hit_recent={} rows={} fallback={} suggestions={}",
            graph_response_type or "answer",
            session_id,
            cache_info.get("is_recent_cache_hit", False),
            rowcount,
            used_fallback,
            bool(suggestions),
        )

        # OPTIMIZACIÓN: Filtrar dimensions del response según necesidad del frontend
        # Solo incluir dimensions cuando el caso lo requiera:
        # - gray_zone: necesita mostrar dimensiones disponibles
        # - no_data: necesita sugerencias de dimensions
        # - answer con datos: puede necesitar para sugerencias ciudadanas
        # - NO incluir en: saludos, soporte, definiciones (no se usan)
        rendering_payload = response_state.get("rendering", {}) or {}
        dimensions_payload = None

        # Casos donde SÍ incluir dimensions catalog completo
        needs_dimensions = (
            str(graph_response_type or "").startswith("gray_zone")
            or response_state.get("no_data")  # Query SQL sin resultados
            or (
                str(response_state.get("is_relevant", "no")).lower() == "yes"
                and _get_sql_rowcount(response_state) > 0  # Query SQL con resultados
            )
        )

        if needs_dimensions:
            dimensions_payload = response_state.get("dimensions", {})
            logger.debug("DIMENSIONS included in response (needed for frontend)")
        else:
            logger.debug("DIMENSIONS excluded from response (not needed)")

        return _attach_response_meta(
            {
                "user_question": user_question_html,
                "complete_question": user_complete_question_html,
                "response": assistant_content_html,
                "session_count": request.session["count"],
                "sql_query": _get_sql_query(response_state),
                "session_id": request.session.get("id", None),
                "response_id": convert_floats_to_int(question_id),
                "is_relevant": response_state.get("is_relevant", None),
                "is_social_interaction": response_state.get(
                    "is_social_interaction", None
                ),
                "is_support_request": response_state.get("is_support_request", None),
                "has_pii": response_state.get("has_pii", None),
                "summary": _get_frontend_summary(response_state),
                "original_language_iso": response_state.get(
                    "original_language_iso", None
                ),
                "allowed_questions": allowed_questions,
                "assistant_content_non_md": assistant_content_non_md,
                "gray_zone_details": _get_gray_zone_details(response_state),
                "response_type": graph_response_type,
                "used_fallback": used_fallback,
                "fallback_rows": fallback_rows,
                "citizen_feedback": _get_citizen_feedback(response_state),
                "citizen_actions": _get_citizen_actions(response_state),
                "citizen_note": _get_citizen_note(response_state),
                "frontend_warning_priority": _get_frontend_warning_priority(
                    response_state
                ),
                "citizen_actions_details": _get_citizen_actions_details(response_state),
                "suggestions": suggestions,  # ← NUEVO: sugerencias opcionales no-bloqueantes
                "user_assistance": _get_user_assistance(response_state),
                "rendering": rendering_payload,  # ← OPTIMIZADO: solo rendering necesario
                "no_data": response_state.get("no_data"),
                "dimensions": dimensions_payload,  # ← CONDICIONAL: solo si needs_dimensions=True
            },
            cause=cause,
            allowed_questions=allowed_questions,
        )

    except GraphRecursionError:
        logger.warning("CHAT ▸ GRAPH recursion_limit_reached", exc_info=True)
        raise HTTPException(
            status_code=422,
            detail={
                "code": "graph_recursion_limit",
                "message": (
                    "Necesito una versión más concreta de la pregunta para avanzar. Por favor, divídala en una sola idea o especifique el indicador que desea consultar."
                ),
                "hints": [
                    "Mantenga un solo objetivo por consulta.",
                    "Aclarar país, entidad o período ayuda a reducir pasos.",
                ],
            },
        )
    except RateLimitExhausted as rle:
        # Specific handler for rate limit exhaustion - no exception logging, just warning
        logger.warning("CHAT ▸ RATE_LIMIT_EXHAUSTED friendly fallback triggered")
        allowed_questions = max(
            0, settings.session_max_question - request.session.get("count", 0)
        )
        error_detail = (
            "<div id='respuesta_texto' class='respuesta-text'>"
            f"{rle.user_message}"
            "</div>"
        )
        raise HTTPException(
            status_code=503,  # Service Unavailable - more appropriate than 500
            detail=error_detail,
        )
    except Exception as e:
        error_text = str(e)
        if (
            "content_filter" in error_text
            or "ResponsibleAIPolicyViolation" in error_text
        ):
            logger.warning("Content filter triggered during processing: {}", error_text)
            allowed_questions = max(
                0, settings.session_max_question - request.session.get("count", 0)
            )
            assistant_content = SAFE_RESPONSE
            assistant_content_html = create_assistant_content_html(assistant_content)
            return _attach_response_meta(
                {
                    "user_question": create_user_question_html(message),
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session.get("count", 0),
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": None,
                    "is_relevant": "no",
                    "is_social_interaction": "no",
                    "is_support_request": "no",
                    "has_pii": True,
                    "summary": None,
                    "original_language_iso": "undetected",
                    "allowed_questions": allowed_questions,
                    "assistant_content_non_md": None,
                    "clarification": None,
                    "response_type": "moderation_blocked",
                    "gray_zone_details": None,
                    "used_fallback": False,
                    "fallback_rows": None,
                    "citizen_feedback": None,
                    "citizen_actions": None,
                    "citizen_note": None,
                    "frontend_warning_priority": None,
                    "citizen_actions_details": None,
                },
                cause="moderation",
                allowed_questions=allowed_questions,
            )
        logger.exception(
            "Error inesperado al procesar la solicitud del grafo CS:", exc_info=e
        )
        # Detectar tipo de error para mensaje más específico
        error_str = str(e).lower()
        if "timeout" in error_str or "timed out" in error_str:
            error_detail = (
                "<div id='respuesta_texto' class='respuesta-text'>"
                "La consulta tardó  en procesarse. Esto puede ocurrir con búsquedas muy amplias."
                "Por favor, intente con criterios más específicos (sector, territorio, año) o reformule su pregunta."
                "Si el problema persiste, avísenos por el botón de soporte en el link de Ayuda. Muchas gracias."
                "</div>"
            )
        elif "rate limit" in error_str or "429" in error_str:
            error_detail = (
                "<div id='respuesta_texto' class='respuesta-text'>"
                "Hubo un problema. Por favor, espere unos segundos e intente nuevamente con criterios más específicos."
                "Si el problema persiste, avísenos por el botón de soporte en el link de Ayuda. Muchas gracias."
                "</div>"
            )
        elif "connection" in error_str or "network" in error_str:
            error_detail = (
                "<div id='respuesta_texto' class='respuesta-text'>"
                "Hubo un problema. Por favor, intente nuevamente en unos segundos con criterios más específicos."
                "Si el problema persiste, avísenos por el botón de soporte en el link de Ayuda. Muchas gracias."
                "</div>"
            )
        else:
            error_detail = (
                "<div id='respuesta_texto' class='respuesta-text'>"
                "Tuvimos un problema para procesar su consulta. Por favor, intente nuevamente en unos minutos. "
                "Si el problema persiste, avísenos por el botón de soporte en el link de Ayuda. Muchas gracias."
                "</div>"
            )
        raise HTTPException(
            status_code=500,
            detail=error_detail,
        )
