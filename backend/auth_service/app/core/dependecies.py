import jwt
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
import redis.asyncio as aioredis

from .redis_connect import redis_client
from .oauth2 import oauth2_scheme
from .postgres import session_maker
from ..config import get_settings, Settings
from ..repositories.auths import AuthRepository
from ..schemas.auth import GetUser
from ..services.auths import AuthService


async def get_postgres() -> AsyncSession:
    async with session_maker() as session:
        yield session


async def get_auth_repository(
        postgres: AsyncSession = Depends(get_postgres)
) -> AuthRepository:
    return await get_auth_repository_no_depends(postgres=postgres)


async def get_auth_repository_no_depends(
        postgres: AsyncSession
):
    return AuthRepository(postgres=postgres)

async def get_redis():
    return redis_client


async def get_auth_service(
        auth_repo: AuthRepository = Depends(get_auth_repository),
        redis: aioredis = Depends(get_redis),
        settings: Settings = Depends(get_settings)
) -> AuthService:
    return AuthService(
        auth_repo=auth_repo,
        redis=redis,
        settings=settings
    )


async def get_current_user(
        token: str = Depends(oauth2_scheme),
        auth_repo: AuthRepository = Depends(get_auth_repository)
):
    return await get_current_user_no_depends(
        token=token,
        auth_repo=auth_repo
    )


async def get_current_user_no_depends(
        token: str,
        auth_repo: AuthRepository
):
    settings = get_settings()
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail='Could not validate credentials',
        headers={'WWW-Authentication': "Bearer"}
    )

    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
        user_id = payload.get('sub')
        first_name = payload.get('firstname')
        username = payload.get('username')
        # email = payload.get('email')
        if any(value is None for value in [user_id, first_name, username]):
            raise credentials_exception

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Access token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception

    user = await auth_repo.get_user_by_id(user_id=int(user_id))
    if user is None:
        raise credentials_exception
    return GetUser.model_validate(user)
