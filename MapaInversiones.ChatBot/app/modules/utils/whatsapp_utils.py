import re

"""
This script:
- Provides utilities to format markdown text for WhatsApp.
- Converts markdown syntax to WhatsApp-compatible formatting.
- Simulates tables using plain text with pipes and dashes.
"""


def markdown_to_whatsapp(text):
    # Convertir negrita (**texto** -> *texto*)
    text = re.sub(r"\*\*(.*?)\*\*", r"*\1*", text)
    # Convertir cursiva (*texto* -> _texto_)
    text = re.sub(r"\*(.*?)\*", r"_\1_", text)
    # Convertir tachado (~~texto~~ -> ~texto~)
    text = re.sub(r"~~(.*?)~~", r"~\1~", text)
    # Convertir monoespaciado (```texto``` -> ```texto``` y `texto` -> ```texto```)
    text = re.sub(r"`{3}(.*?)`{3}", r"```\1```", text)
    text = re.sub(r"`(.*?)`", r"```\1```", text)

    # Tablas Markdown a tablas simuladas con | y -
    if "|" in text:  # Comprobar si hay tablas
        rows = text.split("\n")
        table = []
        for row in rows:
            if "|" in row:
                # Eliminar espacios redundantes y evitar bordes vacíos
                table.append(
                    "| "
                    + " | ".join(
                        cell.strip() for cell in row.split("|") if cell.strip()
                    )
                    + " |"
                )
            else:
                table.append(row)
        text = "\n".join(table)

    return text
