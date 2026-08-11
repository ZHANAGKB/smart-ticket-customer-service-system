"""Run this once to create all tables defined in app/db/models.py."""
import asyncio

from app.db import models  # noqa: F401
from app.db.session import Base, engine

async def create_tables() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created.")

if __name__ == "__main__":
    asyncio.run(create_tables())
