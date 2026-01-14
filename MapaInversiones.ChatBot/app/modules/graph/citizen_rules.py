"""Reglas declarativas para notas y acciones del citizen review."""

CITIZEN_RULES = [
    {
        "name": "coverage_warning",
        "conditions": {"coverage_warning": True, "rowcount_gt": 0},
        "effects": {
            "note": "coverage_warning",
            "actions": ["highlight_warning", "offer_increase_limit"],
        },
        "score_delta": -1,
    },
    {
        "name": "keyword_regenerate_notice",
        "conditions": {"used_keyword_regenerate": True},
        "effects": {
            "note": "keyword_regenerate",
            "actions": ["show_filter_chips"],
        },
        "score_delta": -1,
    },
    {
        "name": "soft_missing_filters",
        "conditions": {"has_soft_missing_filters": True},
        "effects": {
            "note": None,
            "actions": ["show_filter_chips"],
        },
        "score_delta": 0,
    },
    {
        "name": "uncertainty_pending",
        "conditions": {"has_uncertainty_actions": True},
        "effects": {
            "note": "uncertainty_pending",
            "actions": ["suggest_clarification"],
        },
        "score_delta": -1,
    },
    {
        "name": "missing_keywords_suggestion",
        "conditions": {"has_missing_keywords": True},
        "effects": {
            "note": "missing_keywords",
            "actions": ["show_filter_chips_from_missing"],
        },
        "score_delta": 0,
    },
    {
        "name": "duplicate_hint",
        "conditions": {"has_duplicate_hint": True},
        "effects": {
            "note": "duplicate_hint",
            "actions": ["dedupe_unique_results"],
        },
        "score_delta": -1,
    },
    {
        "name": "low_semantic_relevance",
        "conditions": {"has_low_relevance": True, "rowcount_gt": 0},
        "effects": {
            "note": None,  # El mensaje viene de _validate_semantic_relevance
            "actions": ["suggest_rephrase"],
        },
        "score_delta": -2,  # Penalización fuerte por baja relevancia
    },
    {
        "name": "fallback_with_low_relevance",
        "conditions": {"used_fallback": True, "has_low_relevance": True},
        "effects": {
            "note": None,
            "actions": ["suggest_rephrase", "show_filter_chips"],
        },
        "score_delta": -2,
    },
    {
        "name": "possible_substring_false_positives",
        "conditions": {
            "theme_keywords_used": True,
            "used_keyword_regenerate": False,
            "rowcount_gt": 0,
        },
        "effects": {
            "note": "possible_false_positives",
            "actions": ["suggest_stricter_filtering"],
        },
        "score_delta": -1,
    },
]
