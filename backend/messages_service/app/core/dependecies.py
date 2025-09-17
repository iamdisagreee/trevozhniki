from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from .rabbitmq import jwt_validator_instance
from ..repositories.messages import MessageRepository
from ..services.messages import MessageService
from ..core.s3 import s3_client, S3Client
from ..core.postgres import session_maker
from ..core.giga import giga_chat, GigaChatClient




async def get_postgres() -> AsyncSession:
    async with session_maker() as session:
        yield session

def get_message_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> MessageRepository:
    return MessageRepository(postgres=postgres)

def get_s3() -> S3Client:
    return s3_client

def get_gigachat() -> GigaChatClient:
    return giga_chat

def get_message_service(
        s3: S3Client = Depends(get_s3),
        msg_repo: MessageRepository = Depends(get_message_repository),
        giga: GigaChatClient = Depends(get_gigachat)
) -> MessageService:
    return MessageService(
        s3=s3,
        msg_repo=msg_repo,
        giga=giga
    )

def get_jwt_validator_instance():
    return jwt_validator_instance