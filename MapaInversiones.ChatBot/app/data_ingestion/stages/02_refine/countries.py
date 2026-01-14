from loguru import logger
from sqlalchemy import text
from langchain_openai import AzureChatOpenAI
from langchain.schema import AIMessage, HumanMessage
import re
from app.data_ingestion.core.orchestrator import ETLOrchestrator
from modules.config import settings

# Initialize LLM (Could be moved to Orchestrator)
llm = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_4mini,
    openai_api_version=settings.azure_openai_api_version,
    temperature=0.3,
    streaming=False,
)


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🌍 Starting Countries Refinement...")
    create_sch_countries_table(orchestrator)
    # truncate_sch_countries(orchestrator) # Optional?
    insert_new_countries(orchestrator)
    generate_country_descriptions(orchestrator)
    generate_amount_separators(orchestrator)
    generate_currency_type(orchestrator)
    logger.success("✅ Countries Refinement Completed.")


def create_sch_countries_table(orchestrator):
    logger.info("📦 Ensuring `sch_countries` table...")
    sql = """
    CREATE TABLE IF NOT EXISTS sch_countries (
        id               SERIAL PRIMARY KEY,
        country_iso3     TEXT UNIQUE,
        country_name     TEXT,
        project_url      TEXT,
        is_valid         BOOLEAN       DEFAULT TRUE,
        description      TEXT,
        tables_available TEXT[],
        amount_separator JSONB,
        currency_type    TEXT,
        updated_at       TIMESTAMP     DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_sch_countries_country_name
    ON sch_countries (lower(country_name));
    """
    orchestrator.pg_conn.execute(sql)


def insert_new_countries(orchestrator):
    logger.info("🔍 Scanning `stg_*` tables for countries...")
    with orchestrator.pg_conn.connect() as conn:
        # Find tables with pais_iso3
        result = conn.execute(
            text(
                """
            SELECT table_name
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND column_name = 'pais_iso3'
              AND table_name ILIKE 'stg_%'
        """
            )
        )
        stage_tables = [r[0] for r in result]

        if not stage_tables:
            logger.info("No staging tables found.")
            return

        unions = []
        for tbl in stage_tables:
            has_url = conn.execute(
                text(
                    f"""
                SELECT 1 FROM information_schema.columns
                WHERE table_schema='public' AND table_name='{tbl}' AND column_name='url_link_proyecto'
            """
                )
            ).scalar()

            url_expr = (
                "'https://' || SPLIT_PART(url_link_proyecto,'/',3)"
                if has_url
                else "NULL"
            )
            unions.append(
                f"""
                SELECT DISTINCT
                       pais_iso3,
                       pais_nombre AS country_name,
                       {url_expr} AS project_url,
                       '{tbl}' AS source_table
                FROM {tbl}
            """
            )

        union_sql = " UNION ALL ".join(unions)
        upsert_sql = f"""
        WITH all_countries AS ({union_sql}),
        latest AS (
            SELECT pais_iso3,
                   MAX(country_name)                AS country_name,
                   MAX(project_url)                 AS project_url,
                   ARRAY_AGG(DISTINCT source_table) AS tables_available
            FROM all_countries
            GROUP BY pais_iso3
        )
        INSERT INTO sch_countries
              (country_iso3,country_name,project_url,tables_available,is_valid,updated_at)
        SELECT pais_iso3,
               COALESCE(country_name, INITCAP(pais_iso3)),
               project_url,
               tables_available,
               TRUE,
               NOW()
        FROM latest
        ON CONFLICT (country_iso3) DO UPDATE
          SET country_name     = EXCLUDED.country_name,
              project_url      = COALESCE(EXCLUDED.project_url, sch_countries.project_url),
              tables_available = (
                  SELECT ARRAY(SELECT DISTINCT unnest(sch_countries.tables_available || EXCLUDED.tables_available))
              ),
              updated_at       = NOW();
        """
        orchestrator.pg_conn.execute(upsert_sql)
    logger.success("✅ Countries upserted.")


