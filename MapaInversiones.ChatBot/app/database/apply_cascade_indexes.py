"""
Script to create PostgreSQL indexes required for Cascade Text Search.

Indexes created:
1. GiST indexes on process_text(nombre_proyecto/objetivo_proyecto) for similarity()
2. GIN index for Full-Text Search with to_tsvector

Run this script once to enable optimal performance for the 4-level cascade search.

Usage:
    python apply_cascade_indexes.py
"""

import time
from sqlalchemy import create_engine, text
from modules.config import settings


def apply_cascade_indexes():
    """Create indexes required for cascade text search."""
    print("🚀 Starting CASCADE SEARCH index creation...")
    print("   This enables Trigram similarity and Full-Text Search")

    db_url = settings.psycopg_conn_string
    safe_url = (
        db_url.replace(settings.postgres_password, "******")
        if settings.postgres_password
        else db_url
    )
    print(f"🔌 Connecting to: {safe_url}")

    engine = create_engine(db_url)

    # Indexes to create
    indexes = [
        # GiST for similarity() + ORDER BY on process_text(nombre_proyecto)
        {
            "name": "idx_gist_proc_nombre_proyecto",
            "table": "stg_mapainv_proyectosaprobadosinv",
            "sql": """
                CREATE INDEX idx_gist_proc_nombre_proyecto 
                ON stg_mapainv_proyectosaprobadosinv 
                USING gist (process_text(nombre_proyecto) gist_trgm_ops)
            """,
        },
        # GiST for similarity() + ORDER BY on process_text(objetivo_proyecto)
        {
            "name": "idx_gist_proc_objetivo_proyecto",
            "table": "stg_mapainv_proyectosaprobadosinv",
            "sql": """
                CREATE INDEX idx_gist_proc_objetivo_proyecto 
                ON stg_mapainv_proyectosaprobadosinv 
                USING gist (process_text(objetivo_proyecto) gist_trgm_ops)
            """,
        },
        # GIN for Full-Text Search with to_tsvector
        {
            "name": "idx_fts_proyectos",
            "table": "stg_mapainv_proyectosaprobadosinv",
            "sql": """
                CREATE INDEX idx_fts_proyectos 
                ON stg_mapainv_proyectosaprobadosinv 
                USING gin (
                    to_tsvector('spanish', 
                        COALESCE(nombre_proyecto, '') || ' ' || COALESCE(objetivo_proyecto, '')
                    )
                )
            """,
        },
    ]

    with engine.connect() as conn:
        for idx in indexes:
            idx_name = idx["name"]
            print(f"\n📊 Processing {idx_name}...")

            # Check if exists
            check_sql = text(
                f"""
                SELECT 1 FROM pg_indexes 
                WHERE indexname = :idx_name
            """
            )
            exists = conn.execute(check_sql, {"idx_name": idx_name}).fetchone()

            if exists:
                print(f"   ⏭️ Index {idx_name} already exists. Skipping.")
                continue

            # Create
            try:
                start_time = time.time()
                conn.execute(text(idx["sql"]))
                conn.commit()
                elapsed = time.time() - start_time
                print(f"   ✅ Created {idx_name} in {elapsed:.2f}s")
            except Exception as e:
                print(f"   ❌ Failed to create {idx_name}: {e}")
                # Try to mark function as IMMUTABLE if needed
                if "process_text" in str(e) and "immutable" in str(e).lower():
                    print("   🔧 Attempting to mark process_text as IMMUTABLE...")
                    try:
                        conn.rollback()
                        conn.execute(
                            text("ALTER FUNCTION process_text(text) IMMUTABLE;")
                        )
                        conn.commit()
                        print("   ✅ Function marked IMMUTABLE. Retrying index...")
                        conn.execute(text(idx["sql"]))
                        conn.commit()
                        print(f"   ✅ Created {idx_name} (retry)")
                    except Exception as e2:
                        print(f"   ❌ Retry failed: {e2}")

    print("\n🎉 CASCADE SEARCH indexes processed.")
    print("\nNext steps:")
    print("  1. Set SEARCH_ENABLE_FTS=true in .env (default: true)")
    print("  2. Set SEARCH_TRIGRAM_THRESHOLD_HIGH=0.5 (default)")
    print("  3. Set SEARCH_TRIGRAM_THRESHOLD=0.3 (default)")
    print("  4. Test with a query that doesn't match catalogs")


if __name__ == "__main__":
    apply_cascade_indexes()
