from .csv_exporter import CsvExporter
from .xlsx_exporter import XlsxExporter

EXPORTERS = {
    "csv": CsvExporter,
    "xlsx": XlsxExporter,
}

def generate_opendata(config: dict, db_loader):
    """
    Genera archivos OpenData (CSV/XLSX) a partir de vistas definidas en config.yaml.
    """
    exports = config.get("opendata_exports", [])
    if not exports:
        print("[OpenData] No se encontraron exports en la configuración.")
        return

    for exp in exports:
        if exp["enable"] == True:
            name = exp["name"]
            view = exp["view"]
            formats = exp.get("formats", ["csv"])
            output_path = exp.get("output_path", "./opendata")

            print(f"[OpenData] Exportando vista '{view}' como {formats}")

            # Obtener datos desde la BD
            query = f"SELECT * FROM {view}"
            df = db_loader.run_query(query)

            if df.empty:
                print(f"[OpenData] La vista '{view}' no devolvió datos.")
                continue

            # Exportar en cada formato solicitado
            for fmt in formats:
                exporter_cls = EXPORTERS.get(fmt)
                if not exporter_cls:
                    print(f"[OpenData] Formato no soportado: {fmt}")
                    continue

                exporter = exporter_cls()
                exporter.export(df, output_path, name)
