from typing import Optional
from sqlmodel import Field, SQLModel

class PlaylistSongs(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    song_id: int = Field(foreign_key="song.id", index=True)
    playlist_id: int = Field(foreign_key="playlist.id", index=True)
    position: int = Field(index=True)