import os.path

from fastapi import APIRouter, Depends, UploadFile, File

router = APIRouter(prefix='/users', tags=['users'])

@router.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):

    total_bytes = 0
    chunk_size = 1024 * 1024

    while True:
        chunk = await file.read(chunk_size)

        if not chunk:
            break

        total_bytes += len(chunk)
        print(f"Received chunk of {total_bytes} bytes")

    return {"filename": file.filename, 'content_type': file.content_type}
