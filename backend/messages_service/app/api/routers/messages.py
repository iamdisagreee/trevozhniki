from fastapi import APIRouter, UploadFile, File, Depends
from fastapi.responses import JSONResponse

from app.core.dependecies import get_s3

from app.services.messages import MessageService

from app.core.dependecies import get_message_service

import os

router = APIRouter(prefix='/messages', tags=['messages'])

@router.post("/uploadfile", response_class=JSONResponse)
async def create_upload_file(
        file: UploadFile = File(...),
        message_service: MessageService = Depends(get_message_service)
):
    """ Загрузка json-файла в s3-хранилище"""

    await message_service.upload_file(file)

    return JSONResponse(
        content={"detail": "File successfully loaded"},
    )