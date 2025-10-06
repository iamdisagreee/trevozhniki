import asyncio
import json
from logging import exception
from pyexpat.errors import messages

import aiofiles
from asyncio import sleep
from datetime import datetime, timezone
from random import shuffle, choice
from gigachat.exceptions import ResponseError
from sqlalchemy.exc import IntegrityError
from fastapi import UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from io import BytesIO, StringIO

from ..core.giga import GigaChatClient
from ..core.rabbitmq import RabbitMQValidator
from ..core.s3 import S3Client

import os

from ..repositories.messages import MessageRepository
from ..schemas.message import GetUser, ProcessingFile

VALID_EXTENSION = 'json'
VALID_CONTENT_TYPE = 'application/json'
MAX_FILE_SIZE = 1024 * 1024 * 1


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
        # Получаем текущую позицию указателя в байgiтах - это размер файла
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
            file_extension: str,
            username: str
    ):
        time_now = datetime.now()
        return f"{username}-{file_extension}-{time_now.strftime("%Y.%m.%d-%H:%M:%S")}"

    @staticmethod
    def file_change_logic(
            file_json: dict
    ):
        new_file = {
            'messages': list(
                map(
                    lambda msg: {'from': msg['from'], 'text': msg['text']},
                    filter(lambda msg: not msg.get('mime_type'), file_json['messages'])
                )
            )
        }
        # print(new_file)
        return new_file

    async def preprocessing_file(
            self,
            file: UploadFile
    ):
        raw_bytes = await file.read()
        file_json = json.loads(raw_bytes.decode('utf-8'))
        # print(len(str(file_json)))
        new_file = json.dumps(self.file_change_logic(file_json))
        # print(len(str(new_file)))

        processed_bytes = new_file.encode('utf-8')

        return UploadFile(
            filename=file.filename,
            headers=file.headers,
            file=BytesIO(processed_bytes)  # Создаем файло-подобное отродие, то есть где есть метод read() и т.д.
        )

    async def upload_file(
            self,
            file: UploadFile,
            user: GetUser,
    ):
        processed_file = await self.preprocessing_file(file)

        self.check_file_extension(processed_file.filename)
        self.check_file_content_type(processed_file.content_type)
        self.check_file_size(processed_file)
        new_filename = self.generate_filename(
            file_extension=processed_file.filename.split(".")[-1],
            username=user.username
        )

        chat = await self.msg_repo.create_chat(
            name=new_filename,
            user_id=user.id,
        )

        await self.msg_repo.upload_file(
            filename=new_filename,
            file_extension=processed_file.filename.split('.')[-1],
            user_id=user.id,
            chat_id=chat.id
        )

        await self.s3.upload_file(
            file=processed_file,
            filename=new_filename
        )

        return JSONResponse(
            content={"detail": "File successfully loaded",
                     "chatId": chat.id,
                     "filename": new_filename},
        )

        return JSONResponse(
            content={"detail": "File successfully loaded",
                     "chatId": 2,
                     "filename": 'vova-json-2025.09.19-08:09'},
        )

    async def get_all_chats(
            self,
            user_id: int
    ):
        chats = await self.msg_repo.all_chats(user_id=user_id)
        chats_json = {'chats':
            [
                {
                    'id': chat.id,
                    'name': chat.name
                } for chat in chats
            ]
        }
        return JSONResponse(
            content=chats_json
        )

    async def delete_chat(
            self,
            chat_id: int
    ):
        result_postgres = await self.msg_repo.delete_chat(chat_id=chat_id)
        if not result_postgres.rowcount:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='There is no chat with such id'
            )

        # ЛОГИКА УДАЛЕНИЯ ВСЕХ ФАЙЛОВ ИЗ S3...................

        return JSONResponse(
            content={'detail': "Chat successfully deleted"}
        )

    async def get_chat_by_id(
            self,
            chat_id: int):
        chat = await self.msg_repo.get_chat_by_id(chat_id=chat_id)

        if chat is None:
            raise HTTPException(
                detail='There is no chat with such id',
                status_code=status.HTTP_404_NOT_FOUND
            )
        answer_name = chat.files[1].name
        try:
            filepath = await self.s3.get_file(answer_name)
        except Exception as e:
            # print(e, type(e))
            raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=e.kwargs.get('msg')
            )

        async with aiofiles.open(filepath, mode='r', encoding='utf-8') as file:
            text = await file.read()

        return JSONResponse(
            content={'text': text}
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
            file: ProcessingFile,
            user: GetUser
    ):

        filepath = await self.s3.get_file(filename=file.filename)
        uploaded_file = self.giga.upload_file(filepath=filepath)
        try:
            response = self.giga.request_processing(file_id=uploaded_file.id_).choices[0].message.content
            response_text = StringIO(response)

            new_filename = self.generate_filename(
                file_extension='txt',
                username=user.username
            )

            upload_file = UploadFile(
                file=response_text,
                filename=new_filename
            )

            await self.s3.upload_file(
                file=upload_file,
                filename=new_filename
            )

            await self.msg_repo.upload_file(
                filename=new_filename,
                file_extension='txt',
                user_id=user.id,
                chat_id=file.chat_id
            )

            return JSONResponse(
                content={'text': response}
            )

            return JSONResponse(
                content={'text': """
                Есть над чем задуматься: непосредственные участники технического прогресса освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, ограничены исключительно образом мышления. Сложно сказать, почему некоторые особенности внутренней политики, вне зависимости от их уровня, должны быть описаны максимально подробно. Вот вам яркий пример современных тенденций — начало повседневной работы по формированию позиции требует анализа инновационных методов управления процессами. Таким образом, сложившаяся структура организации способствует повышению качества соответствующих условий активизации. Прежде всего, глубокий уровень погружения однозначно фиксирует необходимость глубокомысленных рассуждений! Не следует, однако, забывать, что сложившаяся структура организации играет важную роль в формировании новых принципов формирования материально-технической и кадровой базы. Прежде всего, высокотехнологичная концепция общественного уклада создаёт необходимость включения в производственный план целого ряда внеочередных мероприятий с учётом комплекса укрепления моральных ценностей. Каждый из нас понимает очевидную вещь: консультация с широким активом однозначно определяет каждого участника как способного принимать собственные решения касаемо прогресса профессионального сообщества.
                """}
            )

        except ResponseError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail='GigaChat API unavailable'
            )
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail='No found chat with such chat id '
            )
        except Exception as e:
            raise HTTPException(
                status_code=e.status_code,
                detail=e.detail
            )
        finally:
            pass
            # os.remove(filepath)
            # self.giga.delete_file(file_id=uploaded_file.id_)
