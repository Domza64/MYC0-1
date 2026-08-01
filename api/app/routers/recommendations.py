from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.schemas.song import SongResponse
from app.services import song_service

router = APIRouter(prefix="/api/recommendations")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/recently-played", response_model=list[SongResponse], dependencies=[Depends(cookie)])
def recently_played_unique(
    session: Session = Depends(get_session),
    session_data: SessionData = Depends(verifier),
    page: int = 0,
) -> List[SongResponse]:
    """
    Return the list of recently played unique songs for the current user
    """
    return song_service.recently_played_songs(session, session_data.user_id, page)
