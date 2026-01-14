Con la inclusión del contenido del archivo `init-db/init.sql`, actualicé la documentación para detallar el propósito y la funcionalidad de este script. Aquí está la versión actualizada del `README`:

---

# **Documentación Actualizada para Docker Compose**

Este entorno de Docker Compose define tres servicios principales: **Phoenix**, **Base de Datos PostgreSQL con TimescaleDB** y **Aplicación FastAPI**. La configuración incluye scripts personalizados para levantar, gestionar y probar las conexiones a los servicios. Además, se incluyen pasos para inicializar la base de datos con configuraciones específicas.

---

## **Servicios Definidos en `docker-compose.yml`**

### **1. Phoenix**
- **Descripción**: Servicio de monitoreo Phoenix, diseñado para rastrear datos de análisis.
- **Imagen**: `arizephoenix/phoenix:latest`.
- **Configuraciones**:
  - **Puertos**: Expuesto en el puerto `6006` del host.
  - **Reinicio**: Configurado para reiniciarse automáticamente en caso de fallos.
  - **Dependencias**: Depende del servicio `db` para funcionar correctamente.
  - **Variables de Entorno**:
    - `PHOENIX_SQL_DATABASE_URL`: URL de la base de datos PostgreSQL.

---

### **2. Base de Datos (PostgreSQL con TimescaleDB)**
- **Descripción**: Contenedor de base de datos PostgreSQL 16 con soporte para TimescaleDB y extensiones AI Tools.
- **Imagen**: `timescale/timescaledb-ha:pg16`.
- **Configuraciones**:
  - **Variables de Entorno**: Cargadas desde un archivo `.env` con los valores:
    - `POSTGRES_USER`
    - `POSTGRES_PASSWORD`
    - `POSTGRES_DATABASE`
  - **Volúmenes**:
    - `db_data`: Persistencia de datos.
    - `init-db`: Scripts de inicialización ejecutados al inicio (incluye `init.sql`).
    - `postgresql.conf` y `pg_hba.conf`: Archivos para configuración personalizada.
  - **Puertos**: Expuesto según el puerto configurado en el archivo `.env` (ejemplo: `5432`).
  - **Comando Personalizado**:
    - Inicia PostgreSQL con un archivo de configuración específico (`postgresql.conf`).
  - **Reinicio**: Automático en caso de fallos.

---

### **3. Aplicación FastAPI**
- **Descripción**: Servicio de backend basado en FastAPI.
- **Imagen**: `mapainversiones` (asegúrate de que esta imagen esté previamente construida).
- **Configuraciones**:
  - **Construcción**:
    - Basado en un `Dockerfile` que instala dependencias con Poetry y configura el entorno.
  - **Puertos**: Expuesto en el puerto `8001` del host.
  - **Dependencias**:
    - Garantiza que `db` esté listo antes de iniciar.
  - **Variables de Entorno**:
    - Define el entorno (`ENV=production` o `ENV=development`).
  - **Reinicio**: Automático en caso de fallos.

---

## **Inicialización de la Base de Datos**

### **Archivo `init-db/init.sql`**
Este archivo se ejecuta automáticamente al iniciar el contenedor de la base de datos. Contiene los siguientes pasos:

1. **Crear la base de datos `chatbot`:**
   ```sql
   CREATE DATABASE chatbot;
   ```

2. **Seleccionar la base de datos `chatbot`:**
   ```sql
   \c chatbot;
   ```

3. **Crear la extensión `vector` si no existe:**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

Estos pasos son necesarios para preparar la base de datos `chatbot` y habilitar las funcionalidades relacionadas con vectores.

---

## **Comandos para Gestionar el Entorno**

### **Iniciar los Servicios**
- **Construir y Levantar los Servicios**:
  ```bash
  docker-compose up --build
  ```
- **Ejecutar en Segundo Plano**:
  ```bash
  docker-compose up -d --build
  ```

### **Detener los Servicios**
- **Detener y Eliminar Recursos**:
  ```bash
  docker-compose down
  ```
