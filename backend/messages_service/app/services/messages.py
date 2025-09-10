from fastapi import UploadFile, HTTPException, status

from app.core.s3 import S3Client

import os


VALID_EXTENSION = 'json'
VALID_CONTENT_TYPE = 'application/json'
MAX_FILE_SIZE = 1024 * 1024


class MessageService:
    def __init__(self, s3: S3Client):
        self.s3 = s3

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

    # @staticmethod
    # def generate_filename(file:):

    async def upload_file(self, file: UploadFile):

        self.check_file_extension(file.filename)
        self.check_file_content_type(file.content_type)
        self.check_file_size(file)

        await self.s3.upload_file(file=file)

    async def delete_file(self, object_name: str):
        self.s3.delete_file(object_name=object_name)

    async def get_file(self, object_name: str):
        self.s3.get_file(object_name=object_name)