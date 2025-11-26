from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True)
    role: str = Field(index=True)
    password: str = Field(index=False)
    playlists: list["Playlist"] = Relationship(back_populates="user", cascade_delete=True)
    user_image: Optional[str] = Field(default=None)
