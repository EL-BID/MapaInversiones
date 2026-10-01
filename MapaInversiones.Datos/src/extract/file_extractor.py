# src/extract/file_extractor.py
"""
Extractor de archivos CSV/XLSX que cumple el contrato BaseExtractor.extract(details) -> list[dict].
- Lee el archivo (o archivos via glob) completo(s).
- Normaliza nombres de columnas.
- Devuelve list[dict] para que main.py use db_loader.load_to_stage(...).
"""
from __future__ import annotations
import os, glob, re
from typing import List, Dict
import pandas as pd
from .base_extractor import BaseExtractor

def _normalize_col(name: str) -> str:
    x = str(name).strip().lower()
    x = re.sub(r"[^a-z0-9_]+", "_", x)
    x = re.sub(r"_+", "_", x).strip("_")
    return x or "col"

class FileExtractor(BaseExtractor):
    def extract(self, details: dict) -> List[Dict]:
        """
        Lee CSV/XLSX definidos en 'details' y retorna list[dict].

        details esperados (mínimo):
          - source_type: 'csv' | 'xlsx'
          - base_dir: carpeta base (default: 'data')
          - path: patrón de archivo (puede ser glob, ej: 'ventas/*.csv')
          - header: bool (default: True)
          - CSV: delimiter, encoding
          - XLSX: xlsx_sheet
        """
        base_dir = os.path.abspath(details.get("base_dir", "data"))
        pattern  = os.path.join(base_dir, details.get("path", "*"))
        files = sorted(glob.glob(pattern))
        if not files:
            return []

        ftype = (details.get("source_type") or "").lower()
        header = 0 if details.get("header", True) else None

        frames = []
        for fpath in files:
            if ftype == "csv":
                df = pd.read_csv(
                    fpath,
                    sep=details.get("delimiter", ","),
                    encoding=details.get("encoding", "utf-8"),
                    header=header,
                    dtype=str,           # mínimo: todo texto para evitar sorpresas
                )
            elif ftype == "xlsx":
                df = pd.read_excel(
                    fpath,
                    sheet_name=details.get("xlsx_sheet"),
                    header=header,
                    dtype=str,
                )
            else:
                raise ValueError(f"Tipo de archivo no soportado: {ftype}")

            # Normalizar nombres de columnas
            df.columns = [_normalize_col(c) for c in df.columns]
            frames.append(df)

        # Unir si hay múltiples archivos
        full_df = pd.concat(frames, ignore_index=True) if len(frames) > 1 else frames[0]
        # Devolver en el mismo formato que usa la API: list[dict]
        return full_df.to_dict(orient="records")
