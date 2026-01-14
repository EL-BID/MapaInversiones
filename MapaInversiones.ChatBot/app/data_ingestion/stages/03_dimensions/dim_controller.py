from app.data_ingestion.core.orchestrator import ETLOrchestrator
from . import sectores, territorios

# from . import entidades, estados, fuentes # Future migration


def run(orchestrator: ETLOrchestrator, **kwargs):
    # Dimensions Pipeline
    # TODO: Read from config/dimensions.json/yaml to toggle?
    # For now run enabled ones

    sectores.run(orchestrator, **kwargs)
    territorios.run(orchestrator, **kwargs)

    # entidades.run(orchestrator)
    # estados.run(orchestrator)
    # fuentes.run(orchestrator)
