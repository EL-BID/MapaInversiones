# app/routes/__init__.py
from fastapi import Request, Response
from modules.utils.session_manager import session_manager
from loguru import logger


def get_session_id(request: Request, response: Response):
    session_id = session_manager.get_session_id(request)
    if not session_id:
        session_id = session_manager.create_session(request)
        logger.info(
            f"------> New Session ID Created: {session_id}"
        )  # Depuración: Imprimir el session_id nuevo
    else:
        logger.info(
            f"------> Existing Session ID: {session_id}"
        )  # Depuración: Imprimir el session_id existente

    return session_id


# def update_session_question_data(question,answer, request: Request, response: Response):
#     session_id = session_manager.get_session_id(request)
#     if session_id:
#         update_session_question_data(question, answer,session_id, request)
#     else:
#        session_id= get_session_id(request,response)
#        update_session_question_data(question, answer,session_id, request)

#     return session_id


# Asegurarse de exportar la función
__all__ = ["get_session_id"]
