# 🚀 ChatBot ETL Pipeline

Este directorio contiene el pipeline de **Extracción, Transformación y Carga (ETL)** modular para la ingesta de datos del ChatBot.

El sistema ha sido refactorizado para ser **Config-Driven** (impulsado por configuración), lo que significa que agregar nuevas fuentes de datos no requiere (en la mayoría de los casos) tocar código Python, sino simplemente editar archivos YAML.

---

## 🏗️ Arquitectura

El pipeline se divide en **5 Etapas (Stages)** secuenciales:

1.  **01_ingest (Ingesta)**:
    *   **Origen**: SQL Server, Archivos CSV/Excel, URLs.
    *   **Destino**: Tablas `stg_` (Staging) en PostgreSQL.
    *   **Función**: Copia datos crudos tal cual, truncando la tabla de destino antes de insertar (o limpiando por país).
2.  **02_refine (Refinamiento)**:
    *   **Origen**: Tablas `stg_`.
    *   **Destino**: Tablas de Metadatos `sch_tables`, `sch_columns`, `sch_relations`.
    *   **Función**: "Refleja" la estructura de la BD, genera descripciones con LLM y embeddings para que el bot entienda el esquema.
3.  **03_dimensions (Dimensiones)**:
    *   **Origen**: Tablas `stg_`.
    *   **Destino**: Tablas dimensionales `dim_sectores`, `dim_territorios`.
    *   **Función**: Normaliza entidades (sectores, lugares) para búsquedas difusas y catálogos.
4.  **04_knowledge (Conocimiento)**:
    *   **Origen**: `raw_fewshots` (CSV/Tabla) y `sch_fewshots`.
    *   **Destino**: `sch_fewshots`.
    *   **Función**: Transfiere nuevos few-shots, ejecuta su SQL para llenar `expected_output`, corrige (LLM) las consultas inválidas y prepara todas las columnas/embeddings necesarios para el stage 05.

   Esta etapa recorre `raw_fewshots` para poblar `sch_fewshots`, luego valida y corrige las consultas a través del LLM (`app/data_ingestion/stages/04_knowledge/validator.py`). Si tienes nuevas few-shots o necesitas re-validar, ejecuta solo esta etapa (`python app/data_ingestion/manage.py run-stage 04_knowledge`); `run-batch` ya la ejecuta después de las etapas de dim y refine.
5.  **05_publish (Publicación)**:
    *   **Origen**: Todo lo anterior (`sch_tables`, `sch_columns`, `sch_fewshots`, `dim_*`).
    *   **Destino**: Tabla Universal `public.documents`.
    *   **Función**: Genera el índice vectorial final usado por el RAG del Chatbot.

---

## 🛠️ Cómo Usar (`manage.py`)

El punto de entrada es el script `manage.py`. Asegúrate de estar en el entorno virtual.

### 1. Comandos Básicos

```bash
# Ver ayuda
python app/data_ingestion/manage.py --help

# 📡 Probar conexiones a BD (Postgres y SQL Server)
python app/data_ingestion/manage.py test-connections
```

### 2. Ejecutar el Pipeline Completo
Para correr **todas** las etapas en orden (ideal para rerescos nocturnos o despliegues iniciales):

```bash
python app/data_ingestion/manage.py run-batch --country dom
```
*(El flag `--country` es útil si tienes lógica de limpieza por país, por defecto es 'dom')*

### 3. Ejecutar una Etapa Específica
Si solo quieres regenerar los documentos o solo re-ingestar datos crudos:

```bash
# Solo ingesta (Stage 01)
python app/data_ingestion/manage.py run-stage 01_ingest

# Solo publicación de documentos (Stage 05)
python app/data_ingestion/manage.py run-stage 05_publish
```

### 4. Ingestar una Sola Fuente
Si agregaste una tabla nueva en el YAML y solo quieres traerla sin correr todo:

```bash
# 'proyectos_dom' es el ID definido en sources.yaml
python app/data_ingestion/manage.py ingest --source-id proyectos_dom
```

---

## ⚙️ Configuración y Fuentes (`sources.yaml`)

