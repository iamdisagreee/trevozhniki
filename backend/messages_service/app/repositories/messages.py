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
    ):
        uploaded_file = File(
            name=filename,
            user_id=user_id
        )
        self.postgres.add(uploaded_file)
        await self.postgres.commit()

    async def delete_file(
            self,
            user_id: int,
            filename: str
    ):
        await self.postgres.execute(delete(File).where(File.user_id==user_id, File.name==filename))
        await self.postgres.commit()
