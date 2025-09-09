from contextlib import asynccontextmanager
import aiofiles

from fastapi import UploadFile, HTTPException
from aiobotocore.session import get_session
from botocore.exceptions import ClientError

from app.config import get_settings


class S3Client:
    def __init__(
            self,
            access_key: str,
            secret_key: str,
            endpoint_url: str,
            bucket_name: str
    ):
        self.config = {
            "aws_access_key_id": access_key,
            "aws_secret_access_key": secret_key,
            "endpoint_url": endpoint_url
        }

        self.bucket_name = bucket_name
        self.session = get_session()
        self.status_code = None
        self.exc_message = None

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    @staticmethod
    def on_exception(response):
        status_code = response.get("ResponseMetaData").get('HTTPStatusCode')
        exc_message = response.get("Error").get("Message")
        raise HTTPException(status_code=status_code,
                            detail=exc_message)

    async def upload_file(
            self,
            file_path: str
    ):
        object_name = file_path.split("/")[-1]  # /users/artem/cat.jpg
        try:
            async with self.get_client() as client:
                with open(file_path, "rb") as file:
                    await client.put_object(
                        Bucket=self.bucket_name,
                        Key=object_name,
                        Body=file
                    )
        except ClientError as e:
            print(e)
            print("АШИБОЧКА")
            # self.on_exception(e.response)

    async def delete_file(
            self,
            object_name: str
    ):
        try:
            async with self.get_client() as client:
                await client.delete_object(
                    Bucket=self.bucket_name,
                    Key=object_name
                )
        except ClientError as e:
            self.on_exception(e.response)


    async def get_file(
            self,
            object_name: str
    ):
        try:
            async with self.get_client() as client:
                await client.get_object(
                    Bucket=self.bucket_name,
                    Key=object_name
                )
                # Далее логика возвращения файла куда-то

        except ClientError as e:
            self.on_exception(e.response)

settings = get_settings()
print(settings)
print(settings.s3_access_key)
s3_client = S3Client(
    access_key=settings.s3_access_key,
    secret_key=settings.s3_secret_key,
    endpoint_url=settings.s3_endpoint_url,
    bucket_name=settings.s3_bucket_name
)