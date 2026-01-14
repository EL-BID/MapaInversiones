from loguru import logger
from sqlalchemy import text
from app.data_ingestion.core.vector_store import VectorStore
from langchain_openai import AzureChatOpenAI
from langchain.schema import AIMessage, HumanMessage
from modules.config import settings
from app.data_ingestion.core.orchestrator import ETLOrchestrator

vec = VectorStore()
llm = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_4mini,
    openai_api_version=settings.azure_openai_api_version,
    temperature=0.0,
    streaming=False,
)


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("📊 Starting Tables Refinement...")
    insert_raw_tables(orchestrator)
    generate_table_descriptions(orchestrator)
    generate_table_embeddings(orchestrator)
    logger.success("✅ Tables Refinement Completed.")


def insert_raw_tables(orchestrator):
    logger.info("🔄 Inserting `stg_` tables into `sch_tables`...")
    insert_sql = """
    INSERT INTO sch_tables (
        table_name,
        table_ddl,
        table_recordcount,
        updated_at
    )
    SELECT 
        t.table_name, 
        (
            SELECT 'CREATE TABLE ' || c.table_name || ' (' ||
                   string_agg(c.column_name || ' ' || c.data_type, ', ') || ');'
            FROM information_schema.columns c
            WHERE c.table_schema = 'public'
              AND c.table_name   = t.table_name
            GROUP BY c.table_name
        ) AS table_ddl,
        COALESCE(
            (
                SELECT reltuples::BIGINT
                FROM pg_class pc 
                JOIN pg_namespace pn ON pn.oid = pc.relnamespace
                WHERE pn.nspname = 'public'
                  AND pc.relname = t.table_name
            ), 0
        ) AS table_recordcount,
        NOW() AS updated_at
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
      AND t.table_name   LIKE 'stg_%'
    ON CONFLICT (table_name) DO UPDATE 
      SET table_ddl        = EXCLUDED.table_ddl,
          table_recordcount = EXCLUDED.table_recordcount,
          updated_at        = CASE
              WHEN sch_tables.table_ddl        IS DISTINCT FROM EXCLUDED.table_ddl
                OR sch_tables.table_recordcount IS DISTINCT FROM EXCLUDED.table_recordcount
              THEN NOW() ELSE sch_tables.updated_at END;
    """
    orchestrator.pg_conn.execute(insert_sql)

    # Prune obsolete
    prune_sql = """
    DELETE FROM sch_tables st
    WHERE st.table_name LIKE 'stg_%'
      AND NOT EXISTS (
          SELECT 1
          FROM information_schema.tables t
          WHERE t.table_schema = 'public'
            AND t.table_name   = st.table_name
      );
    """
    orchestrator.pg_conn.execute(prune_sql)
    logger.info("✅ Tables inserted/pruned.")


def generate_table_descriptions(orchestrator):
    logger.info("🧠 Generating Table Descriptions...")
    with orchestrator.pg_conn.connect() as conn:
        tables = (
            conn.execute(
                text(
                    """
            SELECT table_name, table_ddl
            FROM sch_tables
            WHERE table_description IS NULL or table_description = ''
        """
                )
            )
            .mappings()
            .all()
        )

    for row in tables:
        table_name = row["table_name"]
        table_ddl = row["table_ddl"]
        prompt = f"""
        Eres un experto en bases de datos.
        Genera una descripción precisa (≤ 220 caracteres) de la tabla '{table_name}':
        {table_ddl}
        Reglas: Propósito, atributos clave, no mencionar relaciones, sin markdown.
        """
        try:
            resp = llm.invoke([HumanMessage(content=prompt)])
            if isinstance(resp, AIMessage):
                desc = resp.content.strip()
                orchestrator.pg_conn.execute(
                    "UPDATE sch_tables SET table_description = :d WHERE table_name = :n",
                    {"d": desc, "n": table_name},
                )
        except Exception as e:
            logger.error(f"Error desc {table_name}: {e}")


def generate_table_embeddings(orchestrator):
    logger.info("🧠 Generating Table Embeddings...")
    with orchestrator.pg_conn.connect() as conn:
        rows = (
            conn.execute(
                text(
                    """
            SELECT table_name,
                   LEFT(process_text(unaccent(
                       'Nombre de la tabla: ' || table_name ||
                       '. Descripción: '    || COALESCE(table_description,'') ||
                       '. Estructura DDL: ' || COALESCE(table_ddl,'')
                   )), 3000) AS clean_input
            FROM sch_tables
            WHERE table_embedding IS NULL
        """
                )
            )
            .mappings()
            .all()
        )

    for row in rows:
        emb = vec.get_embedding(row["clean_input"])
        orchestrator.pg_conn.execute(
            "UPDATE sch_tables SET table_embedding = :e WHERE table_name = :n",
            {"e": emb, "n": row["table_name"]},
        )
