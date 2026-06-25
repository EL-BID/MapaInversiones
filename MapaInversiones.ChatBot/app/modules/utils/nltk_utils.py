import threading
from typing import Set

from loguru import logger
from nltk import data, download
from nltk.corpus import stopwords
from .spanish_stopwords import SPANISH_STOPWORDS

"""
Utilities to manage NLTK corpora on demand without blocking the first request.
We kick off background downloads when a resource is missing and provide a
minimal fallback so the application can keep running.
"""

_RESOURCE_PATHS = {
    "stopwords": "corpora/stopwords",
    "punkt": "tokenizers/punkt",
}

_download_lock = threading.Lock()
_active_downloads: set[str] = set()

_stopwords_lock = threading.Lock()
_spanish_stopwords_cache: Set[str] | None = None

_FALLBACK_SPANISH_STOPWORDS = set(SPANISH_STOPWORDS)


def schedule_nltk_resource(resource: str) -> None:
    """
    Schedule an asynchronous download of the requested NLTK resource if it is
    not already available locally.
    """
    path = _RESOURCE_PATHS.get(resource)
    if not path:
        logger.warning("Unknown NLTK resource requested: {}", resource)
        return

    try:
        data.find(path)
        return
    except LookupError:
        pass
    except Exception as exc:
        logger.warning(
            "NLTK resource '{}' lookup failed (will re-download): {}", resource, exc
        )

    with _download_lock:
        if resource in _active_downloads:
            return
        _active_downloads.add(resource)

    def _download():
        global _spanish_stopwords_cache
        try:
            logger.info("Downloading NLTK resource '{}' in background…", resource)
            download(resource, quiet=True)
            logger.info("NLTK resource '{}' download complete.", resource)
        except Exception as exc:  # pragma: no cover - best effort
            logger.warning("Failed to download NLTK resource '{}': {}", resource, exc)
        finally:
            if resource == "stopwords":
                with _stopwords_lock:
                    # Force reload on next access in case we were using fallback
                    _spanish_stopwords_cache = None
            with _download_lock:
                _active_downloads.discard(resource)

    threading.Thread(target=_download, daemon=True).start()


def get_spanish_stopwords() -> Set[str]:
    """
    Return a set of Spanish stopwords. If the official corpus is unavailable, a
    basic fallback list is returned and the corpus download is scheduled in the
    background.
    """
    global _spanish_stopwords_cache
    with _stopwords_lock:
        if _spanish_stopwords_cache is not None:
            return set(_spanish_stopwords_cache)

    try:
        words = stopwords.words("spanish")
        result = set(words)
    except LookupError:
        schedule_nltk_resource("stopwords")
        logger.warning(
            "NLTK Spanish stopwords corpus not available; using fallback list."
        )
        result = set(_FALLBACK_SPANISH_STOPWORDS)

    with _stopwords_lock:
        _spanish_stopwords_cache = set(result)

    return set(result)


__all__ = ["schedule_nltk_resource", "get_spanish_stopwords"]
