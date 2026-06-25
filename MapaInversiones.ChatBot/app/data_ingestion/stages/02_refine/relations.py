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
    logger.info("🔗 Starting Relations Refinement...")
    insert_relations(orchestrator)
    generate_relation_descriptions(orchestrator)
    generate_relation_embeddings(orchestrator)
    logger.success("✅ Relations Refinement Completed.")


def insert_relations(orchestrator):
    logger.info("🔄 Inserting FK Relations...")
    sql = """
    INSERT INTO sch_relations (source_table, source_column, target_table, target_column, relationship_type, updated_at)
    SELECT
        kcu.table_name, kcu.column_name, ccu.table_name, ccu.column_name, '1:M', NOW()
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.constraint_schema = ccu.constraint_schema
    WHERE tc.constraint_type = 'FOREIGN KEY' AND kcu.table_schema = 'public' AND ccu.table_schema = 'public' AND kcu.table_name LIKE 'stg_%'
    ON CONFLICT (source_table, source_column, target_table, target_column) DO UPDATE SET updated_at = NOW();
    """
    orchestrator.pg_conn.execute(sql)

    # Prune
    prune_sql = """
    DELETE FROM sch_relations sr
    WHERE sr.source_table LIKE 'stg_%'
    AND NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name AND tc.constraint_schema = kcu.constraint_schema
        JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name AND tc.constraint_schema = ccu.constraint_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND kcu.table_name = sr.source_table AND kcu.column_name = sr.source_column
        AND ccu.table_name = sr.target_table AND ccu.column_name = sr.target_column
    );
    """
    orchestrator.pg_conn.execute(prune_sql)


def generate_relation_descriptions(orchestrator):
    logger.info("🧠 Generating Relation Descriptions...")
    with orchestrator.pg_conn.connect() as conn:
        rels = (
            conn.execute(
                text(
                    """
            SELECT source_table, source_column, target_table, target_column
            FROM sch_relations WHERE relation_description IS NULL
        """
                )
            )
            .mappings()
            .all()
        )

    for r in rels:
        prompt = f"Describe la relación 1:M donde {r['source_table']}.{r['source_column']} referencia a {r['target_table']}.{r['target_column']} en una oración."
        try:
            resp = llm.invoke([HumanMessage(content=prompt)])
            if isinstance(resp, AIMessage):
                orchestrator.pg_conn.execute(
                    "UPDATE sch_relations SET relation_description = :d, updated_at = NOW() WHERE source_table=:st AND source_column=:sc AND target_table=:tt AND target_column=:tc",
                    {
                        "d": resp.content.strip()[:300],
                        "st": r["source_table"],
                        "sc": r["source_column"],
                        "tt": r["target_table"],
                        "tc": r["target_column"],
                    },
                )
        except Exception as e:
            logger.error(f"Error rel desc: {e}")


def generate_relation_embeddings(orchestrator):
    logger.info("🧠 Generating Relation Embeddings...")
    with orchestrator.pg_conn.connect() as conn:
        rows = (
            conn.execute(
                text(
                    """
            SELECT source_table, source_column, target_table, target_column,
                   process_text(unaccent(
                      'La tabla '||source_table||' se relaciona con '||target_table||' mediante '||source_column||' ↔ '||target_column||'. '||COALESCE(relation_description,'')
                   )) AS clean_input
            FROM sch_relations WHERE relation_embedding IS NULL AND relation_description IS NOT NULL
        """
                )
            )
            .mappings()
            .all()
        )

    for r in rows:
        emb = vec.get_embedding(r["clean_input"])
        orchestrator.pg_conn.execute(
            "UPDATE sch_relations SET relation_embedding = :e WHERE source_table=:st AND source_column=:sc AND target_table=:tt AND target_column=:tc",
            {
                "e": emb,
                "st": r["source_table"],
                "sc": r["source_column"],
                "tt": r["target_table"],
                "tc": r["target_column"],
            },
        )
