from typing import Annotated
from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.services import song_service
from app.schemas.song import SongResponse, SongRateRequest

router = APIRouter(prefix="/api/songs")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[SongResponse], dependencies=[Depends(cookie)])
def get_all_songs(
        session: SessionDep,
        offset: int = 0, # TODO: Refactor to be page instead of offset, to aligned with rest of the application
        limit: int = 10,
        session_data: SessionData = Depends(verifier)
) -> list[SongResponse]:
    """
    Get all songs.
    """
    return song_service.get_songs(session, session_data.user_id, offset, limit)


@router.get("/{song_id}", response_model=SongResponse, dependencies=[Depends(cookie)])
def read_song(
        song_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> SongResponse:
    """
    Get a song by its ID.
    """
    return song_service.get_song(session, session_data.user_id, song_id)


@router.put("/{song_id}/rating", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(cookie)])
def rate_song(
        song_id: int,
        rate_request: SongRateRequest,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> Response:
    """
    Set a rate for a song.
    """
    song_service.rate_song(session, session_data.user_id, song_id, rate_request.rate)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
