from app.data_ingestion.core.orchestrator import ETLOrchestrator
from . import validator, embeddings


def run(orchestrator: ETLOrchestrator, **kwargs):
    # Knowledge Pipeline
    validator.run(orchestrator, **kwargs)
    embeddings.run(orchestrator, **kwargs)
