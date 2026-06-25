# chat.py

import json
from time import time
from datetime import datetime, date

from fastapi import APIRouter, HTTPException, Request, Depends, BackgroundTasks, Query
from fastapi.responses import PlainTextResponse, JSONResponse, Response

from langgraph.errors import GraphRecursionError

from fastapi.encoders import jsonable_encoder
from decimal import Decimal
from collections import OrderedDict  # sólo para ordenar si quieres


from sqlalchemy.orm import Session
from database.dependencies import get_postgres_db
from middleware.security import verify_public_client

from modules.config import settings
from modules.utils.db_utils import add_question
from modules.whatsapp.process_whatsapp_message import process_whatsapp_message
from modules.utils.utils import (
    verify_signature_decorator,
    log_session_info,
    convert_floats_to_int,
    prepare_message_history,
)
from modules.graph.graph import graph
from modules.models import AnswerRequest, AnswerSave, ChatRequest

from modules.services.chat_service import (
    process_chat,
    get_autosuggest_suggestions,
)

# Llamado a session manager //poner ahi el manejo de session
from modules.utils.session_manager import session_manager

# router = APIRouter(prefix="/api", dependencies=[Depends(verify_public_client)])
_api_dependencies = (
    [Depends(verify_public_client)] if settings.require_frontend_api_key else []
)
router = APIRouter(prefix="/api", dependencies=_api_dependencies)
from datetime import datetime

from modules.utils.cache_utils import get_question_ia_by_id, update_approved
from fastapi import Body
from modules.utils.db_utils import add_custom_feedback
from modules.models import CustomFeedbackRequest

from loguru import logger

from google.cloud import translate_v2 as translate

import os
from sqlalchemy import text
from pathlib import Path

from modules.utils.cache_utils import get_cache_hit
from modules.graph.helpers_estado import (
    _set_sql_query,
    _set_sql_execution,
    _get_sql_query,
)
from modules.rate_limit import limiter

# Ayuda contextual por país
from constants.nodes import (
    HELP_TEXT_HND,
    HELP_TEXT_PAN,
    HELP_TEXT_PRY,
    HELP_TEXT_DOM,
    HELP_TEXT_DEFAULT,
)

from modules.utils.html_utils import (
    create_user_question_html,
    create_assistant_content_html,
)

from modules.utils.html_utils import build_stats_dashboard_html

# Mapeo ISO3 → texto de ayuda
HELP_TEXTS_BY_COUNTRY = {
    "hnd": HELP_TEXT_HND,
    "pan": HELP_TEXT_PAN,
    "pry": HELP_TEXT_PRY,
    "dom": HELP_TEXT_DOM,
}


# Cache in-memory for schema summary markdown to avoid repeated disk I/O
SCHEMA_SUMMARY_CACHE: str | None = None


def _load_schema_summary() -> str:
    """Load schema_summary.md into memory (cached). Returns a markdown string.

    This function is tolerant: if the file is missing it returns a friendly placeholder.
    """
    global SCHEMA_SUMMARY_CACHE
    if SCHEMA_SUMMARY_CACHE is not None:
        return SCHEMA_SUMMARY_CACHE

    try:
        schema_path = (
            Path(__file__).resolve().parents[1] / "database" / "schema_summary.md"
        )
        if schema_path.exists():
            with schema_path.open(encoding="utf-8") as f:
                SCHEMA_SUMMARY_CACHE = f.read()
        else:
            SCHEMA_SUMMARY_CACHE = (
                "No hay un resumen de esquema disponible en este momento."
            )
    except Exception as exc:
        logger.error(f"Failed to load schema_summary.md: {exc}")
        SCHEMA_SUMMARY_CACHE = (
            "No hay un resumen de esquema disponible en este momento."
        )

    return SCHEMA_SUMMARY_CACHE


@router.get("/suggestions")
@limiter.limit(settings.rate_limit_chat)
def autosuggest_handler(
    request: Request,
    q: str = Query("", alias="q"),
    country: str = Query("dom", alias="country"),
    limit: int = Query(10, ge=1, le=100),
    refresh: bool = Query(False, alias="refresh"),
    db: Session = Depends(get_postgres_db),
):
    suggestions = get_autosuggest_suggestions(
        db=db,
        query=q,
        country_code=country,
        limit=limit,
        force_reload=refresh,
    )
    return {"suggestions": suggestions}


