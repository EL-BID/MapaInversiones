# Guía Operativa — ETL MapaInversiones Cali

Guía completa para instalar, configurar y ejecutar el pipeline ETL de PaQueVeas Cali.

---

## 1. Requisitos previos

### Python

- Python **3.10 o superior**
- Verificar: `python --version`

### ODBC Driver para SQL Server

El ETL se conecta a SQL Server vía ODBC. Instalar **ODBC Driver 17 for SQL Server**:

- **Windows**: [descargar instalador Microsoft](https://learn.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server)
- **macOS**: `brew install msodbcsql17`
- **Linux (Ubuntu/Debian)**:
  ```bash
  curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
  curl https://packages.microsoft.com/config/ubuntu/20.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
  apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17
  ```

Verificar que el driver esté instalado:
```bash
# Windows (PowerShell)
Get-OdbcDriver -Name "ODBC Driver 17*"

# macOS / Linux
odbcinst -q -d -n "ODBC Driver 17 for SQL Server"
```

### Acceso a la base de datos

Necesitas credenciales de acceso a SQL Server con permisos de:
- `CREATE TABLE`, `INSERT`, `UPDATE`, `DELETE` en la base de datos staging (`PISGRSTG_Cali`)
- `SELECT` en las vistas del modelo final (`MapainversionesCali`)

---

## 2. Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd Datos_PYTHON_CALI

# 2. Crear entorno virtual
python -m venv .venv

# 3. Activar entorno virtual
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Windows (CMD):
.venv\Scripts\activate.bat
# macOS / Linux:
source .venv/bin/activate

# 4. Instalar dependencias
pip install -r requirements.txt
```

---

## 3. Configuración de credenciales

```bash
# Copiar plantilla
cp .env.example .env
```

Editar `.env` con las credenciales del entorno:

```env
DB_SERVER=<servidor SQL Server, ej: nombre-servidor o IP,puerto>
DB_NAME=<base de datos staging, ej: PISGRSTG_Cali>
DB_USER=<usuario SQL Server>
DB_PASSWORD=<contraseña>
```

> El archivo `.env` **nunca se sube al repositorio**. Está excluido por `.gitignore`.

---

## 4. Preparar los archivos de entrada

Los archivos Excel de cada período deben colocarse en la carpeta `data/AAAAMM/`.  
Esta carpeta **no está en el repositorio** — hay que crearla manualmente.

Estructura esperada:

```
data/
└── 202601/
    ├── CUIPO.xlsx
    ├── CATALOGO_DE_PRODUCTOS.xlsx
    ├── BASE BID.xlsx
    └── REPORTE_RPC.xlsx
```

| Archivo | Hoja requerida | Contenido |
|---------|---------------|-----------|
| `CUIPO.xlsx` | `CUIPO` | Presupuesto de inversión (Sistema CUIPO) |
| `CATALOGO_DE_PRODUCTOS.xlsx` | `Catálogo de Productos` | Catálogo MGA / SUIFP / PIIP |
| `BASE BID.xlsx` | `Procesos` | Procesos de compra SECOP II |
| `BASE BID.xlsx` | `Contratos` | Contratos SECOP II |
| `REPORTE_RPC.xlsx` | `REPORTE` | Reporte RPC / SAP interno Alcaldía |

---

## 5. Configurar el período en config.yaml

Antes de ejecutar, actualizar en `config.yaml` el campo `path` y `periodo` de cada fuente:

```yaml
extract_sources:
  - name: "CUIPO"
    details:
      path: "data/202601/CUIPO.xlsx"   # <- actualizar período
      periodo: "202601"                 # <- actualizar período
  - name: "CATALOGO PRODUCTOS"
    details:
      path: "data/202601/CATALOGO_DE_PRODUCTOS.xlsx"
      periodo: "202601"
  # ... ídem para PROCESOS, CONTRATOS, REPORTE RPC
```

---

## 6. Ejecutar el pipeline

Todos los comandos se ejecutan desde la raíz del proyecto con el entorno virtual activado.

### Ver perfiles disponibles

```bash
python src/main.py --list-runs
```

### Ejecutar por dominio completo (recomendado)

```bash
# Presupuesto: extract + transform + load + opendata
python src/main.py --run presupuesto_full

# Procesos: extract + transform + load + opendata
python src/main.py --run procesos_full

# Contratos: extract + load + opendata
python src/main.py --run contratos_full

# Solo exportar datos abiertos (sin reprocesar)
python src/main.py --run opendata_full
```

### Ejecutar todo en secuencia

```bash
python src/main.py --run presupuesto_full
python src/main.py --run procesos_full
python src/main.py --run contratos_full
```

### Ejecución por etapa (avanzado)

```bash
# Solo extraer un dominio
python src/main.py --domain presupuesto --stage extract

# Solo cargar contratos
python src/main.py --domain contratos --stage load

# Múltiples dominios y etapas
python src/main.py --domain procesos,contratos --stage extract,load
```

---

## 7. Flujo del pipeline

```
Excel (data/AAAAMM/)
    │
    ▼ EXTRACT
PISGRSTG_Cali.dbo.stg_cali_*      (tablas de staging)
    │
    ▼ TRANSFORM  (sql/valid/)
Tablas válidas con reglas de negocio aplicadas
    │
    ▼ LOAD  (sql/model/)
MapainversionesCali                (modelo final que consume la app)
    │
    ▼ OPENDATA  (opcional)
src/data/opendata/*.csv y *.xlsx   (archivos de datos abiertos)
```

### Scripts SQL — Transform (`sql/valid/`)

| Script | Qué hace |
|--------|----------|
| `valid_procesar_cuipo_historico.sql` | Normaliza histórico CUIPO, identifica vigencia |
| `valid_entidades.sql` | Consolida catálogo de entidades y secretarías |
| `valid_fondo.sql` | Normaliza fuentes de financiación |
| `valid_area_funcional.sql` | Jerarquía de áreas funcionales |
| `valid_linea_presupuestal.sql` | Líneas presupuestales |
| `valid_procesos.sql` | Limpieza y normalización de procesos SECOP |

### Scripts SQL — Load (`sql/model/`)

| Script | Tabla destino |
|--------|--------------|
| `model_entidades.sql` | Catálogo de entidades |
| `model_area_funcional.sql` | Áreas funcionales |
| `model_fondo.sql` | Fondos / fuentes de recursos |
| `model_linea_presupuestal.sql` | Líneas presupuestales |
| `model_FactPresupuesto.sql` | Tabla de hechos presupuesto |
| `model_CatalogoPresupuestoXProyInv.sql` | Presupuesto por proyecto de inversión |
| `model_procesos.sql` | Procesos de compra |
| `model_contratos.sql` | Contratos |
| `model_contratista.sql` | Contratistas |
| `model_ContratoXEntidad.sql` | Relación contrato-entidad |
| `model_ContratoXProyectoInversion.sql` | Relación contrato-proyecto |
| `model_ProcesoXProyectoInversion.sql` | Relación proceso-proyecto |
| `model_fuente_de_los_recursos_ppto.sql` | Fuente de recursos presupuesto |
| `model_fuente_de_los_recursos_contratos.sql` | Fuente de recursos contratos |

---

## 8. Salidas del pipeline

### Tablas en base de datos

- **Staging** (`PISGRSTG_Cali`): tablas `stg_cali_*` — se recrean en cada ejecución
- **Modelo final** (`MapainversionesCali`): tablas actualizadas que consume la app web

### Archivos de datos abiertos

Generados en `src/data/opendata/` en formato CSV y XLSX:

| Archivo | Contenido |
|---------|-----------|
| `DatosAbiertosPresupuestoXProyInv` | Presupuesto por proyecto de inversión |
| `DatosAbiertosProcesosXProyectosInv` | Procesos por proyecto |
| `DatosAbiertosContratosXProyectosInv` | Contratos por proyecto |
| `DatosAbiertosProyectosInversion` | Proyectos aprobados |
| `DatosAbiertosProyectosInversionPresupuestoAvanceFisicoXAnio` | Avance físico por año |
| `DatosAbiertosProyectosInversionEjecucionFinancieraDetallada` | Ejecución financiera detallada |
| `DatosAbiertosProyectosInversionXTerritorio` | Proyectos por territorio |
| `DatosAbiertosEmprestito` | Empréstitos |
| `DatosAbiertosProyectosInversionEmprestito` | Proyectos por empréstito |

---

## 9. Errores comunes

### Error de conexión ODBC

```
pyodbc.InterfaceError: ('IM002', '[IM002] Data source name not found...')
```

**Causa**: ODBC Driver 17 no está instalado o no está en el PATH.  
**Solución**: instalar el driver (ver sección 1) y verificar con `odbcinst -q -d`.

---

### Error de autenticación

```
pyodbc.OperationalError: Login failed for user '...'
```

**Causa**: credenciales incorrectas en `.env`.  
**Solución**: verificar `DB_USER` y `DB_PASSWORD` en `.env`. Confirmar acceso al servidor desde la máquina que ejecuta el ETL.

---

### Archivo Excel no encontrado

```
FileNotFoundError: data/202601/CUIPO.xlsx
```

**Causa**: el archivo no está en la ruta indicada en `config.yaml`.  
**Solución**: verificar que el Excel esté en `data/AAAAMM/` y que el `path` en `config.yaml` coincida exactamente con el nombre del archivo.

---

### Hoja de Excel no encontrada

```
ValueError: Worksheet named 'CUIPO' not found
```

**Causa**: el nombre de la hoja en el Excel no coincide con el campo `xlsx_sheet` en `config.yaml`.  
**Solución**: abrir el Excel y verificar el nombre exacto de la hoja (distingue mayúsculas/minúsculas y espacios).

---

### TrustServerCertificate

```
SSL Provider: certificate verify failed
```

**Causa**: el servidor SQL Server usa un certificado autofirmado.  
**Solución**: el loader ya incluye `TrustServerCertificate=yes` por defecto. Si persiste, verificar que el ODBC Driver esté actualizado.

---

## 10. Estructura del proyecto

```
Datos_PYTHON_CALI/
├── src/
│   ├── main.py                       # Orquestador — punto de entrada
│   ├── db_loader.py                  # Interfaz de carga a SQL Server
│   ├── db_loader_pyodbc.py           # Implementación con pyodbc + SQLAlchemy
│   ├── db_loader_bcp.py              # Implementación alternativa con BCP
│   ├── sql_runner.py                 # Ejecuta scripts .sql sobre la BD
│   ├── extract/
│   │   ├── xlsx_extractor.py         # Lee Excel locales
│   │   ├── csv_extractor.py          # Lee CSV locales
│   │   ├── api_extractor.py          # Consume APIs REST
│   │   └── adls_xlsx_extractor.py    # Lee Excel desde Azure Data Lake
│   └── opendata_export/
│       ├── generator.py              # Orquesta la exportación opendata
│       ├── csv_exporter.py           # Exporta a CSV
│       └── xlsx_exporter.py          # Exporta a XLSX
├── sql/
│   ├── valid/                        # Scripts de transformación (staging → válidos)
│   └── model/                        # Scripts de carga (válidos → modelo final)
├── data/                             # Excel de entrada por período (NO en git)
│   └── AAAAMM/
├── config.yaml                       # Configuración completa del pipeline
├── requirements.txt                  # Dependencias Python
├── .env.example                      # Plantilla de credenciales
└── docs/
    └── guia_operativa.md             # Este documento
```
