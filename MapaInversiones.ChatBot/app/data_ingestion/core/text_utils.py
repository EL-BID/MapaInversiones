import pandas as pd
from sqlalchemy import create_engine, text
from loguru import logger
from modules.config import settings


def normalize_free_text_pg(engine, text_input):
    """
    Calls the PostgreSQL functions clean_text, remove_stopwords_text, and lemmatize_text
    in a single query to normalize text fields.

    Returns the fully normalized text from Postgres.
    """
    if not text_input or not text_input.strip():
        return ""

    # We'll chain the calls: lemmatize_text(remove_stopwords_text(clean_text(:txt)))
    query = text(
        """
        SELECT lemmatize_text(
                 remove_stopwords_text(
                   clean_text(:txt)
                 )
               ) AS normalized
    """
    )
    with engine.begin() as conn:
        row = conn.execute(query, {"txt": text_input}).fetchone()
    return row[0]  # normalized text


if __name__ == "__main__":
    # Example usage
    engine_postgresql = create_engine(
        settings.postgres_conn_string,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={
            "keepalives": 1,
            "keepalives_idle": 30,
            "keepalives_interval": 10,
            "keepalives_count": 5,
        },
    )

    # frases parecidas pero distintas, usando plural/singular, masculino/femenino, reemplazando stopwords, etc. en español:
    samples_text = [
        "El gato come pescado",
        "Los gatos comen pescado",
        "El gato come pescado",
        "El ministerio de las mujeres",
        "El ministerio de la mujer",
        "La Organización Nacional de Energía",
        "Organización Nacional de Energía",
        "Organización de Energía",
        "Organizaciones de las energias",
    ]

    # Invoke the Postgres-based text normalization based on the samples

    for sample in samples_text:
        normalized = normalize_free_text_pg(engine_postgresql, sample)
        logger.info(f"Original: {sample}\n\t Normalized: {normalized}")