# Dependency to create and manage the Google Translate client
# Google manifest.json file required
def get_translate_client():
    credentials_path = settings.absolute_google_credentials_path
    logger.info(f"Setting GOOGLE_APPLICATION_CREDENTIALS to {credentials_path}")

    if not os.path.isfile(credentials_path):
        logger.error(f"Service account file not found at: {credentials_path}")
        raise FileNotFoundError(
            f"Service account file not found at: {credentials_path}"
        )

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
    return translate.Client()


@router.post("/approveAnswer")
@limiter.limit(settings.rate_limit_approve)
async def approveAnswer(request: Request, answer_request: AnswerRequest):
    """
    Función para aprobar una respuesta. Devuelve una respuesta en formato JSON.
    """
    # Obtener el session_id de la cookie
    # session_id = session_manager.get_session_id(request)

    # request.session.get("id", None),
    session_id = request.session.get("id", None)
    logger.info(
        "APPROVE_ANSWER ▸ session=%s payload=%s", session_id, answer_request.dict()
    )

    answerId = answer_request.answerId
    isApproved = answer_request.isApproved
    approved = 1 if isApproved == True else 0
    commentDisApproved = answer_request.commentDisApproved
    try:
        # Llamar a la función para obtener la pregunta de IA por ID
        question_db = get_question_ia_by_id(answerId, session_id)
        if question_db is not None and len(question_db) > 0:
            id = int(question_db[0]["id"])
            totalLikes = int(question_db[0]["totallikes"])
            # feedback update
            logger.info(
                "APPROVE_ANSWER ▸ updating question_id=%s totalLikes=%s approved=%s",
                id,
                totalLikes,
                approved,
            )
            update_result = update_approved(
                id, totalLikes, approved, commentDisApproved, False
            )
            logger.info(
                "APPROVE_ANSWER ▸ update_result=%s question_id=%s session=%s",
                update_result,
                id,
                session_id,
            )
            return True
        return None
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sendCustomFeedback")
@limiter.limit(settings.rate_limit_feedback)
async def sendCustomFeedback(
    request: Request, payload: CustomFeedbackRequest = Body(...)
):
    """
    Endpoint que recibe feedback personalizado desde el frontend.
    Espera JSON con keys: answerId, feedbackText, userQuestion, userEmail
    Persiste el feedback en la tabla `user_feedback` usando add_custom_feedback.
    """
    try:
        session_id = request.session.get("id", None)

        # payload already validated by Pydantic
        answer_id = payload.answerId
        feedback_text = payload.feedbackText
        user_question = payload.userQuestion
        user_email = payload.userEmail

        logger.info(
            "SEND_CUSTOM_FEEDBACK ▸ session=%s payload=%s",
            session_id,
            payload.dict(),
        )

        inserted_id = add_custom_feedback(
            answer_id, user_email, user_question, feedback_text, session_id
        )

        # If the insert returned falsy (no id) it likely conflicted with the
        # UNIQUE constraint (answer_id, session_id). Return 409 so the frontend
        # can inform the user and disable further attempts.
        if not inserted_id:
            logger.warning(
                "SEND_CUSTOM_FEEDBACK ▸ duplicate feedback answer_id=%s session=%s",
                answer_id,
                session_id,
            )
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "detail": "Feedback ya registrado para esta respuesta en esta sesión.",
                },
            )

        logger.info(
            "SEND_CUSTOM_FEEDBACK ▸ stored id=%s answer_id=%s session=%s",
            inserted_id,
            answer_id,
            session_id,
        )

        return JSONResponse(content={"success": True, "id": inserted_id})
    except Exception as e:
        logger.error(f"Error en /sendCustomFeedback: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/sendFeedbackEmail")
