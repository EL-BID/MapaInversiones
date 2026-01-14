import sys
import time
from sqlalchemy import create_engine, text
from modules.config import settings


def apply_functional_indexes():
    print("🚀 Starting FUNCTIONAL GIN/Trigram index creation...")
    print("ℹ️  Strategy: 'Clean' Layer -> Indexing process_text(col)")

    db_url = settings.psycopg_conn_string
    engine = create_engine(db_url)

    # Format: (table, column_expression, index_name)
    # Note: process_text() must be IMMUTABLE for this to work.
    # If it fails, we know we need to ALTER FUNCTION first.
    indexes_to_create = [
        (
            "stg_mapainv_proyectosaprobadosinv",
            "process_text(nombre_proyecto)",
            "idx_proc_nombre_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "process_text(objetivo_proyecto)",
            "idx_proc_objetivo_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "process_text(nombresector_proyecto)",
            "idx_proc_nombresector_proyecto",
        ),
        (
            "stg_mapainv_proyectosaprobadosinv",
            "process_text(nombreentidadejecutora_proyecto)",
            "idx_proc_entidadejecutora",
        ),
    ]

    with engine.connect() as conn:
        print("✅ Connected.")

        # 0. Check process_text immutability (best effort check)
        # We try to create index; if it fails due to volatility, we catch it.

        for table, col_expr, idx_name in indexes_to_create:
            print(f"🔍 Checking/Creating FUNCTIONAL index {idx_name} on {col_expr}...")

            # Check if exists
            check_sql = text(f"SELECT 1 FROM pg_indexes WHERE indexname = '{idx_name}'")
            if conn.execute(check_sql).fetchone():
                print(f"   ⏭️ Index {idx_name} already exists. Skipping.")
                continue

            # Create
            start_time = time.time()
            create_sql = text(
                f"CREATE INDEX {idx_name} ON {table} USING gin ({col_expr} gin_trgm_ops);"
            )

            try:
                conn.execute(create_sql)
                conn.commit()
                elapsed = time.time() - start_time
                print(f"   ✅ Created {idx_name} in {elapsed:.2f}s")
            except Exception as e:
                print(f"   ❌ Failed to create {idx_name}: {e}")
                print("   ⚠️  Hint: Ensure 'process_text' function is marked IMMUTABLE.")
                # Try to alter function to immutable if that's the error
                if "immutable" in str(e).lower():
                    print(
                        "   🔧 Attempting to ALTER FUNCTION process_text to IMMUTABLE..."
                    )
                    try:
                        conn.rollback()
                        conn.execute(
                            text("ALTER FUNCTION process_text(text) IMMUTABLE;")
                        )
                        conn.commit()
                        print("   ✅ Function marked IMMUTABLE. Retrying index...")
                        conn.execute(create_sql)
                        conn.commit()
                        print(f"   ✅ Created {idx_name} (retry)")
                    except Exception as e2:
                        print(f"   ❌ Retry failed: {e2}")

    print("🎉 All functional indexes processed.")


if __name__ == "__main__":
    try:
        apply_functional_indexes()
    except Exception as e:
        print(f"❌ Script Failed: {e}")
        sys.exit(1)
