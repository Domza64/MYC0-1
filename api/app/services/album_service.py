from sqlmodel import Session
from app.models.album import Album
from app.repositories import album_repository, song_repository
from app.exceptions.domain.album import AlbumNotFoundException
from app.models.song import Song
from app.schemas.song import SongResponse


def get_albums(session: Session, author_id: int | None) -> list[Album]:
    """
    Returns all albums or all albums belonging to an author.
    """
    return album_repository.get_albums(session, author_id)


def get_album(session: Session, album_id: int) -> Album:
    """
    Returns album by id.
    """
    album: Album | None = album_repository.get_album(session, album_id)
    if not album:
        raise AlbumNotFoundException(album_id)

    return album


def get_songs(session: Session, user_id: int, album_id: int) -> list[SongResponse]:
    """
    Returns a list of songs from an album.
    """
    album: Album | None = album_repository.get_album(session, album_id)
    if not album:
        raise AlbumNotFoundException(album_id)

    # Map to DTO here because the query returns user-specific data (rating),
    # which is not part of the Song ORM model and cannot be handled by generic router mapping.
    songs: list[tuple[Song, int | None]] = song_repository.get_songs_from_album(session, user_id, album_id)
    return [
        SongResponse.model_validate(song).model_copy(
            update={"rating": rating}
        )
        for song, rating in songs
    ]
