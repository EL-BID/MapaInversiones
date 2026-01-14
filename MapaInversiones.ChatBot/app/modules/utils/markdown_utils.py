import markdown2
from markdown import Markdown
from io import StringIO
from datetime import datetime
import re
import json
from pathlib import Path
from loguru import logger
import html


def beautify_column_name(name: str) -> str:
    if not name:
        return ""
    cleaned = name.replace("_", " ")
    cleaned = re.sub(r"\s+", " ", cleaned)
    pretty = cleaned.strip().title()
    pretty = re.sub(r"\bId\b", "ID", pretty)
    pretty = re.sub(r"\bUrl\b", "URL", pretty)
    pretty = re.sub(r"\bIso\b", "ISO", pretty)
    return pretty


"""
This script:
- Provides utilities to convert markdown text to HTML.
- Formats tables in markdown with specific CSS classes for styling.
- Removes markdown syntax from text.
"""


# remove markdown from original markdown answer
def unmark_element(element, stream=None):
    if stream is None:
        stream = StringIO()
    if element.text:
        stream.write(element.text)
    for sub in element:
        unmark_element(sub, stream)
    if element.tail:
        stream.write(element.tail)
    return stream.getvalue()


# remove markdown from original markdown answer
def unmark(text, __md):
    """
    Remove markdown from text
    """
    return __md.convert(text)


# transform markdown to html
def markdown_to_html(markdown_text):
    """
    Transform markdown to html and apply minimal sanitization to avoid XSS.
    """
    if markdown_text is None:
        return ""

    # ═══════════════════════════════════════════════════════════════════════════
    # PRE-PROCESAMIENTO: Normalizar listas inline a formato markdown estándar
    # El LLM a veces genera "texto: \n- item1\n- item2" sin línea en blanco
    # Markdown2 necesita línea en blanco antes de la lista para reconocerla
    # ═══════════════════════════════════════════════════════════════════════════

    # Detectar patrón de lista inline: texto seguido de \n- items
    # Convertir a formato markdown estándar con línea en blanco antes de la lista
    normalized_text = markdown_text

    # Patrón: cualquier texto que NO sea un item de lista, seguido de \n-
    # Insertar línea en blanco para que markdown2 lo reconozca como lista
    normalized_text = re.sub(
        r"([^\n])\n(- )",  # texto + newline + inicio de lista
        r"\1\n\n\2",  # texto + doble newline + inicio de lista
        normalized_text,
    )

    # También manejar el caso donde hay múltiples espacios o tabs antes del guión
    normalized_text = re.sub(r"([^\n])\n(\s*- )", r"\1\n\n\2", normalized_text)

    html_text = markdown2.markdown(
        normalized_text, extras=["extra", "smarty", "tables", "footnotes"]
    )

    # escape script/style blocks aggressively
    html_text = re.sub(
        r"(?is)<\s*(script|style)(.*?)>(.*?)<\s*/\s*\1\s*>",
        lambda m: html.escape(m.group(0)),
        html_text,
    )

    # if a table is found <table> then add an id and class named "tabla-respuesta" to the table
    if "<table>" in html_text:
        html_text = html_text.replace("<table>", "<table class='tabla-respuesta'>")
    # for each tbody on the table add an id and class named "tabla-respuesta-cuerpo" and iterate to add another class called "tabla-respuesta-cuerpo" + i (i = 1, 2, 3, ...) to each tbody)
    for i in range(1, html_text.count("<tbody>") + 1):
        if "<tbody>" in html_text:
            html_text = html_text.replace(
                "<tbody>",
                f"<tbody class='tabla-respuesta-cuerpo'>",
                1,
            )
    # for each tr on the table add an id and class named "tabla-respuesta-fila" and iterate to add another class called "tabla-respuesta-fila" + i (i = 1, 2, 3, ...) to each tr
    if "<tr>" in html_text:
        html_text = html_text.replace(
            "<tr>",
            "<tr class='tabla-respuesta-fila'>",
        )
    # if a list ul li is found, add a id and a class named "respuesta-lista" to the ul and a class named "respuesta-lista-elemento" to each li
    if "<ul>" in html_text:
        html_text = html_text.replace("<ul>", "<ul class='respuesta-lista'>")
    if "<li>" in html_text:
        html_text = html_text.replace("<li>", "<li class='respuesta-lista-elemento'>")
    # for all a href="" add _BLANK to target
    if "<a href=" in html_text:
        html_text = html_text.replace("<a href=", "<a target='_BLANK' href=")

    return html_text


