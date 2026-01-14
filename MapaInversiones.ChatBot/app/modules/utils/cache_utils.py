import pandas as pd
import os

import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import ThreadedConnectionPool

from contextlib import contextmanager
import threading

# from databricks import sql

from modules.config import settings

from loguru import logger

from datetime import datetime, timedelta
from modules.tools.vector_store import VectorStore
from modules.utils.markdown_utils import markdown_to_html
import json

# CONECTIONTYPE = settings.connection_type

"""
This script:
- Cache utilities for managing question and answer caching.
- Manages database connections using a connection pool.
- Provides functions to fetch and execute SQL queries.
- Contains specific functions to interact with a cache table for questions and answers.
"""


def _to_int(value, default=None):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


POOL_MIN = _to_int(os.getenv("CACHE_DB_POOL_MIN"), 1)
POOL_MAX = _to_int(os.getenv("CACHE_DB_POOL_MAX"), 5)
CONNECT_TIMEOUT = _to_int(os.getenv("CACHE_DB_TIMEOUT"), 5)


def _build_conn_kwargs():
    kwargs = {
        "host": settings.effective_postgres_host,
        "dbname": settings.postgres_database,
        "user": settings.postgres_user,
        "password": settings.postgres_password,
        "connect_timeout": CONNECT_TIMEOUT,
    }

    port = _to_int(settings.effective_postgres_port)
    if port:
        kwargs["port"] = port

    return kwargs


_pool_lock = threading.Lock()
_pool: ThreadedConnectionPool | None = None


def _get_pool() -> ThreadedConnectionPool:
    global _pool
    if _pool is None:
        with _pool_lock:
            if _pool is None:
                logger.info(
                    "Inicializando pool de conexiones para cache (min={}, max={})",
                    POOL_MIN,
                    POOL_MAX,
                )
                try:
                    _pool = ThreadedConnectionPool(
                        minconn=POOL_MIN,
                        maxconn=max(POOL_MAX, POOL_MIN),
                        **_build_conn_kwargs(),
                    )
                except Exception:  # pragma: no cover - fail fast during init
                    logger.exception("Fallo inicializando pool de caché")
                    raise
    return _pool


@contextmanager
def get_connection(*, autocommit: bool = True):
    pool = _get_pool()
    conn = pool.getconn()
    original_autocommit = conn.autocommit
    conn.autocommit = autocommit
    try:
        yield conn
        if not autocommit:
            conn.commit()
    except Exception:
        if not autocommit:
            try:
                conn.rollback()
            except Exception:
                logger.exception("Rollback failed on cache connection")
        raise
    finally:
        conn.autocommit = original_autocommit
        pool.putconn(conn)


def _fetch_all(sql: str, params=None):
    with get_connection() as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(sql, params)
            return cursor.fetchall()


def _execute(sql: str, params=None) -> int:
    with get_connection(autocommit=False) as connection:
        with connection.cursor() as cursor:
            cursor.execute(sql, params)
            return cursor.rowcount


DATABRICKS_TOKEN = ""


# Cargar la variable de entorno
CACHE_QUESTIONS_FILE = os.getenv("CACHE_QUESTIONS_FILE")

"""
def get_cache_questions():
    # Get the questions from the cache database in a dictionary format
    logger.info(f"--> entro A CACHÉ QUESTIONS")
    # get_questions_cache_databricks()
    df = pd.read_csv(CACHE_QUESTIONS_FILE, encoding="utf-8")
    df_subset = df[["Id", "Question"]]
    logger.info(f"--> df_subset {df_subset}")
    return df_subset.to_dict(orient="records")
"""


def get_questions_cache():
    """
    Devuelve todas las preguntas almacenadas en caché con los campos mínimos necesarios:
    'id', 'question' y 'pais'.

    Returns:
        list[dict] | None: Lista de preguntas en caché o None si ocurre un error.
    """
    results = get_cache()
    if results is None:
        return None

    filtered_results = [
        {
            "id": record.get("id"),
            "question": record.get("question"),
            "pais": record.get("pais"),
        }
        for record in results
    ]

    return filtered_results


def get_questions_cache_by_country(country: str = None):
    """
    Filtra los registros de caché por país y devuelve solo los campos 'id', 'question' y 'pais'.

    Args:
        country (str): Código del país (ej. 'dom').

    Returns:
        list[dict] | None: Lista de preguntas en caché con solo los campos esenciales, o None si ocurre un error.
    """
    results = get_cache_by_country(country)
    if results is None:
        return None

    filtered_results = [
        {
            "id": record.get("id"),
            "question": record.get("question"),
            "pais": record.get("pais"),
        }
        for record in results
    ]

    return filtered_results


