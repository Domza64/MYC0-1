from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


class Playlist(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = Field(default=None, index=True)
    shared: bool = Field(default=False, index=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    playlist_image: Optional[str] = Field(default=None)
    user: Optional["User"] = Relationship(back_populates="playlists")