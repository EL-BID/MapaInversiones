from app.data_ingestion.core.orchestrator import ETLOrchestrator
from . import documents


def run(orchestrator: ETLOrchestrator, **kwargs):
    # Publish Pipeline
    documents.run(orchestrator, **kwargs)
