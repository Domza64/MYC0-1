from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.model.song import Song, SongRead
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api/songs")
SessionDep = Annotated[Session, Depends(get_session)]

# TODO: Getting songs for albuims, playlists or authors should be in their respective routers, not here.
@router.get("", response_model=list[SongRead], dependencies=[Depends(cookie)])
def get_all_songs(session: SessionDep, offset: int = 0, limit: int = 10, session_data: SessionData = Depends(verifier)) -> list[SongRead]:
    """
    Get all songs.
    """
    songs = session.exec(select(Song).offset(offset).limit(limit)).all()

    return [SongRead.model_validate(song) for song in songs]


@router.get("/{song_id}", response_model=SongRead, dependencies=[Depends(cookie)])
def read_song(song_id: int, session: SessionDep, session_data: SessionData = Depends(verifier)) -> SongRead:
    """
    Get a song by its ID.
    """
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    
    return SongRead.model_validate(song)


@router.get("/folder/{folder_id}", response_model=list[SongRead], dependencies=[Depends(cookie)])
def get_songs_in_folder(
    folder_id: int,
    session: Session = Depends(get_session),
    session_data: SessionData = Depends(verifier)
) -> list[SongRead]:
    """
    Return all songs that belong directly to the given folder.
    """
    songs = session.exec(select(Song).where(Song.folder_id == folder_id)).all()

    return [SongRead.model_validate(song) for song in songs]

