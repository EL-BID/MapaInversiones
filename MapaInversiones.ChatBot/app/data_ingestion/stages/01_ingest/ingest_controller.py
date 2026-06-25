from pathlib import Path
import re

from loguru import logger
import yaml
import pandas as pd

from app.data_ingestion.core.orchestrator import ETLOrchestrator
from app.data_ingestion.config.settings_etl import ETLSettings, get_etl_settings

_TABLE_NAME_PATTERN = re.compile(r"^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)*$")


def _is_safe_table_name(table_name: str) -> bool:
    return bool(_TABLE_NAME_PATTERN.fullmatch(table_name))


def run(
    orchestrator: ETLOrchestrator,
    source_id: str = None,
    dry_run: bool = False,
    **kwargs,
):
    settings = get_etl_settings()

    # Load Sources
    with open(settings.SOURCES_YAML, "r") as f:
        config = yaml.safe_load(f)

    sources = config.get("sources", [])

    # Filter if specific source requested
    if source_id:
        sources = [s for s in sources if s.get("id") == source_id]
        if not sources:
            logger.error(f"Source ID '{source_id}' not found in configuration.")
            return

    logger.info(f"🚀 Starting Ingestion for {len(sources)} source(s)...")

    for source in sources:
        if not source.get("enabled", True):
            logger.info(f"⏩ Skipping disabled source: {source['id']}")
            continue

        try:
            process_source(orchestrator, source, dry_run, settings)
        except Exception as e:
            logger.error(f"❌ Failed to process source {source['id']}: {e}")


def process_source(
    orchestrator: ETLOrchestrator,
    source: dict,
    dry_run: bool,
    settings: ETLSettings,
) -> None:
    s_id = source["id"]
    s_type = source["type"]
    dest_table = source["destination_table"]
    logger.info(f"🔹 Processing source: {s_id} ({s_type}) -> {dest_table}")

    if not _is_safe_table_name(dest_table):
        logger.error("🚫 Destination table name '%s' is invalid.", dest_table)
        return

    df = None

    if s_type == "sql_server":
        query = source["sql_query"]
        sql_ref = source.get("connection_ref")
        sql_conn = orchestrator.get_sql_connector(sql_ref)
        if not sql_conn:
            logger.error(
                "SQL Server connector '%s' not configured.", sql_ref or "default"
            )
            return

        logger.info("⏳ Executing extraction query on %s...", sql_ref or "default")
        df = sql_conn.query_to_df(query)

    elif s_type == "csv_file":
        path = source["path"]
        logger.info(f"⏳ Reading CSV from {path}...")
        csv_path = Path(path)
        if not csv_path.is_absolute():
            attempts = [
                settings.BASE_DIR / csv_path,
                settings.BASE_DIR.parent / csv_path,
                Path.cwd() / csv_path,
            ]
            for attempt in attempts:
                if attempt.exists():
                    csv_path = attempt
                    break

        if not csv_path.exists():
            logger.error("🚫 CSV file not found at %s.", csv_path)
            return

        df = pd.read_csv(csv_path)

    else:
        logger.warning(f"Unknown source type: {s_type}")
        return

    if df is None or df.empty:
        logger.warning(f"⚠️  No data extracted for {s_id}")
        return

    logger.info(f"✅ Extracted {len(df)} rows.")

    # Normalization (Lower case columns)
    df.columns = df.columns.str.lower()

    if dry_run:
        logger.info(f"🛑 Dry-run: Would write {len(df)} rows to {dest_table}")
        return

    # Write to Postgres
    logger.info(f"💾 Writing to {dest_table}...")
    # Using 'replace' or 'append'? The logic in 01_01 was delete-then-insert-partitioned or complex.
    # The requirement says "load to staging". Usually staging is Truncate/Insert or Append.
    # 01_01 logic was: accumulate all sources for a dest, then delete by country, then insert.
    # Here we are processing one source at a time. This might be risky if we just Append without cleaning.
    # HOWEVER, the committee approved "Ingest -> Load to Staging Tables".
    # For now, let's assume 'append' but we might want 'replace' for staging tables.
    # Or we leave the cleaning logic to the orchestrator or specific logic?
    # Simple Staging: truncate before load? But we have multiple countries loading to same table.

    # DECISION: For now, use 'append'. Cleaning should be handled separately or we need a cleaner logic.
    # But wait, 01_01 performed "DELETE FROM dest WHERE pais_iso3 = ANY(...)".
    # We can replicate this if we know the country.

    country = source.get("country")
    if country:
        orchestrator.pg_conn.execute(
            f"DELETE FROM {dest_table} WHERE pais_iso3 = :country",
            {"country": country},
        )
        logger.info(f"🗑️ Cleared existing data for {country} in {dest_table}")
    else:
        logger.info(f"ℹ️ No country filter defined; skipping cleanup for {dest_table}")

    df.to_sql(
        dest_table,
        orchestrator.pg_conn.engine,
        if_exists="append",
        index=False,
        method="multi",
        chunksize=1000,
    )
    logger.success(f"✅ Loaded {len(df)} rows to {dest_table}")
