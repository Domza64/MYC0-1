from typing import Annotated
from app.config import MUSIC_DIR
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.lib.file_utils import read_all_audio_files
from app.model.song import Song
from app.db.sqlite import get_session
from app.lib.db_utils import create_song
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/scan-library", dependencies=[Depends(cookie)])
def scan_files(session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    # Read all songs currently in filesystem
    scanned_songs = read_all_audio_files(MUSIC_DIR)

    # Build a set of file paths found in the filesystem
    scanned_paths = {song.file_path for song in scanned_songs}

    # Read all songs currently in DB
    db_songs = session.exec(select(Song)).all()
    db_paths = {song.file_path for song in db_songs}

    # Find differences
    new_paths = scanned_paths - db_paths
    removed_paths = db_paths - scanned_paths

    # Add new songs
    added_count = 0
    for song in scanned_songs:
        if song.file_path in new_paths:
            create_song(song, session)
            added_count += 1

    # Remove deleted songs
    removed_count = 0
    for path in removed_paths:
        song = session.exec(select(Song).where(Song.file_path == path)).first()
        if song:
            session.delete(song) # TODO - also delete orphaned folders and move function to db_utils
            removed_count += 1

    session.commit()

    return {
        "message": f"Library synced successfully.",
        "added": added_count,
        "removed": removed_count,
        "total": len(scanned_paths)
    }