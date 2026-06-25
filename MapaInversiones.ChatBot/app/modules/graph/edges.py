from typing import Literal, Dict, Union
from langgraph.graph import END

from modules.graph.state import AgentState
from modules.config import settings

from loguru import logger

MAX_CLARIFICATION_TURNS = getattr(settings, "max_clarification_turns", 2)
USE_COMPLEXITY_ROUTING = getattr(settings, "enable_complexity_routing", False)

# Import helpers from helpers_estado (consolidated state management)
from modules.graph.helpers_estado import (
    _get_assistance_turn,
    _get_assistance_needed,
    _set_assistance_needed,
    _get_user_assistance,
    _get_assistance_metadata,
    _get_sql_rowcount,
    _get_sql_query,
    _is_sql_retry_exhausted,
)


# Edge functions are used to determine the next node to proceed to based on the current state.
# They are called by the graph runner to decide the next step in the conversation.
# Each edge function takes the current state as input and returns the next node to proceed to.
# The next node can be a graph node or END to terminate the conversation.
# They are like decision nodes in a decision tree. Decision points in the conversation flow are determined by these functions.


def handle_fetch_data_outcome(
    state: AgentState,
) -> Literal[
    "regenerate_query",
    "process_user_response",
    "request_clarification",
    "handle_gray_zone",
]:
    """
    Determines the next step based on the outcome of fetching data from the database.

    Priority order:
      1) If there was an error → regenerate_query
      2) If fallback matched rows (used_fallback) → process_user_response
      3) If gray_zone_reason is present → handle_gray_zone
      4) If 0 rows and clarification is ready (and not yet shown) → request_clarification
      5) Otherwise → process_user_response
    """
    if state.get("fetch_failed"):
        logger.error("FLOW ▸ ROUTE fetch_outcome=error_flag")
        return "regenerate_query"

    last_message = state["messages"][-1]
    if (
        isinstance(getattr(last_message, "content", ""), str)
        and "Error" in last_message.content
    ):
        logger.error("FLOW ▸ ROUTE fetch_outcome=error_heuristic")
        return "regenerate_query"

    # If the fetch_data node performed a relaxed fallback that produced rows,
    # prefer continuing the normal flow with those results.
    if state.get("used_fallback"):
        logger.info(f"FLOW ▸ ROUTE fetch_outcome=fallback_success")
        return "process_user_response"

    rowcount = _get_sql_rowcount(state)

    # If a gray zone reason was explicitly set (e.g., unsupported metric), route to gray handler.
    from modules.graph.helpers_estado import _get_gray_zone_reason

    if _get_gray_zone_reason(state):
        logger.info(f"FLOW ▸ ROUTE fetch_outcome=gray_zone")
        return "handle_gray_zone"

    # For true zero-rows without fallback: optionally ask for a clarification.
    # ═══════════════════════════════════════════════════════════════
    # NEW: Use helpers (with automatic fallback to legacy fields)
    # ═══════════════════════════════════════════════════════════════
    user_assistance = state.get("user_assistance") or {}
    metadata = user_assistance.get("metadata") or {}
    postfetch_ready = metadata.get("postfetch_ready", False)
    postfetch_shown = metadata.get("postfetch_shown", False)

    if rowcount == 0 and postfetch_ready and not postfetch_shown:
        current_turns = _get_assistance_turn(state)  # Uses helper
        if current_turns >= MAX_CLARIFICATION_TURNS:
            logger.info(
                f"FLOW ▸ ROUTE fetch_outcome=clarification_skipped turn={current_turns}/{MAX_CLARIFICATION_TURNS}"
            )
            assistance = _get_user_assistance(state)
            meta = _get_assistance_metadata(state)
            assistance["options"] = []
            meta["postfetch_ready"] = False
            meta["postfetch_shown"] = False
            _set_assistance_needed(state, False)
            state["postfetch_clarification_exhausted"] = True
            state["postfetch_clarification_turns"] = current_turns
        else:
            logger.info(
                f"FLOW ▸ ROUTE fetch_outcome=request_clarification [using helpers]"
            )
            return "request_clarification"

    logger.info(f"FLOW ▸ ROUTE fetch_outcome=process_user_response")
    return "process_user_response"


