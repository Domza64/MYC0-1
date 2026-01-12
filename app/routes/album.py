from typing import Annotated, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.model.album import Album, AlbumRead
from app.db.sqlite import get_session
from app.model.song import SongRead
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api/albums")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[AlbumRead], dependencies=[Depends(cookie)])
def get_all_albums(
        author_id: Optional[int] = Query(None, description="Filter albums by author ID"),
        session: Session = Depends(get_session), 
        session_data: SessionData = Depends(verifier)
    ) -> list[AlbumRead]:
    """
    Get all albums. Optionally filter by author_id.
    """
    statment = select(Album)
    if author_id is not None:
        statment = statment.where(Album.author_id == author_id)

    albums = session.exec(statment).all()
    return [AlbumRead.model_validate(album) for album in albums]


@router.get("/{album_id}", response_model=AlbumRead, dependencies=[Depends(cookie)])
def get_album(album_id: int, session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)) -> AlbumRead:
    """
    Get an album by ID.
    """
    album = session.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    
    return AlbumRead.model_validate(album)


@router.get("/{album_id}/songs", response_model=list[SongRead], dependencies=[Depends(cookie)])
def get_songs_in_album(
        album_id: int,
        session: Session = Depends(get_session),
        session_data: SessionData = Depends(verifier)
    ) -> list[SongRead]:
    """
    Get all songs in a specific album.
    """
    album = session.get(Album, album_id)
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")

    return [SongRead.model_validate(song) for song in album.songs]