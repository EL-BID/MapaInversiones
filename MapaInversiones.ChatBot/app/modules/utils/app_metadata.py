from __future__ import annotations

import json
from pathlib import Path
from typing import Optional

from loguru import logger

from modules.config import settings

_DEFAULT_DATA_CUTOFF_DISPLAY = "Fecha no disponible"
_DATA_CUTOFF_CACHE: Optional[str] = None
_DATA_CUTOFF_MTIME: Optional[float] = None


def _resolve_data_cutoff_path() -> Path:
    return Path(settings.data_cutoff_path)


def _read_data_cutoff_file(path: Path) -> Optional[str]:
    try:
        with path.open("r", encoding="utf-8") as handler:
            payload = json.load(handler)
            value = payload.get("data_cutoff_date") or payload.get("fecha_corte")
            if value:
                return str(value).strip()
    except FileNotFoundError:
        logger.warning(
            "Archivo de metadata {} no encontrado; se usa valor por defecto.", path
        )
    except Exception as exc:  # pragma: no cover - defensa
        logger.warning("No se pudo leer metadata {}: {}", path, exc)
    return None


def get_data_cutoff_date() -> str:
    """Devuelve la fecha de corte de datos cacheada, refrescando solo si el archivo cambia."""
    global _DATA_CUTOFF_CACHE, _DATA_CUTOFF_MTIME
    path = _resolve_data_cutoff_path()
    try:
        mtime = path.stat().st_mtime
    except FileNotFoundError:
        _DATA_CUTOFF_CACHE = None
        _DATA_CUTOFF_MTIME = None
        return _DEFAULT_DATA_CUTOFF_DISPLAY

    if _DATA_CUTOFF_CACHE is None or _DATA_CUTOFF_MTIME != mtime:
        value = _read_data_cutoff_file(path)
        _DATA_CUTOFF_CACHE = value or _DEFAULT_DATA_CUTOFF_DISPLAY
        _DATA_CUTOFF_MTIME = mtime

    return _DATA_CUTOFF_CACHE


def set_data_cutoff_date(value: str) -> str:
    """Persiste la fecha de corte y actualiza el cache local."""
    path = _resolve_data_cutoff_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"data_cutoff_date": value}
    with path.open("w", encoding="utf-8") as handler:
        json.dump(payload, handler, ensure_ascii=False, indent=2)

    # Actualizar cache
    global _DATA_CUTOFF_CACHE, _DATA_CUTOFF_MTIME
    _DATA_CUTOFF_CACHE = value
    try:
        _DATA_CUTOFF_MTIME = path.stat().st_mtime
    except FileNotFoundError:
        _DATA_CUTOFF_MTIME = None
    return value
