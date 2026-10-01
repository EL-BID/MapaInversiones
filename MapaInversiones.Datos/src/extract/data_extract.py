import pandas as pd
import logging
from sqlalchemy.sql import text
from src.config.db_config import create_db_engine
import unicodedata
from logger import get_logger

logger = get_logger(__name__)

def renombrar_columnas_duplicadas(columns):
    """Renombra columnas duplicadas agregando un sufijo numérico."""
    new_columns = []
    counter = {}

    for col in columns:
        if col not in counter:
            counter[col] = 0
            new_columns.append(col)
        else:
            counter[col] += 1
            new_columns.append(f"{col}_{counter[col]}")
    return new_columns

def limpiar_y_normalizar_columna(columna):
    # Remover acentos de las letras
    columna = unicodedata.normalize('NFKD', columna).encode('ASCII', 'ignore').decode('utf-8')
    # Limpiar espacios y caracteres especiales
    columna = columna.strip().lower().replace(' ', '_')
    columna = ''.join(char for char in columna if char.isalnum() or char == '_')
    return columna

def load_excel(file_path, sheet):
    """Carga una hoja de un archivo EXCEL a un Dataframe de Pandas"""
    # Leer las primeras filas para detectar el encabezado
    sample_data = pd.read_excel(file_path, sheet_name=sheet, header=None, nrows=20)

    # Buscar la fila que contiene los nombres de las columnas (la que no tiene NaN y tiene textos significativos)
    header_row = sample_data.apply(lambda row: row.notna().sum(), axis=1).idxmax()    

    # Cargar los datos a partir de la fila detectada
    df = pd.read_excel(file_path, sheet_name=sheet, header=header_row)    

    # Limpiar y normalizar los nombres de las columnas
    if not df.empty:    
        
        df.columns = [limpiar_y_normalizar_columna(col) for col in df.columns]
        
        # Renombrar columnas con mismo nombre
        df.columns = renombrar_columnas_duplicadas(df.columns)


    return df    

def load_csv(file_path):
    """Carga un archivo CSV en un DataFrame de pandas."""
    try:
        df = pd.read_csv(file_path, encoding='utf-8', dtype=str)
        logger.info(f"Archivo {file_path} cargado correctamente.")

        # Si el DataFrame tiene datos, eliminar espacios en los nombres de las columnas
        if not df.empty:
            df.columns = df.columns.str.strip()
                    
        return df
    except Exception as e:
        logger.error(f"Error al cargar {file_path}: {e}")
        raise

def extract_sql(database_name, table_name):
    """Extrae datos de una tabla SQL Server y devuelve un DataFrame."""

    engine = create_db_engine(database_name)

    try:
        query = text(f"SELECT * FROM {database_name}.dbo.{table_name}")
        df = pd.read_sql(query, engine)
        logger.info(f"Datos extraídos exitosamente desde {database_name}.{table_name}.")
        return df
    except Exception as e:
        logger.error(f"Error al extraer datos de {database_name}.{table_name}: {e}")
        raise