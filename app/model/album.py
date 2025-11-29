from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


class Album(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    author_id: Optional[int] = Field(default=None, foreign_key="author.id")
    album_art: Optional[str] = Field(default=None) # TODO: this should be set when creating Album
    author: Optional["Author"] = Relationship(back_populates="albums")
    songs: list["Song"] = Relationship(back_populates="album")
