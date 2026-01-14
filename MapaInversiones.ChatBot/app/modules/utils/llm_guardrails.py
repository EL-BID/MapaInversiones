# app/modules/utils/llm_guardrails.py
"""
LLM Guardrails: Unified wrapper for all LLM chain invocations.
Provides:
  - Semaphore-based concurrency control
  - Circuit breaker for consecutive failures (429/5xx)
  - Exponential backoff retries with tenacity
  - Active call tracking for observability
"""
from __future__ import annotations

import random
import threading
import time
from typing import Any, Dict, Optional

from loguru import logger
from tenacity import (
    Retrying,
    retry_if_exception_type,
    stop_after_attempt,
    stop_after_delay,
    wait_exponential,
)

from modules.config import settings

# ═══════════════════════════════════════════════════════════════════════════
# EXCEPTION IMPORTS (with fallbacks for environments without openai/httpx)
# ═══════════════════════════════════════════════════════════════════════════

try:
    from openai import (
        RateLimitError,
        APITimeoutError,
        APIConnectionError,
        InternalServerError,
    )
except Exception:

    class RateLimitError(Exception): ...

    class APITimeoutError(Exception): ...

    class APIConnectionError(Exception): ...

    class InternalServerError(Exception): ...


try:
    from httpx import (
        TimeoutException as HTTPXTimeoutException,
        NetworkError as HTTPXNetworkError,
    )
except Exception:

    class HTTPXTimeoutException(Exception): ...

    class HTTPXNetworkError(Exception): ...


# ═══════════════════════════════════════════════════════════════════════════
# CUSTOM EXCEPTIONS
# ═══════════════════════════════════════════════════════════════════════════


class LLMConcurrencyTimeout(RuntimeError):
    """Raised when no semaphore slot is available within the configured timeout."""


class LLMCircuitOpenError(RuntimeError):
    """Raised when the circuit breaker blocks new LLM calls."""


# ═══════════════════════════════════════════════════════════════════════════
# TRANSIENT ERROR DEFINITIONS
# ═══════════════════════════════════════════════════════════════════════════

_TRANSIENT_ERROR_CANDIDATES: tuple[type[BaseException], ...] = tuple(
    exc
    for exc in (
        RateLimitError,
        APITimeoutError,
        APIConnectionError,
        HTTPXTimeoutException,
        HTTPXNetworkError,
        TimeoutError,
        ConnectionError,
        OSError,
    )
    if isinstance(exc, type) and issubclass(exc, BaseException)
)

if not _TRANSIENT_ERROR_CANDIDATES:
    _TRANSIENT_ERROR_CANDIDATES = (Exception,)

_CIRCUIT_ERROR_CANDIDATES: tuple[type[BaseException], ...] = tuple(
    exc
    for exc in (
        RateLimitError,
        InternalServerError,
    )
    if isinstance(exc, type) and issubclass(exc, BaseException)
)

if not _CIRCUIT_ERROR_CANDIDATES:
    _CIRCUIT_ERROR_CANDIDATES = (Exception,)


# ═══════════════════════════════════════════════════════════════════════════
# CIRCUIT BREAKER
# ═══════════════════════════════════════════════════════════════════════════


class SimpleCircuitBreaker:
    """
    Simple in-process circuit breaker: opens after `fail_max` consecutive errors
    of configured types, stays open for `reset_timeout` seconds.
    """

    def __init__(self, fail_max: int, reset_timeout: int):
        self.fail_max = fail_max
        self.reset_timeout = reset_timeout
        self._lock = threading.Lock()
        self._failures = 0
        self._open_deadline = 0.0

    def _now(self) -> float:
        return time.monotonic()

    def before_call(self, label: str, metadata: Dict[str, Any]) -> None:
        with self._lock:
            if self._open_deadline:
                now = self._now()
                if now < self._open_deadline:
                    remaining = self._open_deadline - now
                    logger.warning(
                        "LLM ▸ CIRCUIT BLOCKED label={} remaining={:.1f}s metadata={}",
                        label,
                        remaining,
                        metadata,
                    )
                    raise LLMCircuitOpenError(
                        "Servicio temporalmente no disponible. Intente más tarde."
                    )
                # Cooldown finished
                self._failures = 0
                self._open_deadline = 0.0

    def record_success(self) -> None:
        with self._lock:
            self._failures = 0
            self._open_deadline = 0.0

    def record_failure(
        self, label: str, metadata: Dict[str, Any], exc: BaseException
    ) -> bool:
        with self._lock:
            opened = False
            self._failures += 1
            if self._failures >= self.fail_max:
                self._open_deadline = self._now() + self.reset_timeout
                opened = True
                logger.error(
                    "LLM ▸ CIRCUIT OPEN label={} cooldown={}s metadata={} last_error={}",
                    label,
                    self.reset_timeout,
                    metadata,
                    type(exc).__name__,
                )
            else:
                logger.warning(
                    "LLM ▸ CIRCUIT failure_count={}/{} label={} metadata={} error={}",
                    self._failures,
                    self.fail_max,
                    label,
                    metadata,
                    type(exc).__name__,
                )
            return opened