async def sendFeedbackEmail(
    request: Request, payload: CustomFeedbackRequest = Body(...)
):
    """
    Alias/compat endpoint used by the front-end when email API mode is enabled.
    Persists the feedback in DB (same as /sendCustomFeedback).
    """
    try:
        session_id = request.session.get("id", None)

        # payload validated by Pydantic
        answer_id = payload.answerId
        feedback_text = payload.feedbackText
        user_question = payload.userQuestion
        user_email = payload.userEmail

        inserted_id = add_custom_feedback(
            answer_id, user_email, user_question, feedback_text, session_id
        )

        # If conflict, inform the frontend so it can avoid retrying
        if not inserted_id:
            logger.warning(
                "SEND_FEEDBACK_EMAIL ▸ duplicate feedback answer_id=%s session=%s",
                answer_id,
                session_id,
            )
            return JSONResponse(
                status_code=409,
                content={
                    "success": False,
                    "detail": "Feedback ya registrado para esta respuesta en esta sesión.",
                },
            )

        # NOTE: sending the actual email is out of scope here. Frontend may
        # also open a mailto link. This endpoint focuses on persistence.
        logger.info(
            "SEND_FEEDBACK_EMAIL ▸ stored id=%s answer_id=%s session=%s",
            inserted_id,
            answer_id,
            session_id,
        )
        return JSONResponse(content={"success": True, "id": inserted_id})
    except Exception as e:
        logger.error(f"Error en /sendFeedbackEmail: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def get_optional_translate_client():
    """
    Dependency to create and manage the Google Translate client.
    Uses google_translate_flag to determine if the client should be created.
    .env: GOOGLE_TRANSLATE_FLAG (bool)
    """
    if settings.google_translate_flag:
        return translate.Client()
    return None


@router.post("/chat/reset-session")
async def reset_chat_session(request: Request):
    """
    Permite al frontend iniciar una conversación nueva limpiando la sesión actual
    (historial, contador, filtros) y generando un nuevo session_id.
    """
    try:
        previous_session = request.session.get("id")
        log_session_info("Estado de la sesión antes de reiniciar:", request.session)
        request.session.clear()
        logger.info(
            "✅ Sesión anterior limpiada correctamente (session_id={})",
            previous_session,
        )
    except Exception as exc:
        logger.error("💥 Error limpiando la sesión antes de reiniciar: {}", exc)
        raise HTTPException(
            status_code=500,
            detail={
                "code": "reset_session_failed",
                "message": "No pude iniciar una conversación nueva. Intenta nuevamente.",
            },
        ) from exc

    new_session_id = session_manager.create_session(request)
    log_session_info("Estado de la sesión luego de reiniciar:", request.session)
    return {
        "message": "Sesión reiniciada correctamente.",
        "session_id": new_session_id,
    }
    return None


# add description to router so that it can be displayed in the docs fastapi /docs:
@router.post("/chat")
@limiter.limit(settings.rate_limit_chat)
def chat(
    payload: ChatRequest,
    request: Request,
    db: Session = Depends(get_postgres_db),
    translate_client: translate.Client = Depends(get_optional_translate_client),
):
    """
    Endpoint para el chatbot front web.
    params:
    - message: str: mensaje del usuario
    - country_code: str: código de país del usuario
    """
    logger.info("\n\n\n ---------------> START API CHAT <--------------- \n\n\n")
    logger.info(f"request.session: {request.session}")

    message = (payload.message or "").strip()
    country_code = (payload.country_code or "").strip().lower()
    currency_type = payload.currency_type
    decimal_separator = payload.decimal_separator

    # ── Quick guard: country not provided ─────────────────────────
    if not message:
        logger.info("Message is missing or empty.")
        return JSONResponse(
            status_code=400,
            content={
                "detail": {
                    "code": "empty_message",
                    "message": "Escribí una pregunta antes de enviarla.",
                }
            },
        )

    if not country_code:
        logger.info("Country code is missing or empty.")
        return JSONResponse(
            status_code=400,
            content={
                "detail": {
                    "code": "missing_country",
                    "message": "Por favor, seleccione un país antes de hacer su pregunta.",
                }
            },
        )

    # logger currency_code and decimal_separator
    logger.info(f"currency_type: {currency_type}")
    logger.info(f"decimal_separator: {decimal_separator}")

    message_lower = message.lower()
    logger.info(f"message: {message_lower}")

    # --- CORTE RÁPIDO DE AYUDA ------------------------------------
    if message_lower == "ayuda":
        logger.info("User requested help")

        # Texto de ayuda según país (fallback genérico)
        help_text = HELP_TEXTS_BY_COUNTRY.get(country_code.lower(), HELP_TEXT_DEFAULT)

        user_question_html = create_user_question_html("Ayuda")
        assistant_content_html = create_assistant_content_html(help_text)

        return JSONResponse(
            content={
                "user_question": user_question_html,
                "complete_question": None,
                "response": assistant_content_html,
                "session_count": request.session.get("count", 0),
                "sql_query": None,
                "session_id": request.session.get("id", None),
                "response_id": None,
                "is_relevant": "no",
                "is_social_interaction": "no",
                "allowed_questions": settings.session_max_question,
                "assistant_content_non_md": help_text,
            }
        )
    # --------------------------------------------------------------

    # --- CORTE RÁPIDO: "Qué cosas puedo consultar?" ----------------
    normalized_msg = message_lower.strip()
    if normalized_msg in (
        "que cosas puedo consultar",
        "qué cosas puedo consultar",
        "que puedo consultar",
        "qué puedo consultar",
        "que datos puedo consultar",
        "qué datos puedo consultar",
    ):
        # Read prebuilt schema summary (markdown) and return as assistant content
        try:
            summary_md = _load_schema_summary()

            user_question_html = create_user_question_html("Qué cosas puedo consultar?")
            assistant_content_html = create_assistant_content_html(summary_md)

            return JSONResponse(
                content={
                    "user_question": user_question_html,
                    "complete_question": None,
                    "response": assistant_content_html,
                    "session_count": request.session.get("count", 0),
                    "sql_query": None,
                    "session_id": request.session.get("id", None),
                    "response_id": None,
                    "is_relevant": "no",
                    "is_social_interaction": "no",
                    "allowed_questions": settings.session_max_question,
                    "assistant_content_non_md": summary_md,
                }
            )
        except Exception as e:
            logger.error(f"Error al leer schema_summary.md: {e}")
            raise HTTPException(status_code=500, detail=str(e))
    # --------------------------------------------------------------
    # --------------------------------------------------------------

    # --- CORTE RÁPIDO DE ESTADÍSTICAS -----------------------------

    # ………………………………………………………………………………………………………
    if message_lower in ("ver estadísticas", "ver estadisticas"):

        user_question_html = create_user_question_html(message)

        stat_row = (
            db.execute(
                text(
                    """                     -- ← misma consulta
            SELECT
                total_projects,
                total_monto_proyectos_mm,
                promedio_monto_proyectos_mm,
                plazo_medio_anios,
                promedio_avance_financiero,
                pct_proyectos_avance_gt80,
                pct_proyectos_avance_lt20,

                /* Sectores */
                top_3_sectores_mayor_inversion,
                top_3_sectores_menor_inversion,

                /* Territorios */
                top_3_territorios_mayor_inversion,
                top_3_territorios_menor_inversion,

                /* Organismos financiadores */
                top_3_organismos_financiadores_mayor_monto,
                top_3_organismos_financiadores_menor_monto,

                /* Entidades ejecutoras */
                top_3_entidades_ejecutoras_mayor_monto,
                top_3_entidades_ejecutoras_menor_monto,

                /* Distribución por estado */
                porcentaje_por_estado
            FROM mv_country_stats
            WHERE country_iso3 = :cc
        """
                ),
                {"cc": country_code},
            )
            .mappings()
            .first()
        )

        # --------------------  NORMALIZACIÓN  --------------------
        if not stat_row:  # país sin datos
            return JSONResponse(
                status_code=404,
                content={"detail": "No hay estadísticas para este país"},
            )

        # 1️⃣ conviértelo a dict “normal”
        stats_dict = dict(stat_row)

        # 2️⃣ Post‑procesar columnas JSON que vienen como str → list/dict
        json_cols = [
            c
            for c in stats_dict.keys()
            if c.startswith("top_") or c == "porcentaje_por_estado"
        ]
        for col in json_cols:
            if isinstance(stats_dict[col], str):
                try:
                    stats_dict[col] = json.loads(stats_dict[col])
                except Exception:
                    # si no es un JSON válido lo dejamos como está
                    pass

        # 3️⃣ porcentaje_por_estado → list[{estado,pct}] (tolerante a dict o list)
        estado_pct_raw = stats_dict.pop("porcentaje_por_estado", {}) or {}
        if isinstance(estado_pct_raw, dict):
            stats_dict["estado_pct"] = [
                {"estado": k, "pct": v} for k, v in estado_pct_raw.items()
            ]
        elif isinstance(estado_pct_raw, list):
            # ya viene en el formato esperado
            stats_dict["estado_pct"] = estado_pct_raw
        else:
            stats_dict["estado_pct"] = []

        # 4️⃣ asegura serialización (Decimal → float, etc.)
        stats_json = jsonable_encoder(stats_dict)

        # --------------------  RESPUESTA  --------------------
        return JSONResponse(
            content={
                "user_question": user_question_html,  # por si sigues mostrando la pregunta
                "stats": stats_json,  # ⬅ D3 consumirá esto
                "session_count": request.session.get("count", 0),
                "session_id": request.session.get("id"),
            }
        )

    # --------------------------------------------------------------

    start_time = time()
    try:
        # Pasar el flag pending_irrelevant_retry al request para que process_chat lo detecte
        pending_irrelevant_retry = getattr(payload, "pending_irrelevant_retry", False)
        if pending_irrelevant_retry:
            request.pending_irrelevant_retry = True
            logger.info(
                "CHAT ▸ ROUTE pending_irrelevant_retry=True received from frontend"
            )

        response_data = process_chat(
            message, country_code, currency_type, request, db, translate_client
        )

        # Calculates total duration
        total_duration = time() - start_time
        logger.info(f"CHAT ▸ TOTAL DURATION: {total_duration:.2f}s")

        if isinstance(response_data, dict):
            # Update the "Ejecución" section with the total route duration
            # This ensures the time displayed matches the user's perceived wait time (approx 0.64s)
            # and effectively overwrites the internal service-only time (0.01s).
            tech_details = response_data.get("technical_details")
            sections = []

            if isinstance(tech_details, list):
                sections = tech_details
            elif isinstance(tech_details, dict):
                sections = tech_details.get("sections", [])

            for section in sections:
                if isinstance(section, dict) and section.get("title") == "Ejecución":
                    items = section.get("items", [])
                    # Remove existing time entry if any
                    new_items = [
                        i
                        for i in items
                        if not str(i).startswith("Tiempo de respuesta:")
                    ]
                    # Add total duration
                    new_items.append(f"Tiempo de respuesta: {total_duration:.2f}s")
                    section["items"] = new_items
                    break

        return JSONResponse(content=response_data)
    except HTTPException as http_exc:
        # Re-raise HTTP exceptions to be handled by FastAPI
        logger.info(f"HTTPException: {http_exc}")
        raise http_exc
    except Exception as e:
        # Handle unexpected exceptions
        logger.error(f"Unhandled exception in chat route: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Ocurrió un error inesperado en el servidor. Reintente en unos minutos.",
        )


@router.post("/saveAnswer")
@limiter.limit(settings.rate_limit_feedback)
async def saveAnswer(request: Request, answer_save: AnswerSave):
    """
    Función para guardar la respuesta del chatbot a una pregunta generada por el ciudadano.
    Devuelve True si fue correcto y False si no se pudo guardar correctamente la pregunta en la base de datos
    """
    country_code = answer_save.country_code
    user_question = answer_save.user_question
    sql_query = answer_save.sql_query
    assistant_content = answer_save.assistant_content_non_md
    summary = answer_save.summary
    try:
        # Llamar a la función para obtener la pregunta de IA por ID
        try:
            id = add_question(
                country_code,
                user_question,
                sql_query,
                assistant_content,
                datetime.now().strftime("%Y-%m-%d"),
                "IA",
                "",
                "",
                0,
                0,
                0,
                0,
                request.session.get("id", None),
                "",
                summary,
            )
            logger.info(f"id: {id}")
        except Exception as add_err:
            logger.error(f"Fallo al guardar respuesta en add_question: {add_err}")
            id = 0
        if id is not None:
            return True
        return False
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/whatsapp-webhook/", status_code=200)
@verify_signature_decorator
async def receive_whatsapp_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    request_body: bytes = None,
):
    """
    Endpoint to receive WhatsApp webhook data. The webhook data is processed in the background.
    """
    try:
        data = json.loads(request_body)
        changes = data["entry"][0]["changes"][0]["value"]

        # Verificar si los datos contienen contactos y mensajes
        if "contacts" not in changes or "messages" not in changes:
            return JSONResponse(
                content={
                    "status": "skipped",
                    "message": "No contacts or messages found",
                },
                status_code=202,
            )

        sender_id = changes["contacts"][0]["wa_id"]
        message_data = changes["messages"][0]
        message_id = message_data["id"]
        background_tasks.add_task(
            process_whatsapp_message,
            message_data,
            message_id,
            sender_id,
        )

        return JSONResponse(
            content={"status": "received", "message": "Flow processed in background"}
        )

    except KeyError as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error de clave faltante en el JSON recibido: {str(e)}",
        )
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=400, detail=f"Error al decodificar el JSON: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar la solicitud de webhook: {str(e)}",
        )