**Aquí es donde ocurre la magia.**

El archivo de configuración principal es:
📂 `app/data_ingestion/config/sources.yaml`

### ¿Cómo agregar una nueva fuente?

Simplemente añade una entrada en la lista `sources`.

#### Ejemplo 1: Agregar una Tabla SQL
Supongamos que quieres traer la tabla de "Ejecución Física" desde SQL Server.

```yaml
sources:
  - id: ejecucion_fisica_dom
    type: sql_server
    enabled: true
    connection_ref: AZURE_SQL_MAIN
    country: dom
    destination_table: stg_ejecucion_fisica
    sql_query: |
      SELECT 
        id_proyecto, 
        avance_fisico, 
        fecha_corte,
        'dom' as pais_iso3
      FROM P_MAPAINVERSIONES.dbo.t_ejecucion_fisica
      WHERE pais = 'Republica Dominicana'
```

#### Ejemplo 2: Agregar un CSV Local
Supongamos que tienes un Excel/CSV manual de "Códigos SNIP prioritarios".

```yaml
sources:
  - id: codigos_prioritarios
    type: csv_file
    enabled: true
    country: dom
    destination_table: stg_codigos_prioritarios
    path: "data/manual/codigos_snip_2024.csv"
```

### Campos Clave del YAML

| Campo | Descripción |
| :--- | :--- |
| **`id`** | Nombre único de la fuente (sin espacios). |
| **`type`** | `sql_server` (consultas en SQL Server) o `csv_file` (archivo local). |
| **`connection_ref`** | Alias usado para resolver un conector preconfigurado (ver abajo). Si se omite, se usa la primera conexión disponible. |
| **`country`** | Opcional; se usa para limpiar datos previos de ese país antes de recargar. |
| **`destination_table`** | Tabla destino en Postgres. Debe ser válida y preferiblemente comenzar con `stg_`. El código valida el nombre y hace `DELETE ... WHERE pais_iso3 = :country` si hay país. |
| **`sql_query`** | Consulta SQL que se ejecutará (solo `sql_server`). |
| **`path`** | Ruta relativa o absoluta del CSV (solo `csv_file`). |
| **`enabled`** | Puedes apagar la fuente sin borrar la entrada. |

### Resolución de conectores y CSV

La lista de alias/conn strings vive en `app/data_ingestion/config/settings_etl.py` bajo `ETLSettings.SQL_SERVER_SOURCES`. Por defecto incluye `AZURE_SQL_MAIN`, que apunta a la propiedad `sqlserver_conn_string` de `modules.config.settings`. Si necesitas más orígenes, añade nuevos pares `ALIAS: property_name` y actualiza `.env` con la conexión correspondiente.

Cuando una fuente declara `connection_ref: AZURE_SQL_MAIN`, el controlador de Stage 01 obtiene ese connector y ejecuta la consulta. Si la conexión no existe, la carga falla con el log correspondiente.

Los CSV se resuelven intentando primero la ruta absoluta, luego `BASE_DIR`, luego `BASE_DIR.parent` y finalmente el `cwd`. Si el archivo no se encuentra, el contenedor se detiene antes de escribir nada.

---

## 🧩 Dependencias (`dependencies.py`)

Archivo: `app/data_ingestion/config/dependencies.py`

Si creas una tabla nueva (ej. `stg_nueva`), no *necesitas* obligatoriamente tocar este archivo para que la ingesta funcione. 

Sin embargo, si esa tabla es **padre** de otra (por ejemplo, `stg_proyectos` es padre de `stg_territorios` por FK), debes definirlas aquí para que el sistema sepa en qué orden borrarlas y cargarlas.

```python
DEPENDENCIES = {
    "stg_hija": ["stg_padre"],  # stg_padre se carga primero
    ...
}
```

---

## 🏗️ Extensión del Código

- **Nuevos Connectores**: `app/data_ingestion/core/connectors.py` (ej. agregar MySQL o Oracle).
- **Lógica de Transformación**:
    - Si es limpieza ligera, hazlo en la SQL del `sources.yaml`.
    - Si es compleja (normalización, IA), agrega un script en `app/data_ingestion/stages/02_refine/` o `03_dimensions/` y regístralo en el controlador de esa etapa.

