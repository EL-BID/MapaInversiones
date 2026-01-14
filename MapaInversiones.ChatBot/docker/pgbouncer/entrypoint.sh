#!/usr/bin/env sh
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# PgBouncer entrypoint - Optimized for 100 concurrent users
# ═══════════════════════════════════════════════════════════════════════════

DB_HOST="${POSTGRES_UPSTREAM_HOST:-${POSTGRES_HOST:-}}"
DB_PORT="${POSTGRES_UPSTREAM_PORT:-${POSTGRES_PORT:-}}"
DB_NAME="${PGBOUNCER_DATABASE:-${POSTGRES_DATABASE:-}}"
DB_USER="${POSTGRES_USER:-}"
DB_PASSWORD="${POSTGRES_PASSWORD:-}"

if [ -z "${DB_HOST}" ] || [ -z "${DB_PORT}" ] || [ -z "${DB_NAME}" ] || [ -z "${DB_USER}" ]; then
  echo "Missing required Postgres connection variables." >&2
  exit 1
fi

# ═══════════════════════════════════════════════════════════════════════════
# Pool settings optimized for 100 concurrent users
# ═══════════════════════════════════════════════════════════════════════════
PGBOUNCER_PORT="${PGBOUNCER_PORT:-6432}"
POOL_MODE="${PGBOUNCER_POOL_MODE:-transaction}"
DEFAULT_POOL_SIZE="${PGBOUNCER_DEFAULT_POOL_SIZE:-30}"         # Was 20, now 30 for 100 users
RESERVE_POOL_SIZE="${PGBOUNCER_RESERVE_POOL_SIZE:-10}"         # Was 5, now 10 for peaks
MAX_CLIENT_CONN="${PGBOUNCER_MAX_CLIENT_CONN:-150}"            # Was 200, now 150 (more realistic)
MIN_POOL_SIZE="${PGBOUNCER_MIN_POOL_SIZE:-5}"                  # Keep minimum connections warm
RESERVE_POOL_TIMEOUT="${PGBOUNCER_RESERVE_POOL_TIMEOUT:-5}"    # Seconds before using reserve
IGNORE_STARTUP_PARAMETERS="${PGBOUNCER_IGNORE_STARTUP_PARAMETERS:-extra_float_digits}"
AUTH_TYPE="${PGBOUNCER_AUTH_TYPE:-plain}"
SERVER_RESET_QUERY_ALWAYS="${PGBOUNCER_SERVER_RESET_QUERY_ALWAYS:-0}"

# ═══════════════════════════════════════════════════════════════════════════
# Timeout settings - aligned with Python config (90s LLM + 90s SQL)
# ═══════════════════════════════════════════════════════════════════════════
IDLE_TRANSACTION_TIMEOUT="${PGBOUNCER_IDLE_TRANSACTION_TIMEOUT:-60}"   # Was 30, now 60
QUERY_TIMEOUT="${PGBOUNCER_QUERY_TIMEOUT:-120}"                        # Max query time
CLIENT_IDLE_TIMEOUT="${PGBOUNCER_CLIENT_IDLE_TIMEOUT:-300}"            # 5 min idle client
SERVER_IDLE_TIMEOUT="${PGBOUNCER_SERVER_IDLE_TIMEOUT:-60}"             # 1 min idle server conn

mkdir -p /etc/pgbouncer

cat > /etc/pgbouncer/pgbouncer.ini <<EOF
[databases]
${DB_NAME} = host=${DB_HOST} port=${DB_PORT} user=${DB_USER} password=${DB_PASSWORD}

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = ${PGBOUNCER_PORT}
auth_type = ${AUTH_TYPE}
auth_file = /etc/pgbouncer/userlist.txt

; Pool settings
pool_mode = ${POOL_MODE}
max_client_conn = ${MAX_CLIENT_CONN}
default_pool_size = ${DEFAULT_POOL_SIZE}
min_pool_size = ${MIN_POOL_SIZE}
reserve_pool_size = ${RESERVE_POOL_SIZE}
reserve_pool_timeout = ${RESERVE_POOL_TIMEOUT}

; Timeout settings
idle_transaction_timeout = ${IDLE_TRANSACTION_TIMEOUT}
query_timeout = ${QUERY_TIMEOUT}
client_idle_timeout = ${CLIENT_IDLE_TIMEOUT}
server_idle_timeout = ${SERVER_IDLE_TIMEOUT}

; Connection handling
server_reset_query = DISCARD ALL
server_reset_query_always = ${SERVER_RESET_QUERY_ALWAYS}
ignore_startup_parameters = ${IGNORE_STARTUP_PARAMETERS}

; Logging
logfile = /tmp/pgbouncer.log
pidfile = /tmp/pgbouncer.pid
unix_socket_dir = /tmp
log_connections = 0
log_disconnections = 0
log_pooler_errors = 1
stats_period = 60
EOF

printf '"%s" "%s"\n' "${DB_USER}" "${DB_PASSWORD}" > /etc/pgbouncer/userlist.txt

chown -R pgbouncer:pgbouncer /etc/pgbouncer

echo "PgBouncer starting with: pool_size=${DEFAULT_POOL_SIZE}, max_clients=${MAX_CLIENT_CONN}, reserve=${RESERVE_POOL_SIZE}"

exec dumb-init pgbouncer -u pgbouncer /etc/pgbouncer/pgbouncer.ini
