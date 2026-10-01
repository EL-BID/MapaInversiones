# ETL MapaInversiones Cali — PaQueVeas

Pipeline ELT en Python para actualizar los datos de la plataforma [PaQueVeas Cali](https://paqueveas.cali.gov.co).

Actualiza:
- Presupuesto de Inversión (CUIPO)
- Proyectos de Inversión
- Procesos y Contratos (SECOP II)
- Exportación a datos abiertos (CSV/XLSX)

---

## 1. Requisitos previos

- Python 3.10+
- ODBC Driver 17 o 18 para SQL Server ([descargar](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server))
- Acceso a la base de datos SQL Server (staging y modelo final)

---

## 2. Instalación

```bash
# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# Linux/macOS:
source .venv/bin/activate
# Windows (PowerShell):
.venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt
```

---

## 3. Configuración de credenciales

Copiar el archivo de ejemplo y completar con los datos del entorno:

```bash
cp .env.example .env
```

Editar `.env`:

```
DB_SERVER=<servidor SQL Server>
DB_NAME=<base de datos staging, ej: PISGRSTG_Cali>
DB_USER=<usuario SQL>
DB_PASSWORD=<contraseña>
```

> **El archivo `.env` nunca se versiona.** Está en `.gitignore`.

---

## 4. Preparar archivos de entrada

Los archivos Excel de cada período deben colocarse en `data/AAAAMM/` (esta carpeta no está en el repositorio):

```
data/
└── 202601/
    ├── CUIPO.xlsx
    ├── CATALOGO_DE_PRODUCTOS.xlsx
    ├── BASE BID.xlsx
    └── REPORTE_RPC.xlsx
```

Luego actualizar en `config.yaml` las rutas `path` y el campo `periodo` de cada `extract_sources` con el período nuevo.

---

## 5. Ejecución

```bash
# Ver todos los perfiles disponibles
python src/main.py --list-runs

# Ejecutar un dominio completo (extract + transform + load + opendata)
python src/main.py --run presupuesto_full
python src/main.py --run procesos_full
python src/main.py --run contratos_full

# Solo exportar datos abiertos (sin reprocesar staging)
python src/main.py --run opendata_full

# Ejecución manual por dominio y etapa
python src/main.py --domain presupuesto --stage extract
python src/main.py --domain contratos --stage load
python src/main.py --domain procesos,contratos --stage extract,load
```

---

## 6. Flujo del pipeline

```
Excel (data/AAAAMM/)
    ↓ Extract
PISGRSTG_Cali.dbo.stg_cali_*   ← tablas staging
    ↓ Transform (sql/valid/)
tablas válidas
    ↓ Load (sql/model/)
MapaInversionesCali             ← modelo final (app)
    ↓ OpenData (opcional)
src/data/opendata/              ← CSV y XLSX para datos abiertos
```

### Fuentes de entrada

| Archivo | Hoja | Tabla staging | Dominio |
|---------|------|---------------|---------|
| `CUIPO.xlsx` | CUIPO | `stg_cali_cuipo` | presupuesto |
| `CATALOGO_DE_PRODUCTOS.xlsx` | Catálogo de Productos | `stg_cali_catalogo_productos` | presupuesto |
| `BASE BID.xlsx` | Procesos | `stg_cali_procesos` | procesos |
| `BASE BID.xlsx` | Contratos | `stg_cali_contratos` | contratos |
| `REPORTE_RPC.xlsx` | REPORTE | `stg_cali_reporte_rpc` | procesos |

---

## 7. Configuración avanzada (`config.yaml`)

El archivo `config.yaml` controla todo el pipeline sin tocar el código:

- **`extract_sources`**: fuentes Excel → tablas staging
- **`transform_models`**: scripts SQL `sql/valid/` (staging → válidos)
- **`load_models`**: scripts SQL `sql/model/` (válidos → modelo final)
- **`opendata_exports`**: vistas a exportar como CSV/XLSX
- **`domains`**: agrupa items por dominio de negocio
- **`runs`**: perfiles de ejecución reutilizables

### Includes (configuración modular)

Se pueden componer varios YAML desde uno principal:

```yaml
includes:
  - config/base.yaml
  - config/domains/presupuesto.yaml
```

---

## 8. Estructura del repositorio

```
├── src/
│   ├── main.py                  # Orquestador principal
│   ├── db_loader.py             # Carga a SQL Server
│   ├── sql_runner.py            # Ejecuta scripts SQL
│   ├── extract/                 # Extractores (xlsx, csv, api, adls)
│   └── opendata_export/         # Exportadores CSV/XLSX
├── sql/
│   ├── valid/                   # Scripts transform (staging → válidos)
│   └── model/                   # Scripts load (válidos → modelo final)
├── config.yaml                  # Configuración del pipeline
├── requirements.txt
├── .env.example                 # Plantilla de credenciales
└── Dockerfile
```
