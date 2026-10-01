"""
api_extractor.py

Extractor de datos vía API.
Responsabilidades:
- Resolver autenticación si 'source_details.auth' está definido:
  - Obtener access_token con usuario/clave de variables de entorno
- Consumir el endpoint y normalizar la respuesta a lista[dict]
"""

import os
import re
import requests
from .base_extractor import BaseExtractor


def _expand_env_placeholders(value: str) -> str:
    """
    Solo se aplica si 'value' es str y tiene ese formato.
    """
    if not isinstance(value, str):
        return value
    m = re.fullmatch(r"\$\{([A-Za-z_][A-Za-z0-9_]*)\}", value.strip())
    if not m:
        return value
    env_name = m.group(1)
    return os.getenv(env_name, "")


def _get_api_token(auth_details: dict) -> str:
    """
    Obtiene un token de acceso desde 'auth_details.login_url' enviando
    el usuario/contraseña que toma de variables de entorno.
    (Mismo comportamiento que existía en main.py)
    """
    login_url = auth_details.get('login_url')
    login_url = _expand_env_placeholders(login_url)

    user = os.getenv('API_JAM_USER')
    password = os.getenv('API_JAM_PASSWORD')

    if not all([login_url, user, password]):
        raise ValueError("Faltan detalles de autenticación (login_url, API_JAM_USER, API_JAM_PASSWORD).")

    print(f"   -> Solicitando token de acceso para el usuario '{user}' desde: {login_url}")

    payload = {"username": user, "password": password}
    response = requests.post(login_url, json=payload)
    response.raise_for_status()

    data = response.json()
    token_obj = None
    if isinstance(data, list) and data:
        token_obj = data[0]
    elif isinstance(data, dict):
        token_obj = data

    if not isinstance(token_obj, dict):
        raise ValueError("La respuesta del login no es un diccionario válido o está vacía.")

    access_token = token_obj.get('access_token')
    if not access_token:
        raise ValueError("La respuesta del login no contenía 'access_token'.")

    print("   -> Token obtenido exitosamente.")
    return access_token


class ApiExtractor(BaseExtractor):
    """Extractor HTTP: llama un endpoint y retorna registros (lista de dicts)."""

    def extract(self, source_details: dict, access_token: str = None) -> list:
        """
        Extrae datos desde la API. Si no se provee 'access_token' y existe 'auth',
        resuelve internamente la autenticación (mismo contrato que antes).
        """
        auth = source_details.get('auth')
        if access_token is None and auth:
            access_token = _get_api_token(auth)

        url = source_details.get('url')
        if not url:
            raise ValueError("Falta 'url' en source_details.")

        headers = (source_details.get('headers') or {}).copy()
        if access_token:
            headers.setdefault('Authorization', f'Bearer {access_token}')

        # Otros parámetros (query/body) si existieran en config
        params = source_details.get('params') or None
        body = source_details.get('body') or None
        method = (source_details.get('method') or 'GET').upper()

        if method == 'GET':
            resp = requests.get(url, headers=headers, params=params)
        elif method == 'POST':
            resp = requests.post(url, headers=headers, params=params, json=body)
        else:
            raise ValueError(f"Método HTTP no soportado: {method}")

        resp.raise_for_status()
        payload = resp.json()

        # Normalización: lista de dicts directa o 'data' adentro (comportamiento original)
        if isinstance(payload, list):
            return payload
        if isinstance(payload, dict):
            if 'data' in payload and isinstance(payload['data'], list):
                return payload['data']
            raise ValueError("La respuesta no es una lista ni contiene 'data' como lista.")
        raise ValueError("Respuesta inesperada de la API.")