_SCHEMA_LABELS_CACHE: dict[str, str] | None = None


def _shorten_description(
    text: str, *, max_words: int = 6, max_chars: int = 48
) -> str | None:
    if not text:
        return None

    snippet = str(text)

    desc_match = re.search(r"descripci[oó]n\s*:\s*(.+)", snippet, re.IGNORECASE)
    if desc_match:
        snippet = desc_match.group(1)
    else:
        attr_match = re.search(
            r"atributo\s*:\s*([A-Za-z0-9_]+)", snippet, re.IGNORECASE
        )
        if attr_match:
            return beautify_column_name(attr_match.group(1))

    snippet = snippet.replace("|", " ")
    snippet = re.sub(r"\s+", " ", snippet).strip()
    if not snippet:
        return None

    words = snippet.split()
    shortened = " ".join(words[:max_words]).strip()
    if len(shortened) > max_chars:
        shortened = shortened[:max_chars].rstrip()
    return beautify_column_name(shortened)


def _load_schema_labels() -> dict[str, str]:
    global _SCHEMA_LABELS_CACHE
    if _SCHEMA_LABELS_CACHE is not None:
        return _SCHEMA_LABELS_CACHE

    labels: dict[str, str] = {}
    try:
        schema_path = (
            Path(__file__).resolve().parents[2] / "database" / "schema_enriched.json"
        )
        if not schema_path.exists():
            logger.warning(
                f"Schema file not found at {schema_path}, using default column labels."
            )
        else:
            with schema_path.open(encoding="utf-8") as f:
                schema_data = json.load(f)
            for table in schema_data.values():
                columns = table.get("columns") or {}
                for column_name, meta in columns.items():
                    desc = meta.get("description")
                    label = _shorten_description(desc)
                    if label:
                        labels[column_name.lower()] = label
    except Exception as exc:
        logger.error(f"Failed to load schema column labels: {exc}")
    _SCHEMA_LABELS_CACHE = labels
    return labels


COLUMN_NAME_OVERRIDES = {
    "id_proyecto": "ID Proyecto",
    "codigo_snip": "Código SNIP",
    "nombre_proyecto": "Nombre Proyecto",
    "objetivo_proyecto": "Objetivo Proyecto",
    "estado_proyecto": "Estado Proyecto",
    "fechainicio_proyecto": "Fecha Inicio",
    "valor_proyecto": "Valor Proyecto",
    "valor_ejecutado_fuente": "Valor Ejecutado",
    "anio_fechainicio_proyecto": "Año Inicio",
    "fechafin_proyecto": "Fecha Fin",
    "anio_fechafin_proyecto": "Año Fin",
    "duracion_proyecto": "Duración",
    "idsector_proyecto": "ID Sector",
    "nombresector_proyecto": "Sector",
    "porcentajeavancefinanciero_proyecto": "Avance Financiero",
    "identidadejecutora_proyecto": "ID Entidad Ejecutora",
    "nombreentidadejecutora_proyecto": "Entidad Ejecutora",
    "nombre_region": "Región",
    "nombre_departamento": "Provincia",
    "nombre_municipio": "Municipio",
    "pais_iso3": "País ISO3",
    "pais_nombre": "País",
    "url_link_proyecto": "Link",
    "valor_total": "Valor",
    "cantidad_proyectos": "Cantidad Proyectos",
    "total_proyectos": "Cantidad Proyectos",
    "total_valor_proyecto": "Valor",
    "total_valor_ejecutado": "Valor Ejecutado",
    "total_valor": "Valor",
    "count": "Cantidad",
    "total_count": "Cantidad",
    "count_total": "Cantidad",
    "count_proyectos": "Cantidad Proyectos",
    "total_cantidad": "Cantidad",
    "cantidad_total": "Cantidad",
    "organismo_financiador": "Organismo Financiador",
    "organismo_financiador_fuente": "Organismo Financiador",
    "fuente_financiacion": "Fuente Financ.",
    "fuente_financiadora": "Fuente Financ.",
    "valor_vigente_fuente": "Valor Vigente",
    "valor_ejecutado_fuente": "Valor Ejecutado",
    "valor_pagado_fuente": "Valor Pagado",
    "valor_asignado_fuente": "Valor Asignado",
    "monto_financiamiento": "Monto Financiamiento",
    "tipo_financiamiento": "Tipo Financiamiento",
    "porcentaje_financiamiento": "Porcentaje Financ.",
    "total_valor_vigente_fuente": "Valor Vigente",
    "total_valor_ejecutado_fuente": "Valor Ejecutado",
    "total_valor_pagado_fuente": "Valor Pagado",
    "total_valor_asignado_fuente": "Valor Asignado",
    "count_fuentes": "Cantidad Fuentes",
    "valor_vigente": "Valor Vigente",
    "valor_ejecutado": "Valor Ejecutado",
    "anio_financiacion": "Año Financiación",
    "id_region": "ID Región",
    "id_departamento": "ID Provincia",
    "id_municipio": "ID Municipio",
    "tipo_proyecto": "Tipo Proyecto",
}


