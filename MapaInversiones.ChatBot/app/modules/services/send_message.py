import httpx

from modules.schemas.db_schemas import ChatMessageModel
from modules.config import settings

from loguru import logger


def transform_number(input_number: str) -> str:
    """
    Transforms the given number by removing the '9' after the country code
    and adding '15' after the area code (e.g., 261).
    This is only due to the format required by the Facebook WhatsApp API, due to an error when using an Argentine number with the whatsapp test number.
    It shoud not be used in production when the official number is used.

    Args:
        input_number (str): The input phone number (e.g., 5492612026135).

    Returns:
        str: The transformed phone number (e.g., 54261152026135).
    """
    transformed_number = ""

    if not input_number.startswith("54"):
        # Return the original number if it doesn't start with '54'
        return input_number

    if input_number.startswith("54911"):
        country_code = "54"
        area_code = input_number[3:5]
        remaining_number = input_number[5:]
        transformed_number = f"{country_code}{area_code}15{remaining_number}"

    else:
        # Remove '9' and add '15' after the area code
        country_code = input_number[:2]  # '54'
        area_code = input_number[3:6]  # '261'
        remaining_number = input_number[6:]  # Rest of the number
        transformed_number = f"{country_code}{area_code}15{remaining_number}"

    logger.info(f"--> transformed number: {transformed_number}")
    return transformed_number


def send_response_message(sender_id: str, chat_message: ChatMessageModel):
    try:
        to_number = sender_id

        send_message(to_number, "text", {"body": chat_message.content})

    except Exception as e:
        logger.error(f"Error sending message: {e}")


def send_text_message(sender_id: str, text: str):
    send_message(sender_id, "text", {"body": text})


def send_message(to_number: str, message_type: str, content: dict):
    transformed_number = transform_number(to_number)
    payload = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": transformed_number,
        "type": message_type,
        message_type: content,
    }
    send_json_response_message(payload)


def send_json_response_message(payload: dict):
    headers = {
        "Authorization": f"Bearer {settings.facebook_whatsapp_token}",
        "Content-Type": "application/json",
    }
    with httpx.Client() as client:
        try:
            response = client.post(
                settings.facebook_whatsapp_api_url, json=payload, headers=headers
            )
            response.raise_for_status()
            logger.info(f"Message sent: {response.json()}")
        except httpx.HTTPStatusError as e:
            logger.error(
                f"HTTP error occurred: {e.response.status_code} - {e.response.text}"
            )
        except Exception as e:
            logger.error(f"An error occurred: {e}")