- **Eliminar También los Volúmenes Persistentes**:
  ```bash
  docker-compose down --volumes
  ```

### **Verificar Logs**
- **Logs en Tiempo Real de un Servicio**:
  ```bash
  docker-compose logs -f [nombre_servicio]
  ```
  - Ejemplo:
    ```bash
    docker-compose logs -f db
    ```

### **Verificar el Estado de los Servicios**
- **Mostrar el Estado Actual de los Contenedores**:
  ```bash
  docker-compose ps
  ```

---

## **Gestión Adicional**

### **Comandos de Limpieza Completa**
Para detener y eliminar todos los contenedores, redes, volúmenes y cachés de imágenes:

#### **Linux**
```bash
sudo docker stop $(sudo docker ps -aq)
sudo docker rm $(sudo docker ps -aq)
sudo docker network prune -f
sudo docker rmi $(sudo docker images -q)
sudo docker volume prune -f
```

#### **Windows**
```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
docker network prune -f
docker rmi $(docker images -q)
docker volume prune -f
```

---

## **Scripts Personalizados**

### **1. Script `build_and_run.sh`**
Este script automatiza la construcción, el despliegue y la inicialización del entorno.

```bash
#!/bin/bash

ENV=${ENV:-production}

echo "DOCKER DOWN -->"
docker-compose down -v

echo "DOCKER UP -->"
docker-compose up --build -d

# Esperar 5 segundos para asegurarse de que los servicios estén levantados
echo "Esperando 5 segundos para que los servicios estén listos..."
sleep 5

echo "POST DATA -->"
./postdata.sh

### **2. Script `calc_resources.sh`**

El script `docker/scripts/calc_resources.sh` reajusta `.env` automáticamente para reflejar el 70 % del host (o el porcentaje que pases con `--percent`). Ejecutalo antes de levantar el stack:

```bash
./docker/scripts/calc_resources.sh
```

Si necesitás otro valor, pasalo con `--percent 80` para actualizar también `RESOURCE_UTILIZATION_PERCENT` y `GUNICORN_WORKERS_PERCENT`.

1. Detecta cores/GB físicos (`nproc`/`sysctl`).
2. Calcula la fracción indicada y escribe `HOST_CPU_CORES`, `HOST_MEMORY_GB`, `RESOURCE_UTILIZATION_PERCENT`, `GUNICORN_WORKERS_PERCENT` en `.env`.
3. Luego podés correr `docker compose up --build` y todos los servicios utilizarán ese presupuesto compartido.
```

---

#### **`postdata.sh`: Ejecución y Monitoreo**

El script `postdata.sh` se encarga de:

1. **Verificar que el contenedor `chatbot_v2-chatbot-1` esté activo.**
2. **Ejecutar el script `datapostgres_ready_new.sh` dentro del contenedor.**
3. **Monitorear el progreso en tiempo real desde el archivo de log `datapost_output.log`.**

**Flujo general:**

```bash
#!/bin/bash

# Configuración
CONTAINER_NAME="chatbot_v2-chatbot-1"
COMMAND="./datapostgres_ready_new.sh"
LOG_FILE="datapost_output.log"

# Esperar que el contenedor esté "running"
while ! docker ps --filter "name=$CONTAINER_NAME" --filter "status=running" | grep $CONTAINER_NAME > /dev/null; do
    sleep 2
    echo "Esperando a que $CONTAINER_NAME esté listo..."
done

# Ejecutar comando dentro del contenedor y monitorear
docker exec $CONTAINER_NAME /bin/bash -c "$COMMAND" > "$LOG_FILE" 2>&1 &
PID=$!
while kill -0 $PID 2> /dev/null; do
    tail -n 5 "$LOG_FILE"
    sleep 5
done
wait $PID

# Resultado final
if [ $? -eq 0 ]; then
    echo "✅ Comando ejecutado exitosamente."
else
    echo "❌ Fallo en la ejecución. Revisa $LOG_FILE."
fi
```

---

