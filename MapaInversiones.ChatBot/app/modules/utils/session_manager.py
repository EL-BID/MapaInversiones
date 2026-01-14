# app/utils/session_manager.py
import secrets
import json
from time import time
from modules.config import settings
from loguru import logger

"""
This script:
- Manages user sessions, including creation, retrieval, updating, and validation.
- Uses secure session IDs and tracks question counts and history.
- Ensures session data is stored and retrieved correctly from the request object.
"""


class SessionManager:
    def __init__(self):
        self.count = 0
        self.start_time = 0

    def create_session(self, request):
        """
        Create a new session and return the session id
        """
        # Generar un session_id seguro usando secrets
        session_id = secrets.token_hex(
            16
        )  # Genera un token de 32 caracteres hexadecimales
        request.session["id"] = session_id
        request.session["count"] = 0
        request.session["start_time"] = 0
        request.session["history"] = []
        logger.info(f"------> New Session ID Created: {session_id}")

        return session_id

    def get_session_id(self, request):
        """
        Get the session id
        """
        return request.session.get("id", None)

    def get_session_count(self, request):
        """
        Get the session questions data
        """
        start_time = request.session.get("start_time", 0)
        elapsed_time = int(time()) - start_time
        return {
            "count": request.session.get("count", 0),
            "start_time": start_time,
            "elapsed_time": elapsed_time,
        }

    def update_session_question_data(self, session_id, question, answer, request):
        """
        Update the session data for the given session id
        Parameters:
        session_id (str): The session id
        question (str): The question asked by the user
        answer (str): The answer provided by the chatbot
        """
        count = request.session.get("count", 0)
        start_time = request.session.get("start_time", 0)
        history = request.session.get("history", [])

        logger.info(f"------> history: {json.dumps(history)}")

        # se estable el tiempo de inicio
        if start_time == 0:
            start_time = int(time())
        request.session["start_time"] = start_time

        # se aumenta el numero de preguntas
        count += 1
        request.session["count"] = count

        # Almacenar preguntas y respuestas en qa_history
        if "history" not in request.session:
            request.session["history"] = []

        history.append({"question": question, "answer": answer})
        request.session["history"] = history

        return {"count": count, "start_time": start_time}

    def clear_session(self, session_id, request):
        """
        Clear the session data
        """
        if request.session.get("id") == session_id:
            request.session.pop("id", None)
            request.session.pop("count", None)
            request.session.pop("start_time", None)
            request.session.pop("history", None)
            logger.info(f"------> Session ID {session_id} cleared.")

    def get_session_question_data_json(self, session_id, request):
        """
        Get the question in session data in JSON format
        """
        history = request.session.get("history", [])
        return json.dumps(history, indent=4)

    def get_session_question_data(self, session_id, request):
        """
        Get the question session data as array
        """
        history = request.session.get("history", [])
        return history

    def validate_amount_session_questions(self, session_id, request, mantain=False):
        """
        Validate the amount of session questions
        return False if user cannot ask again

        """
        count = request.session.get("count", 0)
        start_time = request.session.get("start_time", 0)
        elapsed_time = int(time()) - start_time

        logger.info(f"Validando sesión {session_id}:")
        logger.info(f"- count: {count}")
        logger.info(f"- start_time: {start_time}")
        logger.info(f"- elapsed_time: {elapsed_time}")
        logger.info(f"- session_max_question: {settings.session_max_question}")
        logger.info(f"- session_max_time: {settings.session_max_time}")

        if count < settings.session_max_question:
            if elapsed_time < int(settings.session_max_time):
                return False
            else:
                request.session["count"] = 0
                request.session["start_time"] = 0
                if not mantain:
                    request.session["history"] = []

                return True
        else:
            return False


session_manager = SessionManager()
