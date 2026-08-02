from typing import Literal
from sqlmodel import Session
from datetime import datetime, timezone
from app.models.playlist import Playlist
from app.repositories import playlist_repository
from app.schemas.playlist import PlaylistCreateRequest, PlaylistUpdateRequest
from app.exceptions.domain.permissions import NotAllowedException
from app.exceptions.domain.playlist import PlaylistNotFoundException
from app.schemas.song import SongResponse
from app.repositories import song_repository
from app.models.song import Song
from app.models.playlist_songs import PlaylistSongs
from app.schemas.playlist import AddSongsRequest


def get_playlists(session: Session, user_id: int) -> list[Playlist]:
    """
    Returns all playlists created by and shared with the user.
    """
    return playlist_repository.get_playlists(session, user_id)


def create_playlist(session: Session, user_id: int, playlist_data: PlaylistCreateRequest) -> Playlist:
    """
    Creates a new playlist.
    """
    new_playlist = Playlist(
        name=playlist_data.name,
        description=playlist_data.description,
        shared=playlist_data.shared,
        user_id=user_id,
        updated_at=datetime.now(timezone.utc).isoformat(),
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    return playlist_repository.persist_playlist(session, new_playlist)


def get_songs(session: Session, user_id: int, playlist_id: int) -> list[SongResponse]:
    """
    Returns a list of songs from a playlist.
    """
    # Call get playlists only to check permissions
    _check_and_get_playlist(session, user_id, playlist_id, "view")

    # Map to DTO here because the query returns user-specific data (rating),
    # which is not part of the Song ORM model and cannot be handled by generic router mapping.
    songs: list[tuple[Song, int | None]] = song_repository.get_songs_from_playlist(session, user_id, playlist_id)
    return [
        SongResponse.model_validate(song).model_copy(
            update={"rating": rating}
        )
        for song, rating in songs
    ]


def get_playlist(session: Session, user_id, playlist_id) -> Playlist:
    """
    Returns a playlist by its ID.
    """
    return _check_and_get_playlist(session, user_id, playlist_id, "view")


def update_playlist(session: Session, user_id: int, playlist_id: int, data: PlaylistUpdateRequest) -> Playlist:
    """
    Updates a playlist by its ID.
    """
    playlist: Playlist = _check_and_get_playlist(session, user_id, playlist_id, "edit")

    playlist.name = data.name
    playlist.description = data.description
    playlist.shared = data.shared
    playlist.updated_at = datetime.now(timezone.utc).isoformat()

    return playlist_repository.persist_playlist(session, playlist)


def remove_song(session: Session, user_id: int, playlist_id: int, song_id: int) -> None:
    """
    Removes a song from a playlist.
    """
    playlist: Playlist = _check_and_get_playlist(session, user_id, playlist_id, "edit")

    playlist_repository.remove_song(session, playlist_id, song_id)

    playlist.updated_at = datetime.now(timezone.utc).isoformat()
    playlist_repository.persist_playlist(session, playlist)


def delete_playlist(session: Session, user_id: int, playlist_id: int) -> None:
    """
    Deletes a playlist.
    """
    playlist = _check_and_get_playlist(session, user_id, playlist_id, "edit")
    playlist_repository.delete_playlist(session, playlist)


def add_songs(session: Session, user_id: int, playlist_id: int, data: AddSongsRequest) -> int:
    """
    Add songs to a playlist.
    """
    playlist: Playlist = _check_and_get_playlist(session, user_id, playlist_id, "edit")

    current_max_position: int = playlist_repository.get_last_song_position(session, playlist_id)
    existing_song_ids: list[int] = playlist_repository.get_songs_ids_from_playlist(session, playlist_id)
    songs_to_add: list[PlaylistSongs] = []

    for song_id in data.song_ids:
        if song_id in existing_song_ids:
            continue

        current_max_position += 1
        playlist_song = PlaylistSongs(
            playlist_id=playlist_id,
            song_id=song_id,
            position=current_max_position
        )
        songs_to_add.append(playlist_song)

    if len(songs_to_add) > 0:
        playlist_repository.add_songs(session, songs_to_add)
        playlist.updated_at = datetime.now(timezone.utc).isoformat()
        playlist_repository.persist_playlist(session, playlist)
        # TODO: fire a background task to set an image for a playlist

    return len(songs_to_add)


def _check_and_get_playlist(
    session: Session,
    user_id: int,
    playlist_id: int,
    permission: Literal["view", "edit"] # In future some people may be able to just view, right now allow everyone to edit if playlist is shared
) -> Playlist:
    """
    Returns a playlist by its ID and checks user permissions.
    """
    playlist: Playlist | None = playlist_repository.get_playlist(session, playlist_id)
    if not playlist:
        raise PlaylistNotFoundException(playlist_id)

    is_owner: bool = playlist.user_id == user_id
    if not is_owner and not playlist.shared:
        raise NotAllowedException(f"You are not allowed to {permission} this playlist.")

    return playlist
