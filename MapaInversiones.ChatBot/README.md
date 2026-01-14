# ChatBot_v2

[![Gitleaks](https://github.com/ORG/REPO/actions/workflows/gitleaks.yml/badge.svg)](https://github.com/ORG/REPO/actions/workflows/gitleaks.yml)

Backend conversacional para consultas analíticas sobre datos estructurados. Este repositorio contiene el servicio que interpreta preguntas en lenguaje natural, recupera contexto relevante, genera consultas y devuelve respuestas comprensibles para el usuario final, además de una interfaz web ligera (plantillas Jinja2 + assets estáticos) servida por FastAPI.

## Contenido
- [Objetivos](#objetivos)
- [Alcance](#alcance)
- [Funcionamiento (alto nivel)](#funcionamiento-alto-nivel)
- [Frontend incluido](#frontend-incluido)
- [Conceptos básicos](#conceptos-básicos)
- [Requisitos](#requisitos)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Operación y mantenimiento](#operación-y-mantenimiento)
- [Seguridad y cumplimiento](#seguridad-y-cumplimiento)
- [Limitación de responsabilidades](#limitación-de-responsabilidades)
- [Autores](#autores)
- [Licencia](#licencia)

## Objetivos
**a.** Proveer un backend conversacional que permita transformar preguntas en consultas a datos de forma segura y trazable.

**b.** Facilitar la publicación de respuestas y métricas derivadas de datos, manteniendo consistencia y control de calidad.

**c.** Permitir integración con interfaces de usuario y flujos de ingesta sin acoplarse a una única implementación de frontend.

## Alcance
Incluye:
- Procesamiento de lenguaje natural y generación de consultas.
- Validación y ejecución en base de datos relacional.
- Mecanismos de contexto y control de calidad de respuestas.
- Interfaz web server-side con plantillas Jinja2 y assets estáticos (ver `app/templates` y `app/static`).

## Funcionamiento (alto nivel)
1) La pregunta del usuario se normaliza y se valida con reglas de seguridad.
2) Se recupera contexto útil (catálogo, documentos y ejemplos).
3) Se genera y valida una consulta para la base de datos.
4) Se ejecuta la consulta y se construye la respuesta.
5) Se entrega una salida legible y consistente para el usuario.

## Frontend incluido
- UI web server-rendered con Jinja2 en `app/templates`.
- Archivos estáticos (CSS/JS/imagenes) en `app/static`, servidos en `/static`.
- Ruta principal `/` (y `/home`) para acceder a la interfaz.
- Diseño responsive compatible con navegación móvil.
- No requiere build separado; el frontend se sirve desde FastAPI.

## Conceptos básicos
- **Pregunta:** consulta en lenguaje natural enviada por el usuario.
- **Contexto:** información adicional (metadatos, catálogos, ejemplos) que mejora la precisión.
- **Consulta:** sentencia generada para recuperar datos de la base.
- **Respuesta:** salida final con la interpretación de los resultados.

## Requisitos
- Docker y Docker Compose.
- Python 3.11+ (solo si ejecutas scripts fuera del contenedor).

## Configuración
Se incluye un `.env.dummy` como plantilla pública. Copia ese archivo a `.env` y completa los valores locales.

```bash
cp .env.dummy .env
```

Configura al menos:
- Entorno de ejecución.
- Credenciales de base de datos.
- Credenciales del proveedor de modelos (LLM).

## Ejecución
```bash
docker compose up -d --build
```

Interfaz web local:
- `http://localhost:8000/`

Para reconstruir desde cero:
```bash
docker compose build --no-cache
docker compose up -d
```

Ver logs:
```bash
docker compose logs -f --tail 50
```

## Operación y mantenimiento
- Revisa logs periódicamente para validar estabilidad y errores.
- Mantén actualizada la configuración de entorno al cambiar infraestructura.
- Valida periódicamente la calidad de resultados con muestras reales.

## Seguridad y cumplimiento
- No comitees secretos; usa variables de entorno o un gestor de secretos.
- Aplica el principio de mínimo privilegio para las credenciales de base de datos.
- Realiza escaneos de seguridad antes de publicar o desplegar (Gitleaks en CI).
- Reportes de seguridad: ver `SECURITY.md`.

## Limitación de responsabilidades
El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de esta herramienta, incluyendo, pero sin limitación de potenciales defectos en la herramienta, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con su utilización.


## Autor/es:

---
- [Juan Cruz Vieyra](https://www.linkedin.com/in/juan-cruz-vieyra-345b253/ "Juan Cruz Vieyra")
- [Sebastian del Hoyo](https://www.linkedin.com/in/sebastiandelhoyo/ "Sebastian del Hoyo")
- [José Niño](https://www.linkedin.com/in/jose-ni%C3%B1o-a2a8a731/ "José Niño")
- [Diego Hernan Perez Jaramillo](mailto:diperez@uniandes.edu.co  "Diego Hernan Perez Jaramillo")
- [Álvaro González Hernández](mailto:alvarogh_22@hotmail.com  "Álvaro González Hernández")
- [Wilson Muñoz Camelo](https://www.linkedin.com/in/wilson-mu%C3%B1oz-camelo-24b11324/ "Wilson Muñoz Camelo")
- [Jaime Alberto Osorio](mailto:jaime.osorio@yahoo.com  "Jaime Alberto Osorio")
- [David Olaciregui](https://www.linkedin.com/in/david-olaciregui-35196015/ "David Olaciregui")
- [Anyela Milena Chavarro Muñoz ](https://www.linkedin.com/in/anyela-milena-chavarro-mu%C3%B1oz-0a79a524/ "Anyela Milena Chavarro Muñoz ")
- [Vladimiro Bellini](https://www.linkedin.com/in/vladimirobellini/ "Vladimiro Bellini")
- [Andrés Felipe Villamizar Vecino](mailto:villamizarvecino@hotmail.com "Andrés Felipe Villamizar Vecino")
- [Diana Villamizar](https://www.linkedin.com/in/diana-villamizar-4737762a/ "Diana Villamizar")
- [Paulette Desormeaux](https://www.linkedin.com/in/paulette-desormeaux/ "Paulette Desormeaux")
- [William García](mailto:williamlgr2006@gmail.com "William García")
- [Enrique José Oyaga Arias](mailto:enriqueoyaga@gmail.com "Enrique José Oyaga Arias")
- [Luis Mendez](https://www.linkedin.com/in/luisefe80/ "Luis Mendez")

## Licencia 
---
Este proyecto se rige por la licencia del BID (Banco Interamericano de Desarrollo). Ver `LICENSE`.

## Limitación de responsabilidades

El BID no será responsable, bajo circunstancia alguna, de daño ni indemnización, moral o patrimonial; directo o indirecto; accesorio o especial; o por vía de consecuencia, previsto o imprevisto, que pudiese surgir:

i. Bajo cualquier teoría de responsabilidad, ya sea por contrato, infracción de derechos de propiedad intelectual, negligencia o bajo cualquier otra teoría; y/o

ii. A raíz del uso de la Herramienta Digital, incluyendo, pero sin limitación de potenciales defectos en la Herramienta Digital, o la pérdida o inexactitud de los datos de cualquier tipo. Lo anterior incluye los gastos o daños asociados a fallas de comunicación y/o fallas de funcionamiento de computadoras, vinculados con la utilización de la Herramienta Digital.
