-- docker/sql/tune_postgres.sql
-- ═══════════════════════════════════════════════════════════════════════════
-- PostgreSQL tuning for 100 concurrent users
-- Ejecuta este script con un usuario con permisos de superusuario
-- Se ejecuta automáticamente al iniciar el contenedor Docker
-- ═══════════════════════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════════════════════
-- CONEXIONES Y MEMORIA
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET max_connections = 120;           -- 100 target + 20 overhead
ALTER SYSTEM SET shared_buffers = '512MB';        -- 25% of available RAM (adjust based on server)
ALTER SYSTEM SET effective_cache_size = '2GB';    -- Hint for planner (75% of RAM)
ALTER SYSTEM SET work_mem = '16MB';               -- Per-operation memory
ALTER SYSTEM SET maintenance_work_mem = '256MB';  -- For VACUUM, CREATE INDEX
ALTER SYSTEM SET wal_buffers = '16MB';            -- WAL buffer size

-- ═══════════════════════════════════════════════════════════════════════════
-- TIMEOUTS (Crítico para concurrencia)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET statement_timeout = '90s';                        -- Max query time (matches Python config)
ALTER SYSTEM SET idle_in_transaction_session_timeout = '120s';     -- Kill idle transactions
ALTER SYSTEM SET lock_timeout = '30s';                             -- Max wait for locks
ALTER SYSTEM SET deadlock_timeout = '5s';                          -- Deadlock detection

-- ═══════════════════════════════════════════════════════════════════════════
-- I/O Y PERFORMANCE
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET effective_io_concurrency = 200;  -- For SSDs
ALTER SYSTEM SET random_page_cost = 1.1;          -- SSD optimization (1.1-1.5)
ALTER SYSTEM SET synchronous_commit = 'off';      -- Faster writes (slight durability tradeoff)

-- ═══════════════════════════════════════════════════════════════════════════
-- AUTOVACUUM (Mantener tablas limpias)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET autovacuum_max_workers = 4;
ALTER SYSTEM SET autovacuum_vacuum_cost_limit = 2000;
ALTER SYSTEM SET autovacuum_naptime = '30s';

-- ═══════════════════════════════════════════════════════════════════════════
-- LOGGING (Para debugging de queries lentas)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET log_min_duration_statement = '5s';  -- Log queries >5s

-- ═══════════════════════════════════════════════════════════════════════════
-- PARALLEL QUERIES (Para queries complejas)
-- ═══════════════════════════════════════════════════════════════════════════
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;

-- ═══════════════════════════════════════════════════════════════════════════
-- EXTENSIONES ÚTILES
-- ═══════════════════════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- ═══════════════════════════════════════════════════════════════════════════
-- TABLAS DE SESIÓN (si no existen)
-- ═══════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.chat_session_state (
    session_id TEXT PRIMARY KEY,
    payload    JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_session_state_updated_at
    ON public.chat_session_state (updated_at);

-- ═══════════════════════════════════════════════════════════════════════════
-- REFRESH VISTAS MATERIALIZADAS CRÍTICAS
-- ═══════════════════════════════════════════════════════════════════════════
-- Asegurar que la vista de territorios tenga datos al inicio
REFRESH MATERIALIZED VIEW IF EXISTS public.dim_territorios_flat;

-- ═══════════════════════════════════════════════════════════════════════════
-- APLICAR CAMBIOS
-- ═══════════════════════════════════════════════════════════════════════════
SELECT pg_reload_conf();

-- Verificar configuración aplicada
DO $$
BEGIN
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
    RAISE NOTICE 'PostgreSQL tuning applied for 100 concurrent users';
    RAISE NOTICE 'max_connections: %', current_setting('max_connections');
    RAISE NOTICE 'statement_timeout: %', current_setting('statement_timeout');
    RAISE NOTICE 'shared_buffers: %', current_setting('shared_buffers');
    RAISE NOTICE '═══════════════════════════════════════════════════════════════';
END $$;
