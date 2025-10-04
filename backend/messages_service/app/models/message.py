from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey

from ..core.postgres import BaseSchema



# class User(BaseSchema):
#     __tablename__ = 'users'
#
#     id: Mapped[int] = mapped_column(
#         Integer,
#         nullable=False,
#         primary_key=True,
#         autoincrement=True
#     )
#
#     files: Mapped[List["File"]] = relationship(back_populates='user')

class File(BaseSchema):
    __tablename__ = 'files'

    id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        primary_key=True,
        autoincrement=True
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    extension: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    chat_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            'chats.id',
            ondelete='cascade'
        ),
        nullable=False,
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )

    chat: Mapped["Chat"] = relationship(back_populates='files')

class Chat(BaseSchema):
    __tablename__ = 'chats'

    id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        primary_key=True,
        autoincrement=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )


    files: Mapped[List["File"]] = relationship(back_populates='chat')



