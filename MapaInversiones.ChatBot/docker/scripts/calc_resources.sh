#!/usr/bin/env bash
set -euo pipefail

SCRIPT_NAME="$(basename "$0")"
ENV_FILE=".env"

print_usage() {
    cat <<'EOF'
Usage: calc_resources.sh [--percent PERCENT]

Recalcula HOST_CPU_CORES, HOST_MEMORY_GB y los porcentajes de Gunicorn/Postgres/PgBouncer
en el archivo .env a partir de los recursos reales del host. Usa RESOURCE_UTILIZATION_PERCENT
como valor base si no se pasa --percent.
EOF
}

TARGET_PERCENT=""
while [[ $# -gt 0 ]]; do
    case "$1" in
        --percent)
            shift
            TARGET_PERCENT="$1"
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            echo "⚠️ $SCRIPT_NAME: argumento desconocido: $1"
            print_usage
            exit 1
            ;;
    esac
    shift
done

if [[ ! -f "$ENV_FILE" ]]; then
    echo "⚠️ $SCRIPT_NAME: no encuentro $ENV_FILE"
    exit 1
fi

# Obtener objetivo por defecto de .env si no se pasó explícitamente
if [[ -z "$TARGET_PERCENT" ]]; then
    TARGET_PERCENT=$(grep -E '^RESOURCE_UTILIZATION_PERCENT=' "$ENV_FILE" | head -n1 | cut -d'=' -f2 | tr -d '"')
fi

if [[ -z "$TARGET_PERCENT" ]]; then
    TARGET_PERCENT=70
fi

SYSTEM_NAME="$(uname -s)"
HOST_CPU_CORES=1
HOST_MEMORY_GB=1

if [[ "$SYSTEM_NAME" == "Linux" ]]; then
    HOST_CPU_CORES=$(nproc)
    MEM_KB=$(awk '/MemTotal/ {print $2}' /proc/meminfo)
    HOST_MEMORY_GB=$(awk -v mb="$MEM_KB" 'BEGIN {printf "%.0f", mb/1024/1024}')
elif [[ "$SYSTEM_NAME" == "Darwin" ]]; then
    HOST_CPU_CORES=$(sysctl -n hw.ncpu)
    MEM_BYTES=$(sysctl -n hw.memsize)
    HOST_MEMORY_GB=$(awk -v mb="$MEM_BYTES" 'BEGIN {printf "%.0f", mb/1024/1024/1024}')
else
    echo "⚠️ $SCRIPT_NAME: sistema no soportado ($SYSTEM_NAME). Usá valores manuales."
    exit 1
fi

HOST_CPU_CORES=${HOST_CPU_CORES:-1}
HOST_MEMORY_GB=${HOST_MEMORY_GB:-1}

echo "ℹ️ $SCRIPT_NAME → HOST_CPU_CORES=${HOST_CPU_CORES}, HOST_MEMORY_GB=${HOST_MEMORY_GB}, RESOURCE_UTILIZATION_PERCENT=${TARGET_PERCENT}"

update_env() {
    local key="$1"
    local value="$2"
    if grep -qE "^${key}=" "$ENV_FILE"; then
        perl -0pi -e "s/^${key}=.*/${key}=${value}/m" "$ENV_FILE"
    else
        echo "${key}=${value}" >> "$ENV_FILE"
    fi
}

update_env "HOST_CPU_CORES" "$HOST_CPU_CORES"
update_env "HOST_MEMORY_GB" "$HOST_MEMORY_GB"
update_env "RESOURCE_UTILIZATION_PERCENT" "$TARGET_PERCENT"
update_env "GUNICORN_WORKERS_PERCENT" "$TARGET_PERCENT"

echo "✅ $SCRIPT_NAME: actualizado .env con los nuevos presupuestos."
