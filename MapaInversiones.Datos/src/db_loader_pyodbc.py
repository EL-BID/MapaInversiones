import re
from typing import Optional, Tuple, List
import unicodedata
import pandas as pd
from sqlalchemy import create_engine, text

class DBLoader:
    """
    Gestiona la conexión y la carga de datos a la base de datos (SQL Server).
    - Re-crea tablas de stage como NVARCHAR(MAX) por columna.
    - Inserta usando pyodbc + fast_executemany (rápido y Unicode-safe).
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

    # ------------------------------------------------------------
    # API principal
    # ------------------------------------------------------------
    def load_to_stage(self, data: list, table_name: str) -> None:
        """
        Carga datos en una tabla de STAGE (recreándola siempre como NVARCHAR(MAX))
        usando pyodbc + fast_executemany.

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

        # Limpieza: reemplazar literales "NULL" (texto) y nulos reales por cadena vacía
        #   - "NULL", " null ", "Null", etc. → ""
        df = df.replace(r"^\s*NULL\s*$", "", regex=True).fillna("")

        # Asegurar tipo str para todas las columnas
        df = df.astype(str)        

        # Re-crear tabla como NVARCHAR(MAX)
        self.drop_and_create_table(table_name, list(df.columns))

        # Insertar con pyodbc fast_executemany
        self._fast_insert_dataframe(table_name, df)
        print(f"   -> ¡Carga completada en '{table_name}'!")

    # ------------------------------------------------------------
    # DDL: drop + create con todas las columnas NVARCHAR(MAX)
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
    # Carga rápida con pyodbc + fast_executemany
    # ------------------------------------------------------------
    def _fast_insert_dataframe(self, table_name: str, df: pd.DataFrame, batch_size: int = 50_000) -> None:
        """Inserta un DataFrame usando pyodbc fast_executemany (SQLAlchemy 2.x) evitando NULL en campos vacíos."""
        schema, name = self._parse_table_name(table_name)
        fq = f"[{schema}].[{name}]" if schema else f"[{name}]"
        cols_br = ", ".join(f"[{c}]" for c in df.columns)
        placeholders = ", ".join("?" for _ in df.columns)
        insert_sql = f"INSERT INTO {fq} ({cols_br}) VALUES ({placeholders})"

        def iter_rows(frame: pd.DataFrame):
            for row in frame.itertuples(index=False, name=None):
                yield row

        conn = None
        cursor = None
        try:
            conn = self.engine.raw_connection()
            cursor = conn.cursor()
            cursor.fast_executemany = True
            cursor.arraysize = batch_size

            batch = []
            count = 0
            for rec in iter_rows(df):
                batch.append(rec)
                if len(batch) >= batch_size:
                    cursor.executemany(insert_sql, batch)
                    count += len(batch)
                    batch.clear()

            if batch:
                cursor.executemany(insert_sql, batch)
                count += len(batch)

            conn.commit()
            print(f"   -> (fast_executemany) Insertadas {count} filas en '{table_name}'.")
        except Exception:
            if conn is not None:
                try:
                    conn.rollback()
                except Exception:
                    pass
            raise
        finally:
            if cursor is not None:
                try:
                    cursor.close()
                except Exception:
                    pass
            if conn is not None:
                try:
                    conn.close()
                except Exception:
                    pass


    # ------------------------------------------------------------
    # Utilidades
    # ------------------------------------------------------------
    @staticmethod
    def _parse_table_name(table_name: str) -> Tuple[Optional[str], str]:
        """Devuelve (schema, name). Acepta 'schema.table' o 'table'. Quita corchetes si vienen."""
        t = table_name.strip()
        t = re.sub(r"^\[([^\]]+)\]\.\[([^\]]+)\]$", r"\1.\2", t)  # [dbo].[tabla] -> dbo.tabla
        if "." in t:
            schema, name = t.split(".", 1)
            return schema.strip("[]"), name.strip("[]")
        return None, t.strip("[]")

    @staticmethod
    def _normalize_col(name: str) -> str:
        """Normaliza nombres de columna a snake_case simple, sin perder vocales acentuadas."""
        x = str(name).strip().lower()
        x = unicodedata.normalize("NFD", x)
        x = "".join(ch for ch in x if unicodedata.category(ch) != "Mn")
        x = re.sub(r"[^a-z0-9_]+", "_", x)
        x = re.sub(r"_+", "_", x).strip("_")
        return x or "col"    

    # ------------------------------------------------------------
    # Consultas de solo lectura
    # ------------------------------------------------------------
    def run_query(self, query: str):
        """
        Ejecuta una query SQL y devuelve el resultado como DataFrame.
        """
        try:
            with self.engine.connect() as conn:
                df = pd.read_sql(text(query), conn)
            return df
        except Exception as e:
            print(f" ERROR al ejecutar query: {e}")
            raise