# graph.py  – Pipeline comentado paso a paso
# ═════════════════════════════════════════════════════════════════════
from langgraph.graph import START, END, StateGraph
from modules.graph.state import AgentState

# ── Nodos que siempre se usan ───────────────────────────────────────
from modules.graph.nodes import (
    # Pre-procesado / meta-datos
    inbox_classifier,  # PII-scan + clasificación (unified)
    generate_complete_question_v2,  # re-escribe la última pregunta (simplified)
    classify_question_complexity,  # heurística SIMPLE vs COMPLEJA
    retrieve_documents,  # contexto / few-shots
    llm_analyzer,
    definitions_lookup,  # Búsqueda de conceptos/definiciones en Markdown
    # Ramas SQL
    llm_analyzer_2,
    generate_sql_query,  # one-shot
    generate_sql_candidates,
    select_best_sql_candidate,
    choose_sql_with_llm,
    # Ejecución + fallback
    fetch_data,
    regenerate_query,
    handle_gray_zone,
    # Post-procesado
    process_user_response,
    evaluate_citizen_response,
    compose_frontend_response,
    generate_question_summary,
    # Cierres laterales
    handle_irrelevant_question,
    send_greeting,
    send_confirmation_response,  # ← NUEVO: respuesta a confirmaciones/meta-comunicación
    send_support_response,
    request_clarification,
    moderation_reprompt,
    check_cache_raw,  # ← NUEVO: entry point optimizado
)

# ── Funciones de decisión ───────────────────────────────────────────
from modules.graph.edges import (
    route_after_inbox,  # END / cache / flujo normal (unified)
    handle_fetch_data_outcome,  # fetch_data → regenerate / ok
    route_after_retrieve_documents,  # SIMPLE ↔ COMPLEJA
    route_after_analyzer,
    route_after_gray_zone,
    route_after_select_best,  # ← nuevo ruteo: salta choose_sql_with_llm si ya está decidido
    route_after_compose,  # ← nuevo ruteo: maneja reintentos después de compose
    route_after_regenerate,  # ← NUEVO: protección anti-loop SQL
    route_after_check_cache,  # ← NUEVO: check_cache_raw → (hit/miss)
)
from modules.graph.nodes import prefetch_exit

# ═════════ Construcción del grafo ═══════════════════════════════════
workflow = StateGraph(AgentState)

# 0️⃣ ENTRY POINT: Check Cache Raw (Optimization)
# Verifica HIT exacto o semantic sobre RAW question.
# Si pega, saltamos la re-escritura costosa.
workflow.add_node("check_cache_raw", check_cache_raw)
workflow.add_edge(START, "check_cache_raw")

# Decisión tras check_cache_raw:
# - HIT -> inbox_classifier (Passthrough) -> route_after_inbox -> process_user_response
# - MISS -> generate_complete_question_v2 -> ...
workflow.add_conditional_edges(
    "check_cache_raw",
    route_after_check_cache,
    {
        "inbox_classifier": "inbox_classifier",
        "generate_complete_question_v2": "generate_complete_question_v2",
    },
)

# 1️⃣ Re-escritura de pregunta (Solo si hubo Cache MISS)
workflow.add_node("generate_complete_question_v2", generate_complete_question_v2)
# (Ya no conectamos START aquí, sino desde route_after_check_cache)

# 2️⃣ Inbox classifier (moderación + clasificación + fallback cache normalized)
workflow.add_node("inbox_classifier", inbox_classifier)
workflow.add_node("moderation_reprompt", moderation_reprompt)
workflow.add_node("definitions_lookup", definitions_lookup)
workflow.add_node("send_confirmation_response", send_confirmation_response)
workflow.add_edge("generate_complete_question_v2", "inbox_classifier")

# 2.5️⃣ Summary de pregunta (solo para casos is_relevant="yes")
# OPTIMIZACIÓN: Se ejecuta DESPUÉS de clasificación, solo si es consulta SQL relevante
workflow.add_node("generate_question_summary", generate_question_summary)

# 3️⃣ Ruteo posterior al inbox (moderación / definiciones / cache / flags)
workflow.add_conditional_edges(
    "inbox_classifier",
    route_after_inbox,
    {
        # Moderación y definiciones
        "moderation_reprompt": "moderation_reprompt",
        "definitions_lookup": "definitions_lookup",
        "handle_gray_zone": "handle_gray_zone",
        END: END,
        # Cache
        "process_user_response": "process_user_response",
        "fetch_data": "fetch_data",
        # Flujo normal por flags (decisión integrada en route_after_inbox)
        "generate_question_summary": "generate_question_summary",  # ← NUEVO: summary solo si is_relevant="yes"
        "send_greeting": "send_greeting",
        "send_confirmation_response": "send_confirmation_response",  # ← NUEVO: confirmaciones
        "handle_irrelevant_question": "handle_irrelevant_question",
        "send_support_response": "send_support_response",
        "prefetch_exit": "prefetch_exit",
    },
)
workflow.add_edge("moderation_reprompt", "prefetch_exit")
workflow.add_edge("definitions_lookup", "prefetch_exit")
workflow.add_edge(
    "send_confirmation_response", "prefetch_exit"
)  # ← NUEVO: confirmación termina en exit

