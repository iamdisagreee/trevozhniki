from fastapi import FastAPI
from users import views as users

app = FastAPI(
    title="Trevozhniki API",
    description="API для системы анализа переписок",
    version="1.0.0"
)

app.include_router(users.router, prefix="/api/v1")


