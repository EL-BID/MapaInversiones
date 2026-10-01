import pandas as pd
from sqlalchemy import create_engine, engine
from typing import Optional, Tuple, List

class DBLoader:
    """
    Gestiona la conexión y la carga de datos a la base de datos.
    """

    def __init__(self, connection_string: str):
        """
        Inicializa el DBLoader creando un motor de SQLAlchemy.

        Args:
            connection_string (str): La cadena de conexión para la base de datos.
        """
        try:
            self.engine = create_engine(connection_string)
            print("   -> Motor de base de datos creado exitosamente.")
        except Exception as e:
            print(f" ERROR al crear el motor de base de datos: {e}")
            raise

    def load_to_stage(self, data: list, table_name: str):
        """
        Carga una lista de datos en una tabla de staging, reemplazando la anterior.

        Args:
            data (list): Una lista de diccionarios con los datos a cargar.
            table_name (str): El nombre de la tabla de staging de destino.
        """
        if not data:
            print(f"   -> No hay datos para cargar en la tabla '{table_name}'.")
            return

        print(f"   -> Preparando {len(data)} registros para cargar en '{table_name}'...")
        # Usamos json_normalize para aplanar la estructura de los datos JSON anidados.
        df = pd.json_normalize(data)

        # Usamos el método to_sql de Pandas para cargar los datos
        # if_exists='replace' borrará la tabla si existe y la creará de nuevo.
        df.to_sql(
            name=table_name,
            con=self.engine,
            if_exists='replace',
            index=False,
            chunksize=1000  # Opcional: para cargar en lotes
        )
        print(f"   -> ¡Carga completada en '{table_name}'!")

    def drop_and_create_table(self, table_name: str, columns: List[str]) -> None:
        """Recrea tabla stage con NVARCHAR(MAX) por columna."""
        schema, name = self._parse_table_name(table_name)
        fq = f"[{schema}].[{name}]" if schema else f"[{name}]"
        col_defs = ", ".join(f"[{c}] NVARCHAR(MAX)" for c in columns)

        ddl = []
        if schema:
            ddl.append(
                f"IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'{schema}') EXEC('CREATE SCHEMA {schema}');"
            )
        ddl.append(f"IF OBJECT_ID(N'{fq}', N'U') IS NOT NULL DROP TABLE {fq};")
        ddl.append(f"CREATE TABLE {fq} ({col_defs});")

        with self.engine.begin() as conn:
            for stmt in ddl:
                conn.exec_driver_sql(stmt)
        print(f"   -> Tabla de stage recreada: {fq}")

    def append_dataframe(self, table_name: str, df: pd.DataFrame) -> None:
        """Inserta un DataFrame en append (tabla ya creada)."""
        if df is None or df.empty:
            print(f"   -> DataFrame vacío. Nada para insertar en '{table_name}'.")
            return
        schema, name = self._parse_table_name(table_name)
        for c in df.columns:
            if df[c].dtype != "object":
                df[c] = df[c].astype("string").astype(object)
        df.to_sql(
            name=name, con=self.engine, schema=schema,
            if_exists="append", index=False,
            method="multi", chunksize=50_000,
        )
        print(f"   -> Insertadas {len(df)} filas en '{table_name}'.")

    @staticmethod
    def _parse_table_name(table_name: str) -> Tuple[Optional[str], str]:
        if "." in table_name:
            schema, name = table_name.split(".", 1)
            return schema, name
        return None, table_name