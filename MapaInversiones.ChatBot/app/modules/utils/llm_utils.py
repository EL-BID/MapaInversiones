from dotenv import load_dotenv
from modules.config import settings

from langchain_openai import ChatOpenAI, AzureChatOpenAI
from loguru import logger

load_dotenv()

"""
This script:
- Configures and initializes different language models (LLMs) for use in the application.
- Supports both OpenAI and Azure OpenAI models.
- Models are set with specific parameters like temperature and streaming options.
"""

# define unique models based on types:
# (to new file with unique model construction)

# Timeout y retries desde settings (configurable via .env)
LLM_REQUEST_TIMEOUT = settings.llm_request_timeout  # default 60s
LLM_MAX_RETRIES = settings.llm_max_retries  # default 2

model_oai = ChatOpenAI(
    temperature=0.0,
    model=settings.openai_model_mini,
    streaming=False,
    api_key=settings.openai_api_key,
    request_timeout=LLM_REQUEST_TIMEOUT,
    max_retries=LLM_MAX_RETRIES,
)

"""
# OLD
model_az_4mini = AzureChatOpenAI(
    model=settings.azure_openai_chat_deployment_name_4mini_model,
    temperature=0.0,
    streaming=False,
    openai_api_version=settings.azure_openai_api_version,
    azure_deployment=settings.azure_openai_chat_deployment_name_4mini,
)
"""

# 🔹 Definir el modelo Azure GPT-4o Mini
model_az_4mini = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_4mini,
    openai_api_version=settings.azure_openai_api_version,
    temperature=0.0,
    streaming=False,
    request_timeout=LLM_REQUEST_TIMEOUT,
    max_retries=LLM_MAX_RETRIES,
)

model_az_4 = AzureChatOpenAI(
    model=settings.azure_openai_chat_deployment_name_4_model,
    temperature=0.0,
    streaming=False,
    openai_api_version=settings.azure_openai_api_version,
    azure_deployment=settings.azure_openai_chat_deployment_name_4,
    request_timeout=LLM_REQUEST_TIMEOUT,
    max_retries=LLM_MAX_RETRIES,
)

# 🔹 Definir el modelo Azure GPT-4.1 Mini
model_az_41mini = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_41mini,
    openai_api_version=settings.azure_openai_api_version_41mini,
    temperature=0.0,
    streaming=False,
    request_timeout=LLM_REQUEST_TIMEOUT,
    max_retries=LLM_MAX_RETRIES,
)

# 🔹 Definir el modelo Azure GPT-5 Mini (o1-mini)
model_az_5mini = AzureChatOpenAI(
    azure_endpoint=settings.azure_openai_endpoint,
    azure_deployment=settings.azure_openai_chat_deployment_name_5,
    openai_api_version=settings.azure_openai_api_version_5,
    temperature=1.0,
    streaming=False,
    request_timeout=LLM_REQUEST_TIMEOUT,
    max_retries=LLM_MAX_RETRIES,
)


def get_model(
    schema=None,
    *,
    mini: bool = True,
    family: str = "control",
    effort: str | None = None,
    verbosity: str | None = None,
    seed: int | None = None,
):
    """
    Selecciona el LLM adecuado según la familia solicitada.

    - family="control": modelos deterministas (GPT-4.1 mini / GPT-4).
      honouramos `mini` para decidir el tamaño.
    - family="reasoning": GPT-5 mini con parámetros de reasoning.
    """

    if settings.cloud_selector != "AZURE":
        base_model = model_oai
    else:
        if family == "reasoning":
            # GPT-5 mini only accepts temperature=1.0; reasoning knobs not yet supported by this client.
            base_model = AzureChatOpenAI(
                azure_endpoint=settings.azure_openai_endpoint,
                azure_deployment=settings.azure_openai_chat_deployment_name_5,
                openai_api_version=settings.azure_openai_api_version_5,
                temperature=1.0,
                streaming=False,
                request_timeout=LLM_REQUEST_TIMEOUT,
                max_retries=LLM_MAX_RETRIES,
            )
        else:
            base_model = model_az_41mini if mini else model_az_4

    logger.info(
        f"LLM ▸ family={family} mini={mini} effort={effort} verbosity={verbosity} seed={seed} schema={bool(schema)}"
    )

    if schema:
        try:
            return base_model.with_structured_output(schema, strict=True)
        except TypeError:
            logger.warning(
                "LLM ▸ structured_output strict=True unsupported; falling back to default schema enforcement."
            )
            return base_model.with_structured_output(schema)
    return base_model
