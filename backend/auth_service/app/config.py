from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    s3_access_key: Optional[str] = None
    s3_secret_key: Optional[str] = None
    s3_endpoint_url: Optional[str] = None
    s3_bucket_name: Optional[str] = None
    postgres_connect: Optional[str] = None
    gigachat_client_id: Optional[str] = None
    gigachat_client_secret: Optional[str] = None
    gigachat_authorization_key : Optional[str] = None

    model_config = SettingsConfigDict(
        env_file ='app/.env',
        env_file_encoding='utf-8',
        extra='ignore'
    )


@lru_cache()
def get_settings():
    return Settings()
