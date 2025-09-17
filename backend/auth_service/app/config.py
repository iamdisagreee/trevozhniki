from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    postgres_connect: Optional[str] = None
    jwt_secret_key: Optional[str] = None
    jwt_algorithm: Optional[str] = None
    access_token_expire_minutes: Optional[int] = None
    refresh_token_expire_days: Optional[int] = None
    mail_user: Optional[str] = None
    mail_password: Optional[str] = None
    redis_connect: Optional[str] = None
    model_config = SettingsConfigDict(
        env_file ='app/.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )


@lru_cache()
def get_settings():
    return Settings()