# 3.5️⃣ Conexión desde summary a retrieve_documents (solo casos relevantes)
workflow.add_edge("generate_question_summary", "retrieve_documents")

# 3️⃣ Clasificación simple / compleja
workflow.add_node("classify_question_complexity", classify_question_complexity)

# 4️⃣ Recuperar documentos
workflow.add_node("retrieve_documents", retrieve_documents)
workflow.add_node("llm_analyzer", llm_analyzer)
workflow.add_node("request_clarification", request_clarification)
workflow.add_edge("retrieve_documents", "llm_analyzer")
workflow.add_conditional_edges(
    "llm_analyzer",
    route_after_analyzer,
    {
        "handle_gray_zone": "handle_gray_zone",
        "request_clarification": "request_clarification",
        "classify_question_complexity": "classify_question_complexity",
    },
)
workflow.add_edge("request_clarification", END)
workflow.add_node("llm_analyzer_2", llm_analyzer_2)
workflow.add_edge("classify_question_complexity", "llm_analyzer_2")

## 5️⃣ Generación SQL
##    • 'generate_sql_query' si is_complex_query == "no"
##    • Ruta compleja: generate_sql_candidates → select_best_sql_candidate → choose_sql_with_llm
workflow.add_node("generate_sql_query", generate_sql_query)
workflow.add_node("generate_sql_candidates", generate_sql_candidates)
workflow.add_node("select_best_sql_candidate", select_best_sql_candidate)
workflow.add_node("choose_sql_with_llm", choose_sql_with_llm)

workflow.add_conditional_edges(
    "llm_analyzer_2",
    route_after_retrieve_documents,
    {
        "generate_sql_query": "generate_sql_query",
        "generate_sql_candidates": "generate_sql_candidates",
    },
)
# ↳ si va por rama compleja:
workflow.add_edge("generate_sql_candidates", "select_best_sql_candidate")
workflow.add_conditional_edges(
    "select_best_sql_candidate",
    route_after_select_best,
    {
        "fetch_data": "fetch_data",
        "choose_sql_with_llm": "choose_sql_with_llm",
    },
)
workflow.add_edge("choose_sql_with_llm", "fetch_data")
# ↳ si va por rama simple:
workflow.add_edge("generate_sql_query", "fetch_data")

# 6️⃣ Ejecución y fallback
workflow.add_node("fetch_data", fetch_data)
workflow.add_conditional_edges(
    "fetch_data",
    handle_fetch_data_outcome,
    {
        "regenerate_query": "regenerate_query",
        "process_user_response": "process_user_response",
        "request_clarification": "request_clarification",
        "handle_gray_zone": "handle_gray_zone",
    },
)
workflow.add_node("regenerate_query", regenerate_query)
# ← PROTECCIÓN ANTI-LOOP: Edge condicional que verifica si se agotaron reintentos
workflow.add_conditional_edges(
    "regenerate_query",
    route_after_regenerate,
    {
        "fetch_data": "fetch_data",
        "prefetch_exit": "prefetch_exit",
    },
)
workflow.add_node("handle_gray_zone", handle_gray_zone)
workflow.add_conditional_edges(
    "handle_gray_zone",
    route_after_gray_zone,
    {
        "request_clarification": "request_clarification",
        "prefetch_exit": "prefetch_exit",
    },
)

# 7️⃣ Post-procesado
workflow.add_node("process_user_response", process_user_response)
workflow.add_node("evaluate_citizen_response", evaluate_citizen_response)
workflow.add_node("compose_frontend_response", compose_frontend_response)
workflow.add_edge("process_user_response", "evaluate_citizen_response")
workflow.add_edge("evaluate_citizen_response", "compose_frontend_response")
workflow.add_conditional_edges(
    "compose_frontend_response",
    route_after_compose,
    {
        "regenerate_query": "regenerate_query",
        END: END,
    },
)

# 8️⃣ Ramas de cierre (irrelevante / social / soporte)
workflow.add_node("handle_irrelevant_question", handle_irrelevant_question)
workflow.add_node("send_greeting", send_greeting)
workflow.add_node("send_support_response", send_support_response)
workflow.add_edge("handle_irrelevant_question", "prefetch_exit")
workflow.add_edge("send_greeting", "prefetch_exit")
workflow.add_edge("send_support_response", "prefetch_exit")
workflow.add_node("prefetch_exit", prefetch_exit)
workflow.add_edge("prefetch_exit", END)

# Compilar el grafo
graph = workflow.compile()
