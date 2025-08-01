from gigachat import GigaChat
import requests
import base64
import urllib3
import time
from fastapi import UploadFile
from aiobotocore.session import get_session
from botocore.exceptions import ClientError
from contextlib import asynccontextmanager
from ..config import load_config

urllib3.disable_warnings()

class GigaChatClient:
    def __init__(
            self,
            client_id: str,
            client_secret: str
    ):
        self._client_id = client_id
        self._client_secret = client_secret
        self._access_token = None
        self._expires_at = 0

    @staticmethod
    def token(self):
        if self._access_token and time.time() < self._expires_at - 30 * 60:
            return self._access_token

        credentials = f"{self._client_id}:{self._client_secret}"
        encoded = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')

        url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"

        payload = {
            'scope': 'GIGACHAT_API_B2B'
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': '9fc945fa-9a1d-4b36-9a8c-57977efbc3a0',
            'Authorization': f"Basic {encoded}"
        }

        request = requests.request("POST", url, headers=headers, data=payload, verify=False).json()
        self._access_token = request.get("access_token")
        self._expires_at = request.get("expires_at")

        return self._access_token

    def load_file(
            self,
            file_path: str
    ):
        if self._access_token is None:
            self._access_token = self.token

        giga = GigaChat(
            credentials=self._access_token,
            verify_ssl_certs=False
        )

        return giga.upload_file(
            open(file_path),
            mode="rb"
        )

    def get_file_information(
            self,
            file_id: str
    ):
        giga = GigaChat(
            credentials=self._access_token,
            verify_ssl_certs=False
        )
        result = giga.chat(
            {
                "messages": [
                    {
                        "role": "user",
                        "content": "На чем основана твоя работа? Отвечай на основе приложенного документа",
                        "attachments": [file_id],
                    }
                ],
                "temperature": 0.1
            }
        )

        return result


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

    @asynccontextmanager
    async def get_client(self):
        async with self.session.create_client("s3", **self.config) as client:
            yield client

    async def upload_file(
            self,
            file: UploadFile
    ):
        try:
            async with self.get_client() as client:
                async with open(file, "rb") as file:
                    await client.put_object(
                        Bucket=self.bucket_name,
                        Key=file.filename,
                        Body=file
                    )
        except ClientError as e:
            print("...")

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
            print("...")


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
            print("...")

config = load_config()
giga_chat = GigaChatClient(
    config.giga_chat.client_id,
    config.giga_chat.client_secret
)

s3_client = S3Client(
    access_key="",
    secret_key="",
    endpoint_url="",
    bucket_name=""
)


