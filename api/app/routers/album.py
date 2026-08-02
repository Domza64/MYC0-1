from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from app.models.album import Album
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.schemas.album import AlbumResponse
from app.services import album_service
from app.schemas.song import SongResponse

router = APIRouter(prefix="/api/albums")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[AlbumResponse], dependencies=[Depends(cookie)])
def get_all_albums(
        author_id: int | None = Query(None),
        session: Session = Depends(get_session), 
        _: SessionData = Depends(verifier)
    ) -> list[AlbumResponse]:
    """
    Get all albums. Optionally filter by author_id.
    """
    albums: list[Album] = album_service.get_albums(session, author_id)
    return [AlbumResponse.model_validate(album) for album in albums]


@router.get("/{album_id}", response_model=AlbumResponse, dependencies=[Depends(cookie)])
def get_album(
        album_id: int,
        session: Session = Depends(get_session),
        _: SessionData = Depends(verifier)
) -> AlbumResponse:
    """
    Get an album by ID.
    """
    album: Album = album_service.get_album(session, album_id)
    return AlbumResponse.model_validate(album)


@router.get("/{album_id}/songs", response_model=list[SongResponse], dependencies=[Depends(cookie)])
def get_songs_in_album(
        album_id: int,
        session: Session = Depends(get_session),
        session_data: SessionData = Depends(verifier)
    ) -> list[SongResponse]:
    """
    Get all songs in an album.
    """
    return album_service.get_songs(session, session_data.user_id, album_id)
