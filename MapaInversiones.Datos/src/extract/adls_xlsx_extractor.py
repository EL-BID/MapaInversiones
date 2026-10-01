from __future__ import annotations
import os, re, unicodedata, tempfile
from io import BytesIO
from typing import List, Dict
from openpyxl import load_workbook
import pandas as pd
from azure.identity import AzureCliCredential
from azure.storage.blob import BlobServiceClient
from .base_extractor import BaseExtractor

def _normalize_col(name: str) -> str:
    """Normaliza nombres de columna a snake_case simple, sin perder vocales acentuadas."""
    x = str(name).strip().lower()
    x = unicodedata.normalize("NFD", x)
    x = "".join(ch for ch in x if unicodedata.category(ch) != "Mn")
    x = re.sub(r"[^a-z0-9_]+", "_", x)
    x = re.sub(r"_+", "_", x).strip("_")
    return x or "col"   

class AdlsXlsxExtractor(BaseExtractor):
    def extract(self, details: dict) -> List[Dict]:
        account_url = details["account_url"]
        container   = details["container"]
        filename    = details.get("filename")
        prefix      = details.get("prefix", "")
        sheet       = details.get("sheet_name")
        header      = 0 if details.get("header", True) else None

        cred = AzureCliCredential()  # local
        bsc = BlobServiceClient(account_url=account_url, credential=cred)
        cc  = bsc.get_container_client(container)

        blobs = [filename] if filename else [
            b.name for b in cc.list_blobs(name_starts_with=prefix)
            if b.name.lower().endswith((".xlsx", ".xls"))
        ]
        if not blobs:
            return []

        frames: List[pd.DataFrame] = []
        for blob_name in blobs:
            suffix = ".xlsx" if blob_name.lower().endswith(".xlsx") else ".xls"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp_path = tmp.name
                downloader = cc.download_blob(blob_name)
                downloader.readinto(tmp)  # escribe bytes tal cual
            try:
                df = pd.read_excel(
                    tmp_path,
                    sheet_name=sheet,
                    header=header,
                    dtype=str,
                    engine="openpyxl" if tmp_path.endswith(".xlsx") else None,
                    keep_default_na=False,
                    na_filter=False,
                )
            finally:
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass

            df.columns = [_normalize_col(c) for c in df.columns]
            frames.append(df)

        full_df = pd.concat(frames, ignore_index=True) if len(frames) > 1 else frames[0]
        return full_df.to_dict(orient="records")
