from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter

from .api.routers import messages


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        pass
        yield
        pass
    except Exception as e:
        pass
    finally:
        pass

app = FastAPI(
    title="Сервис для работы с переписками",
    version="1.0.0",
    lifespan=lifespan
)

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(messages.router)

app.include_router(v1_router)







