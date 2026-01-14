from fastapi import APIRouter, Request, Response
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import datetime
from routes import get_session_id  # Importar la función centralizada
from modules.config import settings  # Import settings
from modules.utils.app_metadata import get_data_cutoff_date

# Crear un router de FastAPI para la ruta / del servidor
router = APIRouter()

# Cargar las plantillas de Jinja2 desde el directorio templates de la aplicación de FastAPI
templates = Jinja2Templates(directory="templates")

# Crear una variable con la fecha de creación del servidor en formato YYYY/MM/DD
fecha_creacion = datetime.datetime.now().strftime("%Y/%m/%d")
APP_VERSION = settings.app_version


def _base_context(request: Request, **extra):
    context = {
        "request": request,
        "fecha_creacion": fecha_creacion,
        "app_version": APP_VERSION,
        "data_cutoff_date": get_data_cutoff_date(),
    }
    context.update(extra)
    return context


# Crear una ruta GET para la raíz del servidor que devuelve un archivo HTML con la fecha de creación del servidor en formato YYYY/MM/DD
@router.get("/", response_class=HTMLResponse)
async def index(request: Request, response: Response):
    """
    Ruta para la página de inicio del servidor Chatbot.
    """
    # Obtener o crear una sesión única para cada usuario
    session_id = get_session_id(request, response)

    # Devolver la plantilla index.html
    # con la fecha de creación del servidor en formato YYYY/MM/DD
    # y la solicitud del cliente (request) como contexto
    return templates.TemplateResponse("home.html", _base_context(request))


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/acerca-de-mapabot", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Acerca de MapaBot" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla acerca-de-mapabot.html
    # con la fecha de creación del servidor en formato YYYY/MM/DD
    # y la solicitud del cliente (request) como contexto
    return templates.TemplateResponse("acerca-de-mapabot.html", _base_context(request))


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/terminos-y-condiciones", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Términos de Uso" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    return templates.TemplateResponse(
        "terminos-y-condiciones.html", _base_context(request)
    )


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/home", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Landing Page" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla landing.html

    return templates.TemplateResponse(
        "home.html",
        _base_context(request, frontend_api_key=settings.frontend_api_key),
    )


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/nuevotema", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Landing Page" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla landing.html

    return templates.TemplateResponse(
        "nuevotema.html",
        _base_context(request, frontend_api_key=settings.frontend_api_key),
    )


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/nuevotema_migrado", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Landing Page" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla landing.html

    return templates.TemplateResponse(
        "nuevotema_migrado.html",
        _base_context(request, frontend_api_key=settings.frontend_api_key),
    )


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/nuevotema_limpio", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Landing Page" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla landing.html

    return templates.TemplateResponse(
        "nuevotema_limpio.html",
        _base_context(request, frontend_api_key=settings.frontend_api_key),
    )


# Crear una ruta GET para el archivo acerca-de-mapabot.html
@router.get("/nuevotema2", response_class=HTMLResponse)
async def acerca_de_mapabot(request: Request, response: Response):
    """
    Ruta para la página "Landing Page" del servidor Chatbot.
    """
    session_id = get_session_id(request, response)
    # Devolver la plantilla landing.html

    return templates.TemplateResponse(
        "nuevotema2.html",
        _base_context(request, frontend_api_key=settings.frontend_api_key),
    )
