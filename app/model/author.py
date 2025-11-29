from typing import Optional
from sqlmodel import Field, Relationship, SQLModel


class Author(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    songs: list["Song"] = Relationship(back_populates="author")
    albums: list["Album"] = Relationship(back_populates="author")