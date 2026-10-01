# Usamos una imagen oficial de Python como base
FROM python:3.11-slim

# Instala las dependencias del sistema, incluyendo make
RUN apt-get update && apt-get install -y make

# --- Instalación de dependencias del sistema para el driver ODBC de SQL Server ---
# Se actualiza al método moderno para añadir claves GPG en Debian 12+

# 1. Instalar herramientas necesarias y limpiar la cache de apt
RUN apt-get update && apt-get install -y curl gnupg && rm -rf /var/lib/apt/lists/*

# 2. Descargar la clave GPG de Microsoft, de-armorizarla y guardarla en el keyring
RUN curl -sSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > /etc/apt/keyrings/microsoft.gpg

# 3. Añadir el repositorio de Microsoft, especificando que debe estar firmado por la clave que descargamos
RUN echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" > /etc/apt/sources.list.d/mssql-release.list

# 4. Actualizar la lista de paquetes e instalar el driver
RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc-dev

# --- Fin de la instalación de dependencias ---

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de requerimientos y configuración
COPY requirements.txt .
COPY config.yaml .

# Instalamos las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el código de nuestra aplicación
COPY ./src ./src
COPY ./sql ./sql 

# Comando que se ejecutará cuando el contenedor inicie
CMD ["python", "src/main.py"]