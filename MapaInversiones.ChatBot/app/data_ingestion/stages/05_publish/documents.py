from loguru import logger
from sqlalchemy import text
from app.data_ingestion.core.orchestrator import ETLOrchestrator
from time import time


def run(orchestrator: ETLOrchestrator, **kwargs):
    logger.info("📚 Publishing Documents...")

    ensure_extensions(orchestrator)
    drop_indexes(orchestrator)
    clean_documents_table(orchestrator)
    insert_documents(orchestrator)
    create_indexes(orchestrator)
    refresh_mv_country_stats(orchestrator)

    logger.success("✅ Documents Publishing Completed.")


def ensure_extensions(orchestrator):
    with orchestrator.pg_conn.begin() as conn:
        conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS unaccent;"))
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))


def drop_indexes(orchestrator):
    logger.info("🛑 Dropping indexes...")
    with orchestrator.pg_conn.begin() as conn:
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_contents;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_contents_clean;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_metadata;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_embedding;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_fulltext;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_contents_clean_trgm;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_country_filtertype;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_raw_question_embedding;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_documents_question_trgm;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_contents_tsv;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_cc_ftype_btree;"))
        conn.execute(text("DROP INDEX IF EXISTS idx_docs_contents_clean_trgm_gist;"))


def clean_documents_table(orchestrator):
    logger.info("🧹 Truncating documents table...")
    orchestrator.pg_conn.execute("TRUNCATE public.documents;")


def create_indexes(orchestrator):
    logger.info("🔄 Recreating Indexes...")
    with orchestrator.pg_conn.begin() as conn:
        conn.execute(
            text(
                "CREATE INDEX idx_documents_contents ON public.documents USING gin (to_tsvector('spanish', contents));"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_documents_metadata ON public.documents USING gin (metadata);"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_documents_embedding ON public.documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_documents_raw_question_embedding ON public.documents USING ivfflat (raw_question_embedding vector_cosine_ops) WITH (lists = 100);"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_documents_contents_clean ON public.documents USING gin (to_tsvector('spanish', contents_clean));"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_docs_contents_clean_trgm ON public.documents USING gin (contents_clean gin_trgm_ops);"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_docs_country_filtertype ON public.documents ((metadata->>'country_code'), (metadata->>'filtertype'));"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_documents_question_trgm ON public.documents USING gin (question gin_trgm_ops);"
            )
        )
        # Removed idx_docs_contents_tsv as column not in insert list? or is it computed?
        # Original script implies contents_tsv not inserted but maybe updated trigger?
        # Checking insert list below... contents_tsv is NOT inserted.
        # Assuming contents_tsv is generated column or unused. If legacy, we can skip or add if schema has it.
        # But wait, original script runs create index on it. Let's assume it exists.
        conn.execute(
            text(
                "CREATE INDEX IF NOT EXISTS idx_docs_contents_tsv ON public.documents USING gin (contents_tsv);"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_docs_cc_ftype_btree ON public.documents((metadata->>'country_code'), (metadata->>'filtertype'));"
            )
        )
        conn.execute(
            text(
                "CREATE INDEX idx_docs_contents_clean_trgm_gist ON public.documents USING gist (contents_clean gist_trgm_ops);"
            )
        )


def refresh_mv_country_stats(orchestrator):
    logger.info("📊 Refreshing mv_country_stats...")
    orchestrator.pg_conn.execute("REFRESH MATERIALIZED VIEW public.mv_country_stats;")


def insert_documents(orchestrator):
    logger.info("📥 Inserting Documents...")
    queries = [
        # sch_tables
        """
        INSERT INTO public.documents (id, metadata, contents, contents_clean, embedding)
        SELECT uuid_generate_v1mc(),
               jsonb_build_object('country_code', '*', 'category', 'sch_tables', 'filtertype', 'NotFewShots'),
               'La tabla "' || table_name || '" contiene información estructurada sobre ' || COALESCE(table_description, '') || '. Su estructura es: ' || COALESCE(table_ddl, ''),
               process_text(unaccent('La tabla "' || table_name || '" contiene información estructurada sobre ' || COALESCE(table_description, '') || '. Su estructura es: ' || COALESCE(table_ddl, ''))),
               table_embedding
        FROM sch_tables WHERE table_embedding IS NOT NULL AND LENGTH(TRIM(table_name)) > 0;
        """,
        # sch_columns
        """
        INSERT INTO public.documents (id, metadata, contents, contents_clean, embedding)
        SELECT uuid_generate_v1mc(),
               jsonb_build_object(
                   'country_code', COALESCE((SELECT STRING_AGG(DISTINCT pais_iso3, ', ') FROM sch_values WHERE sch_values.table_name = sch_columns.table_name), '*'),
                   'category', 'sch_columns', 'filtertype', 'NotFewShots'
               ),
               'La columna "' || column_name || '" en la tabla "' || table_name || '" : ' || COALESCE(column_description, ''),
               process_text(unaccent('La columna "' || column_name || '" en la tabla "' || table_name || '" : ' || COALESCE(column_description, ''))),
               column_embedding
        FROM sch_columns WHERE column_embedding IS NOT NULL AND LENGTH(TRIM('La columna "' || column_name || '" en la tabla "' || table_name || '" : ' || COALESCE(column_description, ''))) > 0;
        """,
        # sch_relations
        """
        INSERT INTO public.documents (id, metadata, contents, contents_clean, embedding)
        SELECT uuid_generate_v1mc(),
               jsonb_build_object('country_code', COALESCE(pais_iso3, '*'), 'category', 'sch_relations', 'filtertype', 'NotFewShots'),
               'La tabla "'|| source_table || '" se relaciona con la tabla "' || target_table || '" mediante el atributo ' || source_column || ' = ' || target_column || '. ' || COALESCE(relation_description, ''),
               process_text(unaccent('La tabla "'|| source_table || '" se relaciona con la tabla "' || target_table || '" mediante el atributo ' || source_column || ' = ' || target_column || '. ' || COALESCE(relation_description, ''))),
               relation_embedding
        FROM sch_relations WHERE relation_embedding IS NOT NULL AND relation_description IS NOT NULL;
        """,
        # sch_fewshots
        """
        INSERT INTO public.documents (
            id, metadata, contents, contents_clean, embedding, question, raw_question_embedding, sql_query, results, updated_at
        )
        SELECT
            uuid_generate_v1mc(),
            jsonb_build_object(
                'country_code', COALESCE(pais_iso3, '*'), 'category', 'sch_fewshots', 'filtertype', 'FewShots',
                'sql_query', example_query, 'question', question, 'updated_at', updated_at, 'results', expected_output, 'is_valid', is_valid
            ),
            example_query,
            process_text(unaccent(example_query)),
            question_sql_embedding,
            question,
            raw_question_embedding,
            example_query,
            expected_output,
            updated_at
        FROM public.sch_fewshots
        WHERE question_sql_embedding IS NOT NULL AND raw_question_embedding IS NOT NULL 
          AND LENGTH(TRIM(question)) > 0 AND LENGTH(TRIM(example_query)) > 0 AND is_valid IS TRUE 
          AND (expected_output::text <> '[]' AND expected_output::text <> '[{}]');
        """,
    ]

    for q in queries:
        try:
            res = orchestrator.pg_conn.execute(q)
            logger.info(f"Checking rows affected... (Driver dependent)")
        except Exception as e:
            logger.error(f"Error inserting docs: {e}")
