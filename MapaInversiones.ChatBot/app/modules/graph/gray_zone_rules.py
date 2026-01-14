"""Declarative regras para la inferencia de motivos de zona gris."""

GRAY_ZONE_RULES = [
    {
        "name": "missing_dimension_from_analyzer_options",
        "reason": "MISSING_DIMENSION",
        "description": "El analyzer sugirió aclarar sector/entidad/sinónimo con alta incertidumbre.",
        "when": {
            "postfetch_ready": True,
            "options": {
                "targets_any": ["sector", "entity", "synonym"],
                "sources_any": ["analyzer_uncertainty", "low_conf_filter"],
            },
        },
    },
    {
        "name": "missing_dimension_from_soft_missing_filters",
        "reason": "MISSING_DIMENSION",
        "description": "El analyzer marcó filtros faltantes o de baja confianza.",
        "when": {"soft_missing_present": True},
    },
    {
        "name": "unsupported_metric_avance_fisico",
        "reason": "UNSUPPORTED_METRIC",
        "description": "La consulta pide métricas fuera del dataset (ej.: avance físico).",
        "when": {"analysis_contains_any": ["avance físico"]},
    },
    {
        "name": "fallback_without_results",
        "reason": "NO_ROWS_FILTERED",
        "description": "Se usó fallback pero aún no hay resultados.",
        "when": {
            "used_fallback": True,
            "rowcount": 0,
        },
    },
    {
        "name": "missing_filter_columns",
        "reason": "MISSING_ATTRIBUTE",
        "description": "Hay columnas solicitadas que no existen en el esquema.",
        "when": {
            "missing_filter_columns": True,  # Se evalúa como True si la lista no está vacía
        },
    },
    {
        "name": "postfetch_clarification_exhausted",
        "reason": "MISSING_DIMENSION",
        "description": "Se agotaron los intentos de clarificación post-fetch.",
        "when": {
            "postfetch_exhausted": True,
            "rowcount": 0,
        },
    },
]
