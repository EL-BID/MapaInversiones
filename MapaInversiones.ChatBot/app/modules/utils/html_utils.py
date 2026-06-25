from typing import Optional
import html
from modules.utils.markdown_utils import markdown_to_html

"""
This script:
- Provides utilities to create HTML snippets for user questions and assistant responses.
- Uses markdown conversion for assistant content.
- Wraps content in divs with specific CSS classes for styling.
"""


def create_div(content: str, class_name: str) -> str:
    """
    Wraps the given content in a div with the specified CSS class.

    Args:
        content (str): The content to be wrapped.
        class_name (str): The CSS class to apply to the div.

    Returns:
        str: The resulting HTML string.
    """
    safe_content = content if content is not None else ""
    return f"<div class='{class_name}'>{safe_content}</div>"


def create_assistant_content_html(assistant_content: str) -> str:
    """
    Creates HTML for the assistant's response by converting markdown to HTML
    and wrapping it in a div with the 'message-content' class.

    Args:
        assistant_content (str): The assistant's response in markdown format.

    Returns:
        str: The resulting HTML string.
    """
    html_content = markdown_to_html(assistant_content)
    return create_div(html_content, "message-content")


def create_user_question_html(user_question: str) -> str:
    """
    Creates HTML for the user's question by wrapping it in a div with the 'respuesta-pregunta' class.

    Args:
        user_question (str): The user's question.

    Returns:
        str: The resulting HTML string.
    """
    safe_text = html.escape(user_question or "")
    return create_div(safe_text, "respuesta-pregunta")


def create_user_complete_question_html(complete_user_question: Optional[str]) -> str:
    """
    Creates HTML for the user's complete question by wrapping it in a div with the 'respuesta-pregunta' class.

    Args:
        complete_user_question (Optional[str]): The complete user's question.

    Returns:
        str: The resulting HTML string. If the input is None or empty, returns an empty div.
    """
    content = complete_user_question.strip() if complete_user_question else ""
    safe_text = html.escape(content)
    return create_div(safe_text, "respuesta-pregunta")


from typing import Mapping, Any


def build_stats_dashboard_html(stat_row: Mapping[str, Any]) -> str:
    """
    Construye un dashboard HTML con KPIs y listas desplegables para las estadísticas de un país.
    """
    html = ["<div class='stats-dashboard'>"]

    # Grid de KPIs
    html.append("<div class='kpi-grid'>")
    kpis = [
        ("Total de Proyectos", "total_projects"),
        ("Monto Total (MM)", "total_monto_proyectos_mm"),
        ("Promedio Monto (MM)", "promedio_monto_proyectos_mm"),
        ("Ejecución (%)", "ejecucion_pct"),
        ("Plazo Medio (años)", "plazo_medio_anios"),
        ("Avance Financiero (%)", "promedio_avance_financiero"),
        ("% Avance >80", "pct_proyectos_avance_gt80"),
        ("% Avance <20", "pct_proyectos_avance_lt20"),
    ]
    for label, key in kpis:
        value = stat_row.get(key, "")
        html.append(f"<div class='kpi-card'><strong>{label}:</strong> {value}</div>")
    html.append("</div>")  # cierre kpi-grid

    # Listas desplegables “top 3”
    sections = [
        ("Top 3 Sectores Mayor Inversión", "top_3_sectores_mayor_inversion"),
        ("Top 3 Sectores Menor Inversión", "top_3_sectores_menor_inversion"),
        ("Top 3 Territorios Mayor Inversión", "top_3_territorios_mayor_inversion"),
        ("Top 3 Territorios Menor Inversión", "top_3_territorios_menor_inversion"),
        ("Top 3 Organismos Financiadores", "top_3_organismos_financiadores"),
        ("Top 3 Entidades Ejecutoras", "top_3_entidades_ejecutoras_mayor_monto"),
    ]
    for title, key in sections:
        html.append(
            f"<details><summary>{title}</summary><pre>{stat_row.get(key, [])}</pre></details>"
        )

    # Porcentaje por estado
    html.append("<details><summary>% Proyectos por Estado</summary>")
    for state, pct in stat_row.get("porcentaje_por_estado", {}).items():
        html.append(f"<div><strong>{state}:</strong> {pct}%</div>")
    html.append("</details>")

    html.append("</div>")  # cierre stats-dashboard
    return "\n".join(html)
