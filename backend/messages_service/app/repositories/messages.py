from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from ..models.message import File, Chat


class MessageRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def create_chat(self):
        chat = Chat()
        self.postgres.add(chat)
        await self.postgres.commit()
        return chat

    async def upload_file(
            self,
            filename: str,
            file_extension: str,
            user_id: int,
            chat_id: int
    ):
        uploaded_file = File(
            name=filename,
            extension=file_extension,
            user_id=user_id,
            chat_id=chat_id
        )

        self.postgres.add(uploaded_file)
        await self.postgres.commit()

    async def delete_file(
            self,
            file_id: int
    ):
        result = await self.postgres.execute(delete(File).where(File.id == file_id))

        return result

    async def rollback(self):
        await self.postgres.rollback()

    async def commit(self):
        await self.postgres.commit()
