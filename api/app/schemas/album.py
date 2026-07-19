from pydantic import BaseModel, ConfigDict
from app.schemas.author import AuthorResponse


class AlbumResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str | None
    author: AuthorResponse | None
    album_art: str | None