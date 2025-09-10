from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings

settings = get_settings()

class BaseSchema(DeclarativeBase):
    pass

engine = create_async_engine(
    url=settings.postgres_connect,
    echo=False
)

session_maker = async_sessionmaker(
    bind=engine,
    expire_on_commit=False
)