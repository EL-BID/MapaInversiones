from app.data_ingestion.core.orchestrator import ETLOrchestrator
from . import countries, tables, columns, relations

# values? (assuming skipping values for now or implemented later)


def run(orchestrator: ETLOrchestrator, **kwargs):
    # Metadata Pipeline
    countries.run(orchestrator, **kwargs)
    tables.run(orchestrator, **kwargs)
    columns.run(orchestrator, **kwargs)
    relations.run(orchestrator, **kwargs)
    # values.run(orchestrator, **kwargs)
