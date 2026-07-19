from typing import Annotated
from fastapi import APIRouter, Depends, Response, status
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.services import telemetry_service

router = APIRouter(prefix="/api/telemetry")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/play-song", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(cookie)])
def create_play_record(
        song_id: int,
        session: Session = Depends(get_session),
        session_data: SessionData = Depends(verifier)
) -> Response:
    """
    Add song play history record
    """
    telemetry_service.add_play_record(session, song_id, session_data)

    return Response(status_code=status.HTTP_204_NO_CONTENT)
