from typing import Annotated, List
from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session
from app.models.playlist import Playlist
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.schemas.playlist import PlaylistResponse, PlaylistCreateRequest, PlaylistUpdateRequest, AddSongsRequest, AddSongsResponse
from app.services import playlist_service
from app.schemas.song import SongResponse

router = APIRouter(prefix="/api/playlists")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[PlaylistResponse], dependencies=[Depends(cookie)])
def get_all_playlists(
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> list[PlaylistResponse]:
    """
    Get all playlists.
    """
    playlists: List[Playlist] = playlist_service.get_playlists(session, session_data.user_id)
    return [PlaylistResponse.model_validate(playlist) for playlist in playlists]


@router.post("", response_model=PlaylistResponse, dependencies=[Depends(cookie)])
def create_playlist(
    playlist_data: PlaylistCreateRequest,
    session: SessionDep,
    session_data: SessionData = Depends(verifier)
) -> PlaylistResponse:
    """
    Create a new playlist.
    """
    playlist = playlist_service.create_playlist(session, session_data.user_id, playlist_data)
    return PlaylistResponse.model_validate(playlist)


@router.get("/songs/{playlist_id}", response_model=list[SongResponse], dependencies=[Depends(cookie)])
def get_playlist_songs(
        playlist_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> list[SongResponse]:
    """
    Get all songs in a playlist.
    """
    return playlist_service.get_songs(session, session_data.user_id, playlist_id)


@router.get("/{playlist_id}", response_model=PlaylistResponse, dependencies=[Depends(cookie)])
def get_playlist(
        playlist_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> PlaylistResponse:
    """
    Get a playlist by its ID.
    """
    playlist = playlist_service.get_playlist(session, session_data.user_id, playlist_id)
    return PlaylistResponse.model_validate(playlist)


@router.patch("/{playlist_id}", response_model=PlaylistResponse, dependencies=[Depends(cookie)])
def update_playlist(
        playlist_id: int,
        data: PlaylistUpdateRequest,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> PlaylistResponse:
    """
    Update playlist.
    """
    updated_playlist: Playlist = playlist_service.update_playlist(session, session_data.user_id, playlist_id, data)
    return PlaylistResponse.model_validate(updated_playlist)


@router.delete("/{playlist_id}/{song_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(cookie)])
def remove_song_from_playlist(
        playlist_id: int,
        song_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)):
    """
    Remove a song from a playlist.
    """
    playlist_service.remove_song(session, session_data.user_id, playlist_id, song_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/{playlist_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(cookie)])
def delete_playlist(
        playlist_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
):
    """
    Delete a playlist.
    """
    playlist_service.delete_playlist(session, session_data.user_id, playlist_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/songs/{playlist_id}", response_model=AddSongsResponse, dependencies=[Depends(cookie)])
def add_songs_to_playlist(
        playlist_id: int,
        data: AddSongsRequest,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
):
    """
    Add songs to a playlist.
    """
    added_count = playlist_service.add_songs(session, session_data.user_id, playlist_id, data)
    return AddSongsResponse(added_count=added_count)
