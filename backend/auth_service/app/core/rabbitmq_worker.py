import asyncio
from typing import Optional

import aio_pika
from aio_pika.abc import AbstractIncomingMessage, AbstractRobustConnection, AbstractExchange


import os

from .logger_config import logger
from ..config import get_settings
from .dependecies import get_current_user, get_auth_repository


async def process_validate_jwt(
        message: AbstractIncomingMessage, default_exchange: AbstractExchange
):
    """ Обрабатывает входящий RPC-запрос на проверку jwt """
    logger.info("Пришел в функцию для обработки jwt")
    async with message.process():
        response = b'false'
        # try:
            # print(str(message.body.decode()))
        token = message.body.decode()
        response = await get_current_user(
                token=token,
                auth_repo=get_auth_repository
        )

        # except Exception as e:
        #     print(e)

        if message.reply_to and message.correlation_id:
            await default_exchange.publish(
                aio_pika.Message(
                    body=response,
                    correlation_id=message.correlation_id
                ),
                routing_key=message.reply_to
            )


async def run_consumer():
    """Запускает consumer'а, который слушает очередь RPC-запросов."""
    connection: Optional[AbstractRobustConnection] = None
    logger.info("Пробую запустить consumer")
    try:
        connection = await aio_pika.connect_robust(settings.amqp_url)
        logger.info("Пробую создать connect")
        async with connection:
            channel = await connection.channel() # Создаем канал связи внутри соединения
            await channel.set_qos(prefetch_count=1) # Устанавливаем, что берем по 1 сообщению за раз

            default_exchange = channel.default_exchange # Обменник по умолчанию. отправляет сообщения по routing_key

            queue = await channel.declare_queue("jwt_validate_queue")

            await queue.consume( # Обрабатываем каждое входящее сообщение -> в функцию выше
                lambda message: process_validate_jwt(message, default_exchange)
            )
            logger.info("Запустил консьюмера")

            await asyncio.Future()

    except asyncio.CancelledError:
        pass
    finally:
        if connection and not connection.is_closed:
            await connection.close()

    logger.info("Запустил consumer")

settings = get_settings()