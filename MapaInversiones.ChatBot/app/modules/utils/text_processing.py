import re
import unicodedata
from functools import lru_cache
from typing import Iterable, List

from nltk.stem.snowball import SpanishStemmer

from modules.utils.nltk_utils import get_spanish_stopwords


_NON_ALNUM_RE = re.compile(r"[^a-z0-9\s]")
_WHITESPACE_RE = re.compile(r"\s+")
_spanish_stemmer = SpanishStemmer()


@lru_cache(maxsize=1)
def _normalized_stopwords_stemmed() -> set[str]:
    """
    Load Spanish stopwords, normalize AND stem them.
    This ensures stopwords are compared against stemmed tokens.
    Cached to avoid repeated processing.
    """
    normalized: set[str] = set()
    for word in get_spanish_stopwords():
        cleaned = _normalize_basic(word)
        if cleaned:
            # También agregar versión stemmed
            singular = _singularize(cleaned)
            stemmed = _spanish_stemmer.stem(singular)
            normalized.add(cleaned)
            if stemmed:
                normalized.add(stemmed)
    return normalized


@lru_cache(maxsize=1)
def _normalized_stopwords() -> set[str]:
    """
    Load Spanish stopwords using the same normalization applied in process_text().
    Cached to avoid repeated downloads or heavy processing.
    """
    normalized: set[str] = set()
    for word in get_spanish_stopwords():
        cleaned = _normalize_basic(word)
        if cleaned:
            normalized.add(cleaned)
    return normalized


def _normalize_basic(text: str) -> str:
    """
    Apply the initial cleaning stage used in Postgres' clean_text():
    - Unicode NFKD normalization
    - Remove accents
    - Lowercase
    - Strip non-alphanumeric characters (keep spaces)
    """
    if not text:
        return ""
    normalized = unicodedata.normalize("NFKD", text)
    ascii_text = normalized.encode("ascii", "ignore").decode("ascii")
    lowered = ascii_text.lower()
    stripped = _NON_ALNUM_RE.sub(" ", lowered)
    return stripped.strip()


def _remove_stopwords(tokens: Iterable[str]) -> List[str]:
    stopwords = _normalized_stopwords()
    return [token for token in tokens if token and token not in stopwords]


def _singularize(token: str) -> str:
    """
    Mirror the singularize() helper from the Postgres pipeline.
    """
    if len(token) > 3 and token.endswith("es"):
        return re.sub(r"es$", "", token)
    if len(token) > 2 and token.endswith("s"):
        return token[:-1]
    return token


def process_text_like_db(text: str) -> str:
    """
    Reproduce the behaviour of the Postgres process_text() function entirely in Python.
    Useful for mirroring analyzer filters and building heuristics without hitting the DB.

    Order: normalize → split → singularize → stem → remove stopwords (on stems)
    """
    cleaned = _normalize_basic(text)
    if not cleaned:
        return ""

    tokens = _WHITESPACE_RE.split(cleaned)
    if not tokens:
        return ""

    # Primero stemming, luego stopwords (sobre stems)
    stopwords = _normalized_stopwords_stemmed()
    stemmed: List[str] = []
    for token in tokens:
        singular = _singularize(token)
        lemma = _spanish_stemmer.stem(singular)
        if lemma and lemma not in stopwords:
            stemmed.append(lemma)

    return " ".join(stemmed)


def tokenize_like_process_text(text: str, *, min_length: int = 3) -> List[str]:
    """
    Return unique tokens as produced by process_text_like_db(), filtered by length.
    The order of appearance is preserved.
    """
    normalized = process_text_like_db(text)
    if not normalized:
        return []

    tokens: List[str] = []
    seen: set[str] = set()
    for token in normalized.split():
        if len(token) < min_length:
            continue
        if token in seen:
            continue
        seen.add(token)
        tokens.append(token)
    return tokens
