from gigachat import GigaChat
import requests
import base64
import urllib3
import time
from ..config import load_config

urllib3.disable_warnings()

class WorkGigaChat:
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
        # credentials = f"{'3f56ef97-09f2-4492-bb4e-e9b87e4a52e6'}:{'8f7cd9dd-c8bf-4b93-86bd-ff9a7744877d'}"
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

config = load_config()
giga_chat = WorkGigaChat(
    config.giga_chat.client_id,
    config.giga_chat.client_secret
)


