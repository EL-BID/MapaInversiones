"""
Orquestador del pipeline ELT:
- Lee config.yaml (soporta "includes")
- EXTRACT: recorre 'extract_sources', instancia el extractor segun 'source_type' y ejecuta 'extract'
- TRANSFORM: ejecuta SQL de 'transform_models'
- LOAD: ejecuta SQL de 'load_models'
- Soporta ejecucion selectiva por dominios y etapas via parametros CLI y perfiles "runs"
"""
import argparse
import os
import subprocess
import sys
from copy import deepcopy
from datetime import datetime
from pathlib import Path
from typing import TYPE_CHECKING

import yaml
from dotenv import load_dotenv

from extract.api_extractor import ApiExtractor
from extract.csv_extractor import CsvExtractor
from extract.xlsx_extractor import XlsxExtractor
from opendata_export.generator import generate_opendata
from sql_runner import execute_sql_from_file

try:
    from extract.adls_xlsx_extractor import AdlsXlsxExtractor
except ModuleNotFoundError:
    AdlsXlsxExtractor = None

if TYPE_CHECKING:
    from db_loader_pyodbc import DBLoader

load_dotenv()

EXTRACTORS = {
    "api": ApiExtractor,
    "csv": CsvExtractor,
    "xlsx": XlsxExtractor,
}
if AdlsXlsxExtractor is not None:
    EXTRACTORS["adls_xlsx"] = AdlsXlsxExtractor

STAGE_TO_CONFIG_KEY = {
    "extract": "extract_sources",
    "transform": "transform_models",
    "load": "load_models",
    "opendata": "opendata_exports",
}
ALL_STAGES = tuple(STAGE_TO_CONFIG_KEY.keys())


