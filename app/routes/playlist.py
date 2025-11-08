from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, select
from app.model.playlist import Playlist
from app.db.sqlite import get_session
from app.model.playlist_songs import PlaylistSongs
from app.model.song import Song
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api/playlists")
SessionDep = Annotated[Session, Depends(get_session)]


class PlaylistData(BaseModel):
    name: str
    description: Optional[str]
    shared: bool


@router.get("", response_model=list[Playlist], dependencies=[Depends(cookie)])
def get_all_playlists(session: SessionDep, session_data: SessionData = Depends(verifier)) -> list[Playlist]:
    """
    Get all playlists.
    """
    playlists = session.exec(select(Playlist).where((Playlist.user_id == session_data.user_id) | (Playlist.shared == True))).all()
    return playlists


@router.post("", response_model=Playlist, dependencies=[Depends(cookie)])
def create_playlist(playlist_data: PlaylistData, session: SessionDep, session_data: SessionData = Depends(verifier)) -> Playlist:
    """
    Create a new playlist.
    """
    new_playlist = Playlist(name=playlist_data.name, description=playlist_data.description, shared=playlist_data.shared, user_id=session_data.user_id)
    session.add(new_playlist)
    session.commit()
    session.refresh(new_playlist)
    return new_playlist

@router.get("/{playlist_id}", response_model=list[Song], dependencies=[Depends(cookie)])
def get_playlist_songs(playlist_id: int, session: SessionDep, session_data: SessionData = Depends(verifier)) -> list[Song]:
    """
    Get all songs in a playlist.
    """
    playlist = session.get(Playlist, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    if playlist.user_id != session_data.user_id and not playlist.shared:
        raise HTTPException(status_code=403, detail="You do not have permission to access this playlist")

    songs = session.exec(
        select(Song)
        .join(PlaylistSongs, PlaylistSongs.song_id == Song.id)
        .where(PlaylistSongs.playlist_id == playlist_id)
        .order_by(PlaylistSongs.position)
    ).all()
    return songs

@router.post("/{playlist_id}/songs", dependencies=[Depends(cookie)])
def add_songs_to_playlist(playlist_id: int, song_ids: list[int], session: SessionDep, session_data: SessionData = Depends(verifier)):
    """
    Add songs to a playlist.
    """
    playlist = session.get(Playlist, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    if playlist.user_id != session_data.user_id and not playlist.shared:
        raise HTTPException(status_code=403, detail="You do not have permission to access this playlist")
    
    songs = []
    for song_id in song_ids:
        song = session.get(Song, song_id)
        songs.append(song)
        
    for song in songs:
        playlist_songs = PlaylistSongs(playlist_id=playlist_id, song_id=song_id, position=0)
        session.add(playlist_songs)
        session.commit()
    return {"message": f"{len(songs)} song(s) added to playlist successfully"}