def route_after_inbox(state: Dict) -> Union[str, END]:
    """
    ╔══════════════════════════════════════════════════════════════════╗
    ║                      ROUTE_AFTER_INBOX                            ║
    ║  Edge function del flujo unificado con inbox_classifier.         ║
    ║  Evolución del antiguo route_after_pii_check: ahora integra      ║
    ║  moderación, cache y la derivación inicial en un solo nodo.      ║
    ╚══════════════════════════════════════════════════════════════════╝

    RESPONSABILIDADES:
    1. Ruteo basado en moderación (recommended_action):
       - "block" → END (contenido prohibido)
       - "reprompt" → END (PII detectado, solicitar reformular)
       - "allow" → continuar con lógica de cache o flujo normal

    2. Ruteo para consultas de definiciones:
       - Si user_question contiene patrones de consulta de conceptos → definitions_lookup

    3. Ruteo basado en cache (si action="allow"):
       - Cache hit reciente → process_user_response (usar respuesta cacheada)
       - Cache hit stale → fetch_data (re-ejecutar query, respuesta desactualizada)
       - No cache → generate_question_summary (flujo normal para consultas relevantes)

    PRIORIDADES:
    1. Moderación (block/reprompt) → END
    2. Support request → send_support_response (ANTES de definitions)
    3. Consulta de definición → definitions_lookup
    4. Cache hit (recent) → process_user_response
    5. Cache hit (stale) → fetch_data
    6. Social/Relevant/Default → generate_question_summary / send_greeting / handle_irrelevant_question según flags

    ENTRADA (lee de state):
    - recommended_action: "allow" | "reprompt" | "block" (desde inbox_classifier)
    - response_type: "moderation_blocked" | "moderation_reprompt" (opcional, legacy)
    - user_question: str (pregunta del usuario)
    - is_cache_hit: bool (hay respuesta en cache)
    - is_recent_cache_hit: bool (cache es reciente, <24h)

    SALIDA:
    - "moderation_reprompt": Nodo que envía mensaje de reformulación
    - END: Terminar conversación (block o reprompt sin nodo dedicado)
    - "definitions_lookup": Buscar concepto/definición en documento
    - "process_user_response": Usar respuesta cacheada
    - "fetch_data": Re-ejecutar query (cache stale)
    - "generate_question_summary": Generar resumen breve antes de retrieve_documents
    - "send_greeting": Saludo (social interaction)
    - "send_support_response": Respuesta de soporte
    - "handle_irrelevant_question": Pregunta irrelevante

    NOTAS:
    - generate_question_summary vive antes de retrieve_documents (ver graph.py) para no gastar embeddings en saludos/soporte.
    - OPTIMIZACIÓN: solo se ejecuta si is_relevant="yes" y evita ~1 LLM call en casos sociales/soporte/definiciones
    - Esto ahorra 1 LLM call en saludos, soporte, definiciones y PII (~30-40% del tráfico)
    - Flags de clasificación (is_relevant, is_social, is_support) ya están en state
    """
    # ▸ 1. Moderación: atender recommended_action de inbox_classifier
    recommended_action = state.get("recommended_action", "allow")

    # Compatibilidad: también revisar response_type (puede venir de check_personal_info legacy)
    resp_type = state.get("response_type")

    # PRIORITY 0: Zona gris explícita (ej.: contratistas no disponibles)
    if str(state.get("gray_zone_reason", "")).upper() == "MISSING_CONTRACTOR_DATA":
        logger.info(
            "FLOW ▸ ROUTE inbox gray_zone_reason=MISSING_CONTRACTOR_DATA → handle_gray_zone"
        )
        return "handle_gray_zone"

    # PRIORITY 1: Block (contenido prohibido)
    if recommended_action == "block" or resp_type == "moderation_blocked":
        logger.info("FLOW ▸ ROUTE inbox action=block → prefetch_exit")
        return "prefetch_exit"

    # PRIORITY 2: Reprompt (PII detectado)
    if recommended_action == "reprompt" or resp_type == "moderation_reprompt":
        logger.info("FLOW ▸ ROUTE inbox action=reprompt → prefetch_exit")
        # inbox_classifier ya agregó SAFE_RESPONSE en messages; prefetch_exit se encarga de devolverlo
        return "prefetch_exit"

    # ▸ 2. Leer flags de clasificación temprano para decidir prioridades
    is_support_request = str(state.get("is_support_request", "no")).lower()
    inbox_def_flag = str(state.get("is_definitions_lookup", "no")).lower()

    # PRIORITY 2: Support request (ANTES que definitions)
    # Razonamiento: Si hay ambigüedad, mejor enviar a support que a definitions
    if is_support_request == "yes":
        logger.info(
            "FLOW ▸ ROUTE inbox support_flag=yes → send_support_response (BEFORE definitions)"
        )
        return "send_support_response"

    # PRIORITY 3: Detectar consultas de definiciones/conceptos
    # CRITICAL: Confiar 100% en el flag del inbox_classifier (prompt-driven, sin heurísticas)
    if inbox_def_flag == "yes":
        logger.info(
            "FLOW ▸ ROUTE inbox definition_flag=yes → definitions_lookup (from inbox_classifier)"
        )
        return "definitions_lookup"

    # ▸ 3. Cache: si action="allow", revisar cache antes de continuar
    is_cache_hit = state.get("is_cache_hit")
    is_recent_cache_hit = state.get("is_recent_cache_hit")

    # PRIORITY 3: Cache hit reciente → usar respuesta cacheada
    if is_cache_hit and is_recent_cache_hit:
        logger.info(f"FLOW ▸ ROUTE inbox cache_hit=recent → process_user_response")
        return "process_user_response"

    # PRIORITY 4: Cache hit stale → re-ejecutar query
    if is_cache_hit and not is_recent_cache_hit:
        logger.info(f"FLOW ▸ ROUTE inbox cache_hit=stale → fetch_data")
        return "fetch_data"

    # ▸ 4. Flujo normal (sin cache ni definiciones ni support): decidir por flags restantes
    is_relevant = str(state.get("is_relevant", "no")).lower()
    is_social_interaction = str(state.get("is_social_interaction", "no")).lower()
    is_confirmation = str(state.get("is_confirmation", "no")).lower()

    logger.info(
        "FLOW ▸ ROUTE inbox default flags relevant={} social={} confirmation={}",
        is_relevant,
        is_social_interaction,
        is_confirmation,
    )

    # PRIORITY 5: Confirmation/Acknowledgment (meta-communication - NO new SQL)
    # El usuario está confirmando algo que el bot dijo, no pidiendo nuevos datos
    if is_confirmation == "yes":
        logger.info("FLOW ▸ ROUTE inbox → send_confirmation_response (no SQL)")
        return "send_confirmation_response"

    # PRIORITY 6: Social interaction (confiar en clasificación LLM)
    # Movido ANTES de reprompt legacy para que "hola" vaya a greeting
    if is_social_interaction == "yes":
        logger.info("FLOW ▸ ROUTE inbox → send_greeting")
        return "send_greeting"

    # PRIORITY 7: Relevant question (SQL flow)
    if is_relevant == "yes":
        # OPTIMIZACIÓN: Generar summary SOLO para casos relevantes (consultas SQL)
        # El summary se usa en retrieve_documents para búsqueda semántica
        logger.info("FLOW ▸ ROUTE inbox → generate_question_summary (optimized)")
        return "generate_question_summary"

    # PRIORITY 8: Reprompt legacy (fallback para casos no clasificados)
    # Movido DESPUÉS de clasificación LLM para no bloquear saludos/soporte
    # Solo se usa si: (1) PII real detectado, o (2) short-circuit de generate_complete_question_v2
    if recommended_action == "reprompt" or resp_type == "moderation_reprompt":
        logger.warning(
            "FLOW ▸ ROUTE inbox → prefetch_exit (fallback: reprompt legacy o PII real)"
        )
        return "prefetch_exit"

    # PRIORITY 9: Default → Irrelevant
    logger.info("FLOW ▸ ROUTE inbox → handle_irrelevant_question")
    return "handle_irrelevant_question"