# ═══════════════════════════════════════════════════════════════════════════
# SEMAPHORE & POOL TRACKING
# ═══════════════════════════════════════════════════════════════════════════

_LLM_CONCURRENCY_LIMIT = max(1, settings.llm_concurrency_limit)
_LLM_SEMAPHORE = threading.BoundedSemaphore(_LLM_CONCURRENCY_LIMIT)
_SEMAPHORE_TIMEOUT = max(1, settings.llm_semaphore_timeout_seconds)
_WAIT_LOG_THRESHOLD = max(0, settings.llm_semaphore_log_threshold_ms) / 1000.0

# Preventive jitter to avoid thundering herd (0-100ms)
_JITTER_MIN_MS = 0
_JITTER_MAX_MS = 100

# Track current active LLM calls for observability
_active_llm_calls = 0
_active_llm_calls_lock = threading.Lock()


def get_llm_pool_status() -> dict:
    """Return current LLM pool status for monitoring endpoints."""
    with _active_llm_calls_lock:
        return {
            "active_calls": _active_llm_calls,
            "max_concurrent": _LLM_CONCURRENCY_LIMIT,
            "utilization_pct": round(
                100.0 * _active_llm_calls / _LLM_CONCURRENCY_LIMIT, 1
            ),
        }


# ═══════════════════════════════════════════════════════════════════════════
# CIRCUIT BREAKER INSTANCE
# ═══════════════════════════════════════════════════════════════════════════

_breaker = SimpleCircuitBreaker(
    fail_max=max(1, settings.llm_circuit_breaker_fail_max),
    reset_timeout=max(1, settings.llm_circuit_breaker_reset_timeout),
)

logger.info(
    "LLM_GUARDRAILS ▸ Initialized concurrency_limit={} timeout={}s breaker_fail_max={} breaker_reset={}s",
    _LLM_CONCURRENCY_LIMIT,
    _SEMAPHORE_TIMEOUT,
    settings.llm_circuit_breaker_fail_max,
    settings.llm_circuit_breaker_reset_timeout,
)


# ═══════════════════════════════════════════════════════════════════════════
# RETRY LOGIC WITH TENACITY
# ═══════════════════════════════════════════════════════════════════════════


def _log_retry(label: str, metadata: Dict[str, Any], retry_state) -> None:
    exc = retry_state.outcome.exception() if retry_state.outcome else None
    wait_obj = getattr(retry_state.next_action, "sleep", None)
    wait_display = f"{wait_obj:.1f}" if isinstance(wait_obj, (int, float)) else "?"
    logger.warning(
        "LLM ▸ RETRY attempt={} wait={}s label={} metadata={} error={}",
        retry_state.attempt_number,
        wait_display,
        label,
        metadata,
        type(exc).__name__ if exc else "unknown",
    )


def _build_retryer(label: str, metadata: Dict[str, Any]) -> Retrying:
    return Retrying(
        reraise=True,
        stop=stop_after_attempt(max(1, settings.llm_guardrail_retry_attempts))
        | stop_after_delay(max(1, settings.safe_invoke_max_time)),
        wait=wait_exponential(
            multiplier=1,
            min=1,
            max=max(1, settings.llm_retry_backoff_max_seconds),
        ),
        retry=retry_if_exception_type(_TRANSIENT_ERROR_CANDIDATES),
        before_sleep=lambda state: _log_retry(label, metadata, state),
    )


