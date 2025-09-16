from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter

from .api.routers import auths

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
    title="Сервис для работы с авторизацией",
    version="1.0.0",
    lifespan=lifespan
)

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(auths.router)

app.include_router(v1_router)


@app.get("/health")
async def health_check():
    return {"status": "healthy"}