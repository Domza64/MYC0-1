from sqlalchemy import func
from typing import cast
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.models.playlist import Playlist
from app.models.playlist_songs import PlaylistSongs


def get_playlists(session: Session, user_id: int) -> list[Playlist]:
    """
    Get all playlists created by and shared with the user.
    """
    statement = (
        select(Playlist)
        .options(selectinload(Playlist.creator))
        .where(
            (Playlist.user_id == user_id) | (Playlist.shared == True)
        )
    )

    return list(session.exec(statement).all())


# TODO: Update all other repositories to use this persist instead of separate create/update entity...
#  This moves all session.commit/refresh from services to repository layer
def persist_playlist(session: Session, playlist: Playlist) -> Playlist:
    """
    Creates or updates a playlist.
    """
    session.add(playlist)
    session.commit()
    session.refresh(playlist)
    return playlist


def get_playlist(session: Session, playlist_id: int) -> Playlist | None:
    """
    Returns playlist or None by playlist_id.
    """
    return session.exec(select(Playlist).where(Playlist.id == playlist_id)).one_or_none()


def remove_song(session: Session, playlist_id: int, song_id: int) -> None:
    """
    Removes a song from a playlist if it exists.
    """
    playlist_song_record = session.get(PlaylistSongs, (song_id, playlist_id))
    if playlist_song_record:
        session.delete(playlist_song_record)

    session.commit()


def delete_playlist(session: Session, playlist: Playlist) -> None:
    """
    Deletes a playlist.
    """
    session.delete(playlist)
    session.commit()


def get_songs_ids_from_playlist(session: Session, playlist_id: int) -> list[int]:
    """
    Returns a list of all songs ids from a playlist.
    """
    statement = (
        select(PlaylistSongs.song_id)
        .where(PlaylistSongs.playlist_id == playlist_id)
    )
    return list(session.exec(statement).all())


def get_last_song_position(session: Session, playlist_id: int) -> int:
    """
    Returns last position of a song in a playlist.
    """
    statement = (
        select(func.max(PlaylistSongs.position))
        .where(PlaylistSongs.playlist_id == playlist_id)
    )

    result = cast(int | None, session.exec(statement).one())
    return result or 0


def add_songs(session: Session, songs_to_add: list[PlaylistSongs]) -> None:
    """
    Adds songs to a playlist.
    """
    session.add_all(songs_to_add)
    session.commit()
