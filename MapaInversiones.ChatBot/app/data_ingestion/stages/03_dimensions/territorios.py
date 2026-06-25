from loguru import logger
from app.data_ingestion.core.orchestrator import ETLOrchestrator


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("🗺️ Refreshing dim_territorios...")

    DDL = """
    CREATE TABLE IF NOT EXISTS dim_territorios (
        pais_iso3                text NOT NULL,
        region_original          text,
        region_normalizada       text NOT NULL DEFAULT '',
        departamento_original    text,
        departamento_normalizado text NOT NULL DEFAULT '',
        municipio_original       text,
        municipio_normalizado    text NOT NULL DEFAULT '',
        proyectos_count          integer NOT NULL DEFAULT 0,
        PRIMARY KEY (pais_iso3, region_normalizada, departamento_normalizado, municipio_normalizado)
    );
    """

    DDL_FLAT_VIEW = """
    DROP MATERIALIZED VIEW IF EXISTS dim_territorios_flat CASCADE;

    CREATE MATERIALIZED VIEW dim_territorios_flat AS
    WITH all_territories AS (
        SELECT DISTINCT pais_iso3, 'region' AS tipo_territorio, region_original AS valor_original, region_normalizada AS valor_normalizado, 'nombre_region' AS columna_filtro, 1 AS jerarquia_nivel, SUM(proyectos_count) AS proyectos_count
        FROM dim_territorios WHERE region_normalizada IS NOT NULL AND region_normalizada <> ''
        GROUP BY pais_iso3, region_original, region_normalizada
        UNION ALL
        SELECT DISTINCT pais_iso3, 'departamento' AS tipo_territorio, departamento_original AS valor_original, departamento_normalizado AS valor_normalizado, 'nombre_departamento' AS columna_filtro, 2 AS jerarquia_nivel, SUM(proyectos_count) AS proyectos_count
        FROM dim_territorios WHERE departamento_normalizado IS NOT NULL AND departamento_normalizado <> ''
        GROUP BY pais_iso3, departamento_original, departamento_normalizado
        UNION ALL
        SELECT DISTINCT pais_iso3, 'municipio' AS tipo_territorio, municipio_original AS valor_original, municipio_normalizado AS valor_normalizado, 'nombre_municipio' AS columna_filtro, 3 AS jerarquia_nivel, SUM(proyectos_count) AS proyectos_count
        FROM dim_territorios WHERE municipio_normalizado IS NOT NULL AND municipio_normalizado <> ''
        GROUP BY pais_iso3, municipio_original, municipio_normalizado
    )
    SELECT * FROM all_territories ORDER BY pais_iso3, jerarquia_nivel, proyectos_count DESC;

    CREATE INDEX IF NOT EXISTS idx_dim_territorios_flat_trgm ON dim_territorios_flat USING gin (valor_normalizado gin_trgm_ops);
    CREATE INDEX IF NOT EXISTS idx_dim_territorios_flat_pais ON dim_territorios_flat (pais_iso3);
    """

    DDL_RESOLVE_FUNCTION = """
    DO $$
    DECLARE r RECORD;
    BEGIN
        FOR r IN SELECT oid::regprocedure AS func_signature FROM pg_proc WHERE proname = 'resolve_territory_column' LOOP
            EXECUTE 'DROP FUNCTION IF EXISTS ' || r.func_signature || ' CASCADE';
        END LOOP;
    END $$;

    CREATE OR REPLACE FUNCTION resolve_territory_column(p_pais_iso3 text, p_user_input text, p_min_similarity double precision DEFAULT 0.6)
    RETURNS TABLE (tipo_territorio text, valor_original text, valor_normalizado text, columna_filtro text, jerarquia_nivel integer, similitud double precision, proyectos_count integer)
    LANGUAGE plpgsql AS $$
    DECLARE v_input_normalizado text;
    BEGIN
        v_input_normalizado := process_text(p_user_input);
        RETURN QUERY
        SELECT f.tipo_territorio, f.valor_original, f.valor_normalizado, f.columna_filtro, f.jerarquia_nivel, similarity(f.valor_normalizado, v_input_normalizado)::double precision AS similitud, f.proyectos_count::integer
        FROM dim_territorios_flat f
        WHERE f.pais_iso3 = LOWER(p_pais_iso3) AND similarity(f.valor_normalizado, v_input_normalizado) >= p_min_similarity
        ORDER BY similitud DESC, f.jerarquia_nivel ASC, f.proyectos_count DESC LIMIT 5;
    END;
    $$;
    """

    TRUNCATE = "TRUNCATE TABLE dim_territorios;"

    INSERT = """
    WITH norm AS (
        SELECT
            LOWER(TRIM(pais_iso3))                                AS pais_iso3,
            NULLIF(TRIM(nombre_region), '')                       AS region_original,
            NULLIF(process_text(TRIM(nombre_region)), '')         AS region_normalizada,
            NULLIF(TRIM(nombre_departamento), '')                 AS departamento_original,
            NULLIF(process_text(TRIM(nombre_departamento)), '')   AS departamento_normalizado,
            NULLIF(TRIM(nombre_municipio), '')                    AS municipio_original,
            NULLIF(process_text(TRIM(nombre_municipio)), '')      AS municipio_normalizado
        FROM stg_mapainv_proyectosterritorios
    )
    INSERT INTO dim_territorios (pais_iso3, region_original, region_normalizada, departamento_original, departamento_normalizado, municipio_original, municipio_normalizado, proyectos_count)
    SELECT
        pais_iso3, MIN(region_original), region_normalizada, MIN(departamento_original), departamento_normalizado, MIN(municipio_original), municipio_normalizado, COUNT(*)
    FROM norm
    GROUP BY pais_iso3, region_normalizada, departamento_normalizado, municipio_normalizado
    ORDER BY pais_iso3, COUNT(*) DESC;
    """

    try:
        orchestrator.pg_conn.execute(DDL)
        orchestrator.pg_conn.execute(TRUNCATE)  # Full refresh again
        orchestrator.pg_conn.execute(INSERT)
        orchestrator.pg_conn.execute(DDL_FLAT_VIEW)
        orchestrator.pg_conn.execute(DDL_RESOLVE_FUNCTION)
        logger.success("✅ dim_territorios and flat view refreshed.")
    except Exception as e:
        logger.error(f"❌ Failed dim_territorios: {e}")
        raise e
