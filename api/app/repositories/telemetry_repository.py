from sqlmodel import Session
from app.models.song_play_history import SongPlayRecord


def save_play_record(session: Session, play_record: SongPlayRecord) -> None:
    session.add(play_record)
    session.commit()