## 📝 Variables de Entorno

El sistema usa las mismas variables que el Chatbot (`.env`):
- `POSTGRES_CONN_STRING`: Conexión a la BD destino.
- `SQLSERVERDATA_CONN_STRING`: Conexión a la BD origen principal.
- Credenciales de Azure OpenAI (para generar descripciones y embeddings).

## ⚙️ Configuración Avanzada

El archivo `app/data_ingestion/config/settings_etl.py` contiene parámetros configurables del ETL:

```python
class ETLSettings(BaseSettings):
    # Database Connection Pools
    POSTGRES_POOL_SIZE: int = 10
    SQLSERVER_POOL_SIZE: int = 5
    
    # ETL Processing Settings
    PREVIEW_ROWS: int = 15              # Filas a guardar en few-shot validation
    SQL_EXECUTION_TIMEOUT: int = 30     # Timeout (segundos) para ejecución SQL
    LLM_TEMPERATURE: float = 0.0        # Temperatura para llamadas LLM
```

Puedes sobrescribir estos valores:
- Editando directamente `settings_etl.py`
- Definiendo variables de entorno (ej: `ETL_PREVIEW_ROWS=20`)
- Para producción, ajusta `SQL_EXECUTION_TIMEOUT` según queries complejas

## 📝 Logs

El sistema utiliza **Loguru** para la gestión de logs rotativos.

- **Ubicación por defecto**: `logs/etl.log` (en la raíz del proyecto).
- **Configuración**:
  - **Rotación**: 10 MB (crea un archivo nuevo al llegar a este tamaño).
  - **Retención**: 7 días (elimina logs más antiguos).
  - **Nivel**: `DEBUG` en archivo, `INFO` en consola.

Puedes modificar esta configuración editando `app/data_ingestion/manage.py`:

```python
logger.add("logs/etl.log", rotation="10 MB", retention="7 days", level="DEBUG")
```

---

## ⏰ Automatización (Crontab)

Para ejecutar el pipeline automáticamente (por ejemplo, todas las mañanas a las 6:00 AM), puedes usar **cron**.

1. Abre el editor de cron en tu servidor/máquina:
   ```bash
   crontab -e
   ```

2. Agrega una línea como la siguiente (ajustando tus rutas):

   ```bash
   # Ejecuta el ETL completo para República Dominicana (dom) a las 6:00 AM todos los días
   0 6 * * * cd /home/usuario/ChatBot_v2 && /home/usuario/ChatBot_v2/venv/bin/python app/data_ingestion/manage.py run-batch --country dom >> logs/cron_etl.log 2>&1
   ```

**Recomendaciones:**
- **Rutas Absolutas**: Siempre usa la ruta completa al binario de `python` dentro de tu entorno virtual (ej. `/venv/bin/python`).
- **Logs**: Redirige siempre la salida (`>>`) a un archivo para poder debuggear si algo falla silenciosamente.
- **Docker**: Si corres con Docker, el cron debe ser en el host llamando a `docker exec`:
  ```bash
  0 6 * * * docker exec chatbot-backend python app/data_ingestion/manage.py run-batch --country dom
  ```

---

## 🧩 Addon: Generador de Few-Shots (`app/gen`)

Además del pipeline de ingesta batch, existe un sistema interactivo ("Addon") para **generar y curar Few-Shots dinámicamente** basándose en preguntas reales de usuarios.

Ubicación: `app/gen/`

Este módulo permite:
1.  **Leer preguntas reales** sin respuesta de la base de datos (`questions_mapainv_chat`).
2.  **Generar SQL** automáticamente usando un LLM.
3.  **Validar y Corregir** la SQL interactivamente.
4.  **Insertar** el resultado como un nuevo *few-shot* en `sch_fewshots`, que luego es procesado por el Stage 04 del ETL.

### Uso Rápido
```bash
# Ejecutar el CLI interactivo
python app/gen/cli.py
```

Para más detalles, consultar el `README.md` dentro de `app/gen`.
