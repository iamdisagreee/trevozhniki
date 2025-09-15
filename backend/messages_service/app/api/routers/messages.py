from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse

from ...services.messages import MessageService
from ...core.dependecies import get_message_service
from ...schemas.message import DeleteFile, ProcessingFile

import os

router = APIRouter(prefix='/messages', tags=['messages'])

@router.post("/uploadfile", response_class=JSONResponse)
async def create_upload_file(
        file: UploadFile = File(...),
        message_service: MessageService = Depends(get_message_service)
):
    """ Загрузка json-файла в s3 , postgres"""

    await message_service.upload_file(file=file)

    return JSONResponse(
        content={"detail": "File successfully loaded"},
    )

@router.delete("/deletefile", response_class=JSONResponse)
async def crete_delete_file(
        delete_file: DeleteFile,
        message_service: MessageService = Depends(get_message_service)
):
    """ Удаление json-файла из s3, postgres"""

    await message_service.delete_file(
        file_id=delete_file.id,
        filename=delete_file.name,
    )

    return JSONResponse(
        content={'detail': "File successfully deleted"}
    )

@router.post("/processingfile", response_class=JSONResponse)
async def create_processing_file(
        processing_file: ProcessingFile,
        message_service: MessageService = Depends(get_message_service)
):
    """ Запрос для обработки json-файла с помощью GigaChat API"""

    filepath = await message_service.get_file(filename=processing_file.name)

    answer = await message_service.create_request_gigachat(filepath=filepath)

    #await message_service.delete_file_from_server(filepath=filepath)

    return JSONResponse(
       content={'fileResponse': answer.choices[0].message.content}
    )
