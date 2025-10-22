from http.cookiejar import user_domain_match

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, select, update, desc, asc, func
from sqlalchemy.orm import selectinload
from sqlalchemy.dialects.postgresql import insert



from ..models.message import File, Chat, FileState


class MessageRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def create_chat(
            self,
            name: str,
            interlocutor: str,
            user_id: int,
    ):
        chat = Chat(
            name=name,
            interlocutor=interlocutor,
            user_id=user_id,
        )
        self.postgres.add(chat)
        await self.postgres.commit()
        return chat

    async def create_file_state(
            self,
            user_id: int,
            chat_id: int
    ):
        await self.postgres.execute(
            insert(FileState)
            .values(user_id=user_id, chat_id=chat_id + 1)
            .on_conflict_do_update(index_elements=[FileState.user_id],
                                   set_={'chat_id': chat_id + 1})
        )
        await self.postgres.commit()

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

    async def get_all_chats(
            self,
            user_id: int
    ):
        return await self.postgres.scalars(
            select(Chat)
            .where(Chat.user_id == user_id)
            .order_by(Chat.created_at)
        )

    async def get_chats_by_line(
            self,
            line: str,
            user_id: int
    ):
        return await self.postgres.scalars(
            select(Chat)
            .where(Chat.interlocutor.ilike(f"%{line}%"), Chat.user_id == user_id)
            .order_by(desc(Chat.created_at))
        )

    async def get_limit_chats(
            self,
            user_id: int
    ):
        subquery = (
            select(FileState.last_loaded_id)
            .where(FileState.user_id == user_id)
            .scalar_subquery()
        )

        result = await self.postgres.scalars(
            select(Chat)
            .where(Chat.user_id == user_id, Chat.id < subquery)
            .limit(12)
            .order_by(desc(Chat.created_at))
        )

        return result.all()

    async def update_last_chat_id(
            self,
            user_id: int
    ):
        subquery = (
            select(func.max(Chat.id))
            .where(Chat.user_id == user_id)
            .scalar_subquery()
        )
        # print(subquery + 1)
        await self.postgres.execute(
            update(FileState)
            .values(last_loaded_id=subquery + 1)
            .where(FileState.user_id == user_id)
        )
        await self.postgres.commit()


    async def update_file_state(
            self,
            user_id: int,
            last_loaded_id: int
    ):
        await self.postgres.execute(
            update(FileState)
            .values(last_loaded_id=last_loaded_id)
            .where(FileState.user_id == user_id)
        )

        await self.postgres.commit()

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
