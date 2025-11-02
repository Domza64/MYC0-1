from typing import Annotated, Optional
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.model.folder import Folder
from app.db.sqlite import get_session


router = APIRouter(prefix="/api/folders")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=list[Folder])
def get_all_folders(session: Session = Depends(get_session)):
    """
    Get all root-level folders.
    """
    folders = session.exec(
        select(Folder).where(Folder.parent_id == None)
    ).all()
    return folders

@router.get("/{folder_id}", response_model=list[Folder])
def get_subfolders(
    folder_id: int,
    session: Session = Depends(get_session),
):
    """
    Get subfolders of a specific folder.
    If no folder_id is provided, returns root-level folders.
    """
    folders = session.exec(
        select(Folder).where(Folder.parent_id == folder_id)
    ).all()
    return folders