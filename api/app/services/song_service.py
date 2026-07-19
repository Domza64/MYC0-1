from typing import List
from sqlmodel import Session
from app.models.song import Song
from app.exceptions.domain.song import SongNotFoundException
from app.repositories import song_repository
from app.schemas.song import SongResponse
from app.models.song_rating import SongRating
from app.repositories import song_rating_repository


def get_songs(session: Session, user_id: int, offset: int, limit: int) -> List[SongResponse]:
    rows: list[tuple[Song, int | None]] = song_repository.get_songs(session, user_id, offset, limit)

    # Map to DTO here because the query returns user-specific data (rating),
    # which is not part of the Song ORM model and cannot be handled by generic router mapping.
    return [
        SongResponse.model_validate(song).model_copy(
            update={"rating": rating}
        )
        for song, rating in rows
    ]


def get_song(session: Session, user_id: int, song_id: int) -> SongResponse:
    song_data: tuple[Song, int | None] | None = song_repository.get_song(session, user_id, song_id)
    if not song_data:
        raise SongNotFoundException(song_id)

    # Map to DTO here because the query returns user-specific data (rating),
    # which is not part of the Song ORM model and cannot be handled by generic router mapping.
    return SongResponse.model_validate(song_data[0]).model_copy(
            update={"rating": song_data[1]}
        )


def rate_song(session: Session, user_id: int, song_id: int, rate: int) -> None:
    existing_rating: SongRating | None = song_rating_repository.get_rating(session, user_id, song_id)
    if not existing_rating:
        get_song(session, user_id, song_id) # Just call get_song, in case song doesn't exist, it will throw SongNotFoundException.
        new_rating = SongRating(song_id=song_id, user_id=user_id, rating=rate)
        song_rating_repository.add_rating(session, new_rating)
    else:
        existing_rating.rating = rate
        session.commit()
