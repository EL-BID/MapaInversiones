from fastapi import Request, Header, HTTPException, status
from fastapi import Request, Header, HTTPException, status, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import PlainTextResponse
from modules.config import settings

# 10MB limit
MAX_REQUEST_SIZE = 10 * 1024 * 1024

DEFAULT_ALLOWED_REFERRERS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost",
]


async def verify_public_client(
    request: Request, x_api_key: str = Header(None, alias="X-API-Key")
):

    if not settings.require_frontend_api_key:
        return

    if not settings.frontend_api_key or x_api_key != settings.frontend_api_key:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Invalid or missing API key"
        )

    if settings.enforce_frontend_referrer:
        referrer = request.headers.get("referer", "")
        origin = request.headers.get("origin", "")
        allowed = settings.parsed_frontend_referrers or DEFAULT_ALLOWED_REFERRERS

        if not any(
            allowed_ref
            for allowed_ref in allowed
            if allowed_ref and (allowed_ref in referrer or allowed_ref in origin)
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Invalid referrer or origin",
            )


class SecurityMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        # --- 1. Block Bad User-Agents (Pareto: Low effort, medium impact) ---
        user_agent = request.headers.get("user-agent", "").lower()
        blocked_agents = [
            "sqlmap",
            "nikto",
            "dirbuster",
            "gobuster",
            "wpscan",
            "nessus",
            "acunetix",
            "netsparker",
            "openvas",
        ]
        if any(agent in user_agent for agent in blocked_agents):
            return PlainTextResponse("Forbidden", status_code=403)

        # --- 2. Request Size Limiting (Pareto: Low effort, prevents DoS) ---
        content_length = request.headers.get("content-length")
        if content_length:
            try:
                if int(content_length) > MAX_REQUEST_SIZE:
                    return PlainTextResponse("Payload Too Large", status_code=413)
            except ValueError:
                pass  # If invalid header, let it slide or block? Let's ignore.

        # --- 3. Block directory traversal attempts ---
        if "../" in path or "..\\" in path:
            return PlainTextResponse("Not Found", status_code=404)

        # --- 4. Block common vulnerability scanning patterns ---
        # We can expand this list as we see more attempts in logs
        blocked_substrings = [
            "/cgi-bin/",
            ".php",
            ".env",
            ".git/",
            "/actuator/",
            "/setup.cgi",
            ".aws/",
            "wp-admin",
            "wp-login",
            "composer.json",
            "composer.lock",
            "package.json",
            "package-lock.json",
        ]

        for bad in blocked_substrings:
            if bad in path:
                return PlainTextResponse("Not Found", status_code=404)

        response = await call_next(request)

        # --- 5. Security Headers (Pareto: Low effort, high protection) ---
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"

        return response
