from fastapi import APIRouter, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates


from fastapi import (
    FastAPI,
    APIRouter,
    Request,
    Response,
    HTTPException,
    Form,
    File,
    UploadFile,
    Depends,
    status,
)
from fastapi.exceptions import RequestValidationError
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List, Optional

import datetime
from routes import get_session_id  # Importar la función centralizada
from modules.utils.db_utils import get_question_history_by_sessionId
from modules.utils.markdown_utils import markdown_to_html
import json
import re

# from modules.graph.state import AgentState

from modules.config import settings

from loguru import logger

router = APIRouter()


# Novedad: Añadir una nueva ruta para obtener el historial de preguntas y respuestas del usuario actual.
def convert_datetime_to_str(result):
    if not isinstance(result, list):  # Asegurar que sea una lista
        # raise ValueError("Expected a list of records")
        return []
    for record in result:
        if isinstance(
            record["Date"], datetime
        ):  # Comprobar si es instancia de datetime
            record["Date"] = record["Date"].strftime("%Y-%m-%d %H:%M:%S")
    return result


@router.get("/history")
async def get_history(request: Request, response: Response):
    """
    Endpoint para obtener el historial de preguntas y respuestas del usuario actual.
    """
    try:
        session_id = get_session_id(request, response)
        logger.info(f"session_id: {session_id}")
        history_tuple = get_question_history_by_sessionId(session_id)
        if not history_tuple:
            raise HTTPException(
                status_code=404, detail="No history found for the session"
            )
        # `get_question_history_by_sessionId` históricamente devolvía 3 valores.
        # Desde algunos refactors puede retornar un cuarto flag `no_data`.
        if isinstance(history_tuple, tuple):
            if len(history_tuple) == 4:
                raw_json, more_than_n_rows, total_rows, _no_data = history_tuple
            elif len(history_tuple) == 3:
                raw_json, more_than_n_rows, total_rows = history_tuple
            else:
                raise ValueError("Unexpected history tuple length")
        else:
            raw_json = history_tuple
            more_than_n_rows = False
            total_rows = 0

        if isinstance(raw_json, str):
            try:
                rows = json.loads(raw_json)
            except Exception as exc:
                logger.error(f"[HISTORY] Failed to parse history JSON: {exc}")
                rows = []
        elif isinstance(raw_json, list):
            rows = raw_json
        else:
            rows = []

        for row in rows:
            if not isinstance(row, dict):
                continue
            answer_text = (row.get("Answer") or row.get("answer") or "").strip()
            trace_html = row.get("Trace") or row.get("trace") or ""
            if answer_text and (not trace_html or trace_html.lower() == "none"):
                normalized = re.sub(
                    r"([^\n])(\|[^\n]+\|\s*\n\|[-:\s\|]+)",
                    r"\1\n\n\2",
                    answer_text,
                    flags=re.MULTILINE,
                )
                try:
                    html_rendered = markdown_to_html(normalized)
                    row["Trace"] = html_rendered
                    row["trace"] = html_rendered
                    row["Answer"] = html_rendered
                    row["answer"] = html_rendered
                except Exception as exc:
                    logger.warning(f"[HISTORY] markdown_to_html failed: {exc}")

        return JSONResponse(
            content={
                "rows": rows,
                "more_than_limit": more_than_n_rows,
                "total_rows": total_rows,
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving history: {str(e)}"
        )
