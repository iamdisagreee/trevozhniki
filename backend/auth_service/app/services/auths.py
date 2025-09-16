from datetime import datetime, timezone, timedelta
import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Form, status, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi.responses import JSONResponse

from ..config import get_settings
from ..repositories.auths import AuthRepository
from ..schemas.auth import CreateUser


class AuthService:
    def __init__(
            self,
            auth_repo: AuthRepository
    ):
        self.auth_repo = auth_repo
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.settings = get_settings()

    def hash_password(
            self,
            password: str
    ):
        return self.pwd_context.hash(password)

    def verify_password(
            self,
            plain_password: str,
            hashed_password: str
    ):
        return self.pwd_context.verify(plain_password, hashed_password)

    def create_access_token(
            self,
            data: dict
    ):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(minutes=self.settings.access_token_expire_minutes)
        to_encode.update({'exp': expire})
        return jwt.encode(to_encode, self.settings.jwt_secret_key, self.settings.jwt_algorithm)

    def create_refresh_token(
            self,
            data: dict
    ):
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=self.settings.refresh_token_expire_days)
        to_encode.update({'exp': expire})
        return jwt.encode(to_encode, self.settings.jwt_secret_key, self.settings.jwt_algorithm)

    async def refresh_access_token(
            self,
            refresh_token: str,
    ):
        credentials_exception = HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail='Could not validate refresh token',
            headers={'WWW-Authenticate': "Bearer"}
        )
        try:
            payload = jwt.decode(refresh_token, self.settings.jwt_secret_key, algorithms=[self.settings.jwt_algorithm])
            user_id = payload.get('sub')
            if user_id is None:
                raise credentials_exception

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.PyJWTError:
            raise credentials_exception

        user = await self.auth_repo.get_user_by_id(user_id=int(user_id))
        if user is None:
            raise credentials_exception

        access_token = self.create_access_token(
            data={
                'sub': str(user.id),
                'firstname': user.firstname,
                'username': user.username,
                'email': user.email
            }
        )

        return JSONResponse(
            content={
                "access_token": access_token,
                "token_type": "Bearer"
            }
        )

    async def login_user(
            self,
            username: str,
            password: str,
    ):
        user = await self.auth_repo.get_user_by_username(username=username)
        if not user or not self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Incorrect username or password',
                headers={'WWW-Authentication': "Bearer"}
            )

        access_token = self.create_access_token(
            data={
                'sub': str(user.id),
                'firstname': user.firstname,
                'username': user.username,
                'email': user.email
            }
        )
        refresh_token = self.create_refresh_token(
            data={
                'sub': str(user.id)
            }
        )


        response = JSONResponse(
            content={
                "access_token": access_token,
                "token_type": "Bearer"
            }
        )

        # Кладем рефреш-токен в HttpOnly Cookies
        response.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,
            secure=False,
        )

        return response

    @staticmethod
    async def logout_user():
        response = JSONResponse(
            content={"detail": "User has successfully logged out"}
        )
        response.delete_cookie('refresh_token')
        return response
    async def add_user(
            self,
            create_user: CreateUser
    ):
        user_by_username = await self.auth_repo.get_user_by_username(username=create_user.username)
        user_by_email = await self.auth_repo.get_user_by_email(email=create_user.email)

        if user_by_username is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already registered"
            )

        if user_by_email is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        return await self.auth_repo.add_user(
            firstname=create_user.firstname,
            username=create_user.username,
            email=create_user.email,
            hashed_password=self.hash_password(create_user.password)
        )
