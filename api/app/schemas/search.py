from typing import List
from pydantic import BaseModel
from app.schemas.song import SongResponse
from app.schemas.album import AlbumResponse
from app.schemas.author import AuthorResponse


class SearchResponse(BaseModel):
    songs: List[SongResponse] = []
    albums: List[AlbumResponse] = []
    authors: List[AuthorResponse] = []
