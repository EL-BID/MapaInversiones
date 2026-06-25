from typing import Optional
from modules.utils.whatsapp_utils import markdown_to_whatsapp


def extract_response_content(response: dict) -> Optional[str]:
    """
    Extracts the content from the latest AIMessage in the response.
    If the question is marked as irrelevant, returns a default response.

    Args:
        response (dict): The response object containing messages.

    Returns:
        Optional[str]: The extracted AI message content or a default response if irrelevant.
    """

    # Initialize list to store contents of AI messages
    ai_contents = []

    for message in response.get("messages", []):
        # Handle message based on its type (dict or custom object)
        if isinstance(message, dict):
            content = message.get("content", "").strip()
        else:
            # Access content as an attribute if message is not a dict
            content = getattr(message, "content", "").strip()

        if content:
            ai_contents.append(content)

    # Return the latest content if available
    if ai_contents:
        md_to_wp = markdown_to_whatsapp(ai_contents[-1])
        return md_to_wp

    return None