#### **`datapostgres_ready_new.sh`: Tareas dentro del Contenedor**

Este script realiza:

1. **Conexión a PostgreSQL:**
   Verifica que la base de datos esté accesible.
   ```bash
   python -m data_ingestion.dbpg_conn
   ```

2. **Gestión de Tablas:**
   - Remueve tablas existentes:  
     ```bash
     python -m data_ingestion.dbpg_remove_tables
     ```
   - Lista las tablas actuales:
     ```bash
     python -m data_ingestion.dbpg_listtables
     ```

3. **Procesamiento e Ingesta de Datos:**
   - Carga datos desde Azure SQL Server:
     ```bash
     python -m data_ingestion.data_from_azure_sqlserver
     ```
   - Ejecuta transformaciones:
     ```bash
     python -m data_ingestion.transform
     ```
   - Limpia tablas específicas:
     ```bash
     python -m data_ingestion.dbpg_remove_prefixtables
     ```

4. **Migraciones y Finalización:**
   - Ejecuta migraciones con Alembic:
     ```bash
     alembic upgrade head
     ```
   - Ingesta final de datos:
     ```bash
     python -m data_ingestion.ingest
     ```
   - Lista las tablas actualizadas:
     ```bash
     python -m data_ingestion.dbpg_listtables
     ```

---

### **Flujo Completo**

1. **`build_and_run.sh`**:
   - Detiene contenedores existentes y los elimina con `docker-compose down`.
   - Construye y levanta los contenedores con `docker-compose up`.
   - Espera 5 segundos para asegurar que los servicios estén inicializados.
   - Llama a `postdata.sh`.

2. **`postdata.sh`**:
   - Verifica que el contenedor de la aplicación (`chatbot_v2-chatbot-1`) esté en estado `running`.
   - Ejecuta `datapostgres_ready_new.sh` dentro del contenedor.
   - Monitorea en tiempo real las últimas 5 líneas del log del proceso ejecutado.

3. **`datapostgres_ready_new.sh`** (dentro del contenedor):
   - Realiza tareas específicas de la base de datos y migraciones:
     - Conexión a PostgreSQL.
     - Eliminación y listado de tablas.
     - Transformación e ingesta de datos desde Azure SQL Server.
     - Migraciones con Alembic.
     - Verificación final del estado de la base de datos.

---

### **Logs en Tiempo Real**

Mientras `postdata.sh` monitorea la ejecución de `datapostgres_ready_new.sh`, muestra las últimas 5 líneas del log del proceso cada 5 segundos, permitiendo supervisar el progreso.

---

### **Orden de Dependencias**
- **`build_and_run.sh`** es el punto de entrada principal para construir y desplegar el entorno.
- **`postdata.sh`** asegura que los servicios estén activos antes de iniciar las tareas de procesamiento.
- **`datapostgres_ready_new.sh`** realiza las operaciones detalladas dentro del contenedor.

---

### **Presupuesto de recursos / .env**
El archivo `.env` en la raíz del proyecto actúa como la fuente única de verdad para los límites de CPU y memoria. Allí definimos:

- `HOST_CPU_CORES` y `HOST_MEMORY_GB`: la capacidad total del host.
- `RESOURCE_UTILIZATION_PERCENT` (70%): cuánta parte de esa capacidad usamos para Gunicorn/Postgres/PgBouncer.
- `GUNICORN_WORKERS_PERCENT` y `GUNICORN_THREADS_PER_WORKER`: alimentan la configuración dinámica en `modules/gunicorn.conf.py`.
- Las variables `%_PERCENT` de Postgres y PgBouncer (pool/overflow/default/reserve) duplican ese target para mantener las conexiones en un rango seguro.

Cambiar estos valores en `.env` ajusta simultáneamente el comportamiento de Gunicorn, Postgres y PgBouncer, de modo que todos trabajen dentro del mismo presupuesto sin tocar múltiples archivos. Si necesitás otro perfil más agresivo, basta con modificar ese mismo bloque y reconstruir los contenedores.
