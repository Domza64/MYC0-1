from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class Folder(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    path: str = Field(index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="folder.id")
    parent: Optional["Folder"] = Relationship(back_populates="children", sa_relationship_kwargs={"remote_side": "Folder.id"})
    children: list["Folder"] = Relationship(back_populates="parent")
    songs: list["Song"] = Relationship(back_populates="folder")