def get_cache():
    """
    Obtiene todos los registros almacenados en la tabla de caché de preguntas.

    Returns:
        list[dict] | None: Lista de registros en caché o None si ocurre un error.
    """
    try:
        logger.info("entro por sql → get_cache")

        sql_query = """
            SELECT id, question, answer, pais, totalsearch, questionsummary
            FROM public.cache_mapainv_chat
        """

        logger.info(f"--sql_query: {sql_query.strip()}")
        return _fetch_all(sql_query)

    except Exception as e:
        logger.error(f"❌ Error en get_cache: {e}")
        return None


def get_cache_by_id(id: int):
    """
    Obtiene un registro específico de la tabla de caché según su ID.

    Args:
        id (int): ID del registro en caché.

    Returns:
        list[dict] | None: Lista con el registro encontrado (puede ser vacío), o None si hay un error.
    """
    try:
        logger.info("entro por sql → get_cache_by_id")
        sql_query = """
            SELECT id, pais, question, query, answer, date, source, profile, comments,
                   totalsearch, totallikes, questionsummary
            FROM public.cache_mapainv_chat
            WHERE id = %s
        """
        params = (id,)

        logger.info(f"--sql_query: {sql_query.strip()} -- params: {params}")
        return _fetch_all(sql_query, params)

    except Exception as e:
        logger.error(f"❌ Error en get_cache_by_id: {e}")
        return None


def get_question_ia(question: str, session_id: str | None, country: str, answer: str):
    """
    Busca una pregunta ya registrada en la base según el contenido de la pregunta, país y respuesta,
    con o sin sesión de usuario.

    Args:
        question (str): Pregunta realizada.
        session_id (str | None): ID de la sesión del usuario (o None si no hay).
        country (str): País de origen de la pregunta.
        answer (str): Respuesta generada.

    Returns:
        list[dict] | None: Lista con los registros encontrados o None si ocurre un error.
    """
    try:
        logger.info("entro por sql → get_question_ia")
        logger.info(f"session_id => {session_id}")

        if session_id is None:
            logger.info("entro por session None")
            sql_query = """
                SELECT id, pais, question, query, answer, date, source, profile, comments,
                       totalsearch, totallikes, usersession, trace, questionsummary
                FROM public.questions_mapainv_chat
                WHERE question = %s
                  AND pais = %s
                  AND answer = %s
                  AND usersession IS NULL
                ORDER BY id DESC
            """
            params = (question, country, answer)
        else:
            sql_query = """
                SELECT id, pais, question, query, answer, date, source, profile, comments,
                       totalsearch, totallikes, usersession, trace, questionsummary
                FROM public.questions_mapainv_chat
                WHERE question = %s
                  AND pais = %s
                  AND answer = %s
                  AND usersession IS NOT NULL
                  AND usersession = %s
                ORDER BY id DESC
            """
            params = (question, country, answer, session_id)

        logger.info(f"--sql_query:\n{sql_query.strip()} -- params: {params}")
        return _fetch_all(sql_query, params)

    except Exception as e:
        logger.error(f"❌ Error en get_question_ia: {e}")
        return None


def get_question_ia_by_id(id: int, session_id: str | None):
    """
    Obtiene una pregunta del historial por su ID y, si corresponde, valida la sesión de usuario asociada.

    Args:
        id (int): ID de la pregunta.
        session_id (str | None): ID de la sesión de usuario, o None si no aplica.

    Returns:
        list[dict] | None: Lista con la pregunta encontrada (si existe), o None si ocurre un error.
    """
    try:
        logger.info("---------> entro por sql: get_question_ia_by_id")
        logger.info(f"session_id: {session_id}")
        if session_id is None:
            sql_query = """
                SELECT id, pais, question, query, answer, date, source, profile, comments,
                       totalsearch, totallikes, usersession, trace, isapproved,
                       commentdisapproved, questionsummary
                FROM public.questions_mapainv_chat
                WHERE id = %s AND usersession IS NULL
                ORDER BY id DESC
            """
            params = (id,)
        else:
            sql_query = """
                SELECT id, pais, question, query, answer, date, source, profile, comments,
                       totalsearch, totallikes, usersession, trace, isapproved,
                       commentdisapproved, questionsummary
                FROM public.questions_mapainv_chat
                WHERE id = %s AND usersession IS NOT NULL AND usersession = %s
                ORDER BY id DESC
            """
            params = (id, session_id)

        logger.info(f"--sql_query:\n{sql_query.strip()} -- params: {params}")
        return _fetch_all(sql_query, params)

    except Exception as e:
        logger.error(f"❌ Error en get_question_ia_by_id: {e}")
        return None


