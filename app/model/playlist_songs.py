from sqlmodel import Field, SQLModel

class PlaylistSongs(SQLModel, table=True):
    song_id: int = Field(foreign_key="song.id", primary_key=True)
    playlist_id: int = Field(foreign_key="playlist.id", primary_key=True)
    position: int = Field(index=True)