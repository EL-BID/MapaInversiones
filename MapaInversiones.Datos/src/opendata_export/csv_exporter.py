import pandas as pd
from pathlib import Path
from .base_exporter import BaseExporter
import csv

class CsvExporter(BaseExporter):
    """Exportador de DataFrames a CSV."""

    def export(self, df: pd.DataFrame, output_path: str, name: str):
        Path(output_path).mkdir(parents=True, exist_ok=True)
        file_path = Path(output_path) / f"{name}.csv"
        df.to_csv(
            file_path,
            index=False,
            encoding="utf-8-sig",
            quoting=csv.QUOTE_ALL,  # Asegura que todos los valores estén entre comillas
            quotechar='"'  # Usa comillas dobles para encerrar valores
        )        
        print(f"[OpenData] CSV generado: {file_path}")
