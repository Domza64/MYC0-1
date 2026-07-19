from sqlmodel import Session, select
from app.models.song_rating import SongRating


def get_rating(session: Session, user_id: int, song_id: int) -> SongRating | None:
    statement = (
        select(SongRating)
        .where(
            SongRating.user_id == user_id,
            SongRating.song_id == song_id,
        )
    )

    return session.exec(statement).one_or_none()


def add_rating(session: Session, new_rating: SongRating) -> None:
    session.add(new_rating)
    session.commit()