def route_after_retrieve_documents(state: AgentState) -> str:
    """
    Decide el siguiente paso tras retrieve_documents:
    • Si el flag global USE_COMPLEXITY_ROUTING está desactivado → siempre one-shot
    • Usa is_complex_query para elegir entre multi‑step (generate_sql_candidates) y one-shot
    """
    logger.info(
        f"FLOW ▸ ROUTE after_documents complexity_flag={state.get('is_complex_query')} use_routing={USE_COMPLEXITY_ROUTING}"
    )

    # Ruta de decisión tras retrieve_documents según la complejidad detectada
    # 🔧 Palanca global
    if not USE_COMPLEXITY_ROUTING:
        logger.info("FLOW ▸ ROUTE → generate_sql_query (routing_disabled)")
        return "generate_sql_query"

    if state.get("used_fallback"):
        logger.info("FLOW ▸ ROUTE (Fallback) -> process_user_response")
        return "process_user_response"

    logger.info("FLOW ▸ ROUTE (Regenerate Loop Protection) -> regenerate_query")
    return "regenerate_query"


def route_after_check_cache(
    state: AgentState,
) -> Literal["inbox_classifier", "generate_complete_question_v2"]:
    """
    Decide si saltamos la regeneración de pregunta (LLM) porque ya pegamos en el cache RAW.
    """
    if state.get("is_cache_hit"):
        logger.info("FLOW ▸ ROUTE (Cache Hit) → inbox_classifier")
        return "inbox_classifier"

    logger.info("FLOW ▸ ROUTE (Cache Miss) → generate_complete_question_v2")
    return "generate_complete_question_v2"


