"""Entry point for the AstraTickets FastAPI service."""
from fastapi import FastAPI

from app.core.config import get_settings
from app.api.users import router as users_router
from app.api.tickets import router as tickets_router
from app.api.replies import router as replies_router

settings = get_settings()

app = FastAPI(title=settings.app_name)
# users router
app.include_router(users_router)
# tickets router
app.include_router(tickets_router)
# replies router
app.include_router(replies_router)



@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:

    return {"status": "ok", "environment": settings.environment}

