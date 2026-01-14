import pandas as pd
import csv  # Importar el módulo csv para opciones de quoting
from .vector_store import VectorStore

from loguru import logger

# Initialize VectorStore
vec = VectorStore()

"""
This script:
- Provides tools for semantic, keyword, hybrid, and rerank searches using a vector store.
- Utilizes NLTK for text preprocessing, including stopword removal and tokenization.
- Simplifies user queries by normalizing text and removing irrelevant words.    
"""


output_csv_path = "data_ingestion/search_embed_csv/"
# create output folder if it does not exist
import os

if not os.path.exists(output_csv_path):
    os.makedirs(output_csv_path)

query = "hay proyectos que sean tipo de cambio climatico o suelo o de medio ambiente?"
logger.info(f"\n\n ------> Original Query: {query}")


# --------------------------------------------------------------
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import unicodedata

# Lista de stopwords en español
stop_words = set(stopwords.words("spanish"))
custom_stopwords = {"hay", "haciéndose", "estén"}  # Stopwords adicionales
stop_words.update(custom_stopwords)


def simplify_query_nltk(query):
    """
    Simplifica la consulta eliminando stopwords, quitando acentos y llevando todo a minúsculas.
    """
    # Convertir a minúsculas
    query = query.lower()

    # Eliminar acentos
    query = "".join(
        c
        for c in unicodedata.normalize("NFD", query)
        if unicodedata.category(c) != "Mn"
    )

    # Tokenizar la consulta
    words = word_tokenize(query, language="spanish")

    # Filtrar palabras clave eliminando stopwords
    keywords = [word for word in words if word.isalnum() and word not in stop_words]

    return " ".join(keywords)


# Ejemplo de uso
query = simplify_query_nltk(query)
logger.info(f"\n\n ------> Simplified Query: {query}\n\n")

# --------------------------------------------------------------


# --------------------------------------------------------------
# Semantic search
# --------------------------------------------------------------
semantic_results = vec.semantic_search(query=query, limit=10)
logger.info(f"\n\n ------> Semantic Results: {semantic_results}")

semantic_df = pd.DataFrame(semantic_results)
semantic_df.to_csv(
    output_csv_path + "semantic_search_results.csv",
    mode="w",
    index=False,
    sep="|",
    quoting=csv.QUOTE_ALL,  # Forzar todas las comillas dobles
)
logger.info("\n\n ------> Semantic Results saved to 'semantic_search_results.csv'")

# --------------------------------------------------------------
# Simple keyword search
# --------------------------------------------------------------
keyword_results = vec.keyword_search(query=query, limit=10)
logger.info(f"\n\n ------> Keyword Results: {keyword_results}")

keyword_df = pd.DataFrame(keyword_results)
keyword_df.to_csv(
    output_csv_path + "keyword_search_results.csv",
    mode="w",
    index=False,
    sep="|",
    quoting=csv.QUOTE_ALL,  # Forzar todas las comillas dobles
)
logger.info("\n\n ------> Keyword Results saved to 'keyword_search_results.csv'")

# --------------------------------------------------------------
# Hybrid search
# --------------------------------------------------------------
hybrid_results = vec.hybrid_search(query=query, keyword_k=10, semantic_k=10)
logger.info(f"\n\n ------> Hybrid Results: {hybrid_results}")

hybrid_df = pd.DataFrame(hybrid_results)
hybrid_df.to_csv(
    output_csv_path + "hybrid_search_results.csv",
    mode="w",
    index=False,
    sep="|",
    quoting=csv.QUOTE_ALL,  # Forzar todas las comillas dobles
)
logger.info("\n\n ------> Hybrid Results saved to 'hybrid_search_results.csv'")

# --------------------------------------------------------------
# Reranking
# --------------------------------------------------------------
reranked_results = vec.hybrid_search(
    query=query, keyword_k=10, semantic_k=10, rerank=True, top_n=10
)
# logger.info("\n\n ------> Reranked Results:", reranked_results)

reranked_df = pd.DataFrame(reranked_results)
reranked_df.to_csv(
    output_csv_path + "reranked_search_results.csv",
    mode="w",
    index=False,
    sep="|",
    quoting=csv.QUOTE_ALL,  # Forzar todas las comillas dobles
)
# logger.info("\n\n ------> Reranked Results saved to 'reranked_search_results.csv'")

# --------------------------------------------------------------
# Semantic Metadata Filtering
# --------------------------------------------------------------
"""
metadata_filter = {"country_code": "DOM"}
filtered_results = vec.semantic_search(query=query, limit=3, metadata_filter=metadata_filter)
logger.info(f"\n\n ------> Filtered Results: {filtered_results}")

filtered_df = pd.DataFrame(filtered_results)
filtered_df.to_csv(
    "filtered_search_results.csv",
    index=False,
    sep="|",
    quoting=csv.QUOTE_ALL,  # Forzar todas las comillas dobles
)
logger.info("\n\n ------> Filtered Results saved to 'filtered_search_results.csv'")
"""
