from fastapi import APIRouter, UploadFile, File, Depends, Header, HTTPException
from fastapi.responses import JSONResponse

from ...core.logging_config import logger
from ...core.rabbitmq import RabbitMQJwtValidator
from ...services.messages import MessageService
from ...core.dependecies import get_message_service, get_jwt_validator_instance
from ...schemas.message import DeleteFile, ProcessingFile


router = APIRouter(prefix='/messages', tags=['messages'])



@router.get("/process")
async def process2(authorization: str = Header(...),
                   validate_jwt: RabbitMQJwtValidator = Depends(get_jwt_validator_instance)):
    logger.info(f'Получил: {authorization}')
    result = await validate_jwt.jwt_validate_queue(token=authorization[7:])
    return {"detail": result}

@router.post("/uploadfile", response_class=JSONResponse)
async def create_upload_file(
        file: UploadFile = File(...),
        message_service: MessageService = Depends(get_message_service)
):
    """ Загрузка json-файла в s3, postgres"""
    return await message_service.upload_file(file=file)

@router.delete("/deletefile", response_class=JSONResponse)
async def crete_delete_file(
        delete_file: DeleteFile,
        message_service: MessageService = Depends(get_message_service)
):
    """ Удаление json-файла из s3, postgres"""

    return await message_service.delete_file(
        file_id=delete_file.id,
        filename=delete_file.name,
    )


@router.post("/processingfile", response_class=JSONResponse)
async def create_processing_file(
        processing_file: ProcessingFile,
        message_service: MessageService = Depends(get_message_service)
):
    """ Запрос для обработки json-файла с помощью GigaChat API"""

    filepath = await message_service.get_file(filename=processing_file.name)

    answer = await message_service.create_request_gigachat(filepath=filepath)

    await message_service.delete_file_after_giga(filepath=filepath)

    return JSONResponse(
       content={'fileResponse': answer.choices[0].message.content}
    )
