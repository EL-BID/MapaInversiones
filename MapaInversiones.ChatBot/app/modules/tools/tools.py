from dotenv import load_dotenv
from langchain.tools.retriever import create_retriever_tool
from langchain_postgres import PGVector
from langchain_openai import OpenAIEmbeddings, AzureOpenAIEmbeddings
from modules.config import settings
from langgraph.prebuilt import InjectedState
from typing import Annotated, List
import pandas as pd
import numpy as np

load_dotenv()

"""
# if cloud_selector is set to "azure", use AzureOpenAIEmbeddings
if settings.cloud_selector == "AZURE":
    logger.info("------------> Using Azure OpenAI Embeddings")
    AZURE_OPENAI_API_KEY = settings.azure_openai_api_key
    assert AZURE_OPENAI_API_KEY, "AZURE_OPENAI_API_KEY environment variable is not set."

    embeddings = AzureOpenAIEmbeddings(
        model=settings.azure_openai_embedding_name,
        api_key=settings.azure_openai_api_key,
        azure_endpoint=settings.azure_openai_endpoint,
        api_version=settings.azure_openai_api_version,
        dimensions=settings.azure_openai_embedding_dimensions,
    )
else:
    OPENAI_API_KEY = settings.openai_api_key
    assert OPENAI_API_KEY, "OPENAI_API_KEY environment variable is not set."
    embeddings = OpenAIEmbeddings(model=settings.embedding_model)

vector_store = PGVector(
    connection=settings.postgres_conn_string,
    collection_name="data_dictionaries",
    embeddings=embeddings,
    use_jsonb=True,
)

retriever_tool = create_retriever_tool(
    vector_store.as_retriever(),
    "table_definitions_tool",
    "This tool allows you to search for table definitions to help you build SQL Sever queries to later execute them against the database.",
)


def search_table_definitions(
    question: str,
    country_code: str,
    top_k: int = 15,
) -> List[str]:
    # Search for table definitions to help build SQL Server queries.
    country_code = state["country_code"]
    results = vector_store.similarity_search(
        query=question, k=top_k, filter={"country_code": country_code}
    )
    return [result.page_content for result in results]
"""

# ------------------------------------- novedades -------------------------------------

from .vector_store import VectorStore
from nltk.tokenize import word_tokenize
import unicodedata
from loguru import logger
from modules.utils.nltk_utils import get_spanish_stopwords, schedule_nltk_resource

"""
This script:
- Provides tools for semantic, keyword, hybrid, and rerank searches using a vector store.
- Utilizes NLTK for text preprocessing, including stopword removal and tokenization.
- Simplifies user queries by normalizing text and removing irrelevant words.    
"""


# Inicializar VectorStore
vec = VectorStore()

# Preprocesamiento de NLTK: definición de stopwords
custom_stopwords = {
    "hay",
    "haciéndose",
    "estén",
    "cómo",
    "porque",
    "para que",
    "quién",
    "quienes",
    "existen",
}  # Stopwords adicionales


def _get_stop_words():
    """
    Devuelve el conjunto de stopwords en español, combinando las de NLTK (si
    están disponibles) con la lista personalizada definida arriba.
    """
    base_stopwords = get_spanish_stopwords()
    stop_words = set(base_stopwords) if base_stopwords else set()
    stop_words.update(custom_stopwords)
    return stop_words


def simplify_query_nltk(query: str) -> str:
    """
    Preprocesa la consulta para simplificarla:
    - Convierte a minúsculas.
    - Elimina acentos.
    - Quita palabras irrelevantes (stopwords).
    - Devuelve la consulta simplificada lista para ser usada en las búsquedas.

    Args:
        query (str): La consulta original ingresada por el usuario.

    Returns:
        str: La consulta preprocesada y simplificada.
    """
    # Convertir a minúsculas
    query = query.lower()

    # Eliminar acentos
    query = "".join(
        c
        for c in unicodedata.normalize("NFD", query)
        if unicodedata.category(c) != "Mn"
    )

    # Tokenizar y eliminar stopwords
    try:
        words = word_tokenize(query, language="spanish")
    except LookupError:
        # Descargar tokenizer en background y degradar a split simple
        logger.warning(
            "NLTK tokenizer 'punkt' no disponible. Disparando descarga en background."
        )
        schedule_nltk_resource("punkt")
        words = query.split()

    stop_words = _get_stop_words()
    keywords = [word for word in words if word.isalnum() and word not in stop_words]

    return " ".join(keywords)


