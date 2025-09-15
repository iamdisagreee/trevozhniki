from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete
from ..models.message import File

class MessageRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def upload_file(
            self,
            user_id: int,
            filename: str,
            file_extension: str
    ):
        uploaded_file = File(
            name=filename,
            user_id=user_id,
            extension=file_extension
        )

        self.postgres.add(uploaded_file)
        await self.postgres.commit()

    async def delete_file(
            self,
            file_id: int
    ):
        result = await self.postgres.execute(delete(File).where(File.id == file_id))

        if not result.rowcount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='There is no file with such id'
            )

        return result

    async def rollback(self):
        await self.postgres.rollback()

    async def commit(self):
        await self.postgres.commit()