# Endpoint to verify the webhook with Facebook
@router.get("/whatsapp-webhook/", response_class=PlainTextResponse)
async def verify_token(
    hub_mode: str = Query(..., alias="hub.mode"),
    hub_challenge: str = Query(..., alias="hub.challenge"),
    hub_verify_token: str = Query(..., alias="hub.verify_token"),
):
    """
    Endpoint to verify the webhook with Facebook. The endpoint returns the challenge if the verification token matches.
    """
    if (
        hub_mode == "subscribe"
        and hub_verify_token == settings.facebook_webhook_verify_token
    ):
        return hub_challenge
    else:
        raise HTTPException(status_code=403, detail="Invalid verification token")


@router.get("/validate-max-questions")
async def validate_max_question(request: Request, gethistory: bool):
    """
    Endpoint para verificar desde el front si ha llegado al limite de las preguntas en un tiempo determinado.
    Se aprovechan las funciones existentes en session_manager.
    """
    logger.info(
        "\n\n\n ---------------> START VALIDATE MAX QUESTION <--------------- \n\n\n"
    )

    session_id = session_manager.get_session_id(request)
    # Imprimir el estado de la sesión antes de cualquier cambio
    logger.info(f"Sesion actual:\n{session_id}")

    # se envia el session_id
    sessionq = session_manager.validate_amount_session_questions(session_id, request)
    count = session_manager.get_session_count(request)
    mensaje = ""

    if not sessionq:
        mensaje = f'NO es posible continuar, se ha alcanzado el limite de preguntas. Tiempo transcurrido {count["elapsed_time"]} segundos, y se han hecho {count["count"]} preguntas'

        logger.info(mensaje)

    # Inicializar o recuperar el contador y el tiempo de inicio

    log_session_info("Estado de la sesión después de incrementar:", request.session)

    history = []
    if gethistory:
        history = session_manager.get_session_question_data(session_id, request)

    return JSONResponse(
        content={
            "response": mensaje,
            "continue": sessionq,
            "count": count["count"],
            "elapsed_time": count["elapsed_time"],
            "start_time": count["start_time"],
            "history": history,
        }
    )