def get_cache_by_country(country: str = None):
    """
    Obtiene las respuestas almacenadas en caché para un país específico.

    Args:
        country (str): Código del país (ej. 'dom').

    Returns:
        list[dict] | None: Lista de registros que coinciden con el país, o None si ocurre un error.
    """
    try:
        logger.info("entro por sql → get_cache_by_country")
        sql_query = """
            SELECT id, question, answer, pais, totalsearch, questionsummary
            FROM public.cache_mapainv_chat
            WHERE pais = %s
        """

        logger.info(f"SQL query: {sql_query} -- param: {country}")
        return _fetch_all(sql_query, (country,))

    except Exception as e:
        logger.error(f"❌ Error en get_cache_by_country: {e}")
        return None


def get_cached_answer(question_similarity_id: int, pais: str):
    """
    Obtiene una respuesta del caché según el ID de similitud de la pregunta.
    Si se encuentra, incrementa el contador 'TotalSearch' y devuelve la respuesta.

    Args:
        question_similarity_id (int): ID de la pregunta similar en caché.
        pais (str): País al que se asocia la pregunta.

    Returns:
        list[dict] | None: Lista con un único dict que contiene Id, Answer y Pais, o None si no se encuentra.
    """
    try:
        db = get_cache()
        item = next(
            (item for item in db if item["id"] == int(question_similarity_id)), None
        )
        logger.info(f"--> item: {item}")

        if item is not None:
            answer_id = item.get("id")
            answer_by_question = item.get("answer")
            total_search = item.get("totalsearch", 0)

            data = [{"Id": answer_id, "Answer": answer_by_question, "Pais": pais}]

            # Incrementar TotalSearch en +1
            update_success = update_cache(
                total_search + 1, "id", question_similarity_id
            )
            logger.info(f"--> update_success: {update_success}")

            return data

        return None

    except Exception as e:
        logger.error(f"❌ Error en get_cached_answer: {e}")
        return None


def update_cache(totalSearch, condition_field, condition_value):
    """
    Actualiza el valor de 'totalsearch' en la tabla cache_mapainv_chat
    según el campo de condición especificado (actualmente solo se permite 'id').

    Args:
        totalSearch (int): Nuevo valor para el campo totalsearch.
        condition_field (str): Campo de condición para el WHERE (solo 'id' permitido).
        condition_value (any): Valor que debe cumplir el campo de condición.

    Returns:
        bool: True si se actualizó correctamente, None si hubo un error.
    """
    try:
        logger.info(f"entro por sql a update_cache")
        logger.info(f"totalSearch: {totalSearch}")
        logger.info(f"condition_field: {condition_field}")
        logger.info(f"condition_value: {condition_value}")

        # Validar que condition_field sea un campo permitido para evitar SQL injection
        if condition_field.lower() != "id":
            raise ValueError(f"Campo no permitido para condición: {condition_field}")

        query = f"""
            UPDATE public.cache_mapainv_chat
            SET totalsearch = %s
            WHERE {condition_field} = %s
        """
        params = (totalSearch, condition_value)

        logger.info(f"-- update_query: {query} -- params: {params}")
        rowcount = _execute(query, params)
        if rowcount:
            logger.success(
                "✅ Registro actualizado exitosamente donde {} = {}.",
                condition_field,
                condition_value,
            )
            return True
        logger.warning(
            "⚠️ No se encontraron filas para actualizar donde {} = {}.",
            condition_field,
            condition_value,
        )
        return False

    except Exception as e:
        logger.error(f"❌ Error en update_cache: {e}")
        return None


