#!/usr/bin/env python3
import sys
import argparse
from loguru import logger
from pathlib import Path

# Add project root to sys.path to allow imports from app.modules, etc.
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(PROJECT_ROOT))

# Setup Logger
logger.remove()
logger.add(sys.stderr, level="INFO")
logger.add("logs/etl.log", rotation="10 MB", retention="7 days", level="DEBUG")

from app.data_ingestion.core.orchestrator import ETLOrchestrator


def cmd_test_connections(args):
    orchestrator = ETLOrchestrator()
    orchestrator.test_connections()


def cmd_ingest(args):
    orchestrator = ETLOrchestrator()
    # Import Stage 01 dynamically via run_stage or call directly?
    # run_stage abstraction is better
    orchestrator.run_stage("01_ingest", source_id=args.source_id, dry_run=args.dry_run)


def cmd_run_batch(args):
    orchestrator = ETLOrchestrator()
    logger.info(f"🚀 Batch Run started. Country: {args.country}, Force: {args.force}")

    stages = ["01_ingest", "02_refine", "03_dimensions", "04_knowledge", "05_publish"]
    for stage in stages:
        orchestrator.run_stage(stage, country=args.country, force=args.force)


def cmd_run_stage(args):
    orchestrator = ETLOrchestrator()
    orchestrator.run_stage(args.stage_name)  # args can be passed


def main():
    parser = argparse.ArgumentParser(description="Mapabot ETL Manager 3000")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # test-connections
    subparsers.add_parser("test-connections", help="Test DB connections")

    # ingest
    parser_ingest = subparsers.add_parser("ingest", help="Run Stage 01: Ingestion")
    parser_ingest.add_argument("--source-id", help="Specific source ID to ingest")
    parser_ingest.add_argument(
        "--dry-run", action="store_true", help="Simulate without writing"
    )

    # run-batch
    parser_batch = subparsers.add_parser("run-batch", help="Run Full ETL Batch")
    parser_batch.add_argument("--country", default="dom", help="ISO3 Country code")
    parser_batch.add_argument(
        "--force", action="store_true", help="Force refresh even if data is current"
    )

    # run-stage
    parser_stage = subparsers.add_parser("run-stage", help="Run a specific stage")
    parser_stage.add_argument(
        "stage_name",
        choices=[
            "01_ingest",
            "02_refine",
            "03_dimensions",
            "04_knowledge",
            "05_publish",
        ],
    )

    args = parser.parse_args()

    if args.command == "test-connections":
        cmd_test_connections(args)
    elif args.command == "ingest":
        cmd_ingest(args)
    elif args.command == "run-batch":
        cmd_run_batch(args)
    elif args.command == "run-stage":
        cmd_run_stage(args)


if __name__ == "__main__":
    main()
