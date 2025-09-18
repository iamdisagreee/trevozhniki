from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException, Security
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from ...core.logging_config import logger
from ...services.messages import MessageService
from ...core.dependecies import get_message_service, get_current_user
from ...schemas.message import DeleteFile, ProcessingFile, GetUser

router = APIRouter(prefix='/messages', tags=['messages'])

security = HTTPBearer()


@router.post("/uploadfile", response_class=JSONResponse)
async def create_upload_file(
        file: UploadFile = File(...),
        message_service: MessageService = Depends(get_message_service),
        current_user: GetUser = Depends(get_current_user)
):
    """ Загрузка json-файла в s3, postgres"""
    return await message_service.upload_file(
        file=file,
        user=current_user
    )

@router.delete("/deletefile", response_class=JSONResponse)
async def crete_delete_file(
        delete_file: DeleteFile,
        message_service: MessageService = Depends(get_message_service),
        current_user: GetUser = Depends(get_current_user)
):
    """ Удаление json-файла из s3, postgres"""

    return await message_service.delete_file(
        file_id=delete_file.id,
        filename=delete_file.name,
    )


@router.post("/processingfile", response_class=JSONResponse)
async def create_processing_file(
        processing_file: ProcessingFile,
        message_service: MessageService = Depends(get_message_service),
        current_user: GetUser = Depends(get_current_user)
):
    """ Запрос для обработки json-файла с помощью GigaChat API"""

    answer = await message_service.create_request_gigachat(filename=processing_file.name)

    return JSONResponse(
       content={'fileResponse': answer.choices[0].message.content}
    )