def update_approved(
    id: int, totalLikes: int, isApproved: int, commentDisApproved: str, isCache: bool
):
    """
    Actualiza el estado de aprobación de una pregunta, ya sea en caché o en el historial completo.

    Args:
        id (int): ID de la pregunta a actualizar.
        totalLikes (int): Número actual de likes para la pregunta.
        isApproved (int): 1 si se aprueba, 0 si se desaprueba (convertido a booleano internamente).
        commentDisApproved (str): Comentario en caso de desaprobación.
        isCache (bool): True si se actualiza en caché, False si en preguntas completas.

    Returns:
        bool | None: True si se actualizó correctamente, None si ocurrió un error.
    """
    try:
        logger.info(
            "UPDATE_APPROVED ▸ target_table=%s id=%s totalLikes=%s isApproved=%s isCache=%s",
            "cache_mapainv_chat" if isCache else "questions_mapainv_chat",
            id,
            totalLikes,
            isApproved,
            isCache,
        )
        table_name = "cache_mapainv_chat" if isCache else "questions_mapainv_chat"
        approved_value = bool(isApproved)

        if not approved_value:
            query = f"""
                UPDATE public.{table_name}
                SET isapproved = %s,
                    commentdisapproved = %s,
                    totallikes = 0
                WHERE id = %s
            """
            params = (approved_value, commentDisApproved, id)
        else:
            query = f"""
                UPDATE public.{table_name}
                SET isapproved = %s,
                    commentdisapproved = '',
                    totallikes = %s
                WHERE id = %s
            """
            params = (approved_value, totalLikes + 1, id)

        logger.info(
            "UPDATE_APPROVED ▸ query=%s params=%s",
            query.strip().replace("\n", " "),
            params,
        )
        rowcount = _execute(query, params)
        if rowcount:
            logger.success(
                "UPDATE_APPROVED ▸ updated rows=%s id=%s approved=%s likes=%s",
                rowcount,
                id,
                approved_value,
                params[1] if approved_value else 0,
            )
            return True

        logger.warning(
            "UPDATE_APPROVED ▸ no rows updated id=%s approved=%s",
            id,
            approved_value,
        )
        return False

    except Exception as e:
        logger.error("UPDATE_APPROVED ▸ error id=%s: %s", id, e)
        return None


def get_topics_by_country(country: str = None):
    """
    Devuelve una lista de temas (preguntas, fuentes y resúmenes) filtrados por país desde la caché.

    Args:
        country (str): Código del país (ej. 'dom').

    Returns:
        list[dict] | None: Lista de temas encontrados o None si ocurre un error.
    """
    try:
        logger.info("entro por sql → get_topics_by_country")
        sql_query = """
            SELECT id, question, source, questionsummary
            FROM public.cache_mapainv_chat
            WHERE pais = %s
        """
        params = (country,)

        logger.info(f"sql_query: {sql_query.strip()} -- params: {params}")
        rows = _fetch_all(sql_query, params) or []
        for row in rows:
            trace_html = row.get("trace") if isinstance(row, dict) else None
            if trace_html:
                continue
            answer_text = row.get("answer") if isinstance(row, dict) else None
            if answer_text:
                try:
                    row["trace"] = markdown_to_html(answer_text)
                except Exception as exc:  # pragma: no cover
                    logger.warning(
                        f"No se pudo renderizar HTML para historial cache: {exc}"
                    )
        return rows

    except Exception as e:
        logger.error(f"❌ Error en get_topics_by_country: {e}")
        return None


def api_get_topics_by_country(country: str = None):
    results = get_topics_by_country(country)
    if results is None:
        return None
    filtered_results = results
    return filtered_results


def _normalize_session_id(session_id: str | None) -> str:
    if not session_id:
        return ""
    cleaned = re.sub(r"[^A-Za-z0-9_\\-]", "", str(session_id))
    return cleaned[:128]


def get_question_history_by_sessionId(sesionId: str = None):
    """
    Obtiene el historial de preguntas de una sesión específica desde la tabla de preguntas.

    Args:
        sesionId (str): ID de la sesión de usuario.

    Returns:
        list[dict] | None: Lista de preguntas ordenadas por ID descendente, o None si ocurre un error.
    """
    try:
        normalized_session = _normalize_session_id(sesionId)
        if not normalized_session:
            logger.warning(
                "get_question_history_by_sessionId recibió session vacío/invalid."
            )
            return []

        logger.info(f"------> Session ID desde caché utils: {normalized_session}")
        sql_query = """
            SELECT
                id,
                question,
                answer,
                trace,
                source,
                questionsummary,
                isapproved,
                commentdisapproved,
                date
            FROM public.questions_mapainv_chat
            WHERE usersession = %s
            ORDER BY id DESC
        """
        params = (normalized_session,)

        logger.info(f"sql_query: {sql_query.strip()} -- params: {params}")
        return _fetch_all(sql_query, params)

    except Exception as e:
        logger.error(f"❌ Error en get_question_history_by_sessionId: {e}")
        return None


