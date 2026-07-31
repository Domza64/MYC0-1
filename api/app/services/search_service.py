from typing import List
from sqlmodel import Session
from app.schemas.search import SearchResponse
from app.schemas.song import SongResponse
from app.schemas.album import AlbumResponse
from app.schemas.author import AuthorResponse
from app.repositories import song_repository


def search(session: Session, user_id: int, query: str, page: int) -> SearchResponse:
    """Returns list of songs, authors and albums that match the search query"""
    limit = 15
    offset = page * limit

    data = song_repository.search(session, user_id, query, limit, offset)
    print(data)

    songs: List[SongResponse] = [
        SongResponse.model_validate(song).model_copy(
            update={"rating": rating}
        )
        for song, rating in song_repository.search(session, user_id, query, limit, offset)
    ]

    # TODO: Implement search for albums and authors.
    albums: List[AlbumResponse] = []
    authors: List[AuthorResponse] = []

    # Map to DTO here because this function requires joining data from multiple tables into
    # one big response, so it cannot be handled by generic router mapping.
    return SearchResponse(songs=songs, albums=albums, authors=authors)