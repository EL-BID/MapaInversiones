import logging
import time
import threading
from datetime import datetime
from typing import Any, List, Optional, Tuple, Union
import pandas as pd
import psycopg
from psycopg2.pool import ThreadedConnectionPool
from modules.config import settings
from langchain_openai import AzureOpenAIEmbeddings  # Cambio aquí
from timescale_vector import client
from datetime import timedelta
from functools import lru_cache
from loguru import logger

from langchain_community.document_compressors.flashrank_rerank import FlashrankRerank
from flashrank import Ranker
from langchain.schema import Document

"""
This script:
- Manages vector store operations including embedding generation, table and index management, upserting records, and searching.
- Uses Azure OpenAI for embeddings and Timescale Vector for vector database operations.
- Implements dynamic filtering of search results based on configurable thresholds.
- Defines settings and thresholds for semantic search, keyword search, and few-shots similarity.
"""


def _get_threshold(setting_name: str, default: float) -> float:
    """Fetch a numeric threshold from settings with a safe fallback."""
    raw_value = getattr(settings, setting_name, default)
    try:
        value = float(raw_value)
    except (TypeError, ValueError):
        logger.warning(
            f"Invalid value '{raw_value}' for {setting_name}; using default {default}."
        )
        value = default
    return max(0.0, value)


# Umbrales iniciales que definen qué tan estrictos somos en cada canal.
SEMANTIC_DISTANCE_THRESHOLD = _get_threshold("semantic_distance_threshold", 0.35)
KEYWORD_MIN_RANK = _get_threshold("keyword_min_rank", 0.05)
FEWSHOTS_MIN_SIMILARITY = _get_threshold("fewshots_min_similarity", 0.8)
# Pasos con los que relajamos los umbrales cuando no hay suficientes resultados.
SEMANTIC_DISTANCE_RELAX_STEP = _get_threshold("semantic_distance_relax_step", 0.05)
KEYWORD_RANK_RELAX_STEP = _get_threshold("keyword_rank_relax_step", 0.02)
FEWSHOTS_SIMILARITY_RELAX_STEP = _get_threshold("fewshots_similarity_relax_step", 0.05)


def _get_int_setting(setting_name: str, default: int) -> int:
    raw_value = getattr(settings, setting_name, default)
    try:
        value = int(raw_value)
    except (TypeError, ValueError):
        logger.warning(
            f"Invalid value '{raw_value}' for {setting_name}; using default {default}."
        )
        value = default
    return max(0, value)


# Mínimos globales para no degradar demasiado el contexto ni la latencia.
RETRIEVAL_MIN_RESULTS = max(1, _get_int_setting("retrieval_min_results", 4))
RETRIEVAL_MAX_RELAX_ATTEMPTS = max(
    1, _get_int_setting("retrieval_max_relax_attempts", 3)
)


# ============================================================================
# Thread-safe connection pool singleton for vector operations
# Fixes: psycopg2.pool.PoolError: trying to put unkeyed connection
# ============================================================================
_vec_pool_lock = threading.Lock()
_vec_pool: ThreadedConnectionPool | None = None


def _get_vec_pool() -> ThreadedConnectionPool:
    """Get or create a thread-safe connection pool for vector operations."""
    global _vec_pool
    if _vec_pool is None:
        with _vec_pool_lock:
            if _vec_pool is None:
                logger.info(
                    "VEC_POOL ▸ Creating ThreadedConnectionPool (minconn=2, maxconn=10)"
                )
                _vec_pool = ThreadedConnectionPool(
                    minconn=2, maxconn=10, dsn=settings.psycopg_conn_string
                )
    return _vec_pool


class VectorSettings:
    """A class for storing vector table settings."""

    def __init__(self, table_name, embedding_dimensions, time_partition_interval):
        self.table_name = table_name
        self.embedding_dimensions = embedding_dimensions
        self.time_partition_interval = time_partition_interval


# Define default vector settings
default_vector_settings = VectorSettings(
    table_name="vw_documents_cleansql",
    embedding_dimensions=settings.azure_openai_embedding_dimensions,
    time_partition_interval=timedelta(days=7),
)

# Define cache vector settings
cache_vector_settings = VectorSettings(
    table_name="vw_documents_rawquestion",
    embedding_dimensions=settings.azure_openai_embedding_dimensions,
    time_partition_interval=timedelta(days=7),
)


