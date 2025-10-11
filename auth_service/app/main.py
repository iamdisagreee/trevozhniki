import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

from .api.routers import auths
from .core.rabbitmq_worker import run_consumer


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        consumer_task = asyncio.create_task(run_consumer())
        yield
        consumer_task.cancel()
    except Exception as e:
        pass
    finally:
        pass

app = FastAPI(
    title="Сервис для работы с авторизацией",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auths.router)

app.include_router(v1_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}