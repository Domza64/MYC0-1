from pydantic import BaseModel, ConfigDict
from app.schemas.user import BasicUserResponse


class PlaylistCreateRequest(BaseModel):
    name: str
    description: str | None = None
    shared: bool

class PlaylistUpdateRequest(BaseModel):
    name: str
    description: str | None = None
    shared: bool

class AddSongsRequest(BaseModel):
    song_ids: list[int]

class AddSongsResponse(BaseModel):
    added_count: int

class PlaylistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    shared: bool
    updated_at: str
    created_at: str
    playlist_image: str | None
    creator: BasicUserResponse
