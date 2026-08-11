from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.core.config import get_settings


settings = get_settings()

#线上环境echo需要关闭
engine = create_async_engine(settings.database_url, echo=True)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    """Base class every ORM model inherits from."""

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency that yields a request-scoped DB session."""
    async with AsyncSessionLocal() as session:
        yield session
