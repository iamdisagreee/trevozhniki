from gigachat import GigaChat
import requests
import base64
import time
import urllib3

urllib3.disable_warnings()

from ..config import get_settings


class GigaChatClient:
    def __init__(
            self,
            client_id: str,
            client_secret: str
    ):
        self.client_id = client_id
        self.client_secret = client_secret
        self.giga_client = None
        self.expires_at = 0

    def create_giga_client(self):
        if self.giga_client is None:
            credentials = self.create_credentials()
            self.giga_client = GigaChat(
                credentials=credentials,
                verify_ssl_certs=False
            )

    def create_credentials(self):
        return base64.b64encode(f"{self.client_id}:{self.client_secret}".encode('utf-8')).decode('utf-8')

    def token(self):
        if time.time() < self.expires_at - 30 * 60:
            return

        credentials = self.create_credentials()

        url = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"

        payload = {
            'scope': 'GIGACHAT_API_PERS'
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': '9fc945fa-9a1d-4b36-9a8c-57977efbc3a0',
            'Authorization': f"Basic {credentials}"
        }

        request = requests.request("POST", url, headers=headers, data=payload, verify=False).json()
        self.expires_at = request.get("expires_at")

    def upload_file(
            self,
            filepath: str
    ):
        self.token()
        self.create_giga_client()

        return self.giga_client.upload_file(
            open(filepath, mode="rb")
        )

    def delete_file(
            self,
            file_id: str
    ):
        self.token()
        self.create_giga_client()

        return self.giga_client.delete_file(file_id)

    def request_processing(
            self,
            file_id: str
    ):
        self.token()
        self.create_giga_client()

        result = self.giga_client.chat(
            {
                # "model": 'GIGACHAT_API_PERS',
                "messages": [
                    {
                        "role": "user",
                        "content": "Проведи анализ переписки",
                        "attachments": [file_id],
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 1000
            }
        )

        return result


settings = get_settings()

# giga = GigaChatClient(
#    '5c13c118-54c2-4eda-82b1-b4a0f8d643c0',
#    '2f4b036f-0d0e-4d79-a020-41472f8c2c63'
# )

giga_chat = GigaChatClient(
    settings.gigachat_client_id,
    settings.gigachat_client_secret
)

# print(giga.token())
# print(giga.upload_file("core/result.pdf"))
#id_ = 'bc9e0f83-5f9f-4b83-b316-5eb3ddbfe221'
#print(giga.request_processing(id_))
