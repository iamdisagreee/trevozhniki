from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select
from sqlalchemy.orm import selectinload

from ..models.message import File, Chat


class MessageRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def create_chat(
            self,
            name: str,
            user_id: int,
    ):
        chat = Chat(
            name=name,
            user_id=user_id,
        )
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

        return uploaded_file



    async def all_chats(
            self,
            user_id: int
    ):
        return await self.postgres.scalars(
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(Chat.created_at)
        )

    async def get_chat_by_id(
            self,
            chat_id: int
    ):
        return await self.postgres.scalar(
            select(Chat)
            .where(Chat.id == chat_id)
            .options(selectinload(Chat.files))
        )

    async def delete_chat(
            self,
            chat_id: int
    ):
        result = await self.postgres.execute(delete(Chat).where(Chat.id == chat_id))
        await self.postgres.commit()
        return result

    async def delete_file(
            self,
            file_id: int
    ):
        return await self.postgres.execute(delete(File).where(File.id == file_id))

    async def rollback(self):
        await self.postgres.rollback()

    async def commit(self):
        await self.postgres.commit()
