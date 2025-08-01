from fastapi import APIRouter, Depends, UploadFile

router = APIRouter(prefix='/users', tags=['users'])

@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile):
    return {"filename": file.filename}
