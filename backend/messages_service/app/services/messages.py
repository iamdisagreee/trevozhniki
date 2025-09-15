import asyncio
from asyncio import sleep
from datetime import datetime, timezone
from random import shuffle, choice

from fastapi import UploadFile, HTTPException, status
from io import BytesIO

from ..core.giga import GigaChatClient
from ..core.s3 import S3Client

import os

from ..repositories.messages import MessageRepository

VALID_EXTENSION = 'json'
VALID_CONTENT_TYPE = 'application/json'
MAX_FILE_SIZE = 1024 * 1024 * 5


class MessageService:
    def __init__(
            self,
            s3: S3Client,
            msg_repo: MessageRepository,
            giga: GigaChatClient
    ):

        self.s3 = s3
        self.msg_repo = msg_repo
        self.giga = giga

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
    def generate_filename(filename: str):
        name = choice(['vova', 'nikita', 'nika', 'darina', 'margo'])
        time_now = datetime.now(timezone.utc)
        file_extension = filename.split(".")[-1]
        return f"{name}-{file_extension}-{time_now.strftime("%Y.%m.%d-%H:%M")}"

    async def upload_file(
            self,
            file: UploadFile
    ):

        self.check_file_extension(file.filename)
        self.check_file_content_type(file.content_type)
        self.check_file_size(file)
        new_filename = self.generate_filename(file.filename)

        await self.msg_repo.upload_file(
            user_id=0,  # Здесь должны получить id из jwt-токена
            filename=new_filename,  # файла
            file_extension=file.filename.split('.')[-1]
        )
        await self.s3.upload_file(
            file=file,
            filename=new_filename
        )

    async def delete_file(
            self,
            file_id: int,
            filename: str
    ):
        await self.msg_repo.delete_file(file_id=file_id)
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

    async def get_file(self, filename: str):
        return await self.s3.get_file(filename=filename)

    async def create_request_gigachat(
            self,
            filepath: str
    ):
        # bio = BytesIO(file)
        # bio.name = "result.pdf"
        # bio='1'
        try:
            uploaded_file = self.giga.upload_file(filepath=filepath)
            # print(uploaded_file)
            return self.giga.request_processing(file_id=uploaded_file.id_)
        except Exception as e:
            self.delete_file_from_server(filepath=filepath)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='GigaChat API unavailable'
            )


    @staticmethod
    def delete_file_from_server(filepath: str):
        os.remove(filepath)
