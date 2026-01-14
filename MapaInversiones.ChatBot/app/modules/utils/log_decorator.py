# modules/graph/utils/log_decorator.py
from functools import wraps
from time import perf_counter
from loguru import logger

from modules.config import settings

"""
This script:
- Provides a decorator to log the start and end of function executions, including duration.
"""

TRACE_TERMINAL_NODES = {
    "generate_question_summary",
    "process_user_response",
    "handle_irrelevant_question",
    "send_greeting",
    "send_support_response",
}


def trace_node(name: str):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            state = args[0] if args and isinstance(args[0], dict) else None
            trace_enabled = getattr(settings, "trace_metrics", False)

            logger.info(f"🔵 [NODE-START] {name}")
            start = perf_counter()
            try:
                return fn(*args, **kwargs)
            finally:
                duration_ms = (perf_counter() - start) * 1000
                logger.info(f"🟢 [NODE-END]   {name} ({duration_ms:.2f} ms)")

                if trace_enabled and state is not None:
                    metrics = state.setdefault(
                        "_trace_metrics", {"nodes": [], "tokens": {}}
                    )
                    metrics.setdefault("nodes", []).append(
                        {"node": name, "duration_ms": round(duration_ms, 2)}
                    )

                    if name in TRACE_TERMINAL_NODES and not metrics.get(
                        "summary_logged"
                    ):
                        total = sum(node["duration_ms"] for node in metrics["nodes"])
                        logger.info(
                            "[TRACE] total={total:.2f} ms nodes={nodes} tokens={tokens}",
                            total=total,
                            nodes=metrics["nodes"],
                            tokens=metrics.get("tokens", {}),
                        )
                        metrics["summary_logged"] = True

        return wrapper

    return decorator
