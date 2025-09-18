import asyncio
from asyncio import sleep
from datetime import datetime, timezone
from random import shuffle, choice

from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from io import BytesIO

from ..core.giga import GigaChatClient
from ..core.rabbitmq import RabbitMQValidator
from ..core.s3 import S3Client

import os

from ..repositories.messages import MessageRepository
from ..schemas.message import GetUser

VALID_EXTENSION = 'json'
VALID_CONTENT_TYPE = 'application/json'
MAX_FILE_SIZE = 1024 * 1024 * 5


class MessageService:
    def __init__(
            self,
            s3: S3Client,
            msg_repo: MessageRepository,
            giga: GigaChatClient,
            # rabbitmq: RabbitMQValidator
    ):

        self.s3 = s3
        self.msg_repo = msg_repo
        self.giga = giga
        # self.rabbitmq = rabbitmq

    @staticmethod
    def check_file_extension(filename: str):
        """ Проверка файла на расширение """
        if filename.split(".")[-1] != VALID_EXTENSION:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail='Incorrect file extension'
            )

    @staticmethod
    def check_file_content_type(content_type: str):
        """ Проверка файла на заголовок Content-Type """
        if content_type != VALID_CONTENT_TYPE:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail='Invalid MIME-type of a file'
            )

    @staticmethod
    def check_file_size(file: UploadFile):
        """ Проверка файла на размер """

        # Перемещаем указатель в конец файла
        file.file.seek(0, os.SEEK_END)
        # Получаем текущую позицию указателя в байтах - это размер файла
        file_size = file.file.tell()
        # Возвращаем указатель в начало файла
        file.file.seek(0, os.SEEK_SET)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail='File size exceeded'
            )

    @staticmethod
    def generate_filename(
            filename: str,
            username: str
    ):
        time_now = datetime.now(timezone.utc)
        file_extension = filename.split(".")[-1]
        return f"{username}-{file_extension}-{time_now.strftime("%Y.%m.%d-%H:%M")}"

    async def upload_file(
            self,
            file: UploadFile,
            user: GetUser,
    ):

        self.check_file_extension(file.filename)
        self.check_file_content_type(file.content_type)
        self.check_file_size(file)
        new_filename = self.generate_filename(
            filename=file.filename,
            username=user.username
        )

        await self.msg_repo.upload_file(
            user_id=user.id,  # Здесь должны получить id из jwt-токена
            filename=new_filename,  # файла
            file_extension=file.filename.split('.')[-1]
        )
        await self.s3.upload_file(
            file=file,
            filename=new_filename
        )

        return JSONResponse(
            content={"detail": "File successfully loaded"},
        )

    async def delete_file(
            self,
            file_id: int,
            filename: str,
    ):
        result_postgres = await self.msg_repo.delete_file(file_id=file_id)
        if not result_postgres.rowcount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='There is no file with such id'
            )

        try:
            await self.get_file(filename=filename)
            await self.s3.delete_file(filename=filename)
        except HTTPException as e:
            await self.msg_repo.rollback()
            raise HTTPException(
                status_code=e.status_code,
                detail=e.detail
            )
        await self.msg_repo.commit()

        return JSONResponse(
            content={'detail': "File successfully deleted"}
        )

    async def get_file(self, filename: str):
        return await self.s3.get_file(filename=filename)

    async def create_request_gigachat(
            self,
            filename: str
    ):
        # bio = BytesIO(file)
        # bio.name = "result.pdf"
        # bio='1'
        filepath = await self.s3.get_file(filename=filename)
        uploaded_file = self.giga.upload_file(filepath=filepath)

        try:
            response = self.giga.request_processing(file_id=uploaded_file.id_)
            # new_file=BytesIO(response.encode())
            # upload_file=UploadFile(
            #     filename='aue',
            #     file=new_file,
            #     content_type='text/plain'
            # )
            # print(await upload_file.read())
            return response
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='GigaChat API unavailable'
            )
        finally:
            os.remove(filepath)
            self.giga.delete_file(file_id=uploaded_file.id_)

