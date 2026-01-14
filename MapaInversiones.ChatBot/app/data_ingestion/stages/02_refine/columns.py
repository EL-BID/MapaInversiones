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

COLUMN_DESCRIPTION_OVERRIDES = {
    (
        "stg_mapainv_proyectosaprobadosinv",
        "codigo_snip",
    ): "ATRIBUTO: codigo_snip | TIPO: text | DESCRIPCIÓN: Código SNIP (Sistema Nacional de Inversión Pública). Identificador público del proyecto.",
    (
        "stg_mapainv_proyectosaprobadosinv",
        "id_proyecto",
    ): "ATRIBUTO: id_proyecto | TIPO: bigint | DESCRIPCIÓN: Identificador interno único del proyecto. Usado para JOINS y URLs.",
    (
        "stg_mapainv_proyectosaprobadosinv",
        "valor_proyecto",
    ): "ATRIBUTO: valor_proyecto | TIPO: double precision | DESCRIPCIÓN: Monto total aprobado. Usar para 'presupuesto' o 'monto total'.",
    # Add more overrides if needed, keeping it concise
}


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🏛️ Starting Columns Refinement...")
    insert_raw_columns(orchestrator)
    apply_description_overrides(orchestrator)
    generate_column_descriptions(orchestrator)
    update_count_distinct(orchestrator)
    update_column_sample_values(orchestrator)
    generate_column_embeddings(orchestrator)
    logger.success("✅ Columns Refinement Completed.")


def insert_raw_columns(orchestrator):
    logger.info("🔄 Inserting Columns...")
    sql = """
    INSERT INTO sch_columns (table_name, column_name, column_type, updated_at)
    SELECT c.table_name, c.column_name, c.data_type, NOW()
    FROM information_schema.columns c
    WHERE c.table_schema = 'public' AND c.table_name LIKE 'stg_%' AND c.table_name NOT LIKE '%_bkp'
    ON CONFLICT (table_name, column_name) DO UPDATE SET updated_at = NOW();
    """
    orchestrator.pg_conn.execute(sql)


def apply_description_overrides(orchestrator):
    logger.info("⚡ Applying Overrides...")
    for (tbl, col), desc in COLUMN_DESCRIPTION_OVERRIDES.items():
        orchestrator.pg_conn.execute(
            "UPDATE sch_columns SET column_description = :d, column_embedding = NULL, updated_at = NOW() WHERE table_name = :t AND column_name = :c",
            {"d": desc, "t": tbl, "c": col},
        )


def generate_column_descriptions(orchestrator):
    logger.info("🧠 Generating Column Descriptions...")
    with orchestrator.pg_conn.connect() as conn:
        cols = (
            conn.execute(
                text(
                    "SELECT table_name, column_name, column_type FROM sch_columns WHERE column_description IS NULL"
                )
            )
            .mappings()
            .all()
        )

    for col in cols:
        tbl, att, typ = col["table_name"], col["column_name"], col["column_type"]
        if (tbl, att) in COLUMN_DESCRIPTION_OVERRIDES:
            continue

        prompt = f"Describe el atributo '{att}' (tipo {typ}) de la tabla '{tbl}' en una oración. Sin markdown."
        try:
            resp = llm.invoke([HumanMessage(content=prompt)])
            if isinstance(resp, AIMessage):
                orchestrator.pg_conn.execute(
                    "UPDATE sch_columns SET column_description = :d, updated_at = NOW() WHERE table_name = :t AND column_name = :c",
                    {"d": resp.content.strip()[:200], "t": tbl, "c": att},
                )
        except Exception as e:
            logger.error(f"Error desc {tbl}.{att}: {e}")


def update_count_distinct(orchestrator):
    with orchestrator.pg_conn.connect() as conn:  # Read
        cols = (
            conn.execute(
                text(
                    "SELECT table_name, column_name FROM sch_columns WHERE count_distinct IS NULL"
                )
            )
            .mappings()
            .all()
        )

    for col in cols:
        tbl, att = col["table_name"], col["column_name"]
        try:
            # Need to run count query: SELECT COUNT(DISTINCT "col") FROM "tbl"
            # This is slow, maybe skip for large tables? Or sample?
            cnt = orchestrator.pg_conn.query_to_df(
                f'SELECT COUNT(DISTINCT "{att}") FROM "{tbl}"'
            ).iloc[0, 0]
            orchestrator.pg_conn.execute(
                "UPDATE sch_columns SET count_distinct = :n, updated_at = NOW() WHERE table_name = :t AND column_name = :c",
                {"n": int(cnt), "t": tbl, "c": att},
            )
        except Exception as e:
            logger.warning(f"Error count {tbl}.{att}: {e}")


def update_column_sample_values(orchestrator):
    with orchestrator.pg_conn.connect() as conn:
        cols = (
            conn.execute(
                text(
                    "SELECT table_name, column_name FROM sch_columns WHERE samples IS NULL"
                )
            )
            .mappings()
            .all()
        )

    for col in cols:
        tbl, att = col["table_name"], col["column_name"]
        try:
            vals = orchestrator.pg_conn.query_to_df(
                f'SELECT DISTINCT "{att}" FROM "{tbl}" WHERE "{att}" IS NOT NULL LIMIT 5'
            )
            if not vals.empty:
                sample = ", ".join(map(str, vals.iloc[:, 0].tolist()))[:200]
                orchestrator.pg_conn.execute(
                    "UPDATE sch_columns SET samples = :s, updated_at = NOW() WHERE table_name = :t AND column_name = :c",
                    {"s": sample, "t": tbl, "c": att},
                )
        except Exception as e:
            logger.warning(f"Error samples {tbl}.{att}: {e}")


def generate_column_embeddings(orchestrator):
    logger.info("🧠 Generating Column Embeddings...")
    with orchestrator.pg_conn.connect() as conn:
        rows = (
            conn.execute(
                text(
                    """
            SELECT table_name, column_name,
                   process_text(unaccent(
                       'Tabla: '||table_name||' Atributo: '||column_name||' Descripción: '||COALESCE(column_description,'')||' Ejemplos: '||COALESCE(samples,'')
                   )) AS clean_input
            FROM sch_columns WHERE column_embedding IS NULL
        """
                )
            )
            .mappings()
            .all()
        )

    for r in rows:
        emb = vec.get_embedding(r["clean_input"])
        orchestrator.pg_conn.execute(
            "UPDATE sch_columns SET column_embedding = :e, updated_at = NOW() WHERE table_name = :t AND column_name = :c",
            {"e": emb, "t": r["table_name"], "c": r["column_name"]},
        )
