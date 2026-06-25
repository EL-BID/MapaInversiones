from loguru import logger
from app.data_ingestion.core.orchestrator import ETLOrchestrator


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🏭 Refreshing dim_sectores...")

    DDL = """
    CREATE TABLE IF NOT EXISTS dim_sectores (
        pais_iso3          text NOT NULL,
        sector_original    text NOT NULL,
        sector_normalizado text NOT NULL,
        proyectos_count    integer NOT NULL,
        PRIMARY KEY (pais_iso3, sector_normalizado)
    );
    """
    TRUNCATE = "TRUNCATE TABLE dim_sectores;"

    INSERT = """
    WITH normalized AS (
        SELECT
            LOWER(TRIM(pais_iso3))                          AS pais_iso3,
            TRIM(nombresector_proyecto)                     AS sector_original,
            process_text(TRIM(nombresector_proyecto))        AS sector_normalizado
        FROM stg_mapainv_proyectosaprobadosinv
        WHERE nombresector_proyecto IS NOT NULL
          AND LENGTH(TRIM(nombresector_proyecto)) > 0
    )
    INSERT INTO dim_sectores (pais_iso3, sector_original, sector_normalizado, proyectos_count)
    SELECT
        pais_iso3,
        MIN(sector_original) AS sector_original,
        sector_normalizado,
        COUNT(*)             AS proyectos_count
    FROM normalized
    GROUP BY pais_iso3, sector_normalizado
    ORDER BY pais_iso3, proyectos_count DESC;
    """

    try:
        orchestrator.pg_conn.execute(DDL)
        orchestrator.pg_conn.execute(TRUNCATE)  # Careful if we have multi-country load?
        # dim_sectores seems designed to hold multiple countries (PK includes pais_iso3).
        # But truncate wipes all. If we load per-country, we should DELETE WHERE pais_iso3.
        # But the original script truncated.
        # For now, replicates behavior (Full refresh).

        orchestrator.pg_conn.execute(INSERT)
        logger.success("✅ dim_sectores refreshed.")
    except Exception as e:
        logger.error(f"❌ Failed dim_sectores: {e}")
        raise e
