"""
Tracing initialisation with a fail‑safe OTLP exporter.

If the collector (Phoenix) goes down, the exporter disables itself
permanently so background threads never crash the worker.
"""

"""
This script:
- Configures and initializes tracing for the application using OpenTelemetry.
- Implements a safe OTLP exporter with a circuit-breaker to handle network failures gracefully.
- Ensures that tracing continues to function without crashing the application in case of exporter errors.
"""

from phoenix.otel import register
from modules.config import settings

# OpenTelemetry
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace.export import (
    BatchSpanProcessor,
    SpanExporter,
    SpanExportResult,  # public enum for exporter status
)
import phoenix.otel.otel as phx_otel
import logging

# ────────────────────────────────────────────────────────────────
# Tracer provider (Phoenix helper)
# ────────────────────────────────────────────────────────────────
tracer_provider = register(
    project_name="mapa-inversiones-chatbot",
    endpoint=settings.tracing_endpoint,
    batch=True,  # batch export for performance
    verbose=True,  # print configuration banner
)


# ────────────────────────────────────────────────────────────────
# Safe exporter: circuit‑breaker on network failures
# ────────────────────────────────────────────────────────────────
class SafeOTLPExporter(OTLPSpanExporter):
    """OTLP exporter wrapped with a simple circuit‑breaker."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._enabled = True  # can be re‑enabled from outside

    def export(self, spans):  # noqa: D401
        if not self._enabled:
            # Already muted → claim success so upstream keeps running
            return SpanExportResult.SUCCESS
        try:
            return super().export(spans)
        except Exception as exc:
            # First failure → disable permanently and warn
            logging.getLogger(__name__).warning(
                "Tracing disabled after exporter error: %s", exc
            )
            self._enabled = False
            return SpanExportResult.FAILURE


# Register the safe exporter on the global tracer provider
safe_exporter = SafeOTLPExporter(endpoint=settings.tracing_endpoint, timeout=10)
tracer_provider.add_span_processor(BatchSpanProcessor(safe_exporter))

# Ensure *all* Phoenix internal instrumentation also uses the safe exporter
phx_otel.HTTPSpanExporter = SafeOTLPExporter


# ────────────────────────────────────────────────────────────────
# Helper to swap existing exporters at runtime (e.g. on reload)
# ────────────────────────────────────────────────────────────────
def init_tracing():
    """
    Iterate over the span processors created by `phoenix.register`
    and replace their exporters with our SafeOTLPExporter.

    Returns the exporter instance so callers can toggle `._enabled`
    if they need to re‑arm the circuit‑breaker.
    """
    span_proc = getattr(tracer_provider, "_active_span_processor", None)
    if not span_proc or not getattr(span_proc, "_span_processors", None):
        return None

    for proc in span_proc._span_processors:
        if hasattr(proc, "exporter") and not isinstance(
            proc.exporter, SafeOTLPExporter
        ):
            new_exporter = SafeOTLPExporter(
                endpoint=settings.tracing_endpoint, timeout=10
            )
            proc.exporter = new_exporter
            return new_exporter

    return safe_exporter
