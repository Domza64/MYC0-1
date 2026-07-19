from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime
from sqlalchemy import Index


class SongPlayRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")
    song_id: int = Field(foreign_key="song.id")
    played_at: datetime

    __table_args__ = (
        Index("ix_play_user_date", "user_id", "played_at"),
    )