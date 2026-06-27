from typing import Optional

from pydantic import field_validator
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel


class SongRating(SQLModel, table=True):
    __tablename__ = "song_rating"

    id: Optional[int] = Field(default=None, primary_key=True)

    user_id: int = Field(foreign_key="user.id")
    song_id: int = Field(foreign_key="song.id")

    rating: int = Field()

    @field_validator("rating")
    @classmethod
    def validate_rating(cls, value: int) -> int:
        if not (1 <= value <= 5):
            raise ValueError("rating must be between 1 and 5")
        return value

    __table_args__ = (
        UniqueConstraint("user_id", "song_id"),
    )