# Nuevo ruteo tras select_best_sql_candidate
def route_after_select_best(state: AgentState) -> str:
    """
    Decide si saltar el paso de elección con LLM:
    • fetch_data si select_best_sql_candidate ya decidió y dejó sql_query
    • choose_sql_with_llm en caso contrario
    """
    decided = bool(state.get("best_sql_decided"))
    # Usa helper para soportar el estado consolidado
    has_sql = bool((_get_sql_query(state) or "").strip())

    logger.info(
        f"FLOW ▸ ROUTE after_select_best best_sql_decided={decided} has_sql={has_sql}"
    )

    if decided and has_sql:
        return "fetch_data"
    return "choose_sql_with_llm"


def route_after_analyzer(state: AgentState) -> str:
    """
    Decide si se necesita una aclaración antes de continuar.
    Usa helpers para compatibilidad con nuevo sistema user_assistance.
    """
    from modules.graph.helpers_estado import _get_gray_zone_decision

    decision = _get_gray_zone_decision(state)
    decision_status = decision.get("status")

    # Use helpers (read from new system with fallback to legacy)
    needs_clarification = _get_assistance_needed(state)
    current_turns = _get_assistance_turn(state)

    logger.info(
        "── CLARIFICATION_STATE before route: turn={} needed={}",
        current_turns,
        needs_clarification,
    )
    logger.info(
        "FLOW ▸ ROUTE after_analyzer ▸ status={} needs_clarification={} turn={} max={}",
        decision_status,
        needs_clarification,
        current_turns,
        MAX_CLARIFICATION_TURNS,
    )

    if decision_status == "block":
        logger.info("FLOW ▸ ROUTE → handle_gray_zone (block)")
        return "handle_gray_zone"

    from modules.graph.helpers_estado import _get_gray_zone_reason as get_gz_reason

    gray_zone_reason = get_gz_reason(state)
    if settings.enable_analyzer_gray_zone and gray_zone_reason:
        logger.info(f"FLOW ▸ ROUTE → handle_gray_zone (reason={gray_zone_reason})")
        return "handle_gray_zone"
    if needs_clarification:
        if current_turns >= MAX_CLARIFICATION_TURNS:
            logger.info(
                f"FLOW ▸ ROUTE clarification_skipped turns={current_turns}/{MAX_CLARIFICATION_TURNS}"
            )
            _set_assistance_needed(state, False)  # Updates both systems
        else:
            logger.info(
                "FLOW ▸ ROUTE → request_clarification (pre_fetch) [using helpers]"
            )
            return "request_clarification"
    elif current_turns:
        logger.info(
            "── CLARIFICATION_STATE reset (needs_clarification=False) previous_turn={}",
            current_turns,
        )

    return "classify_question_complexity"


