"""
xlsx_extractor.py

Extractor para archivos XLS/XLSX que cumple el contrato:
BaseExtractor.extract(details) -> list[dict]

- Lee uno o varios XLSX/XLS (glob en details['path'] bajo details['base_dir']).
- Normaliza nombres de columnas.
- Devuelve list[dict].
"""
from __future__ import annotations

import os
import glob
import re
from typing import List, Dict

import pandas as pd

from .base_extractor import BaseExtractor


def _normalize_col(name: str) -> str:
    """Normaliza nombres de columna a snake_case simple."""
    import re, unicodedata
    x = str(name).strip().lower()
    x = unicodedata.normalize("NFD", x)
    x = "".join(ch for ch in x if unicodedata.category(ch) != "Mn")
    x = re.sub(r"[^a-z0-9_]+", "_", x)
    x = re.sub(r"_+", "_", x).strip("_")
    return x or "col"

def detect_header_row(fpath: str, sheet=0, max_check: int = 5) -> int:
    """
    Detecta automáticamente la fila de encabezado en un Excel.
    Estrategia: lee primeras `max_check` filas sin header y elige
    la fila con mayor número de valores no nulos.
    """
    preview = pd.read_excel(fpath, sheet_name=sheet, header=None, nrows=max_check, dtype=str)
    non_null_counts = preview.notna().sum(axis=1)
    best_row = non_null_counts.idxmax()
    return best_row


class XlsxExtractor(BaseExtractor):
    """Extractor para XLS/XLSX."""

    def extract(self, details: dict) -> List[Dict]:
        """
        Args:
            details: {
              base_dir: str = "[folder]",
              path: str (ej. "[file].xlsx" o "[folder]/*.xlsx"),
              xlsx_sheet: str | int | None = None,
              header: bool = True
            }
        Returns:
            list[dict]: filas del/los Excel con columnas normalizadas.
        """
        base_dir = os.path.abspath(details.get("base_dir", "data"))
        pattern = os.path.join(base_dir, details.get("path", "*.xlsx"))

        if pattern.lower().endswith((".xlsx", ".xls")):
            # Caso: archivo específico
            files = [pattern] if os.path.exists(pattern) else []
        else:
            # Caso: patrón de búsqueda (*.xlsx)
            files = sorted(glob.glob(pattern) + glob.glob(pattern.replace(".xlsx", ".xls")))

        if not files:
            return []

        sheet = details.get("xlsx_sheet", None)
        periodo = details.get("periodo", None)
        frames: List[pd.DataFrame] = []

        for fpath in files:

            header = detect_header_row(fpath, sheet=sheet)

            df = pd.read_excel(
                fpath,
                sheet_name=sheet,
                header=header,
                dtype=str,
            )

            df['periodo'] = periodo

            df.columns = [_normalize_col(c) for c in df.columns]
            frames.append(df)

        full_df = pd.concat(frames, ignore_index=True) if len(frames) > 1 else frames[0]
        return full_df.to_dict(orient="records")
