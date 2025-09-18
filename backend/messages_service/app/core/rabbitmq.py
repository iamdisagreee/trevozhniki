import asyncio
import json
import uuid
from typing import Optional
from fastapi import HTTPException
import aio_pika
from aio_pika.abc import AbstractIncomingMessage

import os

from .logging_config import logger
from ..config import get_settings
from ..schemas.message import GetUser


class RpcClient:
    """Асинхронный RPC клиент для RabbitMQ."""

    def __init__(self, amqp_url: str):
        self.amqp_url = amqp_url # URL для подключения к RabbitMQ
        self.connection: Optional[aio_pika.RobustConnection] = None
        self.channel: Optional[aio_pika.Channel] = None
        self.callback_queue: Optional[aio_pika.Queue] = None
        self.futures = {} # {correlation_id: Future}; Future будет завершено, когда придет ответ на соотве-ий вопрос
        self.loop = asyncio.get_running_loop() # создаем цикл событий asyncio

    async def connect(self):
        self.connection = await aio_pika.connect_robust(self.amqp_url, loop=self.loop) # создаем robust (крепкое соединение)
        self.channel = await self.connection.channel() # Создается канал внутри соединения.
        # Все операции с очередями и сообщениями выполняются через канал
        self.callback_queue = await self.channel.declare_queue(exclusive=True) # Создается уникальная очередь обратного вызова
        # Эксклюзивные очереди доступны только для объявляющего соединения и удаляются, когда это соединение закрывается
        await self.callback_queue.consume(self.on_response, no_ack=True) # Начинается потребление из callback_queue.
        # Каждое сообщение будет передаваться в метод on_response, no_ack - подтверждать получение смс не требуется

    async def close(self):
        if self.connection and not self.connection.is_closed:
            await self.connection.close()

    def on_response(self, message: AbstractIncomingMessage):
        future = self.futures.pop(message.correlation_id, None)
        if future:
            future.set_result(message.body)

    async def call(self, body: str, routing_key: str) -> Optional[bytes]:
        # Проверяем, что connection доступен
        if not self.connection or self.connection.is_closed:
            raise ConnectionError('RPC client is not connected')

        correlation_id = str(uuid.uuid4())
        future = self.loop.create_future()
        self.futures[correlation_id] = future

        await self.channel.default_exchange.publish( # Публикация сообщения в RabbitMQ
            aio_pika.Message(
                body=body.encode(),
                correlation_id=correlation_id,
                reply_to=self.callback_queue.name # Куда отправлять полученное сообщение
            ),
            routing_key=routing_key # В какую очередь отправлять для получения ответа
        )

        try:
            return await asyncio.wait_for(future, timeout=5.0)
        except asyncio.TimeoutError:
            self.futures.pop(correlation_id, None)
            return None

class RabbitMQValidator:
    """Конкретная реализация через RabbitMQ RPC."""

    def __init__(self, amqp_url: str):
        self.rpc_client = RpcClient(amqp_url=amqp_url)

    async def connect(self):
        await self.rpc_client.connect()

    async def close(self):
        await self.rpc_client.close()

    async def jwt_validate(self, token: str):
        logger.info("Отправляю token в rabbitmq")
        response = await self.rpc_client.call(
            body=token,
            routing_key='jwt_validate_queue'
        )
        response_json = json.loads(response.decode())

        logger.info(f'Получили в сервисе с сообщениями:\n{response_json}')

        if response_json.get('status_code'):
            raise HTTPException(
                status_code=response_json.get('status_code'),
                detail=response_json.get('exception')
            )
        else:
            return GetUser.model_validate(response_json)

settings = get_settings()
rabbitmq_validator_instance = RabbitMQValidator(amqp_url=settings.amqp_url)
