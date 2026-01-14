-- ═══════════════════════════════════════════════════════════════════════════
-- Cascade Text Search Indexes
-- Creates GiST and GIN indexes for fuzzy and full-text search
-- ═══════════════════════════════════════════════════════════════════════════

-- Ensure pg_trgm extension exists for trigram similarity
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GiST index for similarity() on process_text(nombre_proyecto)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gist_proc_nombre_proyecto') THEN
        RAISE NOTICE 'Creating idx_gist_proc_nombre_proyecto...';
        CREATE INDEX idx_gist_proc_nombre_proyecto 
        ON stg_mapainv_proyectosaprobadosinv 
        USING gist (process_text(nombre_proyecto) gist_trgm_ops);
        RAISE NOTICE 'Created idx_gist_proc_nombre_proyecto';
    ELSE
        RAISE NOTICE 'idx_gist_proc_nombre_proyecto already exists, skipping';
    END IF;
END
$$;

-- GiST index for similarity() on process_text(objetivo_proyecto)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_gist_proc_objetivo_proyecto') THEN
        RAISE NOTICE 'Creating idx_gist_proc_objetivo_proyecto...';
        CREATE INDEX idx_gist_proc_objetivo_proyecto 
        ON stg_mapainv_proyectosaprobadosinv 
        USING gist (process_text(objetivo_proyecto) gist_trgm_ops);
        RAISE NOTICE 'Created idx_gist_proc_objetivo_proyecto';
    ELSE
        RAISE NOTICE 'idx_gist_proc_objetivo_proyecto already exists, skipping';
    END IF;
END
$$;

-- GIN index for Full-Text Search with to_tsvector
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_fts_proyectos') THEN
        RAISE NOTICE 'Creating idx_fts_proyectos...';
        CREATE INDEX idx_fts_proyectos 
        ON stg_mapainv_proyectosaprobadosinv 
        USING gin (
            to_tsvector('spanish', 
                COALESCE(nombre_proyecto, '') || ' ' || COALESCE(objetivo_proyecto, '')
            )
        );
        RAISE NOTICE 'Created idx_fts_proyectos';
    ELSE
        RAISE NOTICE 'idx_fts_proyectos already exists, skipping';
    END IF;
END
$$;