def route_after_gray_zone(state: AgentState) -> Union[str, END]:
    """
    Tras informar al usuario sobre la zona gris, decide si mostrar opciones de clarificación.
    Usa helpers para compatibilidad con nuevo sistema user_assistance.
    """
    # ═══════════════════════════════════════════════════════════════
    # NEW: Use helpers and user_assistance (with fallback to legacy)
    # ═══════════════════════════════════════════════════════════════
    postfetch_ready = False
    postfetch_shown = False

    user_assistance = state.get("user_assistance") or {}
    metadata = user_assistance.get("metadata") or {}
    postfetch_ready = metadata.get("postfetch_ready", False)
    postfetch_shown = metadata.get("postfetch_shown", False)

    if postfetch_ready and not postfetch_shown:
        current_turns = _get_assistance_turn(state)  # Uses helper
        if current_turns >= MAX_CLARIFICATION_TURNS:
            logger.info(
                f"FLOW ▸ ROUTE gray_zone clarification_skipped turns={current_turns}/{MAX_CLARIFICATION_TURNS} [using helpers]"
            )
            assistance = _get_user_assistance(state)
            metadata = _get_assistance_metadata(state)
            assistance["options"] = []
            metadata["postfetch_ready"] = False
            metadata["postfetch_shown"] = False
            _set_assistance_needed(state, False)
        else:
            logger.info(
                "FLOW ▸ ROUTE gray_zone → request_clarification [using helpers]"
            )
            return "request_clarification"

    logger.info("FLOW ▸ ROUTE gray_zone → prefetch_exit")
    return "prefetch_exit"


def route_after_compose(state: AgentState) -> Union[Literal["regenerate_query"], END]:
    """
    Rutea después de compose_frontend_response para manejar reintentos
    cuando todas las filas fueron filtradas como irrelevantes.

    Si pending_irrelevant_retry=True y irrelevant_retry_count==0,
    desvía a regenerate_query para reintentar con filtros ajustados.
    """
    from modules.graph.helpers_estado import (
        _get_pending_irrelevant_retry,
        _get_irrelevant_retry_count,
        _set_pending_irrelevant_retry,
        _increment_irrelevant_retry_count,
    )

    pending_retry = _get_pending_irrelevant_retry(state)
    retry_count = _get_irrelevant_retry_count(state)

    if pending_retry and retry_count == 0:
        logger.info(
            f"FLOW ▸ ROUTE after_compose pending_retry=True retry_count={retry_count} → regenerate_query"
        )
        # Incrementar contador y limpiar flag
        _increment_irrelevant_retry_count(state)
        _set_pending_irrelevant_retry(state, False)
        return "regenerate_query"

    logger.info(
        f"FLOW ▸ ROUTE after_compose pending_retry={pending_retry} retry_count={retry_count} → END"
    )
    return END


def route_after_regenerate(
    state: AgentState,
) -> Union[Literal["fetch_data", "prefetch_exit"], END]:
    """
    ╔══════════════════════════════════════════════════════════════════╗
    ║               ROUTE_AFTER_REGENERATE                              ║
    ║  Protección anti-loop: verifica si los reintentos SQL se agotaron ║
    ║  ANTES de volver a ejecutar fetch_data.                          ║
    ╚══════════════════════════════════════════════════════════════════╝

    RESPONSABILIDADES:
    1. Si stop_processing=True o response_type=error_max_retries → prefetch_exit
    2. Si reintentos SQL agotados → prefetch_exit (doble check de seguridad)
    3. Caso normal → fetch_data (continuar el flujo)

    ENTRADA:
    - state["stop_processing"]: bool (si regenerate_query agotó reintentos)
    - state["response_type"]: str (si es "error_max_retries")

    SALIDA:
    - "prefetch_exit": Terminar el flujo con mensaje de error
    - "fetch_data": Continuar con la SQL regenerada
    """
    # Check 1: regenerate_query ya marcó stop_processing
    if state.get("stop_processing"):
        logger.info(
            "FLOW ▸ ROUTE after_regenerate stop_processing=True → prefetch_exit"
        )
        return "prefetch_exit"

    # Check 2: response_type indica que se agotaron reintentos
    if state.get("response_type") == "error_max_retries":
        logger.info(
            "FLOW ▸ ROUTE after_regenerate response_type=error_max_retries → prefetch_exit"
        )
        return "prefetch_exit"

    # Check 3: Doble seguridad - verificar directamente si los reintentos están agotados
    if _is_sql_retry_exhausted(state):
        logger.warning(
            "FLOW ▸ ROUTE after_regenerate sql_retry_exhausted=True → prefetch_exit (safety check)"
        )
        return "prefetch_exit"

    # Caso normal: continuar a fetch_data
    logger.info("FLOW ▸ ROUTE after_regenerate → fetch_data")
    return "fetch_data"
