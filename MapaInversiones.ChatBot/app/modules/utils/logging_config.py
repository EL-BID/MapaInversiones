from loguru import logger
import sys
import logging
from pathlib import Path
from modules.config import settings

"""
This script:
- Configures and initializes logging for the application using loguru.
- Sets different log levels based on the environment (development or production).
- Logs are written to both console and rotating log files with appropriate formatting.
"""


def setup_logging():
    # Remove default handlers to prevent duplication
    logger.remove()

    # Determine environment
    env = settings.env

    # Set log level: priority is settings.log_level > env-based default
    # LOG_LEVEL in .env: DEBUG, INFO, WARNING, ERROR, CRITICAL
    if settings.log_level and settings.log_level.upper() in {
        "DEBUG",
        "INFO",
        "WARNING",
        "ERROR",
        "CRITICAL",
    }:
        log_level = settings.log_level.upper()
    elif env == "development":
        log_level = "DEBUG"
    else:
        log_level = "WARNING"

    # Ensure log directory exists
    log_dir = Path("logs")
    log_dir.mkdir(parents=True, exist_ok=True)

    # Define log file with environment name
    log_file = log_dir / f"chatbot_{env}.log"

    # Add file handler with rotation
    logger.add(
        log_file,
        level=log_level,
        rotation="5 MB",
        retention="10 days",
        compression="zip",
        format="{time:YYYY-MM-DD HH:mm:ss} - {level} - {message}",
        enqueue=True,
    )

    # Add console handler with color
    logger.add(
        sys.stdout,
        level=log_level,
        format="<level>{level: <8}</level> - {message}",
        colorize=True,
    )

    # Intercept standard logging and redirect to loguru
    class InterceptHandler(logging.Handler):
        def emit(self, record):
            # Get corresponding loguru level
            try:
                level = logger.level(record.levelname).name
            except ValueError:
                level = record.levelno

            # Find the caller frame
            frame, depth = logging.currentframe(), 2
            while frame and frame.f_code.co_filename == logging.__file__:
                frame = frame.f_back
                depth += 1

            # Log the message with loguru
            logger.opt(depth=depth, exception=record.exc_info).log(
                level, record.getMessage()
            )

    # Set up standard logging to use InterceptHandler
    logging.basicConfig(handlers=[InterceptHandler()], level=0)

    # Redirect specific loggers if needed
    logging.getLogger("uvicorn.access").handlers = [InterceptHandler()]
    logging.getLogger("uvicorn.error").handlers = [InterceptHandler()]

    # Silence overly verbose third-party debug logs (httpx/openai) in development
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("openai").setLevel(logging.INFO)
