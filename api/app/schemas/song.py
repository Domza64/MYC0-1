from pydantic import BaseModel, ConfigDict, Field
from app.schemas.album import AlbumResponse
from app.schemas.author import AuthorResponse


class SongResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str | None
    author: AuthorResponse | None
    album: AlbumResponse | None
    genre: str | None
    year: int | None
    file_path: str
    file_name: str
    folder_id: int | None
    duration: int | None
    file_size: int
    file_format: str
    image: str | None
    rating: int | None = None # User specific rating, not a field in Song from db

class SongRateRequest(BaseModel):
    rate: int = Field(ge=1, le=5)
