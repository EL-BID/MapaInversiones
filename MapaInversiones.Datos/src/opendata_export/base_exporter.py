from abc import ABC, abstractmethod
import pandas as pd

class BaseExporter(ABC):
    """Interfaz base para exportadores OpenData."""

    @abstractmethod
    def export(self, df: pd.DataFrame, output_path: str, name: str):
        """Exporta un DataFrame en un formato específico."""
        pass
