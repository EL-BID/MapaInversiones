"""
Utilidades para reconstruir el historial (user / assistant) que se envía
al grafo para regenerar la *complete question*.

Garantiza que:

• Si no hay filas → devuelve lista vacía.
• Las filas se ordenan cronológicamente (antiguo → reciente).
• Cada turno contiene siempre las keys mínimas esperadas por
  `prepare_message_history`: ``role``, ``content`` y ``timestamp``.
• Se evita lanzar `AttributeError` incluso si la consulta devuelve tipos
  inesperados (p.ej. tuplas, ints, None, etc.).
"""

from typing import List, Dict, Any
from datetime import datetime
import time

from modules.utils.db_utils import get_question_history_by_sessionId

"""
This script:
- Provides utilities to reconstruct the user/assistant history sent to the graph to regenerate the complete question.
- Ensures that if there are no rows, it returns an empty list.
- Ensures that rows are ordered chronologically (oldest to newest).
- Each turn always contains the minimum keys expected by `prepare_message_history`: `role`, `content`, and `timestamp`.
- Avoids raising `AttributeError` even if the query returns unexpected
"""


def _safe_str(val: Any) -> str:
    """Convierte cualquier valor a `str`, excepto `None` → ''."""
    return "" if val is None else str(val).strip()


def _row_to_turns(row: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Convierte una fila de la tabla `questions_mapainv_chat` a dos turnos:
    uno de usuario y otro del asistente.
    """
    # Timestamp: usamos “ahora” para que todos los turnos queden dentro de la
    # ventana de 5 min del generate_complete_question.
    ts = int(time.time())

    # País (opcional)
    cc = _safe_str(row.get("Pais") if isinstance(row, dict) else "")

    # Pregunta de usuario
    user_turn = {
        "role": "user",
        "content": _safe_str(row.get("Question") if isinstance(row, dict) else row),
        "timestamp": ts,
        "country_code": cc,
    }

    # Respuesta (preferimos summary; si no, Answer completa)
    assistant_content = (
        _safe_str(row.get("QuestionSummary"))
        if isinstance(row, dict) and row.get("QuestionSummary")
        else _safe_str(row.get("Answer") if isinstance(row, dict) else "")
    )

    assistant_turn = {
        "role": "assistant",
        "content": assistant_content,
        "timestamp": ts,
        "country_code": cc,
    }

    return [user_turn, assistant_turn]


def build_history_for_prompt(
    db, session_id: str, limit: int = 100
) -> List[Dict[str, Any]]:
    """
    Devuelve como máximo `limit` turnos (pares user+assistant) en
    **orden cronológico** para la sesión indicada.

    Si ocurre cualquier fallo durante la reconstrucción, se devuelve
    una lista vacía en vez de propagar la excepción.
    """
    try:
        result = get_question_history_by_sessionId(session_id, limit)
        if isinstance(result, tuple):
            raw_rows = result[0]
        else:
            raw_rows = result

        if not raw_rows:
            return []

        # La consulta existente ordena DESC por Id → invertimos
        history: List[Dict[str, Any]] = []
        for r in reversed(raw_rows):
            # Cada fila ⇒ 2 mensajes
            history.extend(_row_to_turns(r))

        return history

    except Exception as exc:  # pragma: no cover
        # Devolver lista vacía para que el flujo principal no rompa
        from loguru import logger

        logger.error(f"Error construyendo historial para prompt: {exc}", exc_info=True)
        return []
