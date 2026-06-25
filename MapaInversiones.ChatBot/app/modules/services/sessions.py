from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from modules.crud import get_session, create_session


def get_or_create_session(db: Session, sender_id: str):
    """
    Obtiene o crea una sesión para un remitente dado. Si ya existe una sesión y tiene menos de 24 horas, se reutiliza.
    En caso contrario, se crea una nueva sesión.

    Args:
        db (Session): La sesión de la base de datos.
        sender_id (str): El ID del remitente que envía el mensaje.

    Returns:
        SessionModel: La sesión actual, ya sea existente o recién creada.
    """

    # Obtener la sesión actual de la base de datos si existe
    session = get_session(db, sender_id)

    # Definir el tiempo de expiración de la sesión (24 horas)
    session_expire_time = timedelta(hours=24)

    # Verificar si la sesión existe y si aún está dentro del periodo de 24 horas
    if session and (datetime.utcnow() - session.last_message_at) < session_expire_time:
        # Reutilizar la sesión existente
        return session

    # Si no existe una sesión o ha expirado, crear una nueva
    now = datetime.utcnow()
    session = create_session(
        db,
        sender_id,
    )

    return session
