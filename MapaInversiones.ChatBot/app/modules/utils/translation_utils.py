import re

from langdetect import detect_langs, DetectorFactory, LangDetectException
from google.cloud import translate_v2 as translate
from google.api_core.exceptions import GoogleAPIError
from loguru import logger

"""
This script:
- Provides utilities for language detection and translation using both langdetect and Google Cloud Translate API.
"""


# Ensure deterministic results
DetectorFactory.seed = 0


def detect_language(text: str) -> str:
    """
    Detect the language of the given text.

    Args:
        text (str): The text to analyze.

    Returns:
        str: The detected language ISO-639 code (e.g., 'en', 'es').

    Raises:
        ValueError: If the language could not be detected.
    """
    # The minimum score threshold for language to be considered detected
    score_threshold: float = 0.95

    if not text or len(text.strip()) == 0:
        raise ValueError("Text cannot be empty or whitespace.")

    try:
        languages = detect_langs(text)
        logger.info(f"Detected languages: {languages}")

        # Check if the top language's score meets the threshold
        if languages and languages[0].prob >= score_threshold:
            return languages[0].lang
        else:
            return "undetected"

    except LangDetectException:
        return "undetected"


def detect_language_google(text: str, translate_client: translate.Client) -> str:
    """
    Detect the language of the given text using Google Cloud Translate API.

    Args:
        text (str): The text to analyze.
        translate_client (translate.Client): Google Translate client instance.

    Returns:
        str: The detected language ISO-639 code (e.g., 'en', 'es').

    Raises:
        ValueError: If the input text is empty.
        RuntimeError: For Google API errors or unexpected failures.
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty or whitespace.")

    try:
        # Call Google Translate API to detect the language
        result = translate_client.detect_language(text)

        # Extract the detected language
        detected_language = result.get("language")
        confidence = result.get("confidence", 0)

        logger.info(
            f"Detected language: {detected_language} (Confidence: {confidence})"
        )

        return detected_language if detected_language else "undetected"
    except GoogleAPIError as e:
        raise RuntimeError(f"Google Translate API error: {str(e)}")
    except Exception as e:
        raise RuntimeError(
            f"An unexpected error occurred during language detection: {str(e)}"
        )


def translate_text(
    text: str, target_language: str, translate_client: translate.Client
) -> str:
    """
    Translate text using Google Cloud Translate API.

    Args:
        text (str): The text to translate.
        target_language (str): The target language ISO-639 code (e.g., 'en', 'es').

    Returns:
        str: The translated text.

    Raises:
        ValueError: If input text is invalid.
        RuntimeError: For Google API or other unexpected errors.
    """
    # Input validation
    if not text or not text.strip():
        raise ValueError("Text cannot be empty or whitespace.")
    if not target_language or len(target_language) != 2:
        raise ValueError(
            "Target language must be a valid ISO-639 code (e.g., 'en', 'es')."
        )

    try:

        # Perform translation
        result = translate_client.translate(text, target_language=target_language)
        logger.info(f"Translated text: {result['translatedText']}")

        # Return the translated text
        return result["translatedText"]
    except GoogleAPIError as e:
        raise RuntimeError(f"Google Translate API error: {str(e)}")
    except Exception as e:
        raise RuntimeError(f"An unexpected error occurred during translation: {str(e)}")


def translate_markdown(
    markdown_text: str, target_language: str, translate_client: translate.Client
) -> str:
    """
    Translate Markdown text while preserving the Markdown structure.

    Args:
        markdown_text (str): The Markdown text to translate.
        target_language (str): The target language ISO-639 code (e.g., 'en', 'es').
        translate_client (translate.Client): Google Translate client instance.

    Returns:
        str: The translated Markdown text.
    """
    if not markdown_text or not markdown_text.strip():
        raise ValueError("Markdown text cannot be empty or whitespace.")

    # Regex to match Markdown patterns
    markdown_patterns = (
        r"(```.*?```|`.*?`|\[.*?\]\(.*?\)|\*\*.*?\*\*|\*.*?\*|#+\s.*|-\s.*)"
    )

    # Split the Markdown into parts
    parts = re.split(markdown_patterns, markdown_text, flags=re.DOTALL)

    # Separate plain text and Markdown parts
    plain_texts = [
        part
        for part in parts
        if not re.match(markdown_patterns, part, flags=re.DOTALL) and part.strip()
    ]

    # Translate all plain text parts in a single batch
    try:
        translated_texts = []
        if plain_texts:
            translated_texts = [
                translate_text(text, target_language, translate_client)
                for text in plain_texts
            ]

        # Reconstruct Markdown, replacing plain text with translated text
        translated_parts = []
        text_index = 0
        for part in parts:
            if part in plain_texts:
                translated_parts.append(translated_texts[text_index])
                text_index += 1
            else:
                translated_parts.append(part)

        return "".join(translated_parts)
    except Exception as e:
        logger.error(f"Error during Markdown translation: {e}")
        raise RuntimeError("Failed to translate Markdown text.")