def generate_country_descriptions(orchestrator):
    # Logic copied and adapted from archive
    logger.info("🧠 Generating Country Descriptions...")
    with orchestrator.pg_conn.connect() as conn:  # Use connect for reading and iterating
        # We need to iterate and update.
        # CAUTION: 'conn' here is a single connection.
        # If we execute UPDATEs inside the loop using the same conn, it might be fine or need transaction.
        # Orchestrator execute uses a new transaction context.

        rows = (
            conn.execute(
                text(
                    """
            SELECT id, country_iso3, country_name,
                   COALESCE(project_url,'Fuente oficial') AS project_url,
                   tables_available, updated_at
            FROM sch_countries
            WHERE TRIM(COALESCE(description,'')) = ''
        """
                )
            )
            .mappings()
            .all()
        )

    for r in rows:
        try:
            # attributes logic omitted for brevity or need implementation?
            # Implementation required for full functionality.
            # Fetch attributes
            with orchestrator.pg_conn.connect() as attr_conn:
                attrs = (
                    attr_conn.execute(
                        text(
                            f"""
                    SELECT DISTINCT table_name, column_name
                    FROM public.sch_values
                    WHERE pais_iso3 = '{r['country_iso3']}' AND is_valid = true
                 """
                        )
                    )
                    .mappings()
                    .all()
                )

            attributes_list = [f"{a['table_name']} ({a['column_name']})" for a in attrs]
            attributes_csv = ", ".join(attributes_list)

            parts = []
            if r["updated_at"]:
                parts.append(f"Fecha: {r['updated_at'].strftime('%d-%m-%Y')}")
            parts.append(f"Tablas: {', '.join(r.get('tables_available') or [])}")

            prompt = f"""
             Generá un texto breve para usuarios que quieran consultar datos públicos sobre **{r['country_name']}**.
             Origen: {r['project_url']}
             {'. '.join(parts)}
             Atributos: {attributes_csv}
             Estilo: Máximo 3 oraciones, motivar consulta, formal, sin markdown.
             """

            resp = llm.invoke([HumanMessage(content=prompt)])
            desc = resp.content.strip() if isinstance(resp, AIMessage) else ""

            if desc:
                orchestrator.pg_conn.execute(
                    "UPDATE sch_countries SET description = :d, updated_at = NOW() WHERE id = :id",
                    {"d": desc, "id": r["id"]},
                )
        except Exception as e:
            logger.error(f"Error desc {r['country_iso3']}: {e}")


def generate_amount_separators(orchestrator):
    # Simplified adaptation
    logger.info("🔢 Checking amount separators...")
    with orchestrator.pg_conn.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT country_iso3, country_name FROM sch_countries WHERE amount_separator IS NULL"
            )
        ).fetchall()

    for iso3, name in rows:
        prompt = f"""
        Para el país {name}, ¿qué formato de números decimales se utiliza comúnmente?
        Respondé en JSON válido {{ "decimal": ".", "thousand": "," }} sin markdown.
        """
        try:
            resp = llm.invoke([HumanMessage(content=prompt)])
            content = (
                resp.content.strip().replace("```json", "").replace("```", "").strip()
            )
            # Basic validation could be added
            orchestrator.pg_conn.execute(
                "UPDATE sch_countries SET amount_separator = :s, updated_at = NOW() WHERE country_iso3 = :i",
                {"s": content, "i": iso3},
            )
        except Exception as e:
            logger.error(f"Error separators {iso3}: {e}")


def generate_currency_type(orchestrator):
    logger.info("💰 Checking currency types...")
    with orchestrator.pg_conn.connect() as conn:
        rows = conn.execute(
            text(
                "SELECT country_iso3, country_name FROM sch_countries WHERE currency_type IS NULL"
            )
        ).fetchall()

    for iso3, name in rows:
        prompt = f"Indica SOLO el código ISO-4217 (en MAYÚSCULAS) de la moneda principal de {name}."
        try:
            resp = llm.invoke([HumanMessage(content=prompt)])
            code = resp.content.strip().upper()[:3]
            orchestrator.pg_conn.execute(
                "UPDATE sch_countries SET currency_type = :c, updated_at = NOW() WHERE country_iso3 = :i",
                {"c": code, "i": iso3},
            )
        except Exception as e:
            logger.error(f"Error currency {iso3}: {e}")
