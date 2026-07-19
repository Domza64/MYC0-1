from sqlmodel import Session
from datetime import datetime, timezone
from sqlalchemy.exc import IntegrityError
from app.models.song_play_history import SongPlayRecord
from app.repositories import telemetry_repository
from app.session.session_data import SessionData


def add_play_record(session: Session, song_id: int, session_data: SessionData) -> None:
    """
    Add song play history record
    """

    play_record = SongPlayRecord(
        user_id=session_data.user_id,
        song_id=song_id,
        played_at=datetime.now(timezone.utc),
    )

    try:
        telemetry_repository.save_play_record(session, play_record)
    except IntegrityError:
        session.rollback()
        # TODO: Log error, but still return success
