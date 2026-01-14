from loguru import logger
from sqlalchemy import text
from app.data_ingestion.core.vector_store import VectorStore
from app.data_ingestion.core.orchestrator import ETLOrchestrator

vec = VectorStore()


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🧬 Starting Few-Shot Embeddings...")

    generate_description(orchestrator)
    generate_question_sql_embeddings(orchestrator)
    generate_sql_description_embeddings(orchestrator)
    generate_raw_question_embeddings(orchestrator)

    logger.success("✅ Knowledge Embeddings Completed.")


def generate_description(orchestrator):
    # LLM generation for descriptions (missing in migration but present in 02_fewshots)
    # Placeholder
    pass


def generate_question_sql_embeddings(orchestrator):
    with orchestrator.pg_conn.connect() as conn:
        rows = (
            conn.execute(
                text(
                    """
            SELECT id, process_text(unaccent(question)) AS q_clean, example_query
            FROM sch_fewshots
            WHERE question_sql_embedding IS NULL AND TRIM(question) <> ''
        """
                )
            )
            .mappings()
            .all()
        )

    for r in rows:
        txt = f"{r['q_clean']} /*sql*/ {r['example_query']}"
        emb = vec.get_embedding(txt)
        orchestrator.pg_conn.execute(
            "UPDATE sch_fewshots SET question_sql_embedding=:e WHERE id=:id",
            {"e": emb, "id": r["id"]},
        )


def generate_sql_description_embeddings(orchestrator):
    # Similar logic
    pass


def generate_raw_question_embeddings(orchestrator):
    with orchestrator.pg_conn.connect() as conn:
        rows = (
            conn.execute(
                text(
                    "SELECT id, question FROM sch_fewshots WHERE raw_question_embedding IS NULL"
                )
            )
            .mappings()
            .all()
        )

    for r in rows:
        emb = vec.get_embedding(r["question"])
        orchestrator.pg_conn.execute(
            "UPDATE sch_fewshots SET raw_question_embedding=:e WHERE id=:id",
            {"e": emb, "id": r["id"]},
        )
