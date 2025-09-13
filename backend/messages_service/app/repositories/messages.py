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
            type_file: str
    ):
        uploaded_file = File(
            name=filename,
            user_id=user_id,
            type=type_file
        )

        self.postgres.add(uploaded_file)
        await self.postgres.commit()

    async def delete_file(
            self,
            file_id: int
    ):
        await self.postgres.execute(delete(File).where(File.id == file_id))
        await self.postgres.commit()