def _as_list(value):
    """Normaliza un valor opcional a lista."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _split_csv_values(values):
    """Aplana valores separados por coma manteniendo orden sin duplicados."""
    final_values = []
    for raw in values or []:
        for part in str(raw).split(","):
            value = part.strip()
            if value and value not in final_values:
                final_values.append(value)
    return final_values


def parse_args():
    """Construye los argumentos de linea de comandos."""
    parser = argparse.ArgumentParser(description="Pipeline ETL MapaInversiones Cali")
    parser.add_argument("--config", default="config.yaml", help="Ruta del archivo YAML principal.")
    parser.add_argument("--run", help="Nombre del perfil de ejecucion definido en 'runs'.")
    parser.add_argument(
        "--domain",
        action="append",
        default=[],
        help="Dominio(s) a ejecutar. Repetible o separados por coma.",
    )
    parser.add_argument(
        "--stage",
        action="append",
        default=[],
        help="Etapa(s): extract, transform, load, opendata. Repetible o separados por coma.",
    )
    parser.add_argument("--list-runs", action="store_true", help="Lista perfiles 'runs' disponibles y termina.")
    return parser.parse_args()


def _merge_configs(base: dict, override: dict) -> dict:
    """
    Mezcla dos configuraciones.
    - Etapas (extract/transform/load/opendata): concatena listas.
    - runs/domains: mergea por clave.
    - Escalares: override.
    """
    merged = deepcopy(base or {})
    for key, value in (override or {}).items():
        if key in STAGE_TO_CONFIG_KEY.values():
            merged[key] = list(merged.get(key, [])) + list(value or [])
            continue

        if key in ("runs", "domains"):
            current = merged.get(key, {})
            if not isinstance(current, dict):
                current = {}
            if isinstance(value, dict):
                current.update(value)
            merged[key] = current
            continue

        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _merge_configs(merged[key], value)
            continue

        merged[key] = deepcopy(value)
    return merged


def load_config(config_path: str) -> dict:
    """
    Carga YAML principal y resuelve 'includes' relativos al archivo padre.
    """
    cfg_path = Path(config_path).resolve()

    if not cfg_path.exists():
        raise FileNotFoundError(f"No se encontro el archivo de config: {cfg_path}")

    with cfg_path.open("r", encoding="utf-8") as file:
        cfg = yaml.safe_load(file) or {}

    merged = {}
    for include in _as_list(cfg.pop("includes", [])):
        include_path = (cfg_path.parent / str(include)).resolve()
        include_cfg = load_config(str(include_path))
        merged = _merge_configs(merged, include_cfg)

    merged = _merge_configs(merged, cfg)
    return merged


def _resolve_run_selection(config: dict, args):
    """Resuelve dominios y etapas combinando perfil run y parametros de CLI."""
    runs = config.get("runs", {})
    run_domains = []
    run_stages = []

    if args.run:
        run_cfg = runs.get(args.run)
        if run_cfg is None:
            available = ", ".join(sorted(runs.keys())) or "(sin runs definidos)"
            raise ValueError(f"Run '{args.run}' no encontrado. Disponibles: {available}")
        run_domains = _split_csv_values(_as_list(run_cfg.get("domains")))
        run_stages = _split_csv_values(_as_list(run_cfg.get("stages")))

    cli_domains = _split_csv_values(args.domain)
    cli_stages = _split_csv_values(args.stage)

    selected_domains = cli_domains or run_domains
    selected_stages = cli_stages or run_stages or list(ALL_STAGES)

    # Si no hay elementos en la raiz y si hay dominios, por defecto ejecuta todos.
    has_top_level_items = any(config.get(stage_key) for stage_key in STAGE_TO_CONFIG_KEY.values())
    if not selected_domains and not has_top_level_items and config.get("domains"):
        selected_domains = sorted(config["domains"].keys())

    return selected_domains, selected_stages


def _resolve_domain_items(config: dict, domain_cfg: dict, stage_key: str, domain_name: str):
    """
    Resuelve items por dominio:
    - string => nombre referenciado en el bloque principal
    - dict   => definicion embebida del item
    """
    refs = domain_cfg.get(stage_key, [])
    if not refs:
        return []

    top_level_items = config.get(stage_key, [])
    by_name = {
        item.get("name"): item
        for item in top_level_items
        if isinstance(item, dict) and item.get("name")
    }

    resolved = []
    for ref in refs:
        if isinstance(ref, dict):
            resolved.append(deepcopy(ref))
            continue

        item = by_name.get(ref)
        if item is None:
            raise ValueError(
                f"El dominio '{domain_name}' referencia '{ref}' en '{stage_key}', "
                "pero no existe en el bloque principal."
            )
        resolved.append(deepcopy(item))

    return resolved


def build_execution_config(config: dict, selected_domains, selected_stages):
    """
    Construye la config final a ejecutar:
    - Sin dominios: usa los bloques principales (compatible hacia atras)
    - Con dominios: filtra por dominio y por etapa
    """
    execution = {
        key: deepcopy(value)
        for key, value in config.items()
        if key not in set(STAGE_TO_CONFIG_KEY.values()) | {"domains", "runs", "includes"}
    }

    for stage_key in STAGE_TO_CONFIG_KEY.values():
        execution[stage_key] = []

    if selected_domains:
        domains = config.get("domains", {})
        for domain_name in selected_domains:
            domain_cfg = domains.get(domain_name, {}) or {}
            for stage_key in STAGE_TO_CONFIG_KEY.values():
                execution[stage_key].extend(
                    _resolve_domain_items(config, domain_cfg, stage_key, domain_name)
                )
    else:
        for stage_key in STAGE_TO_CONFIG_KEY.values():
            execution[stage_key] = deepcopy(config.get(stage_key, []))

    selected = set(selected_stages)
    for stage_name, stage_key in STAGE_TO_CONFIG_KEY.items():
        if stage_name not in selected:
            execution[stage_key] = []

    return execution


def print_runs(config: dict):
    """Imprime los runs configurados."""
    runs = config.get("runs", {})
    if not runs:
        print("No hay runs definidos.")
        return

    print("\nRuns disponibles:")
    for name in sorted(runs.keys()):
        run_cfg = runs[name] or {}
        domains = ", ".join(_split_csv_values(_as_list(run_cfg.get("domains")))) or "*"
        stages = ", ".join(_split_csv_values(_as_list(run_cfg.get("stages")))) or "*"
        print(f" - {name}: domains=[{domains}] stages=[{stages}]")


def get_extractor(source_type: str):
    """Devuelve una instancia del extractor segun 'source_type'."""
    try:
        return EXTRACTORS[source_type]()
    except KeyError:
        raise ValueError(f"Tipo de fuente no soportado: {source_type}")


def _run_external_python(script_path: str):
    """Ejecuta un script Python externo sin parametros."""
    script_abs = os.path.abspath(script_path)
    if not os.path.isfile(script_abs):
        raise FileNotFoundError(f"No se encontro el script: {script_abs}")

    print(f"   -> Ejecutando script externo: {script_abs}")
    result = subprocess.run([sys.executable, script_abs])
    if result.returncode != 0:
        raise RuntimeError(f"Script externo termino con codigo {result.returncode}")


def run_extract_stage(config: dict, db_loader: "DBLoader"):
    """
    Ejecuta la etapa de EXTRACT & LOAD TO STAGE:
      - Itera 'extract_sources'
      - Instancia el extractor en base a 'source_type'
      - Llama extractor.extract(details) y carga a stage con db_loader.load_to_stage(...)
    """
    print(f"\n--- [ETAPA 1: EXTRACT & LOAD TO STAGE] --- [{datetime.now():%Y-%m-%d %H:%M:%S}] ")
    for source in config.get("extract_sources", []):
        if not source.get("enabled", True):
            continue

        name = source["name"]
        stype = source["source_type"]
        details = (source.get("details") or {}).copy()

        print(f"\nProcesando fuente: {name}...")
        try:
            if stype == "api_file_py":
                _run_external_python(details["script_path"])
                print(f"   -> Script '{name}' ejecutado correctamente!")
                continue

            extractor = get_extractor(stype)
            target_table = source["target_stage_table"]

            data = extractor.extract(details)
            db_loader.load_to_stage(data, target_table)

            print(f"   -> Proceso completado para '{name}'! --- [{datetime.now():%Y-%m-%d %H:%M:%S}]")
        except Exception as error:
            print(f" ERROR procesando la fuente {name}: {error}")
            raise


def run_valid_stage(config: dict, db_loader: "DBLoader"):
    """
    Ejecuta la etapa de transformacion (SQL).
    Lanza una excepcion si algun modelo falla.
    """
    print(f"\n--- [ETAPA 2: VALIDOS] --- [{datetime.now():%Y-%m-%d %H:%M:%S}]")
    transform_models = config.get("transform_models", [])
    if not transform_models:
        print("   -> No hay modelos definidos para transformar. Omitiendo etapa.")
        return

    for model in transform_models:
        if not model.get("enabled", True):
            continue

        print(f"\nProcesando modelo: {model['name']}...")
        try:
            execute_sql_from_file(db_loader.engine, model["script_path"])
        except Exception as error:
            print(f" ERROR procesando el modelo {model['name']}: {error}")
            raise


def run_load_model(config: dict, db_loader: "DBLoader"):
    """
    Ejecuta la etapa de carga final a las tablas de produccion (MERGE).
    Lanza una excepcion si algun modelo falla.
    """
    print(f"\n--- [ETAPA 3: CARGA MODELO] --- [{datetime.now():%Y-%m-%d %H:%M:%S}]")
    load_models = config.get("load_models", [])
    if not load_models:
        print("   -> No hay modelos definidos para la carga final. Omitiendo etapa.")
        return

    for model in load_models:
        if not model.get("enabled", True):
            continue

        print(f"\nProcesando modelo: {model['name']}...")
        try:
            execute_sql_from_file(db_loader.engine, model["script_path"])
        except Exception as error:
            print(f" ERROR procesando el modelo {model['name']}: {error}")
            raise


def run_pipeline(args):
    """Orquestador principal que ejecuta las etapas del pipeline ELT."""
    print(" Iniciando el pipeline ELT...")

    try:
        config = load_config(args.config)
        if args.list_runs:
            print_runs(config)
            return

        selected_domains, selected_stages = _resolve_run_selection(config, args)
        config_to_run = build_execution_config(config, selected_domains, selected_stages)

        print(
            " Seleccion aplicada -> "
            f"domains: {selected_domains or ['*']} | "
            f"stages: {selected_stages}"
        )

        from db_loader_pyodbc import DBLoader

        connection_string = (
            f"mssql+pyodbc://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@"
            f"{os.getenv('DB_SERVER')}/{os.getenv('DB_NAME')}?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes"
        )
        db_loader = DBLoader(connection_string)

        if "extract" in selected_stages:
            run_extract_stage(config_to_run, db_loader)
        else:
            print("\n--- [ETAPA 1: EXTRACT] Omitida por seleccion de stages. ---")

        if "transform" in selected_stages:
            run_valid_stage(config_to_run, db_loader)
        else:
            print("\n--- [ETAPA 2: VALIDOS] Omitida por seleccion de stages. ---")

        if "load" in selected_stages:
            run_load_model(config_to_run, db_loader)
        else:
            print("\n--- [ETAPA 3: CARGA MODELO] Omitida por seleccion de stages. ---")

        if "opendata" in selected_stages:
            generate_opendata(config_to_run, db_loader)
        else:
            print("\n--- [ETAPA 4: OPENDATA] Omitida por seleccion de stages. ---")

        print("\n Pipeline completado exitosamente!")

    except Exception as error:
        print(f"\n El pipeline ha fallado. Deteniendo ejecucion. Detalle: {error}")
        sys.exit(1)


if __name__ == "__main__":
    cli_args = parse_args()
    run_pipeline(cli_args)
