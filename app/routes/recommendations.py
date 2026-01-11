from typing import Annotated, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from app.db.sqlite import get_session
from app.model.song import Song, SongRead
from app.model.song_play_history import SongPlayHistory
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api/recommendations")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/recently-played", dependencies=[Depends(cookie)])
def recently_played_unique(
    session: Session = Depends(get_session),
    session_data: SessionData = Depends(verifier),
    limit: int = 15,
) -> List[SongRead]:
    """
    Return the list of recently played unique songs for the current user
    """

    # Subquery: get latest play per song
    subq = (
        select(
            SongPlayHistory.song_id,
            func.max(SongPlayHistory.played_at).label("last_played")
        )
        .where(SongPlayHistory.user_id == session_data.user_id)
        .group_by(SongPlayHistory.song_id)
        .subquery()
    )

    # Join with Song to fetch full song info
    stmt = (
        select(Song)
        .join(subq, subq.c.song_id == Song.id)
        .order_by(subq.c.last_played.desc())
        .limit(limit)
    )

    songs = session.exec(stmt).all()

    # Convert to Pydantic models
    return [SongRead.model_validate(song) for song in songs]