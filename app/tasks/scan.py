
from app.config import MUSIC_DIR
from sqlmodel import select, Session

from app.db.sqlite import engine
from app.lib.mp3lib import create_song
from app.model.song import Song
from app.lib.db_utils import insert_song
from app.lib.file_utils import read_all_audio_files

# TODO: Prevent multiple of same task running, raise app error if task is already running

# SCAN V2 PLAN
# save scan result to db, user can later review it, have some inmemory object that provides scan info, scan status, progress...
"""
1 - get list of all files
2 - compute identity hash (audio content only)
3 - load all songs from DB
4 - determine:
      - new songs (hash not in DB)
      - existing songs (hash in DB)
5 - for existing songs:
      - compare metadata fields directly
      - update if changed
6 - delete songs whose hash no longer exists in filesystem
7 - add new songs
7 - commit
"""

def library_scan():
    with Session(engine) as session:
        # All songs and paths
        scanned_files = read_all_audio_files(MUSIC_DIR)
        scanned_paths = {str(song[1]) for song in scanned_files}  # file_path is at index 0

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

        print("SCAN DONE:", {
            "detail": "Library synced successfully.",
            "added": added_count,
            "removed": removed_count,
            "total": len(scanned_paths)
        })