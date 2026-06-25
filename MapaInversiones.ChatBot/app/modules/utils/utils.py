import hmac
import hashlib
import json
from loguru import logger
from fastapi import HTTPException, Request
from decimal import Decimal
from functools import wraps
from modules.config import settings
from langchain_core.messages import HumanMessage, AIMessage

"""
This script:
- Provides utilities to verify request signatures, convert data types, log session info, and prepare message history.
- Ensures security by validating HMAC signatures for incoming requests.
- Converts float and Decimal types to int for consistent data handling.
- Logs session information in a structured JSON format for easier debugging and monitoring.
- Prepares message history by filtering messages based on country code and formatting them for LangChain.
"""


def verify_signature_decorator(func):
    @wraps(func)
    async def wrapper(*args, **kwargs):
        request: Request = kwargs.get("request")
        if not request:
            raise HTTPException(status_code=500, detail="Request object not found")

        request_body = await request.body()
        signature_header = request.headers.get("x-hub-signature-256")

        if not signature_header:
            raise HTTPException(status_code=400, detail="Missing signature header")

        hash_algorithm, expected_signature = signature_header.split("=")
        if hash_algorithm != "sha256":
            raise HTTPException(status_code=400, detail="Invalid hash algorithm")

        hmac_obj = hmac.new(
            settings.facebook_app_secret.encode(), request_body, hashlib.sha256
        )
        computed_signature = hmac_obj.hexdigest()

        if not hmac.compare_digest(computed_signature, expected_signature):
            raise HTTPException(status_code=403, detail="Invalid signature")

        kwargs["request_body"] = (
            request_body  # Pass request_body to the endpoint function
        )
        return await func(*args, **kwargs)

    return wrapper


def convert_floats_to_int(data):
    if isinstance(data, dict):
        return {key: convert_floats_to_int(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_floats_to_int(item) for item in data]
    elif isinstance(data, float):
        return int(data)  # Convertir de float a int
    elif isinstance(data, Decimal):
        return int(data)  # Convertir de Decimal a int
    else:
        return data


def log_session_info(message, session):
    logger.info(f"{message}\n{json.dumps(session, indent=4)}")


def prepare_message_history(history, country_code):
    """
    Prepares a list of LangChain messages from chat history, filtering by the current country code.

    Args:
        history (list): List of message dictionaries containing role, content, and country_code
        country_code (str): The country code to filter messages by (case-insensitive)

    Returns:
        list: List of LangChain messages (HumanMessage or AIMessage) that match the specified country code
    """
    result = []
    # Normalize the input country_code to lowercase
    normalized_country_code = country_code.lower() if country_code else None

    for item in history:
        role = item.get("role")
        content = item.get("content")
        history_country_code = item.get("country_code")
        # Normalize the history country_code to lowercase
        normalized_history_country_code = (
            history_country_code.lower() if history_country_code else None
        )

        # Skip messages that don't match the country_code
        if normalized_history_country_code != normalized_country_code:
            continue
        # Build the appropriate LangChain message
        if role == "user":
            msg = HumanMessage(
                content=content, additional_kwargs={"timestamp": item.get("timestamp")}
            )
        elif role == "assistant":
            msg = AIMessage(
                content=content, additional_kwargs={"timestamp": item.get("timestamp")}
            )
        else:
            continue  # Skip unrecognized roles

        result.append(msg)

    return result
