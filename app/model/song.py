from typing import Optional
from pydantic import BaseModel
from sqlmodel import Field, SQLModel, Relationship


class Song(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: Optional[str] = Field(default=None, index=True)

    author_id: Optional[int] = Field(default=None, foreign_key="author.id")
    author: Optional["Author"] = Relationship(back_populates="songs")

    album_id: Optional[int] = Field(default=None, foreign_key="album.id")
    album: Optional["Album"] = Relationship(back_populates="songs")

    folder_id: Optional[int] = Field(default=None, foreign_key="folder.id", index=True)
    folder: Optional["Folder"] = Relationship(back_populates="songs")

    genre: Optional[str] = Field(default=None, index=True)
    year: Optional[int] = Field(default=None, index=True)
    file_path: str = Field()
    file_name: str = Field()
    duration: Optional[int] = Field(default=None, index=True)  # in seconds
    file_size: int = Field()  # in bytes
    file_format: str = Field()  # 'mp3', 'flac', etc.
    image: Optional[str] = Field(default=None)

# AuthorRead and AlbumRead are used in SongRead and have no connection to Author and Album models
class AuthorRead(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }


class AlbumRead(BaseModel):
    id: int
    title: str

    model_config = {
        "from_attributes": True
    }


class SongRead(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[AuthorRead] = None
    album: Optional[AlbumRead] = None
    genre: Optional[str] = None
    year: Optional[int] = None
    file_path: str
    file_name: str
    folder_id: Optional[int] = None
    duration: Optional[int] = None
    file_size: int
    file_format: str
    image: Optional[str] = None

    model_config = {
        "from_attributes": True
    }