from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Response
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

@router.get("/songs/{playlist_id}", response_model=list[Song], dependencies=[Depends(cookie)])
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

@router.get("/{playlist_id}", response_model=Playlist, dependencies=[Depends(cookie)])
def read_playlist(playlist_id: int, session: SessionDep, session_data: SessionData = Depends(verifier)) -> Playlist:
    """
    Get a playlist by its ID.
    """
    playlist = session.get(Playlist, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    if playlist.user_id != session_data.user_id and not playlist.shared:
        raise HTTPException(status_code=403, detail="You do not have permission to access this playlist")
    return playlist

@router.delete("/{playlist_id}/{song_id}", dependencies=[Depends(cookie)])
def remove_song_from_playlist(playlist_id: int, song_id: int, session: SessionDep, session_data: SessionData = Depends(verifier)):
    """
    Remove a song from a playlist.
    """
    playlist = session.get(Playlist, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    if playlist.user_id != session_data.user_id and not playlist.shared:
        raise HTTPException(status_code=403, detail="You do not have permission to access this playlist")
    

    # This is not multiple songs, it's playlist_songs object thing that represents one song in one playlist in playlist_songs table
    playlist_songs = session.get(PlaylistSongs, (song_id, playlist_id))
    if not playlist_songs:
        raise HTTPException(status_code=404, detail="Song not found in playlist")
    
    session.delete(playlist_songs)
    session.commit()
    return Response(status_code=200)

class AddSongsRequest(BaseModel):
    song_ids: list[int]

@router.post("/songs/{playlist_id}", dependencies=[Depends(cookie)])
def add_songs_to_playlist(playlist_id: int, data: AddSongsRequest, session: SessionDep, session_data: SessionData = Depends(verifier)):
    """
    Add songs to a playlist.
    """
    playlist = session.get(Playlist, playlist_id)
    if not playlist:
        raise HTTPException(status_code=404, detail="Playlist not found")
    
    if playlist.user_id != session_data.user_id and not playlist.shared:
        raise HTTPException(status_code=403, detail="You do not have permission to access this playlist")
    
    added_count = 0
    for song_id in data.song_ids:
        # Skip if song already exists in playlist
        if session.get(PlaylistSongs, (song_id, playlist_id)):
            continue

        # Determine next position
        max_pos = session.exec(
            select(PlaylistSongs.position)
            .where(PlaylistSongs.playlist_id == playlist_id)
            .order_by(PlaylistSongs.position.desc())
        ).first() or 0

        playlist_song = PlaylistSongs(
            playlist_id=playlist_id,
            song_id=song_id,
            position=max_pos + 1
        )
        session.add(playlist_song)
        added_count += 1

    session.commit()
    return {"added_count": added_count}