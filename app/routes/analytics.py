from sqlalchemy.exc import IntegrityError
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlmodel import Session
from app.db.sqlite import get_session
from app.model.song_play_history import SongPlayHistory
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from datetime import datetime, timezone


router = APIRouter(prefix="/api/analytics")
SessionDep = Annotated[Session, Depends(get_session)]


# TODO: Maybe replace with middleware on song file route in future, or maybe not?
@router.post("/play-song", dependencies=[Depends(cookie)])
def get_album(song_id: int, session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    """
    Insert song play history record
    """
    
    play = SongPlayHistory(
        user_id=session_data.user_id,
        song_id=song_id,
        played_at=datetime.now(timezone.utc),
    )

    try:
        session.add(play)
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(status_code=404, detail="Song or user not found")

    return Response(status_code=200)
