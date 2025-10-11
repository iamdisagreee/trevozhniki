from datetime import datetime, timezone, timedelta
from random import randint

import jwt
from fastapi import APIRouter, Depends, HTTPException, Request, Form, status, Response, Cookie
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from fastapi.responses import JSONResponse
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import redis.asyncio as aioredis

from ..config import Settings
from ..repositories.auths import AuthRepository
from ..schemas.auth import CreateUser, ValidateAuthForm
from ..core.logger_config import logger


class AuthService:
    def __init__(
            self,
            auth_repo: AuthRepository,
            redis: aioredis,
            settings: Settings
    ):
        self.auth_repo = auth_repo
        self.redis = redis
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.settings = settings

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
        # logger.info(f'Refresh token: {refresh_token}')
        try:
            payload = jwt.decode(refresh_token, self.settings.jwt_secret_key, algorithms=[self.settings.jwt_algorithm])
            user_id = payload.get('sub')
            # logger.info(f'Payload token: {payload}')

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
                # 'firstname': user.firstname,
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

    @staticmethod
    def modify_username(username: str):
        return username.split('@')[0][:5] if '@' in username else username

    async def login_user(
            self,
            username: str,
            password: str,
    ):
        modify_username = self.modify_username(username=username)

        user = await self.auth_repo.get_user_by_username(username=modify_username)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Incorrect username',
                headers={'WWW-Authentication': "Bearer"}
            )

        if not self.verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Incorrect password',
                headers={'WWW-Authentication': "Bearer"}
            )

        access_token = self.create_access_token(
            data={
                'sub': str(user.id),
                # 'firstname': user.firstname,
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
    async def logout_user(request: Request):
        refresh_token_cookie = request.cookies.get('refresh_token')
        if refresh_token_cookie is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='There is no refresh token'
            )

        response = JSONResponse(
            content={"detail": "User has successfully logged out"}
        )
        response.delete_cookie('refresh_token')
        return response

    async def validate_auth_form(
            self,
            validate_auth: ValidateAuthForm
    ):
        user_by_email = await self.auth_repo.get_user_by_email(email=validate_auth.email)
        # user_by_username = await self.auth_repo.get_user_by_username(username=validate_auth.username)

        if user_by_email is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        # if user_by_username is not None:
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST,
        #         detail="Username already registered"
        #     )

        return JSONResponse(
            content={'detail': 'Successful validation for auth form!'},
            headers={'Cache-Control': 'no-store'}
        )

    @staticmethod
    def create_username_by_email(email: str):
        return email.split('@')[0][:5]

    async def add_user(
            self,
            create_user: CreateUser
    ):
        # user_by_username = await self.auth_repo.get_user_by_username(username=create_user.username)
        user_by_email = await self.auth_repo.get_user_by_email(email=create_user.email)

        # if user_by_username is not None:
        #     raise HTTPException(
        #         status_code=status.HTTP_400_BAD_REQUEST,
        #         detail="Username already registered"
        #     )

        if user_by_email is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        username = self.create_username_by_email(create_user.email)

        return await self.auth_repo.add_user(
            # firstname=create_user.firstname,
            username=username,
            email=create_user.email,
            hashed_password=self.hash_password(create_user.password)
        )

    @staticmethod
    async def send_email(
            from_email: str,
            from_password: str,
            to_email: str,
            header: str,
            body: str
    ):
        """
        Отправка письма по электронной почте с использованием SMTP-сервера Яндекса
        :param from_email: почта адресанта
        :param from_password: специальный пароль адресанта
        :param to_email: почта адресата
        :param header: заголовок письма
        :param body: текст письма
        :return:
        """

        SMTP_SERVER = "smtp.yandex.com"
        SMTP_PORT = 587

        msg = MIMEMultipart()
        msg["From"] = from_email
        msg["To"] = to_email
        msg["Subject"] = header
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(from_email, from_password)  # Авторизация
            server.sendmail(from_email, to_email, msg.as_string())  # Отправляем письмо

    async def create_send_email(
            self,
            to_email: str
    ):
        # Отправляем письмо
        text_header = 'Код подтверждения'
        auth_code = randint(100000, 999999)
        text_body = f'Ваш код: {auth_code}'

        try:
            await self.send_email(
                from_email=self.settings.mail_user,
                from_password=self.settings.mail_password,
                to_email=to_email,
                header=text_header,
                body=text_body
            )
        except smtplib.SMTPAuthenticationError as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='Mistake with authorization in smtp service'
            )

        # Добавляем в redis-хранилище email:auth_code
        await self.redis.set(to_email, auth_code)

        return JSONResponse(
            content=
            {
                "detail": f"Confirmation code sent to {to_email}",
            }
        )

    async def confirm_code(
            self,
            to_email: str,
            entered_code: int
    ):

        correct_code = await self.redis.get(to_email)
        if correct_code is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='No code with such email'
            )

        if int(correct_code) != entered_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Incorrect code entered'
            )

        await self.redis.delete(to_email)

        return JSONResponse(
            content=
            {
                'detail': 'User confirmed successfully'
            }
        )
