import re
from typing import Optional, Tuple, List

import pandas as pd
from sqlalchemy import create_engine

class DBLoader:
    """
    Gestiona la conexión y la carga de datos a la base de datos (SQL Server).
    - Re-crea tablas de stage como NVARCHAR(MAX) por columna.
    - Inserta SIEMPRE usando bcpandas (utilitario nativo BCP de SQL Server).
    """

    def __init__(self, connection_string: str):
        """
        Inicializa el DBLoader creando un motor de SQLAlchemy.

        Args:
            connection_string (str): Cadena de conexión SQLAlchemy, ej:
              mssql+pyodbc://USER:PASS@SERVER/DB?driver=ODBC+Driver+17+for+SQL+Server&TrustServerCertificate=yes
        """
        try:
            self.engine = create_engine(
                connection_string,
                pool_pre_ping=True,
                future=True,
            )
            print("   -> Motor de base de datos creado exitosamente.")
        except Exception as e:
            print(f" ERROR al crear el motor de base de datos: {e}")
            raise

    def load_to_stage(self, data: list, table_name: str) -> None:
        """
        Carga datos en una tabla de STAGE (recreándola siempre como NVARCHAR(MAX)) usando bcpandas.

        Args:
            data: lista de diccionarios (filas) ya normalizados por el extractor.
            table_name: "schema.table" o "table".
        """
        if not data:
            print(f"   -> No hay datos para cargar en la tabla '{table_name}'.")
            return

        print(f"   -> Preparando {len(data)} registros para cargar en '{table_name}'...")

        # Aplanar/crear DataFrame
        df = pd.json_normalize(data)

        # Normalizar nombres de columnas por si algún extractor no lo hizo
        df.columns = [self._normalize_col(c) for c in df.columns]

        # Re-crear tabla como NVARCHAR(MAX)
        self.drop_and_create_table(table_name, list(df.columns))

        # Insertar con bcpandas (siempre)
        self._bcp_append_dataframe(table_name, df)
        print(f"   -> ¡Carga completada en '{table_name}'!")

    # ------------------------------------------------------------
    # drop + create con todas las columnas NVARCHAR(MAX)
    # ------------------------------------------------------------
    def drop_and_create_table(self, table_name: str, columns: List[str]) -> None:
        """Recrea tabla de stage con NVARCHAR(MAX) por columna."""
        schema, name = self._parse_table_name(table_name)
        fq = f"[{schema}].[{name}]" if schema else f"[{name}]"
        col_defs = ", ".join(f"[{c}] NVARCHAR(MAX)" for c in columns)

        ddl = []
        if schema:
            ddl.append(
                f"IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'{schema}') "
                f"EXEC('CREATE SCHEMA {schema}');"
            )
        ddl.append(f"IF OBJECT_ID(N'{fq}', N'U') IS NOT NULL DROP TABLE {fq};")
        ddl.append(f"CREATE TABLE {fq} ({col_defs});")

        with self.engine.begin() as conn:
            for stmt in ddl:
                conn.exec_driver_sql(stmt)
        print(f"   -> Tabla de stage recreada: {fq}")

    # ------------------------------------------------------------
    # Carga rápida (BCP)
    # ------------------------------------------------------------
    def _bcp_append_dataframe(self, table_name: str, df: pd.DataFrame) -> None:
        """Inserta un DataFrame con bcpandas."""
        from bcpandas import to_sql as bcp_to_sql, SqlCreds

        schema, name = self._parse_table_name(table_name)

        # Credenciales de bcpandas a partir del SQLAlchemy engine (sin DSN)
        creds = SqlCreds.from_engine(self.engine)

        # Delimitador y Quote improbable para evitar el error de “todos los delimitadores presentes”
        SAFE_DELIMITER = "\x1f"  # ASCII 31 (Unit Separator)
        SAFE_QUOTE     = "\x1e"  # ASCII 30 (Record Separator)

        bcp_to_sql(
            df,
            name,           
            creds,          
            schema=schema,
            if_exists="append",
            index=False,
            batch_size=100_000,
            delimiter=SAFE_DELIMITER,
            quotechar=SAFE_QUOTE,
        )
        print(f"   -> Insertadas {len(df)} filas en '{table_name}'.")



    # ------------------------------------------------------------
    # Utilidades
    # ------------------------------------------------------------
    @staticmethod
    def _parse_table_name(table_name: str) -> Tuple[Optional[str], str]:
        """Devuelve (schema, name). Acepta 'schema.table' o 'table'. Quita corchetes si vienen."""
        t = table_name.strip()
        # quitar [dbo].[tabla] -> dbo.tabla
        t = re.sub(r"^\[([^\]]+)\]\.\[([^\]]+)\]$", r"\1.\2", t)
        if "." in t:
            schema, name = t.split(".", 1)
            return schema.strip("[]"), name.strip("[]")
        return None, t.strip("[]")

    @staticmethod
    def _normalize_col(name: str) -> str:
        """Normaliza nombres de columna a snake_case simple."""
        x = str(name).strip().lower()
        x = re.sub(r"[^a-z0-9_]+", "_", x)
        x = re.sub(r"_+", "_", x).strip("_")
        return x or "col"
