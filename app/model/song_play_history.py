from typing import Optional
from sqlmodel import Field, SQLModel


class SongPlayHistory(SQLModel, table=True):
    # TODO: Composite indexes
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    song_id: int = Field(foreign_key="song.id", index=True)
    played_at: str = Field(index=True)
