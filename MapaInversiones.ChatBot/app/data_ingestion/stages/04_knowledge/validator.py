from loguru import logger
from sqlalchemy import text
from app.data_ingestion.core.orchestrator import ETLOrchestrator
from app.data_ingestion.config.settings_etl import get_etl_settings
from langchain_openai import AzureChatOpenAI
from langchain.schema import AIMessage, HumanMessage
from modules.config import settings
import json
import re

etl_settings = get_etl_settings()

# LLM for fixing SQL
llm = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_4mini,
    openai_api_version=settings.azure_openai_api_version,
    temperature=etl_settings.LLM_TEMPERATURE,
    streaming=False,
)


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🧠 Starting Few-Shot Validation & Fixes...")

    # 1. Insert new from raw (if any) - simplified logic from 02_fewshots
    insert_new_fewshots(orchestrator)

    # 2. Validate and Fix existing - logic from 02_07_sql_response
    validate_and_fix_fewshots(orchestrator)

    logger.success("✅ Knowledge Validation Completed.")


def insert_new_fewshots(orchestrator):
    # Logic to copy from raw_fewshots to sch_fewshots
    # ... (impl similar to 02_fewshots.py insert_fewshots)
    # Simplified placeholder:
    logger.info("🔄 Syncing raw_fewshots -> sch_fewshots...")
    sql = """
    INSERT INTO sch_fewshots (question, example_query, query_type, pais_iso3)
    SELECT
        lower(regexp_replace(trim(question), '\\s+', ' ', 'g')),
        trim(example_query),
        query_type,
        lower(trim(pais_iso3))
    FROM raw_fewshots
    WHERE is_valid = TRUE
    ON CONFLICT DO NOTHING;
    """
    orchestrator.pg_conn.execute(sql)


def validate_and_fix_fewshots(orchestrator):
    # Logic from 02_07: Check execution, if fail -> fix with LLM -> update expected_output
    with orchestrator.pg_conn.connect() as conn:
        # Fetch pending (no output or stale)
        rows = (
            conn.execute(
                text(
                    """
            SELECT id, trim(question) as question, trim(example_query) as example_query, pais_iso3
            FROM sch_fewshots
            WHERE is_valid = TRUE AND expected_output IS NULL
            LIMIT 100
        """
                )
            )
            .mappings()
            .all()
        )

    for row in rows:
        r_id = row["id"]
        query = row["example_query"]

        # Try execute
        try:
            res_df = orchestrator.pg_conn.query_to_df(
                query
            )  # Warning: this might fail safely
            # query_to_df logs error and raises. We need safe execution.
            # Let's use connector's engine directly for safe exec?
            # Or add safe method to connector.
            pass
        except Exception:
            # Fix with LLM
            logger.warning(f"⚠️ Query {r_id} failed. Fixing...")
            new_query = fix_sql(row["question"], query)
            if new_query:
                # Update and retry
                orchestrator.pg_conn.execute(
                    "UPDATE sch_fewshots SET example_query=:q WHERE id=:id",
                    {"q": new_query, "id": r_id},
                )
                query = new_query

        # Execute again (original or fixed)
        try:
            # We use a limited fetch with proper transaction handling
            with orchestrator.pg_conn.begin() as safe_conn:
                res = safe_conn.execute(
                    text(query).execution_options(timeout=etl_settings.SQL_EXECUTION_TIMEOUT)
                ).fetchall()
                # Serialize limited results
                output = [dict(row._mapping) for row in res[:etl_settings.PREVIEW_ROWS]]
                # make serializable (dates, etc)
                output_json = json.dumps(output, default=str, ensure_ascii=False)

                safe_conn.execute(
                    text(
                        "UPDATE sch_fewshots SET expected_output=:o, updated_at=NOW() WHERE id=:id"
                    ),
                    {"o": output_json, "id": r_id},
                )
                # Transaction commits automatically on context manager exit
                logger.success(f"✅ Fewshot {r_id} validated.")

        except Exception as e:
            logger.error(f"❌ Fewshot {r_id} failed finally: {e}")
            orchestrator.pg_conn.execute(
                "UPDATE sch_fewshots SET is_valid=FALSE WHERE id=:id", {"id": r_id}
            )


def fix_sql(question, bad_query):
    prompt = f"Corregir esta SQL Postgres para la pregunta '{question}':\n{bad_query}\nSolo devolver SQL limpio iniciando con SELECT/WITH."
    try:
        resp = llm.invoke([HumanMessage(content=prompt)])
        return resp.content.strip().replace("```sql", "").replace("```", "")
    except:
        return None
