#!/usr/bin/env bash
set -euo pipefail

SCRIPT_PATH="${TUNING_SQL_PATH:-/opt/chatbot/sql/tune_postgres.sql}"

if [[ "${ENV:-development}" != "production" ]]; then
  exit 0
fi

if [[ ! -f "${SCRIPT_PATH}" ]]; then
  echo "⚠️  Tuning script ${SCRIPT_PATH} not found, skipping Postgres bootstrap."
  exit 0
fi

DB_HOST="${POSTGRES_UPSTREAM_HOST:-${POSTGRES_HOST:-}}"
DB_PORT="${POSTGRES_UPSTREAM_PORT:-${POSTGRES_PORT:-}}"
SESSION_GC_ENABLED="${SESSION_GC_ENABLED:-1}"
SESSION_GC_TTL_HOURS="${SESSION_GC_TTL_HOURS:-48}"

if [[ -z "${DB_HOST}" || -z "${DB_PORT}" || -z "${POSTGRES_DATABASE:-}" ]]; then
  echo "⚠️  Missing Postgres connection variables. Skipping tuning script."
  exit 0
fi

PG_USER="${POSTGRES_SUPERUSER:-${POSTGRES_USER:-postgres}}"
if [[ -z "${PG_USER}" ]]; then
  echo "⚠️  Missing Postgres user and POSTGRES_SUPERUSER. Skipping tuning script."
  exit 0
fi

# If POSTGRES_SUPERUSER is not set (managed DB) OR the host looks like
# Azure Database for PostgreSQL, skip applying tuning SQL because managed
# services do not allow altering server parameters or require a superuser.
if [[ -z "${POSTGRES_SUPERUSER:-}" || "${DB_HOST}" == *.postgres.database.azure.com ]]; then
  echo "⚠️  Detected managed Postgres host or no superuser provided; skipping tuning script."
  exit 0
fi

MARKER_FILE="/tmp/.postgres_tuning_done"
if [[ -f "${MARKER_FILE}" ]]; then
  echo "ℹ️  Postgres tuning already executed in this container session."
  exit 0
fi

export PGPASSWORD="${POSTGRES_SUPERUSER_PASSWORD:-${POSTGRES_PASSWORD:-}}"

echo "🚀 Applying Postgres tuning script..."
psql \
  --host "${DB_HOST}" \
  --port "${DB_PORT}" \
  --username "${PG_USER}" \
  --dbname "${POSTGRES_DATABASE}" \
  --file "${SCRIPT_PATH}" \
  --set ON_ERROR_STOP=on

touch "${MARKER_FILE}"
echo "✅ Postgres tuning completed."

# ═══════════════════════════════════════════════════════════════════════════
# Cascade Search Indexes (GiST for trigram, GIN for FTS)
# ═══════════════════════════════════════════════════════════════════════════
CASCADE_SQL="${CASCADE_SQL_PATH:-/opt/chatbot/sql/cascade_indexes.sql}"
if [[ -f "${CASCADE_SQL}" ]]; then
  echo "📊 Applying Cascade Search indexes..."
  psql \
    --host "${DB_HOST}" \
    --port "${DB_PORT}" \
    --username "${PG_USER}" \
    --dbname "${POSTGRES_DATABASE}" \
    --file "${CASCADE_SQL}" \
    --set ON_ERROR_STOP=off || true
  echo "✅ Cascade Search indexes applied."
else
  echo "⚠️  Cascade index script ${CASCADE_SQL} not found, skipping."
fi

if [[ "${SESSION_GC_ENABLED}" =~ ^(1|true|TRUE|yes|on)$ ]]; then
  echo "🧹 Purging chat_session_state entries older than ${SESSION_GC_TTL_HOURS} hours..."
  psql \
    --host "${DB_HOST}" \
    --port "${DB_PORT}" \
    --username "${PG_USER}" \
    --dbname "${POSTGRES_DATABASE}" \
    --set ON_ERROR_STOP=on \
    --command "DELETE FROM chat_session_state WHERE updated_at < NOW() - INTERVAL '${SESSION_GC_TTL_HOURS} hours';"
fi
