import pandas as pd
from pathlib import Path
from .base_exporter import BaseExporter

class XlsxExporter(BaseExporter):
    """Exportador de DataFrames a Excel (XLSX)."""

    def export(self, df: pd.DataFrame, output_path: str, name: str):
        Path(output_path).mkdir(parents=True, exist_ok=True)
        file_path = Path(output_path) / f"{name}.xlsx"
        df.to_excel(file_path, index=False, engine="openpyxl")
        print(f"[OpenData] XLSX generado: {file_path}")
