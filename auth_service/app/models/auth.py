from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey

from ..core.postgres import BaseSchema


class User(BaseSchema):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # firstname: Mapped[str] = mapped_column(
    #     String,
    #     nullable=True
    # )
    username: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
    email: Mapped[str] = mapped_column(
        String,
        unique=True,
        nullable=False)
    hashed_password: Mapped[str] = mapped_column(
        String,
        nullable=False
    )