class VectorStore:
    """A class for managing vector operations and database interactions."""

    def __init__(self, use_cache_view: bool = False):
        """Initialize the VectorStore with settings, Azure OpenAI Embeddings, and Timescale Vector client.

        Args:
            use_cache_view (bool): If True, uses the cache view (vw_documents_rawquestion) instead of the default table (documents).
        """
        self.embedding_model = AzureOpenAIEmbeddings(
            model=settings.azure_openai_embedding_name,
            api_key=settings.azure_openai_api_key,
            azure_endpoint=settings.azure_openai_endpoint,
            api_version=settings.azure_openai_api_version,
            dimensions=settings.azure_openai_embedding_dimensions,
        )
        self.vector_settings = (
            cache_vector_settings if use_cache_view else default_vector_settings
        )
        self.vec_client = client.Sync(
            settings.psycopg_conn_string,
            self.vector_settings.table_name,
            self.vector_settings.embedding_dimensions,
            time_partition_interval=self.vector_settings.time_partition_interval,
        )

        # NOTE: Removed unused self.sqlserverconn - was creating orphan connections

        # Thresholds tuned for relevance filtering
        self.semantic_distance_threshold = SEMANTIC_DISTANCE_THRESHOLD
        self.keyword_min_rank = KEYWORD_MIN_RANK
        self.fewshots_min_similarity = FEWSHOTS_MIN_SIMILARITY
        self.semantic_relax_step = SEMANTIC_DISTANCE_RELAX_STEP
        self.keyword_relax_step = KEYWORD_RANK_RELAX_STEP
        self.fewshots_relax_step = FEWSHOTS_SIMILARITY_RELAX_STEP
        self.min_results = RETRIEVAL_MIN_RESULTS
        self.max_relax_attempts = RETRIEVAL_MAX_RELAX_ATTEMPTS

    def create_keyword_search_index(self):
        """Create a GIN index for keyword search if it doesn't exist."""
        logger.info("Creating GIN index for keyword search...")
        index_name = f"idx_{self.vector_settings.table_name}_contents_gin"
        create_index_sql = f"""
        CREATE INDEX IF NOT EXISTS {index_name}
        ON {self.vector_settings.table_name} USING gin(to_tsvector('spanish', contents));
        """
        try:
            with psycopg.connect(settings.psycopg_conn_string) as conn:
                with conn.cursor() as cur:
                    cur.execute(create_index_sql)
                    conn.commit()
                    logging.info(f"GIN index '{index_name}' created or already exists.")
        except Exception as e:
            logging.error(f"Error while creating GIN index: {str(e)}")

    def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for the given text.

        Args:
            text: The input text to generate an embedding for.

        Returns:
            A list of floats representing the embedding.
        """
        text = text.replace("\n", " ")
        start_time = time.time()
        embedding = self.embedding_model.embed_query(text)  # Usamos Azure Embeddings
        elapsed_time = time.time() - start_time
        logging.info(f"Embedding generated in {elapsed_time:.3f} seconds")
        return embedding

    def create_tables(self) -> None:
        """Create the necessary tables in the database"""
        logger.info(f" --> Creating table: {self.vector_settings.table_name}")
        self.vec_client.create_tables()

    def create_index(self) -> None:
        """Create the StreamingDiskANN index to speed up similarity search"""

        # old
        # logger.info(f" --> Creating index: {self.vector_settings.table_name}")
        # self.vec_client.create_embedding_index(client.DiskAnnIndex())
        # new
        """Create the index to speed up similarity search"""
        logger.info(
            f" --> Creating optimized StreamingDiskANN index for: {self.vector_settings.table_name}"
        )
        self.vec_client.create_embedding_index(
            client.TimescaleVectorIndex(
                num_neighbors=60,  # 🔵 Más vecinos, mejor precisión para embeddings grandes
                search_list_size=120,  # 🔵 Mejora la calidad del grafo
                max_alpha=1.2,  # 🔵 Profundiza conexiones útiles en la búsqueda
            )
        )

    def drop_table(self) -> None:
        """Drop the table in the database"""
        logger.info(f"Dropping table: {self.vector_settings.table_name}")
        self.vec_client.drop_table()

    def drop_index(self) -> None:
        """Drop the StreamingDiskANN index in the database"""
        logger.info(f"Dropping index: {self.vector_settings.table_name}")
        self.vec_client.drop_embedding_index()

    def upsert(self, df: pd.DataFrame) -> None:
        """
        Insert or update records in the database from a pandas DataFrame.

        Args:
            df: A pandas DataFrame containing the data to insert or update.
                Expected columns: id, metadata, contents, embedding
        """
        logger.info("Upserting records into the vector store...")
        records = df.to_records(index=False)
        self.vec_client.upsert(list(records))
        logging.info(
            f"Inserted {len(df)} records into {self.vector_settings.table_name}"
        )

    def semantic_search(
        self,
        query: str,
        limit: int = 5,
        metadata_filter: Union[dict, List[dict]] = None,
        predicates: Optional[client.Predicates] = None,
        time_range: Optional[Tuple[datetime, datetime]] = None,
        return_dataframe: bool = True,
        max_distance: Optional[float] = None,
    ) -> Union[List[Tuple[Any, ...]], pd.DataFrame]:
        """
        Query the vector database for similar embeddings based on input text.

        More info:
            https://github.com/timescale/docs/blob/latest/ai/python-interface-for-pgvector-and-timescale-vector.md

        Args:
            query: The input text to search for.
            limit: The maximum number of results to return.
            metadata_filter: A dictionary or list of dictionaries for equality-based metadata filtering.
            predicates: A Predicates object for complex metadata filtering.
                - Predicates objects are defined by the name of the metadata key, an operator, and a value.
                - Operators: ==, !=, >, >=, <, <=
                - & is used to combine multiple predicates with AND operator.
                - | is used to combine multiple predicates with OR operator.
            time_range: A tuple of (start_date, end_date) to filter results by time.
            return_dataframe: Whether to return results as a DataFrame (default: True).

        Returns:
            Either a list of tuples or a pandas DataFrame containing the search results.

        Basic Examples:
            Basic search:
                vector_store.semantic_search("What are your shipping options?")
            Search with metadata filter:
                vector_store.semantic_search("Shipping options", metadata_filter={"category": "Shipping"})
        
        Predicates Examples:
            Search with predicates:
                vector_store.semantic_search("Pricing", predicates=client.Predicates("price", ">", 100))
            Search with complex combined predicates:
                complex_pred = (client.Predicates("category", "==", "Electronics") & client.Predicates("price", "<", 1000)) | \
                               (client.Predicates("category", "==", "Books") & client.Predicates("rating", ">=", 4.5))
                vector_store.semantic_search("High-quality products", predicates=complex_pred)
        
        Time-based filtering:
            Search with time range:
                vector_store.semantic_search("Recent updates", time_range=(datetime(2024, 1, 1), datetime(2024, 1, 31)))
        """
        query_embedding = self.get_embedding(query)

        start_time = time.time()

        search_args = {
            "limit": limit,
        }

        if metadata_filter:
            search_args["filter"] = metadata_filter

        if predicates:
            search_args["predicates"] = predicates

        if time_range:
            start_date, end_date = time_range
            search_args["uuid_time_filter"] = client.UUIDTimeRange(start_date, end_date)

        results = self.vec_client.search(query_embedding, **search_args)
        elapsed_time = time.time() - start_time

        self._log_search_time("Vector", elapsed_time)

        if not return_dataframe:
            return results

        df = self._create_dataframe_from_results(results)

        if max_distance is not None and not df.empty:
            before = len(df)
            df = df[df["distance"] <= max_distance].reset_index(drop=True)
            logger.info(
                "Filtered semantic results by max_distance %.3f → %d/%d kept",
                max_distance,
                len(df),
                before,
            )

        return df

    def _create_dataframe_from_results(
        self,
        results: List[Tuple[Any, ...]],
    ) -> pd.DataFrame:
        """
        Create a pandas DataFrame from the search results.

        Args:
            results: A list of tuples containing the search results.

        Returns:
            A pandas DataFrame containing the formatted search results.
        """
        # Convert results to DataFrame
        if not results:
            return pd.DataFrame(
                columns=["id", "content", "distance", "embedding", "metadata"]
            )

        df = pd.DataFrame(
            results, columns=["id", "metadata", "content", "embedding", "distance"]
        )

        # Expand metadata column
        df = pd.concat(
            [df.drop(["metadata"], axis=1), df["metadata"].apply(pd.Series)], axis=1
        )

        # Convert columns to convenient dtypes
        df["id"] = df["id"].astype(str)
        if "distance" in df.columns:
            df["distance"] = pd.to_numeric(df["distance"], errors="coerce")

        # Drop embeddings by default to avoid large payloads
        df = df.drop(columns=["embedding"], errors="ignore")

        return df

    def _dynamic_filter(
        self,
        df: pd.DataFrame,
        column: str,
        initial_threshold: Optional[float],
        min_results: int,
        step: float,
        higher_is_better: bool,
        *,
        min_threshold: float = 0.0,
        max_threshold: float = 1.0,
    ) -> Tuple[pd.DataFrame, Optional[float]]:
        """
        Iteratively relax a threshold until at least `min_results` remain.

        Args:
            df: DataFrame of scored results.
            column: Column name containing the score to filter on.
            initial_threshold: Starting threshold; if None no filtering is applied.
            min_results: Minimum results to keep (upper bounded by len(df)).
            step: Amount to relax the threshold per iteration.
            higher_is_better: True when larger scores are better (>= threshold), otherwise False
                meaning smaller scores are better (<= threshold).
            min_threshold/max_threshold: Bounds while relaxing.

        Returns:
            Tuple with filtered DataFrame (sorted by relevance) and the threshold used.
        """
        if df.empty or initial_threshold is None:
            return df.reset_index(drop=True), initial_threshold

        if column not in df.columns:
            logger.warning(
                "Column '%s' not in DataFrame; skipping dynamic filter.", column
            )
            return df.reset_index(drop=True), initial_threshold

        min_results = min(max(min_results, 1), len(df))
        step = max(step, 0.0)

        df_sorted = df.sort_values(
            by=column, ascending=not higher_is_better, na_position="last"
        ).reset_index(drop=True)

        current_threshold = initial_threshold
        attempts = 0

        def apply_threshold(threshold: float) -> pd.DataFrame:
            if higher_is_better:
                return df_sorted[df_sorted[column] >= threshold]
            return df_sorted[df_sorted[column] <= threshold]

        filtered = apply_threshold(current_threshold)

        while len(filtered) < min_results and attempts < self.max_relax_attempts:
            previous_threshold = current_threshold
            if higher_is_better:
                if current_threshold <= min_threshold:
                    break
                current_threshold = max(min_threshold, current_threshold - step)
            else:
                if current_threshold >= max_threshold:
                    break
                current_threshold = min(max_threshold, current_threshold + step)

            attempts += 1
            filtered = apply_threshold(current_threshold)
            logger.info(
                "Relaxing threshold for %s: %.3f → %.3f (%d results)",
                column,
                previous_threshold,
                current_threshold,
                len(filtered),
            )

        if filtered.empty:
            filtered = df_sorted.head(min_results)

        return filtered.reset_index(drop=True), current_threshold

    def delete(
        self,
        ids: List[str] = None,
        metadata_filter: dict = None,
        delete_all: bool = False,
    ) -> None:
        """Delete records from the vector database.

        Args:
            ids (List[str], optional): A list of record IDs to delete.
            metadata_filter (dict, optional): A dictionary of metadata key-value pairs to filter records for deletion.
            delete_all (bool, optional): A boolean flag to delete all records.

        Raises:
            ValueError: If no deletion criteria are provided or if multiple criteria are provided.

        Examples:
            Delete by IDs:
                vector_store.delete(ids=["8ab544ae-766a-11ef-81cb-decf757b836d"])

            Delete by metadata filter:
                vector_store.delete(metadata_filter={"category": "Shipping"})

            Delete all records:
                vector_store.delete(delete_all=True)
        """
        if sum(bool(x) for x in (ids, metadata_filter, delete_all)) != 1:
            raise ValueError(
                "Provide exactly one of: ids, metadata_filter, or delete_all"
            )

        if delete_all:
            self.vec_client.delete_all()
            logging.info(f"Deleted all records from {self.vector_settings.table_name}")
        elif ids:
            self.vec_client.delete_by_ids(ids)
            logging.info(
                f"Deleted {len(ids)} records from {self.vector_settings.table_name}"
            )
        elif metadata_filter:
            self.vec_client.delete_by_metadata(metadata_filter)
            logging.info(
                f"Deleted records matching metadata filter from {self.vector_settings.table_name}"
            )

    def _log_search_time(self, search_type: str, elapsed_time: float) -> None:
        """
        Log the time taken for a search operation.

        Args:
            search_type: The type of search performed (e.g., 'Vector', 'Keyword').
            elapsed_time: The time taken for the search operation in seconds.
        """
        logging.info(f"{search_type} search completed in {elapsed_time:.3f} seconds")

    def keyword_search(
        self,
        query: str,
        country_code: str,
        limit: int = 5,
        return_dataframe: bool = True,
        fewshots: bool = False,
        all: bool = False,
        use_websearch: bool = False,  # no se usa, siempre plainto_tsquery
    ) -> Union[List[Tuple[str, str, float]], pd.DataFrame]:
        """
        Realiza una búsqueda combinada de full-text search (tsquery) y trigram similarity
        según la configuración fewshots / all / notfewshots.
        """

        # Flujo general: ejecutar la consulta, evaluar si alcanzamos `min_required`
        # y, de ser necesario, relajar umbrales hasta el límite permitido.

        # Selección de función para la query
        # Force TEST :
        use_websearch = False
        tsquery_fn = "websearch_to_tsquery" if use_websearch else "plainto_tsquery"

        start_time = time.time()

        results: List[Tuple[str, str, float]] = []

        with psycopg.connect(settings.psycopg_conn_string) as conn:
            with conn.cursor() as cur:
                min_required = max(1, min(limit, self.min_results))
                if all:
                    # ── SQL optimizada (trgm con <->  +  sv_hit) ──────────────────────────────
                    search_sql = f"""
                    WITH
                    tsquery AS (                               -- full‑text rank
                        SELECT  d.id,
                                d.contents,
                                ts_rank_cd(d.contents_tsv,
                                        plainto_tsquery('spanish', %s)) * 10 AS rank
                        FROM    public.vw_documents_cleansql_noembeddings AS d
                        WHERE   d.contents_tsv @@ plainto_tsquery('spanish', %s)
                        AND   d.metadata->>'filtertype' = 'NotFewShots'
                        AND   (d.metadata->>'country_code' = %s OR d.metadata->>'country_code' = '*')
                        ORDER BY rank DESC
                        LIMIT   5
                    ),

                    trgm AS (                                  -- trigram distance
                        SELECT  d.id,
                                d.contents,
                                1 - (d.contents_clean <-> process_text(%s)) AS rank
                        FROM    public.vw_documents_cleansql_noembeddings AS d
                        WHERE   (d.metadata->>'country_code' = %s OR d.metadata->>'country_code' = '*')
                        AND   d.metadata->>'filtertype' = 'NotFewShots'
                        ORDER BY d.contents_clean <-> process_text(%s)        -- usa índice trgm
                        LIMIT   5
                    ),

                    sv_hit AS (                                -- pre‑filtrado de sch_values
                        SELECT  sv.unique_value
                        FROM    sch_values sv
                        WHERE   sv.pais_iso3 = %s
                        AND   sv.is_valid
                        AND   process_text(sv.unique_value) <%% %s   -- ← escapado
                        ORDER BY process_text(sv.unique_value) <-> %s
                        LIMIT   30
                    ),

                    sch AS (                                   -- matching documentos × sv_hit
                        SELECT DISTINCT d.id,
                            d.contents,
                            similarity(process_text(sv.unique_value), word) AS rank
                        FROM   sv_hit sv
                        CROSS  JOIN LATERAL unnest(process_text_to_words(%s)) AS word
                        JOIN   public.vw_documents_cleansql_noembeddings d
                            ON d.contents_clean ILIKE '%%' || process_text(sv.unique_value) || '%%'
                        WHERE  (d.metadata->>'country_code' = %s OR d.metadata->>'country_code' = '*')
                        AND  d.metadata->>'filtertype' = 'NotFewShots'
                        ORDER BY rank DESC
                        LIMIT   5
                    )

                    SELECT DISTINCT ON (id) id, contents, rank
                    FROM (
                        SELECT * FROM tsquery
                        UNION ALL
                        SELECT * FROM trgm
                        UNION ALL
                        SELECT * FROM sch
                    ) s
                    ORDER BY id, rank DESC
                    LIMIT %s;
                    """

                    # ── parámetros en el orden exacto de los %s ──────────────────────────────
                    cur.execute(
                        search_sql,
                        (
                            query,  # 1  tsquery ts_rank_cd
                            query,  # 2  tsquery @@
                            country_code,  # 3  país en tsquery
                            query,  # 4  trgm rank  (process_text(%s))
                            country_code,  # 5  país en trgm
                            query,  # 6  trgm ORDER BY <->
                            country_code,  # 7  sv_hit.pais_iso3
                            query,  # 8  sv_hit operador <%
                            query,  # 9  sv_hit ORDER BY <->
                            query,  # 10 process_text_to_words(%s)  (palabras de la pregunta)
                            country_code,  # 11 país en sch
                            limit,  # 12 LIMIT final
                        ),
                    )

                elif fewshots:
                    search_sql = f"""
                        SELECT 
                            d.id,
                            d.contents,
                            similarity(process_text(sv.unique_value), word)::double precision AS rank
                        FROM sch_values sv
                        CROSS JOIN LATERAL unnest(process_text_to_words(%s)) AS word
                        JOIN public.vw_documents_cleansql_noembeddings d 
                            ON d.contents_clean ILIKE '%%' || process_text(sv.unique_value) || '%%'
                        WHERE sv.pais_iso3 = %s
                        AND sv.is_valid = true
                        AND similarity(process_text(sv.unique_value), word) > %s
                        AND (
                            ',' || lower(d.metadata->>'country_code') || ',' ILIKE '%%,' || lower(%s) || ',%%'
                            OR d.metadata->>'country_code' = '*'
                            )
                        AND d.metadata->>'filtertype' = 'FewShots'
                        ORDER BY rank DESC NULLS LAST
                        LIMIT %s;
                    """
                    # Reintentamos con un umbral de similitud cada vez más laxo hasta cubrir el mínimo.
                    similarity_threshold = self.fewshots_min_similarity
                    attempt = 0
                    results = []
                    while True:
                        cur.execute(
                            search_sql,
                            (
                                query,
                                country_code,
                                similarity_threshold,
                                country_code,
                                limit,
                            ),
                        )
                        results = cur.fetchall()
                        if (
                            len(results) >= min_required
                            or similarity_threshold <= 0.0
                            or attempt >= self.max_relax_attempts
                        ):
                            break
                        attempt += 1
                        similarity_threshold = max(
                            0.0, similarity_threshold - self.fewshots_relax_step
                        )
                    # `similarity_threshold` captures the relaxed value used in the final query

                else:  # NotFewShots
                    search_sql = f"""
                        SELECT 
                            d.id,
                            d.contents,
                            ts_rank_cd(to_tsvector('spanish', d.contents_clean), q)::double precision * 10 AS rank
                        FROM public.vw_documents_cleansql_noembeddings d,
                            plainto_tsquery('spanish', %s) q
                        WHERE to_tsvector('spanish', d.contents_clean) @@ q
                        AND d.metadata->>'filtertype' = 'NotFewShots'
                        AND (
                            ',' || lower(d.metadata->>'country_code') || ',' ILIKE '%%,' || lower(%s) || ',%%'
                            OR d.metadata->>'country_code' = '*'
                        )
                        ORDER BY rank DESC NULLS LAST
                        LIMIT %s;
                    """
                    cur.execute(search_sql, (query, country_code, limit))

                if not fewshots:
                    results = cur.fetchall()

        elapsed = time.time() - start_time
        logger.info(f"✅ Resultados keyword encontrados: {len(results)}")
        self._log_search_time("Keyword", elapsed)

        if return_dataframe:
            df = pd.DataFrame(results, columns=["id", "content", "rank"])
            df["id"] = df["id"].astype(str)
            if not df.empty:
                df["rank"] = pd.to_numeric(df["rank"], errors="coerce").fillna(0.0)
                if fewshots:
                    df, applied = self._dynamic_filter(
                        df,
                        "rank",
                        self.fewshots_min_similarity,
                        min_required,
                        self.fewshots_relax_step,
                        higher_is_better=True,
                        min_threshold=0.0,
                        max_threshold=1.0,
                    )
                    logger.info(
                        "Fewshots similarity threshold %.3f → %.3f (%d resultados)",
                        self.fewshots_min_similarity,
                        applied,
                        len(df),
                    )
                else:
                    df, applied = self._dynamic_filter(
                        df,
                        "rank",
                        self.keyword_min_rank,
                        min_required,
                        self.keyword_relax_step,
                        higher_is_better=True,
                        min_threshold=0.0,
                        max_threshold=1.0,
                    )
                    logger.info(
                        "Keyword rank threshold %.3f → %.3f (%d resultados)",
                        self.keyword_min_rank,
                        applied,
                        len(df),
                    )
                df = df.head(limit).reset_index(drop=True)
                df["score"] = df["rank"].fillna(0.0)
                if fewshots:
                    df["similarity_threshold"] = applied
            return df
        else:
            return results

    def hybrid_search(
        self,
        query: str,
        country_code: str,
        keyword_k: int = 5,
        semantic_k: int = 5,
        rerank: bool = True,
        top_n: int = 5,
        fewshots: bool = False,
        all: bool = False,
        use_websearch: bool = True,  # Para extender coherencia con keyword_search
    ) -> pd.DataFrame:
        """
        Realiza una búsqueda híbrida combinando búsqueda por palabras clave y semántica.
        """
        # Ambos canales llegan filtrados con `_dynamic_filter`; aquí sólo orquestamos
        # el merge, el dedupe y la normalización de scores para el reranker.
        # --- Keyword search ---
        keyword_kwargs = {
            "query": query,
            "country_code": country_code,
            "limit": keyword_k,
            "return_dataframe": True,
            "fewshots": fewshots,
            "all": all,
            "use_websearch": use_websearch,
        }

        logger.info("\n🔍 START Ejecutando búsqueda :::: keyword_search\n")
        keyword_results = self.keyword_search(**keyword_kwargs)
        if keyword_results.empty:
            keyword_results = pd.DataFrame(columns=["id", "content", "rank", "score"])
        keyword_results["search_type"] = "keyword"
        if "score" not in keyword_results.columns:
            keyword_results["score"] = keyword_results.get("rank", 0.0)
        logger.info(
            "\n🔍 END Ejecutando keyword_search :: %d resultados tras filtro\n",
            len(keyword_results),
        )

        # --- Semantic search ---
        if all:
            semantic_filter = {"country_code": country_code, "filtertype": "FewShots"}
        else:
            semantic_filter = {
                "filtertype": "FewShots" if fewshots else "NotFewShots",
                "country_code": country_code,
            }

        logger.info("🔍 START Ejecutando búsqueda :::: semantic_search")
        semantic_results = self.semantic_search(
            query=query,
            limit=semantic_k,
            return_dataframe=True,
            metadata_filter=semantic_filter,
            max_distance=None,
        )
        if semantic_results.empty:
            semantic_results = pd.DataFrame(columns=["id", "content", "distance"])
        semantic_results["search_type"] = "semantic"
        if "distance" not in semantic_results.columns:
            semantic_results["distance"] = 1.0
        # Aplicamos el mismo esquema de relajación pero ahora sobre distancias (cuanto menor, mejor).
        semantic_results, applied_semantic = self._dynamic_filter(
            semantic_results,
            "distance",
            self.semantic_distance_threshold,
            min(self.min_results, max(1, semantic_k)),
            self.semantic_relax_step,
            higher_is_better=False,
            min_threshold=0.0,
            max_threshold=1.0,
        )
        semantic_results["similarity"] = 1 - semantic_results["distance"].clip(
            lower=0, upper=1
        )
        semantic_results["score"] = semantic_results["similarity"].clip(lower=0.0)
        semantic_results = semantic_results.head(semantic_k).reset_index(drop=True)
        semantic_results = semantic_results[
            ["id", "content", "search_type", "distance", "similarity", "score"]
        ]
        logger.info(
            "🔍 END Ejecutando semantic_search :: %d resultados tras filtro (threshold %.3f → %.3f)",
            len(semantic_results),
            self.semantic_distance_threshold,
            applied_semantic,
        )

        # --- logger for keyword_results and semantic_results
        logger.info(
            f"--- HYBRID SEARCH: Keyword results: {keyword_results.to_dict(orient='records')}"
        )

        logger.info(
            f"--- HYBRID SEARCH: Semantic results: {semantic_results.to_dict(orient='records')}"
        )

        # --- Combine and de-duplicate ---
        combined_results = pd.concat(
            [keyword_results, semantic_results], ignore_index=True, sort=False
        )

        if combined_results.empty:
            logger.info("Hybrid search sin resultados tras filtros.")
            return combined_results

        combined_results = combined_results.sort_values(
            by="score", ascending=False, na_position="last"
        )
        combined_results = combined_results.drop_duplicates(
            subset=["content"], keep="first"
        ).reset_index(drop=True)

        # --- Combined results logging:
        logger.info(
            f"--- HYBRID SEARCH: Combined results: {combined_results.to_dict(orient='records')}"
        )

        # --- Optional reranking ---
        if rerank:
            return self._rerank_results(query, combined_results, top_n)

        result = combined_results.head(top_n).copy()
        result = result.rename(columns={"score": "relevance_score"})
        return result

    from langchain_community.document_compressors.flashrank_rerank import (
        FlashrankRerank,
    )

    from flashrank import Ranker
    from langchain.schema import Document
    import pandas as pd

    def _rerank_results(
        self, query: str, combined_results: pd.DataFrame, top_n: int
    ) -> pd.DataFrame:
        """
        Re-rankea los resultados combinados usando FlashRank y devuelve un DataFrame ordenado.

        Args:
            query: Consulta en lenguaje natural.
            combined_results: DataFrame con columnas 'id', 'content', 'search_type'.
            top_n: Cantidad máxima de resultados a devolver.

        Returns:
            DataFrame ordenado con columnas: id, content, search_type, relevance_score.
        """

        # Validación básica
        if combined_results.empty:
            return pd.DataFrame(
                columns=["id", "content", "search_type", "relevance_score"]
            )

        # Inicializa el cliente de FlashRank
        flashrank_client = Ranker(max_length=256, cache_dir="/app/.cache/flashrank")

        # Crea instancia del reranker
        reranker = FlashrankRerank(client=flashrank_client, top_n=top_n)

        # Prepara los documentos
        documents = [
            Document(
                page_content=row["content"],
                metadata={
                    "id": row["id"],
                    "search_type": row.get("search_type", ""),
                    "base_score": float(row.get("score", 0.0)),
                },
            )
            for _, row in combined_results.iterrows()
        ]

        # Aplica el reranking
        try:
            reranked_docs = reranker.compress_documents(documents, query)
        except Exception as e:
            logger.error(f"❌ Error en FlashRank: {e}")
            fallback = combined_results.copy()
            fallback = fallback.rename(columns={"score": "relevance_score"})
            return fallback.head(top_n)

        rows = []
        for doc in reranked_docs:
            base_score = float(doc.metadata.get("base_score", 0.0))
            relevance = doc.metadata.get("relevance_score")
            if relevance is None:
                relevance = base_score
            rows.append(
                {
                    "id": doc.metadata.get("id"),
                    "content": doc.page_content,
                    "search_type": doc.metadata.get("search_type"),
                    "base_score": base_score,
                    "relevance_score": float(relevance),
                }
            )

        reranked_df = pd.DataFrame(rows)
        return reranked_df.head(top_n)

    def semantic_cache_query(
        self,
        country_code: str,
        question: str,
    ) -> Union[List[Tuple[Any, ...]], pd.DataFrame]:
        """
        Perform a semantic search filtered by country code, with a minimum similarity score of 0.9.

        Args:
            country_code: The country code to filter results by.
            question: The question to search for.

        Returns:
            A pandas DataFrame containing filtered search results with distance ≤ 0.1.
        """

        # Get query embedding
        query_embedding = self.get_embedding(question)

        # Define metadata filter
        metadata_filter = {
            "category": "sch_fewshots",
            "filtertype": "FewShots",
            "is_valid": True,
            "country_code": country_code,
        }

        # Search parameters
        search_args = {
            "limit": 1,
            "filter": metadata_filter,
        }

        # Perform search
        start_time = time.time()
        results = self.vec_client.search(query_embedding, **search_args)
        logger.info(f"✅ pre search cache query results: {results}")
        elapsed_time = time.time() - start_time
        self._log_search_time("Vector", elapsed_time)

        # Convert results to DataFrame
        df = pd.DataFrame(
            results, columns=["id", "metadata", "content", "embedding", "distance"]
        )

        # Expand metadata column
        df = pd.concat(
            [df.drop(["metadata"], axis=1), df["metadata"].apply(pd.Series)], axis=1
        )

        # Convert id to string for readability
        df["id"] = df["id"].astype(str)

        # Filter by minimum similarity threshold (distance <= threshold)
        threshold = settings.cache_semantic_threshold
        filtered_df = df[df["distance"] <= threshold].reset_index(drop=True)

        # Filter empty/invalid results to prevent empty cache hits
        data_col = None
        if "results" in filtered_df.columns:
            data_col = "results"
        elif "expected_output" in filtered_df.columns:
            data_col = "expected_output"

        if data_col:
            filtered_df = filtered_df[
                filtered_df[data_col].apply(
                    lambda x: (
                        x is not None
                        and x != []
                        and x != "[]"
                        and (not isinstance(x, str) or x.strip() != "")
                    )
                )
            ].reset_index(drop=True)

        logger.info(
            f"✅ Semantic cache query results: {filtered_df.to_dict(orient='records')}"
        )

        return filtered_df
