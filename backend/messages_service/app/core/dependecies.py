from app.services.messages import MessageService
from app.core.s3 import s3_client, S3Client
from fastapi import Depends

from app.core.postgres import session_maker
from sqlalchemy.ext.asyncio import AsyncSession



async def get_postgres():
    async with session_maker() as session:
        yield session

def get_s3():
    yield s3_client

def get_message_service(
        s3: S3Client = Depends(get_s3)
):
    return MessageService(s3=s3)
