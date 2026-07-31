from sqlmodel import SQLModel, Field

class SongFTS(SQLModel, table=True):
    __tablename__ = "song_fts"

    rowid: int = Field(primary_key=True)