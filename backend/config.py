from dataclasses import dataclass

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
# @dataclass
# class Mail:
#     mail_user: str
#     mail_password: str
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