def safe_json(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    if isinstance(obj, set):
        return list(obj)
    return str(obj)


@router.get("/getCountries", status_code=200)
@limiter.limit("30/minute")
async def get_countries(
    request: Request,
    db: Session = Depends(get_postgres_db),
):
    """
    Devuelve todos los países disponibles como un JSON crudo serializado,
    junto con:
      • fs_question: un ejemplo few-shot para ese país
      • pq_question: la pregunta más frecuente hecha por usuarios para ese país
    """
    try:
        result = db.execute(
            text(
                """
            SELECT
                c.country_iso3,
                c.country_name,
                c.project_url,
                c.is_valid,
                c.description || '. Tip: mientras más detalles incluyas (sector, ubicación, año), mejores serán las respuestas.' as description,
                c.tables_available,
                c.amount_separator,
                c.currency_type,
                c.updated_at,
                fs.fs_question,
                pq.pq_question,
                c.country_svg                                

            FROM sch_countries c
            LEFT JOIN vw_country_fewshot           fs ON fs.country_iso3 = c.country_iso3
            LEFT JOIN vw_country_top_question      pq ON pq.country_iso3 = c.country_iso3

            WHERE c.is_valid = TRUE and c.country_iso3 is not null
            ORDER BY c.country_name asc
            
        """
            )
        )

        rows = result.mappings().all()
        serialized = json.dumps([dict(row) for row in rows], default=safe_json)
        return Response(content=serialized, media_type="application/json")
    except Exception as e:
        logger.error(f"❌ Error al obtener países: {e}")
        raise HTTPException(status_code=500, detail="Error al obtener los países.")