def get_cache_hit(user_question: str, country_code: str):
    """
    Check if the user question is in the cache and process the results.
    Returns a dictionary containing cache hit information and processed data.
    """

    # Initialize vector store with cache view
    vec = VectorStore(use_cache_view=True)

    # Perform semantic cache search
    results = vec.semantic_cache_query(
        country_code=country_code,
        question=user_question,
    )

    logger.info(f"Semantic cache results (DataFrame):\n{results.to_string()}")

    # Initialize return values
    cache_info = {
        "is_cache_hit": False,
        "is_recent_cache_hit": False,
        "sql_query": None,
        "results": None,
        "question": None,
    }

    if isinstance(results, pd.DataFrame):
        logger.info(f"Semantic cache results (DataFrame):\n{results.to_string()}")
        if not results.empty:
            cache_info["is_cache_hit"] = True
            cache_info["sql_query"] = (
                results["sql_query"].iloc[0] if "sql_query" in results.columns else None
            )
            cache_info["results"] = (
                results["results"].iloc[0] if "results" in results.columns else None
            )
            cache_info["question"] = (
                results["question"].iloc[0] if "question" in results.columns else None
            )

            # Check if updated_at is within the last month
            if "updated_at" in results.columns:
                updated_at = results["updated_at"].iloc[0]
                if updated_at:
                    current_time = datetime.now()
                    one_month_ago = current_time - pd.Timedelta(days=30)
                    cache_info["is_recent_cache_hit"] = (
                        pd.to_datetime(updated_at) > one_month_ago
                    )
    else:
        logger.info(f"Semantic cache results (List):\n{json.dumps(results, indent=2)}")
        if results:
            cache_info["is_cache_hit"] = True
            cache_info["is_recent_cache_hit"] = True
            cache_info["sql_query"] = results.get("sql_query")
            cache_info["results"] = results.get("results")
            cache_info["question"] = results.get("question")

    return cache_info


def get_cache_hit_sql(user_question: str, country_code: str):
    """
    Check if the user question is in the sch_fewshots table using SQL matching (Tier 0).
    Uses unaccent + ILIKE for flexible text matching.
    """
    cache_info = {
        "is_cache_hit": False,
        "is_recent_cache_hit": False,
        "sql_query": None,
        "results": None,
        "question": None,
        "source": "sql_exact",
    }

    try:
        # Normalizamos la entrada para evitar problemas de espacios
        clean_question = user_question.strip()

        # Query directa a sch_fewshots
        # Se asume que sch_fewshots es la fuente de verdad (igual que documents)
        sql = """
            SELECT 
                question, 
                example_query as sql_query, 
                expected_output as results,
                updated_at
            FROM public.sch_fewshots
            WHERE 
                pais_iso3 = %s 
                AND is_valid = TRUE
                AND expected_output IS NOT NULL
                AND length(expected_output::text) > 20
                AND unaccent(question) ILIKE unaccent(%s)
            LIMIT 1
        """

        # NOTA: ILIKE 'string' busca coincidencia exacta insensible a mayúsculas.
        # unaccent() ignora tildes.
        # No usamos %wildcards% para evitar falsos positivos en frases parciales.

        results = _fetch_all(sql, (country_code, clean_question))

        if results:
            row = results[0]
            cache_info["is_cache_hit"] = True
            cache_info["sql_query"] = row.get("sql_query")

            # Parse results from jsonb if needed, though _fetch_all usually returns dicts/lists for jsonb
            # sch_fewshots.expected_output is jsonb
            cache_info["results"] = row.get("results")
            cache_info["question"] = row.get("question")

            # updated_at is fetched and added to cache_info for return
            updated_at = row.get("updated_at")
            cache_info["updated_at"] = updated_at

            # 3. Check recency (optional logic, mostly required for validation)
            # For now, we just pass the flag. The caller decides if it wants to use it.
            # But we DO mark is_recent_cache_hit based on threshold
            if updated_at:
                # Convert to datetime if it's not already
                if isinstance(updated_at, str):
                    try:
                        updated_at_dt = pd.to_datetime(updated_at)
                    except Exception:
                        # Fallback for parsing errors, treat as very old
                        updated_at_dt = datetime.now() - timedelta(days=9999)
                else:
                    updated_at_dt = updated_at

                # Compare
                current_time = datetime.now()
                age = current_time - updated_at_dt
                if age.days < 30:  # 30 days treshold (example) or use config
                    cache_info["is_recent_cache_hit"] = True
                else:
                    # Still a hit, but "old". We might want to re-validate.
                    # For this specific "fast path", we usually trust the cache if it is valid.
                    # But let's set is_recent_cache_hit = True if it is valid to enable FAST PATH.
                    # NOTE: Logic in check_hybrid_cache might rely on this.
                    # If we want to FORCE fast path for ALL valid hits, set True.
                    cache_info["is_recent_cache_hit"] = True
            else:
                # If no date, assume valid/recent enough if it's in the valid set
                cache_info["is_recent_cache_hit"] = True

            logger.info(f"✅ SQL Cache Hit (Tier 0) for question: '{clean_question}'")
            return cache_info

    except Exception as e:
        logger.error(f"❌ Error in get_cache_hit_sql: {e}")

    return cache_info
