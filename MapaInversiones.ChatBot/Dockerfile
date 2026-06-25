# Usa la imagen oficial de Python 3.12 como base (Debian 12/bookworm)
FROM python:3.12

ENV POETRY_VERSION=1.8.1 \
    POETRY_VIRTUALENVS_CREATE=false \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Dependencias base
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl gnupg ca-certificates apt-transport-https \
    unixodbc unixodbc-dev \
    dos2unix postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Repo Microsoft + ODBC 18 (compatible OpenSSL 3)
RUN curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg && \
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
      > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && ACCEPT_EULA=Y apt-get install -y --no-install-recommends \
      msodbcsql18 mssql-tools18 \
    && echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> /etc/bash.bashrc && \
    rm -rf /var/lib/apt/lists/*

# Poetry
RUN pip install "poetry==1.8.1"

WORKDIR /app

# Dependencias Python
COPY pyproject.toml poetry.lock* /app/
RUN if [ "$ENV" = "development" ]; then \
      poetry install --no-root; \
    else \
      poetry install --no-root --without dev; \
    fi

# (Si realmente necesitás estos extras fuera de Poetry, dejalos)
RUN pip install nltk sqlfluff[postgres] tabulate unidecode

# Pre-download NLTK resources para evitar descarga en runtime
RUN python -m nltk.downloader -d /usr/share/nltk_data stopwords punkt punkt_tab

# Pre-download FlashRank model para evitar descarga en runtime
RUN mkdir -p /app/.cache/flashrank && \
    python -c "from flashrank import Ranker; Ranker(max_length=256, cache_dir='/app/.cache/flashrank')"

# Pre-download tiktoken encodings para evitar descarga en runtime
ENV TIKTOKEN_CACHE_DIR=/app/.cache/tiktoken
RUN mkdir -p /app/.cache/tiktoken && \
    python -c "import tiktoken; tiktoken.get_encoding('cl100k_base'); tiktoken.encoding_for_model('gpt-4o')"

# Copiá scripts de arranque fuera de /app para que no se sobrescriban con el volumen
COPY docker/scripts /opt/chatbot/scripts
RUN find /opt/chatbot/scripts -type f -name "*.sh" -exec dos2unix {} + && \
    chmod +x /opt/chatbot/scripts/*.sh

# Copiá también los scripts SQL necesarios para bootstrap
COPY docker/sql /opt/chatbot/sql

# Copiá tu código (estaba comentado)
COPY . /app

# Normalizá scripts .sh dentro del código
RUN find /app -type f -name "*.sh" -exec dos2unix {} +

# Gunicorn: reload se controla vía ENV/GUNICORN_RELOAD en modules/gunicorn.conf.py
ENTRYPOINT ["/opt/chatbot/scripts/start.sh"]

EXPOSE 8000
