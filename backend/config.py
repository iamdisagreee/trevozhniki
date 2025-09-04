from dataclasses import dataclass
from functools import lru_cache

from environs import Env


# @dataclass
# class Site:
#     postgres: str
#     redis: str
#
# @dataclass
# class JwtAuth:
#     secret_key: str
#     algorithm: str
#

@dataclass
class GigaChat:
    client_id: str
    client_secret: str

@dataclass
class Config:
    giga_chat: GigaChat
    # site: Site
    # jwt_auth: JwtAuth
    # mail: Mail


def load_config():
    env = Env()
    env.read_env()
    return Config(
        giga_chat=GigaChat(
            client_id=env("CLIENT_ID"),
            client_secret=env("CLIENT_SECRET")
        )
    )


from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    gigachat_client_id: str = '123'
    gigachat_client_secret: str = '123'

    model_config = SettingsConfigDict(
        env_file = '.env',
        env_file_encoding='utf-8'
    )

@lru_cache()
def get_settings():
    print("Загрузка настроек...")
    return Settings()