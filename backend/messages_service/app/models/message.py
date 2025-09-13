from datetime import datetime
from typing import List

from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import  Integer, DateTime, String, func, ForeignKey

from ..core.postgres import BaseSchema



class User(BaseSchema):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        primary_key=True,
        autoincrement=True
    )

    files: Mapped[List["File"]] = relationship(back_populates='user')

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

    type: Mapped[str] = mapped_column(
        String,
        nullable=False,
    )

    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            'users.id',
            ondelete='cascade'
        ),
        nullable=False
    )

    user: Mapped["User"] = relationship(back_populates='files')