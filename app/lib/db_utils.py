import os
from sqlmodel import Session, select
from app.model.song import Song
from app.model.folder import Folder


def get_or_create_folder(session: Session, folder_path: str) -> Folder:
    """
    Ensure that a folder and all its parent folders exist in the DB.
    Returns the deepest folder.
    """
    parts = folder_path.strip("/").split("/")
    current_path = ""
    parent = None

    for part in parts:
        current_path = f"{current_path}/{part}" if current_path else part

        folder = session.exec(select(Folder).where(Folder.path == current_path)).first()
        if not folder:
            folder = Folder(name=part, path=current_path, parent_id=parent.id if parent else None)
            session.add(folder)
            session.commit()
            session.refresh(folder)
        parent = folder

    return parent


def insert_song(song: Song, session: Session) -> Song:
    """
    Creates a Song entry and ensures its folder structure exists.
    """
    folder_path = os.path.dirname(song.file_path)
    folder = get_or_create_folder(session, folder_path)

    song.folder_id = folder.id
    session.add(song)
    session.commit()
    session.refresh(song)
    return song
