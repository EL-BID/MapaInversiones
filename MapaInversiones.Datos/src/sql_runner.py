from sqlalchemy.engine import Engine
from sqlalchemy import text

def execute_sql_from_file(engine: Engine, file_path: str):
    """
    Lee y ejecuta el contenido de un archivo .sql.

    Args:
        engine (Engine): Una instancia del motor de SQLAlchemy para la conexión.
        file_path (str): La ruta al archivo .sql que se va a ejecutar.
    """
    print(f"   -> Ejecutando script SQL: {file_path}")
    with open(file_path, 'r', encoding="utf-8-sig") as file:
        sql_script = file.read()
    
    # Usamos una conexión del pool del motor para ejecutar el script
    with engine.connect() as connection:
        # Iniciamos una transacción explícita
        trans = connection.begin()
        try:
            # SQLAlchemy 2.0 requiere que el SQL esté envuelto en text()
            connection.execute(text(sql_script))
            # Si todo va bien, confirmamos la transacción
            trans.commit()
            print(f"   -> Script {file_path} ejecutado con éxito.")
        except Exception as e:
            # Si hay un error, revertimos la transacción
            print(f" ERROR ejecutando {file_path}. Revirtiendo transacción.")
            trans.rollback()
            raise e