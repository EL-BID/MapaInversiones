from datetime import datetime
from sqlalchemy.orm import Session
from modules import models
from modules.schemas.db_schemas import ChatMessageModel, AllowedNumberModel


# Whatsapp related CRUD operations for the database
# This file contains the functions that interact with the database.
# Need for Whatsapp related operations like sending messages, adding allowed numbers, etc.
# TODO: Can this also be useful for non-Whatsapp related operations?
# TODO: Try-Except-catch blocks for error handling?
# TODO: Data Validation for sender_id, session_id, etc.


# get messages ordered by date
def get_messages(db: Session, sender_id: str, session_id: int):
    return (
        db.query(models.ChatMessage)
        .filter(
            models.ChatMessage.conversation_sender_id == sender_id,
            models.ChatMessage.session_id == session_id,
        )
        .order_by(models.ChatMessage.date)
        .all()
    )


def create_message(db: Session, message: ChatMessageModel):
    db_message = models.ChatMessage(**message.dict())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message


def add_allowed_number(db: Session, number: AllowedNumberModel):
    db_number = models.AllowedNumber(**number.dict())
    db.add(db_number)
    db.commit()
    db.refresh(db_number)
    return db_number


def remove_allowed_number(db: Session, number_id: int):
    db.query(models.AllowedNumber).filter(models.AllowedNumber.id == number_id).delete()
    db.commit()
    return number_id


def check_allowed_number(db: Session, number: str):
    return (
        db.query(models.AllowedNumber)
        .filter(models.AllowedNumber.number == number)
        .first()
        is not None
    )


def get_session(db: Session, sender_id: str):
    return (
        db.query(models.ChatSession)
        .filter(models.ChatSession.sender_id == sender_id)
        .order_by(models.ChatSession.last_message_at.desc())
        .first()
    )


def create_session(db: Session, sender_id: str):
    new_session = models.ChatSession(
        sender_id=sender_id,
        created_at=datetime.utcnow(),
        last_message_at=datetime.utcnow(),
    )
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    return new_session


def update_session_last_message_at(db: Session, session: models.ChatSession):
    session.last_message_at = datetime.utcnow()
    db.commit()
    db.refresh(session)
    return session
