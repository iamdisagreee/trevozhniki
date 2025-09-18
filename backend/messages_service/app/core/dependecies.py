from fastapi import Depends, Header, HTTPException, status, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from .rabbitmq import rabbitmq_validator_instance, RabbitMQValidator
from ..repositories.messages import MessageRepository
from ..services.messages import MessageService
from ..core.s3 import s3_client, S3Client
from ..core.postgres import session_maker
from ..core.giga import giga_chat, GigaChatClient

security = HTTPBearer()

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

def get_rabbitmq_validator():
    return rabbitmq_validator_instance

def get_message_service(
        s3: S3Client = Depends(get_s3),
        msg_repo: MessageRepository = Depends(get_message_repository),
        giga: GigaChatClient = Depends(get_gigachat),
        # rabbitmq: RabbitMQValidator = Depends(get_rabbitmq_validator)
) -> MessageService:
    return MessageService(
        s3=s3,
        msg_repo=msg_repo,
        giga=giga,
        # rabbitmq=rabbitmq
    )

async def get_current_user(
        credentials: HTTPAuthorizationCredentials = Security(security),
        rabbitmq: RabbitMQValidator = Depends(get_rabbitmq_validator)
):
    return await rabbitmq.jwt_validate(token=credentials.credentials)