def semantic_search(
    question: str,
    state: Annotated[dict, InjectedState],
) -> List[str]:
    """
    Realiza una búsqueda semántica basada en embeddings.
    - Utiliza el modelo de embeddings para encontrar textos similares.
    - Retorna los resultados más relevantes según la semántica de la consulta.

    Args:
        question (str): La consulta original del usuario.
        state (dict): El estado adicional, útil para filtros o contexto.

    Returns:
        List[str]: Lista de textos relevantes encontrados.
    """
    # Simplificar la consulta
    query = simplify_query_nltk(question)

    # Realizar la búsqueda semántica
    results = vec.semantic_search(query=query, limit=10)

    # Extraer y devolver solo el contenido de los resultados
    return [result["content"] for result in results]


def keyword_search(
    question: str,
    state: Annotated[dict, InjectedState],
) -> List[str]:
    """
    Realiza una búsqueda basada en palabras clave (keyword search).
    - Utiliza índices de texto para encontrar coincidencias exactas o similares.
    - Es ideal para consultas basadas en texto específico.

    Args:
        question (str): La consulta original del usuario.
        state (dict): El estado adicional, útil para filtros o contexto.

    Returns:
        List[str]: Lista de textos relevantes encontrados.
    """
    # Simplificar la consulta
    query = simplify_query_nltk(question)

    # Realizar la búsqueda por palabras clave
    results = vec.keyword_search(query=query, limit=10)

    # Extraer y devolver solo el contenido de los resultados
    return [result["content"] for result in results]


def hybrid_search(
    question: str,
    state: Annotated[dict, InjectedState],
) -> List[str]:
    """
    Realiza una búsqueda híbrida que combina:
    - Búsqueda semántica basada en embeddings.
    - Búsqueda de palabras clave (keyword search).
    - Los resultados combinados son más robustos al incluir relevancia semántica y textual.

    Args:
        question (str): La consulta original del usuario.
        state (dict): El estado adicional, útil para filtros o contexto.

    Returns:
        List[str]: Lista de textos relevantes encontrados.
    """
    # Simplificar la consulta
    query = simplify_query_nltk(question)

    # Realizar la búsqueda híbrida
    results = vec.hybrid_search(query=query, keyword_k=10, semantic_k=10)

    # Extraer y devolver solo el contenido de los resultados
    return [result["content"] for result in results]


def rerank_search(
    question: str,
    country_code: str,
    fewshots: bool,
    keyword_n: int = 5,
    semantic_n: int = 5,
    top_n: int = 5,
    all: bool = False,
):
    """
    Realiza una búsqueda híbrida con reranking:
    - Combina búsqueda semántica y de palabras clave.
    - Los resultados se ordenan adicionalmente utilizando un modelo de reranking.
    - Esto asegura que los resultados finales sean más relevantes para la consulta.

    Args:
        question (str): La consulta original del usuario.
        state (dict): El estado adicional, útil para filtros o contexto.

    Returns:
        List[str]: Lista de textos relevantes ordenados por relevancia.
    """
    # Simplificar la consulta
    query = simplify_query_nltk(question)

    # Realizar la búsqueda híbrida con reranking
    results = vec.hybrid_search(
        query=query,
        country_code=country_code,
        keyword_k=keyword_n,
        semantic_k=semantic_n,
        rerank=True,
        top_n=top_n,
        fewshots=fewshots,
        all=all,
    )

    # reverse order the list of rows
    results = results[::-1]

    # Si results es un DataFrame, extrae la columna 'content' como lista
    if isinstance(results, pd.DataFrame):
        content_list = results["content"].tolist()
    elif isinstance(results, list):  # Si results ya es una lista de diccionarios
        content_list = [result["content"] for result in results]
    else:
        raise TypeError("ERROR! Resultados inesperados: no es ni DataFrame ni lista.")

    # logger.info("n\n\n ------> Reranked Results Content list:", content_list)

    # Retornar la lista de contenidos
    return content_list