def format_table_markdown(projects, currency_code: str, monetary_properties: str):
    try:
        # Convert monetary_properties string to array
        monetary_fields = (
            [field.strip() for field in monetary_properties.split(",")]
            if monetary_properties
            else []
        )

        def format_number(value, decimals: int = 2):
            """
            Formatea números:
            • Miles con punto.
            • Si el número tiene parte decimal, la redondea a `decimals`.
            • Si es entero exacto, lo muestra sin decimales.

            Ejemplos:
                123456      -> "123.456"
                123456.789  -> "123.456,79"   (con 2 decimales)
            """
            try:
                # Acepta strings y numéricos
                num = float(str(value).replace(",", ""))

                # Caso entero: sin decimales
                if num.is_integer():
                    return f"{int(num):,}".replace(",", ".")

                # Caso float: redondea y aplica formato con separadores
                rounded = round(num, decimals)
                # {,} separador miles, {.} separador decimales (estilo US)
                # Luego invertimos para estilo latino: miles '.' y decimales ','
                return (
                    f"{rounded:,.{decimals}f}".replace(",", "X")  # miles -> tmp
                    .replace(".", ",")  # decimales -> ','
                    .replace("X", ".")  # tmp -> '.'
                )
            except (ValueError, TypeError):
                # Si no es numérico, se devuelve tal cual
                return value

        def format_date(date_str):
            try:
                return datetime.strptime(date_str, "%Y-%m-%d").strftime("%d-%m-%Y")
            except Exception as e:
                logger.warning(f"Error formatting date {date_str}: {str(e)}")
                return date_str

        AGGREGATE_NAME_MAP = {
            "count": "Cantidad",
            "total": "Total",
            "total_count": "Cantidad",
            "count_total": "Cantidad",
            "sum": "Suma",
            "avg": "Promedio",
            "average": "Promedio",
            "min": "Mínimo",
            "max": "Máximo",
        }

        schema_labels = _load_schema_labels()

        URL_FIELD_KEYS = [
            "url_link_proyecto",
            "url_link",
            "url_proyecto",
            "project_url",
            "link",
            "url",
        ]

        def _get_project_url(record: dict) -> str:
            """Return the first non-empty URL value from known keys."""
            for key in URL_FIELD_KEYS:
                for variant in (key, key.lower(), key.upper()):
                    if variant in record:
                        value = record.get(variant)
                        if value:
                            return str(value).strip()
            return ""

        def format_display_name(field_key: str) -> str:
            raw_key = field_key or ""
            key = raw_key.lower().strip()

            prefix = None
            remainder = None
            if ":" in key:
                prefix, _, remainder = key.partition(":")
                prefix = prefix.strip()
                remainder = remainder.strip()
                if remainder:
                    key = remainder

            key = key.strip()

            if key in AGGREGATE_NAME_MAP:
                return AGGREGATE_NAME_MAP[key]
            if key.startswith("count_") and len(field_key) > len("count_"):
                base = field_key[len("count_") :]
                return f"Total {beautify_column_name(base)}"
            if key.endswith("_count") and len(field_key) > len("_count"):
                base = field_key[: -len("_count")]
                return f"Total {beautify_column_name(base)}"
            if key.startswith("total_") and len(field_key) > len("total_"):
                base = field_key[len("total_") :]
                return f"Total {beautify_column_name(base)}"
            if key.endswith("_total") and len(field_key) > len("_total"):
                base = field_key[: -len("_total")]
                return f"Total {beautify_column_name(base)}"

            override = COLUMN_NAME_OVERRIDES.get(key)
            if override:
                return override

            schema_label = schema_labels.get(key)
            if schema_label:
                return schema_label

            base_name = remainder or raw_key
            return beautify_column_name(base_name)

        if not projects:
            logger.warning("No projects provided to format_table_markdown")
            return ""

        # ⚠️ Eliminar duplicados
        seen = set()
        unique_projects = []
        for p in projects:
            hashable = tuple(sorted((k, str(v)) for k, v in p.items()))
            if hashable not in seen:
                seen.add(hashable)
                unique_projects.append(p)
        projects = unique_projects

        # Detectar todos los campos disponibles
        available_fields = set()
        for project in projects:
            available_fields.update(project.keys())

        # ✅ Eliminar campos vacíos en todos los proyectos
        def is_field_empty_in_all_projects(field):
            return all(not str(project.get(field, "")).strip() for project in projects)

        available_fields = {
            field
            for field in available_fields
            if not is_field_empty_in_all_projects(field)
        }

        # Detectar y eliminar columna de conteo sin valor informativo (solo 1s)
        count_like_fields = {"count", "conteo", "cantidad"}
        for field in list(available_fields):
            if field.lower() in count_like_fields:
                if all(
                    str(project.get(field, "")).strip() in ("1", "1.0")
                    for project in projects
                ):
                    logger.info(
                        f"Column '{field}' has only 1s, removing it from display."
                    )
                    available_fields.remove(field)

        header_parts = []
        separator_parts = []
        display_field_keys = []

        URL_FIELD_KEYS = set(URL_FIELD_KEYS or [])
        for field_key in sorted(available_fields):
            if field_key in URL_FIELD_KEYS:
                continue
            display_name = format_display_name(field_key)
            if field_key == "valor_proyecto" or field_key in monetary_fields:
                display_name += f" ({currency_code})"
            header_parts.append(f"**{display_name}**")
            separator_parts.append("-" * len(display_name))
            display_field_keys.append(field_key)

        header = (
            f"\n\n| {' | '.join(header_parts)} |\n| {' | '.join(separator_parts)} |"
        )

        rows = []
        for p in projects:
            try:
                row_parts = []
                project_url = _get_project_url(p)
                for field_key in display_field_keys:
                    # Link en nombre_proyecto si hay nombre y URL
                    if (
                        field_key == "nombre_proyecto"
                        and p.get("nombre_proyecto")
                        and project_url
                    ):
                        value = f"**[{p['nombre_proyecto'].strip()}]({project_url})**"
                        row_parts.append(value)

                    # Link en id_proyecto solo si no hay nombre pero sí URL
                    elif (
                        field_key == "id_proyecto"
                        and not p.get("nombre_proyecto")
                        and project_url
                    ):
                        value = f"[{p['id_proyecto']}]({project_url})"
                        row_parts.append(value)

                    # Fechas
                    elif field_key in ["fechainicio_proyecto", "fechafin_proyecto"]:
                        formatted_date = format_date(p.get(field_key, ""))
                        row_parts.append(formatted_date)

                    # Resto de los valores
                    else:
                        value = p.get(field_key, "")
                        if isinstance(value, str):
                            value = value.strip().replace("\n", " ").replace("|", "")
                            if len(value) > 150:
                                value = value[:147] + "..."
                        # Format numeric values
                        if (
                            field_key in monetary_fields
                            or field_key == "valor_proyecto"
                        ):
                            value = format_number(value)
                        row_parts.append(str(value))

                row = f"| {' | '.join(row_parts)} |"
                rows.append(row)
            except Exception as e:
                logger.error(f"Error formatting project row: {str(e)}")
                continue

        if not rows:
            logger.warning("No valid project rows were generated")
            return ""

        return header + "\n" + "\n".join(rows)

    except Exception as e:
        logger.error(f"Error in format_table_markdown: {str(e)}")
        return ""
