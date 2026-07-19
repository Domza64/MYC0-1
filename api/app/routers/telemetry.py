from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.schemas.success import SuccessResponse
from app.services import telemetry_service

router = APIRouter(prefix="/api/telemetry")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/play-song", response_model=SuccessResponse, dependencies=[Depends(cookie)])
def create_play_record(
        song_id: int,
        session: Session = Depends(get_session),
        session_data: SessionData = Depends(verifier)
) -> SuccessResponse:
    """
    Add song play history record
    """
    telemetry_service.add_play_record(session, song_id, session_data)

    return SuccessResponse(message="Play recorded")
