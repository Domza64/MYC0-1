from typing import Annotated
from app.config import MUSIC_DIR
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.model.song import Song
from app.db.sqlite import get_session


router = APIRouter(prefix="/api/songs")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[Song])
def get_all_songs(session: SessionDep, offset: int = 0, limit: int = 10) -> list[Song]:
    """
    Get all songs.
    """
    songs = session.exec(select(Song).offset(offset).limit(limit)).all()
    return songs


@router.get("/{song_id}", response_model=Song)
def read_song(song_id: int, session: SessionDep) -> Song:
    """
    Get a song by its ID.
    """
    song = session.get(Song, song_id)
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    return song


@router.get("/folder/{folder_id}", response_model=list[Song])
def get_songs_in_folder(
    folder_id: int,
    session: Session = Depends(get_session),
) -> list[Song]:
    """
    Return all songs that belong directly to the given folder.
    """
    songs = session.exec(
        select(Song).where(Song.folder_id == folder_id)
    ).all()

    return songs
