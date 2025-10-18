from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.routers import messages
from .core.rabbitmq import rabbitmq_validator_instance


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await rabbitmq_validator_instance.connect()
        yield
       # await rabbitmq_validator_instance.close()
    except Exception as e:
        pass
    finally:
        pass

app = FastAPI(
    title="Сервис для работы с переписками",
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

app.mount('/', StaticFiles(directory='frontend'))

v1_router = APIRouter(prefix="/api/v1")

v1_router.include_router(messages.router)

app.include_router(v1_router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}







