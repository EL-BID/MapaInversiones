# src/extract/base_extractor.py

from abc import ABC, abstractmethod

class BaseExtractor(ABC):
    """
    Clase base abstracta para todos los extractores de datos.
    """

    @abstractmethod
    def extract(self, source_details: dict, access_token: str = None) -> list:
        """
        Método principal para extraer datos de una fuente específica.

        Args:
            source_details (dict): Detalles específicos de la fuente.
            access_token (str, optional): Token de acceso si es necesario.
                                          Defaults to None.

        Returns:
            list: Una lista de registros (diccionarios) extraídos.
        """
        pass