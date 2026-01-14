import os
import multiprocessing


def _get_int_env(name: str, default: int) -> int:
    value = os.getenv(name)
    if value is None:
        return default
    try:
        return int(value)
    except ValueError:
        return default


# Obtiene la variable de entorno "ENV" para determinar el entorno de ejecución.
ENV = os.getenv("ENV", "dev").lower()
# Permite forzar recarga en cualquier entorno si GUNICORN_RELOAD=true/1
FORCE_RELOAD = os.getenv("GUNICORN_RELOAD", "").lower() in {"1", "true", "yes", "on"}

# Permite sobrescribir worker class / loop / http desde variables.
worker_class = os.getenv("GUNICORN_WORKER_CLASS", "uvicorn.workers.UvicornH11Worker")
os.environ.setdefault("UVICORN_LOOP", os.getenv("UVICORN_LOOP", "uvloop"))
os.environ.setdefault("UVICORN_HTTP", os.getenv("UVICORN_HTTP", "httptools"))


# Parámetros base sacados del presupuesto de recursos compartido
HOST_CPU_CORES = max(1, _get_int_env("HOST_CPU_CORES", multiprocessing.cpu_count()))
HOST_MEMORY_GB = float(os.getenv("HOST_MEMORY_GB") or 32)
RESOURCE_UTIL_PERCENT = _get_int_env("RESOURCE_UTILIZATION_PERCENT", 75)
WORKER_PERCENT = _get_int_env("GUNICORN_WORKERS_PERCENT", RESOURCE_UTIL_PERCENT)
WORKER_MEMORY_ESTIMATE_GB = float(
    os.getenv("GUNICORN_WORKER_MEMORY_ESTIMATE_GB") or 1.0
)

workers_cpu = max(1, int(HOST_CPU_CORES * WORKER_PERCENT / 100))
workers_memory = max(
    1,
    int(
        max(0.1, HOST_MEMORY_GB * RESOURCE_UTIL_PERCENT / 100)
        / max(0.1, WORKER_MEMORY_ESTIMATE_GB)
    ),
)
default_workers = max(1, min(workers_cpu, workers_memory))
default_worker_connections = _get_int_env("GUNICORN_WORKER_CONNECTIONS", 400)
default_threads = _get_int_env("GUNICORN_THREADS_PER_WORKER", 4)

# Configuración específica para entorno de desarrollo
if ENV in {"development", "dev"} or FORCE_RELOAD:
    workers = _get_int_env("GUNICORN_WORKERS", 1)
    worker_connections = _get_int_env("GUNICORN_WORKER_CONNECTIONS", 50)
    threads = _get_int_env("GUNICORN_THREADS", default_threads)
    reload = True
    loglevel = os.getenv("GUNICORN_LOGLEVEL", "info")

# Configuración específica para entorno de producción
else:
    workers = _get_int_env("GUNICORN_WORKERS", default_workers)
    worker_connections = default_worker_connections
    threads = _get_int_env("GUNICORN_THREADS", default_threads)
    reload = False
    loglevel = os.getenv("GUNICORN_LOGLEVEL", "info")

# Configuración común para ambos entornos:

# Configura el número máximo de solicitudes que puede manejar un worker antes de reiniciarse.
max_requests = 1200

# Introduce un pequeño margen de variabilidad en el reinicio de workers para balancear la carga.
max_requests_jitter = 50

# Tiempo de espera para desconectar solicitudes lentas (en segundos).
# Aumentado a 180s para soportar alta carga con rate limits de Azure OpenAI
timeout = 180

# Límite del tamaño máximo permitido para líneas en solicitudes HTTP (en bytes).
limit_request_line = 4096
# Límite del número máximo de encabezados HTTP permitidos por solicitud.
limit_request_fields = 100

# Tiempo en segundos para mantener conexiones persistentes activas.
graceful_timeout = 180  # Tiempo extra antes de matar un worker.
keepalive = 5  # Mantener conexiones abiertas más tiempo.


# Dirección y puerto donde Gunicorn escuchará las solicitudes.
bind = "0.0.0.0:8000"

# Archivo de salida para los logs. "-" indica que los logs irán a la consola estándar.
log_file = "-"

# Archivo de logs de acceso (registro de solicitudes).
accesslog = "-"

# Archivo de logs de error.
errorlog = "-"