# ═══════════════════════════════════════════════════════════════════════════
# SEMAPHORE ACQUISITION
# ═══════════════════════════════════════════════════════════════════════════


def _acquire_slot(label: str, metadata: Dict[str, Any]) -> float:
    start = time.perf_counter()
    acquired = _LLM_SEMAPHORE.acquire(timeout=_SEMAPHORE_TIMEOUT)
    waited = time.perf_counter() - start
    if not acquired:
        logger.error(
            "LLM ▸ SLOT_TIMEOUT label={} timeout={}s metadata={}",
            label,
            _SEMAPHORE_TIMEOUT,
            metadata,
        )
        raise LLMConcurrencyTimeout(
            "No hay capacidad disponible para procesar la solicitud en este momento."
        )

    if waited >= _WAIT_LOG_THRESHOLD and _WAIT_LOG_THRESHOLD > 0:
        logger.warning(
            "LLM ▸ SLOT wait={:.2f}s limit={} label={} metadata={}",
            waited,
            _LLM_CONCURRENCY_LIMIT,
            label,
            metadata,
        )
    else:
        logger.debug("LLM ▸ slot acquired label={} wait={:.2f}s", label, waited)
    return waited


# ═══════════════════════════════════════════════════════════════════════════
# MAIN ENTRY POINT: invoke_llm_chain
# ═══════════════════════════════════════════════════════════════════════════


def invoke_llm_chain(
    chain,
    params: Dict[str, Any],
    *,
    label: str,
    metadata: Optional[Dict[str, Any]] = None,
) -> Any:
    """
    Execute chain.invoke with full guardrails:
      - Global semaphore to limit concurrency
      - Circuit breaker for consecutive 429/5xx failures
      - Exponential backoff retries (tenacity)
      - Active call tracking for observability

    Args:
        chain: LangChain chain to invoke
        params: Parameters to pass to chain.invoke()
        label: Descriptive label for logging (e.g., "prefetch.complete_question")
        metadata: Optional metadata dict for logging context

    Returns:
        The result of chain.invoke(params)

    Raises:
        LLMConcurrencyTimeout: No semaphore slot available
        LLMCircuitOpenError: Circuit breaker is open
        Other exceptions: Propagated from chain.invoke after retries exhausted
    """
    global _active_llm_calls

    meta = metadata or {}

    # Check circuit breaker first (fast fail if open)
    _breaker.before_call(label, meta)

    # Acquire semaphore slot
    _acquire_slot(label, meta)

    # Track active call
    with _active_llm_calls_lock:
        _active_llm_calls += 1
        current_active = _active_llm_calls

    logger.debug(
        "LLM ▸ CALL_START label={} active={}/{} metadata={}",
        label,
        current_active,
        _LLM_CONCURRENCY_LIMIT,
        meta,
    )

    start_time = time.perf_counter()
    try:
        retryer = _build_retryer(label, meta)

        def _operation() -> Any:
            # Preventive jitter to spread load across time (avoid thundering herd)
            jitter_ms = random.randint(_JITTER_MIN_MS, _JITTER_MAX_MS)
            if jitter_ms > 0:
                time.sleep(jitter_ms / 1000.0)
            return chain.invoke(params)

        result = retryer(_operation)
        _breaker.record_success()

        elapsed = time.perf_counter() - start_time
        logger.debug(
            "LLM ▸ CALL_END label={} elapsed={:.2f}s metadata={}",
            label,
            elapsed,
            meta,
        )
        return result

    except LLMCircuitOpenError:
        raise
    except Exception as exc:
        if isinstance(exc, _CIRCUIT_ERROR_CANDIDATES):
            opened = _breaker.record_failure(label, meta, exc)
            if opened:
                raise LLMCircuitOpenError(
                    "Servicio temporalmente no disponible. Intente más tarde."
                ) from exc
        logger.error(
            "LLM ▸ invoke failed label={} metadata={} error={}",
            label,
            meta,
            exc,
        )
        raise
    finally:
        # Always decrement active calls and release semaphore
        with _active_llm_calls_lock:
            _active_llm_calls -= 1
        try:
            _LLM_SEMAPHORE.release()
        except ValueError:
            logger.error("LLM ▸ release without prior acquire (label={})", label)
