import re
import unidecode
import difflib
from modules.utils.spanish_stopwords import SPANISH_STOPWORDS

"""
This script:
- Provides utilities to extract relevant column names from a database schema based on a user question.
- Uses tokenization, stopword removal, and crude stemming to identify potential matches.
- Matches are done via case-insensitive substring search and fuzzy matching.
- Returns a list of column names that are relevant to the user's question.

"""

# Palabras muy frecuentes que no deben considerarse para filtrado
STOPWORDS = set(SPANISH_STOPWORDS)


# Common Spanish suffixes, ordered by length (longest first)
SUFFIXES = [
    "ificaciones",
    "izaciones",
    "amientos",
    "imientos",
    "aciones",
    "uciones",
    "logías",
    "encias",
    "ificables",
    "adores",
    "adoras",
    "ancias",
    "idades",
    "anzas",
    "osamente",
    "iblemente",
    "ivamente",
    "mente",
    "ación",
    "amiento",
    "imiento",
    "antes",
    "ante",
    "idad",
    "ismo",
    "able",
    "ible",
    "ista",
    "oso",
    "osa",
    "ivo",
    "iva",
    "ado",
    "ada",
    "ido",
    "ida",
    "ar",
    "er",
    "ir",
    "es",
    "as",
    "os",
]


def stem(word: str) -> str:
    """
    Remove the longest matching suffix from the word, if any,
    to obtain a crude stem for substring matching.
    """
    w = word.lower()
    for suf in SUFFIXES:
        if w.endswith(suf) and len(w) > len(suf) + 2:
            return w[: -len(suf)]
    return w


def extract_filter_columns(question: str, schema: dict) -> list[str]:
    """
    Given a user question and a schema dictionary, return a list of
    column names whose names or descriptions match tokens or stems
    from the question via case-insensitive substring search.
    """
    # Normalize and tokenize the question
    text = unidecode.unidecode(question.lower())
    raw_tokens = re.findall(r"\w+", text)
    tokens = set(raw_tokens) | {stem(t) for t in raw_tokens}
    # Quita tokens cortos o stopwords
    tokens = {t for t in tokens if len(t) > 2 and t not in STOPWORDS}

    matched = set()
    for table, meta in schema.items():
        # "columns" can be either a dict (name -> metadata) or a list of metadata dicts
        raw_cols = meta.get("columns", {})

        # Build an iterator over (column_name, column_metadata)
        if isinstance(raw_cols, dict):
            col_iter = raw_cols.items()
        else:  # assume list/tuple of individual column dicts
            col_iter = ((c.get("name", ""), c) for c in raw_cols)

        for col, col_meta in col_iter:
            if not col:
                continue  # skip malformed entries

            haystack = unidecode.unidecode(
                f"{col} {col_meta.get('description', '')}".lower()
            )

            # 1) match directo por substring en nombre + descripción
            if any(tok in haystack for tok in tokens):
                matched.add(col)
                continue

            # 2) match difuso en el nombre de columna
            if any(
                difflib.get_close_matches(tok, [col], n=1, cutoff=0.7) for tok in tokens
            ):
                matched.add(col)
    return list(matched)
