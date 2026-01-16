from typing import Annotated
from app.config import MUSIC_DIR
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.lib.file_utils import read_all_audio_files
from app.lib.mp3lib import create_song
from app.model.song import Song
from app.db.sqlite import get_session
from app.lib.db_utils import insert_song
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]


# TODO: Make this async background task cause this is not a good now but works for testing
@router.post("/scan-library", dependencies=[Depends(cookie)])
def scan_files(session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    # All songs and paths
    scanned_files = read_all_audio_files(MUSIC_DIR)
    scanned_paths = {str(song[1]) for song in scanned_files} # file_path is at index 0

    # Read all songs currently in DB (costly?)
    db_songs = session.exec(select(Song)).all()
    db_paths = {song.file_path for song in db_songs}
    db_songs = set([song.file_name for song in db_songs])
    
    # Find differences
    removed_paths = db_paths - scanned_paths

    # Add new songs
    added_count = 0
    for file_path, relative_path in scanned_files:
        new_song = create_song(session, file_path, relative_path)
        if file_path.name in db_songs:
            continue
        insert_song(new_song, session)
        added_count += 1

    # Remove deleted songs
    removed_count = 0
    for path in removed_paths:
        song = session.exec(select(Song).where(Song.file_path == path)).first()
        if song:
            session.delete(song)
            removed_count += 1

    session.commit()

    return {
        "detail": "Library synced successfully.",
        "added": added_count,
        "removed": removed_count,
        "total": len(scanned_paths)
    }