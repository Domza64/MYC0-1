from typing import Optional
from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel


class Album(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    author_id: Optional[int] = Field(default=None, foreign_key="author.id")
    album_art: Optional[str] = Field(default=None) # TODO: this should be set when creating Album
    author: Optional["Author"] = Relationship(back_populates="albums")
    songs: list["Song"] = Relationship(back_populates="album")


class AuthorRead(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }
    

class AlbumRead(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[AuthorRead] = None
    album_art: Optional[str] = "default.png"

    model_config = {
        "from_attributes": True
    }
