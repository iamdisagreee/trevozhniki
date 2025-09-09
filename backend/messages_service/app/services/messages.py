from fastapi import UploadFile

from app.core.s3 import S3Client

import os
import aiofiles


VALID_EXTENSION = 'json'
VALID_CONTENT_TYPE = 'application/json'
MAX_FILE_SIZE = 1024 * 1024
DIRECTORY_LOCATION = "../static"
CHUNK_SIZE = 1024 * 1024


class MessageService:
    def __init__(self, s3: S3Client):
        self.s3 = s3


    @staticmethod
    async def read_and_save_file(file: UploadFile):
        """ Асинхронно сохраняет загруженный файл на диск, читая его по частям """
        file_path = f'{DIRECTORY_LOCATION}/{file.filename}'
        try:
            async with aiofiles.open(file_path, "wb") as out_file:
                while content := await file.read(CHUNK_SIZE):
                    await out_file.write(content)
        except Exception as e:
            pass

    async def upload_file(self, file: UploadFile):

        extension = file.filename.split(".")[-1]
        # Перемещаем указатель в конец файла
        file.file.seek(0, os.SEEK_END)
        # Получаем текущую позицию указателя в байтах - это размер файла
        file_size = file.file.tell()
        # Возвращаем указатель в начало файла
        file.file.seek(0, os.SEEK_SET)

        if extension != VALID_EXTENSION:
            pass
        elif file.content_type != VALID_CONTENT_TYPE:
            pass
        elif file_size > MAX_FILE_SIZE:
            pass

        await self.read_and_save_file(file=file)
        file_path = f'{DIRECTORY_LOCATION}/{file.filename}'
        await self.s3.upload_file(file_path=file_path)

    async def delete_file(self, object_name: str):
        self.s3.delete_file(object_name=object_name)

    async def get_file(self, object_name: str):
        self.s3.get_file(object_name=object_name)