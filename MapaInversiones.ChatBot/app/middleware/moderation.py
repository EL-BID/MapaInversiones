from openai import OpenAI
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from loguru import logger


class OpenAIModerationMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, api_key: str):
        super().__init__(app)
        self.client = OpenAI(api_key=api_key)  # Initialize the client

    async def dispatch(self, request: Request, call_next):
        user_input = request.query_params.get("message")

        if user_input:
            try:
                response = self.client.moderations.create(
                    model="omni-moderation-latest",
                    input=user_input,
                )
                moderation_data = response.results

                if moderation_data and moderation_data[0].flagged:
                    return JSONResponse(
                        {"detail": "Content flagged by moderation."}, status_code=400
                    )

            except Exception as e:
                logger.error(f"Moderation API call failed: {str(e)}")
                return JSONResponse(
                    {"detail": f"Moderation error: {str(e)}"}, status_code=500
                )

        # Proceed with the next middleware or route handler
        response = await call_next(request)
        return response
