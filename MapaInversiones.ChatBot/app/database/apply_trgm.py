import os
import sys
import time
from sqlalchemy import create_engine, text
from modules.config import settings


def apply_trgm_indexes():
    print("🚀 Starting GIN/Trigram index creation...")

    db_url = settings.psycopg_conn_string
    # Mask password for logging
    safe_url = (
        db_url.replace(settings.postgres_password, "******")
        if settings.postgres_password
        else db_url
    )
    print(f"🔌 Connecting to: {safe_url}")

    engine = create_engine(db_url)

    # List of indexes to create
    # Format: (table, column, index_name)
    indexes_to_create = [
        (
            "stg_mapainv_proyectosaprobadosinv",
            "nombre_proyecto",
            "idx_trgm_nombre_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "objetivo_proyecto",
            "idx_trgm_objetivo_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "nombresector_proyecto",
            "idx_trgm_nombresector_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "nombreentidadejecutora_proyecto",
            "idx_trgm_entidadejecutora",
        ),
    ]

    with engine.connect() as conn:
        print("✅ Connected.")

        # 1. Enable Extension
        print("🔧 Enabling pg_trgm extension...")
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS pg_trgm;"))
        conn.commit()
        print("✅ Extension enabled.")

        # 2. Create Indexes
        for table, col, idx_name in indexes_to_create:
            print(f"🔍 Checking/Creating index {idx_name} on {table}({col})...")

            # Check if exists
            check_sql = text(f"SELECT 1 FROM pg_indexes WHERE indexname = '{idx_name}'")
            if conn.execute(check_sql).fetchone():
                print(f"   ⏭️ Index {idx_name} already exists. Skipping.")
                continue

            # Create
            start_time = time.time()
            create_sql = text(
                f"CREATE INDEX {idx_name} ON {table} USING gin ({col} gin_trgm_ops);"
            )
            conn.execute(create_sql)
            conn.commit()
            elapsed = time.time() - start_time
            print(f"   ✅ Created {idx_name} in {elapsed:.2f}s")

    print("🎉 All operations completed.")


if __name__ == "__main__":
    try:
        apply_trgm_indexes()
    except Exception as e:
        print(f"❌ Failed: {e}")
        sys.exit(1)
