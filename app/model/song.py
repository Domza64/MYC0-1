from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from app.model.folder import Folder


class Song(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    artist: str = Field(index=True)
    album: str = Field(index=True)
    genre: Optional[str] = Field(default=None, index=True)
    year: Optional[int] = Field(default=None, index=True)
    file_path: str = Field(index=True)
    folder_id: Optional[int] = Field(default=None, foreign_key="folder.id", index=True)
    duration: int = Field(index=True)  # in seconds
    file_size: int = Field(index=True)  # in bytes
    file_format: str = Field(index=True)  # 'mp3', 'flac', etc.
    album_art: Optional[str] = Field(default=None, index=True)
    play_count: int = Field(default=0, index=True)
    last_played: Optional[str] = Field(default=None, index=True)  # ISO string
    folder: Optional[Folder] = Relationship(back_populates="songs")
