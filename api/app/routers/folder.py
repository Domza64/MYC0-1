from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.models.folder import Folder
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.models.song import Song
from app.schemas.song import SongResponse

router = APIRouter(prefix="/api/folders")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[Folder], dependencies=[Depends(cookie)])
def get_all_folders(session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    """
    Get all root-level folders.
    """
    folders = session.exec(
        select(Folder).where(Folder.parent_id == None)
    ).all()
    return folders


@router.get("/songs/{folder_id}", response_model=list[SongResponse], dependencies=[Depends(cookie)])
def get_songs_in_folder(
    folder_id: int,
    session: Session = Depends(get_session),
    session_data: SessionData = Depends(verifier)
) -> list[SongResponse]:
    """
    Return all songs that belong directly to the given folder.
    """
    songs = session.exec(select(Song).where(Song.folder_id == folder_id)).all()

    return [SongResponse.model_validate(song) for song in songs]


@router.get("/{folder_id}", response_model=list[Folder], dependencies=[Depends(cookie)])
def get_subfolders(
    folder_id: int,
    session: Session = Depends(get_session),
    session_data: SessionData = Depends(verifier)
):
    """
    Get subfolders of a specific folder.
    If no folder_id is provided, returns root-level folders.
    """
    folders = session.exec(
        select(Folder).where(Folder.parent_id == folder_id)
    ).all()
    return folders