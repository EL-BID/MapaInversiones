from __future__ import annotations

import random
import time
from contextlib import contextmanager
from threading import Lock, Semaphore

from loguru import logger

from modules.config import settings


# ═══════════════════════════════════════════════════════════════════════════
# ADAPTIVE THROTTLE - Only activates when Azure returns 429
# In normal operation: zero latency added
# When throttled: limits concurrency, adds jitter delay between calls
# ═══════════════════════════════════════════════════════════════════════════


class AdaptiveThrottle:
    """
    Adaptive rate limiter that activates only when rate limits are hit.

    Normal mode: all calls pass through immediately
    Throttled mode:
        - Limits concurrent calls to throttle_concurrency
        - Adds jitter delay before each call
        - Auto-recovers after throttle_duration_seconds
    """

    def __init__(
        self,
        throttle_duration_seconds: float = 30.0,
        throttle_concurrency: int = 3,
        jitter_min: float = 0.5,
        jitter_max: float = 2.0,
    ):
        self._lock = Lock()
        self._throttled = False
        self._throttle_until = 0.0
        self._throttle_semaphore = Semaphore(throttle_concurrency)
        self._throttle_concurrency = throttle_concurrency
        self._throttle_duration = throttle_duration_seconds
        self._jitter_min = jitter_min
        self._jitter_max = jitter_max
        self._429_count = 0

    def activate(self, duration_override: float | None = None):
        """Activate throttle mode after receiving a 429."""
        with self._lock:
            duration = duration_override or self._throttle_duration
            self._throttled = True
            self._throttle_until = time.time() + duration
            self._429_count += 1
            logger.warning(
                "THROTTLE ▸ ACTIVATED duration={}s concurrent_limit={} total_429s={}",
                duration,
                self._throttle_concurrency,
                self._429_count,
            )

    def is_throttled(self) -> bool:
        """Check if currently in throttle mode."""
        with self._lock:
            if self._throttled:
                if time.time() >= self._throttle_until:
                    self._throttled = False
                    logger.info("THROTTLE ▸ RECOVERED back to normal mode")
                    return False
                return True
            return False

    @contextmanager
    def rate_limit(self):
        """
        Context manager to apply rate limiting.
        In normal mode: immediate pass-through
        In throttle mode: acquire semaphore + jitter delay
        """
        if not self.is_throttled():
            yield 0.0  # No delay in normal mode
            return

        # Throttle mode: apply limits
        jitter_delay = random.uniform(self._jitter_min, self._jitter_max)
        logger.info("THROTTLE ▸ WAITING jitter={:.2f}s", jitter_delay)
        time.sleep(jitter_delay)

        # Acquire throttle semaphore (only N concurrent in throttle mode)
        acquired = self._throttle_semaphore.acquire(timeout=30.0)
        if not acquired:
            logger.warning("THROTTLE ▸ SEMAPHORE timeout after 30s")
            yield jitter_delay
            return

        try:
            yield jitter_delay
        finally:
            self._throttle_semaphore.release()

    def get_stats(self) -> dict:
        """Return current throttle stats for logging."""
        return {
            "throttled": self._throttled,
            "throttle_until": self._throttle_until,
            "429_count": self._429_count,
        }


# Global adaptive throttle instance
adaptive_throttle = AdaptiveThrottle(
    throttle_duration_seconds=30.0,  # 30 seconds of throttle after 429
    throttle_concurrency=3,  # Max 3 concurrent in throttle mode
    jitter_min=0.5,
    jitter_max=2.0,
)


class LLMQueueTimeout(Exception):
    """Raised when the global LLM concurrency gate cannot acquire a slot in time."""


class _LLMConcurrencyGate:
    def __init__(self, max_concurrency: int):
        capacity = max(1, int(max_concurrency or 1))
        self._semaphore = Semaphore(capacity)
        self._capacity = capacity

    @contextmanager
    def slot(self, *, timeout_seconds: float):
        start = time.perf_counter()
        acquired = self._semaphore.acquire(timeout=timeout_seconds)
        wait_ms = (time.perf_counter() - start) * 1000.0
        if not acquired:
            raise LLMQueueTimeout(
                f"Timed out waiting {timeout_seconds}s for an LLM slot"
            )

        try:
            yield wait_ms
        finally:
            self._semaphore.release()


_gate = _LLMConcurrencyGate(settings.llm_max_concurrency)


@contextmanager
def llm_concurrency_slot(timeout_seconds: float):
    """
    Context manager that blocks when there are more than `llm_max_concurrency`
    requests executing the LLM pipeline simultaneously.
    """
    with _gate.slot(timeout_seconds=timeout_seconds) as wait_ms:
        if wait_ms >= 1000:
            logger.warning("LLM ▸ semaphore wait={:.0f} ms", wait_ms)
        else:
            logger.debug("LLM ▸ semaphore wait={:.0f} ms", wait_ms)
        yield wait_ms
