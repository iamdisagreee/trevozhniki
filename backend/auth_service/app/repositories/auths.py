from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.auth import User


class AuthRepository:
    def __init__(
            self,
            postgres: AsyncSession
    ):
        self.postgres = postgres

    async def get_user_by_id(
            self,
            user_id: int
    ):
        return await self.postgres.scalar(select(User).where(User.id == user_id))

    async def get_user_by_username(
            self,
            username: str
    ):
        return await self.postgres.scalar(select(User).where(User.username == username))

    async def get_user_by_email(
            self,
            email: str
    ):
        return await self.postgres.scalar(select(User).where(User.email == email))

    async def add_user(
            self,
            firstname: str,
            username: str,
            email: str,
            hashed_password: str
    ):
        db_user = User(
            firstname=firstname,
            username=username,
            email=email,
            hashed_password=hashed_password
        )
        self.postgres.add(db_user)
        await self.postgres.commit()
        return db_user
