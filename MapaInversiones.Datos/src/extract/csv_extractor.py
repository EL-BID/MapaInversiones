"""
csv_extractor.py

Extractor para archivos CSV que cumple el contrato:
BaseExtractor.extract(details) -> list[dict]

- Lee uno o varios CSV (glob en details['path'] bajo details['base_dir']).
- Normaliza nombres de columnas (snake_case simple).
- Devuelve list[dict] (compatible con db_loader.load_to_stage).
"""
from __future__ import annotations

import os
import glob
import re
from typing import List, Dict

import pandas as pd

from .base_extractor import BaseExtractor


def _normalize_col(name: str) -> str:
    """Normaliza nombres a snake_case básico y seguro."""
    x = str(name).strip().lower()
    x = re.sub(r"[^a-z0-9_]+", "_", x)
    x = re.sub(r"_+", "_", x).strip("_")
    return x or "col"


class CsvExtractor(BaseExtractor):
    """Extractor mínimo para CSV."""

    def extract(self, details: dict) -> List[Dict]:
        """
        Args:
            details: {
              base_dir: str = "data",
              path: str (ej. "ventas/*.csv"),
              delimiter: str = ",",
              encoding: str = "utf-8",
              header: bool = True
            }
        Returns:
            list[dict]: filas del/los CSV con columnas normalizadas.
        """
        base_dir = os.path.abspath(details.get("base_dir", "data"))
        pattern = os.path.join(base_dir, details.get("path", "*.csv"))
        files = sorted(glob.glob(pattern))
        if not files:
            return []

        header = 0 if details.get("header", True) else None
        frames: List[pd.DataFrame] = []

        for fpath in files:
            df = pd.read_csv(
                fpath,
                sep=details.get("delimiter", ","),
                encoding=details.get("encoding", "utf-8"),
                header=header,
                dtype=str,  # todo como texto (estable y simple)
            )
            df.columns = [_normalize_col(c) for c in df.columns]
            frames.append(df)

        full_df = pd.concat(frames, ignore_index=True) if len(frames) > 1 else frames[0]
        return full_df.to_dict(orient="records")
