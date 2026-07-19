from sqlmodel import Session, select
from sqlalchemy import and_
from app.models.song import Song
from app.models.song_rating import SongRating


def get_songs(session: Session, user_id: int, offset: int, limit: int) -> list[tuple[Song, int | None]]:
    statement = (
        select(Song, SongRating.rating)
        .outerjoin(
            SongRating,
            and_(
                SongRating.song_id == Song.id,
                SongRating.user_id == user_id,
            ),
        )
        .offset(offset)
        .limit(limit)
    )

    return list(session.exec(statement).all())


def get_song(session: Session, user_id: int, song_id: int) -> tuple[Song, int | None] | None:
    statement = (
        select(Song, SongRating.rating)
        .outerjoin(
            SongRating,
            and_(
                SongRating.song_id == Song.id,
                SongRating.user_id == user_id,
            ),
        )
        .where(Song.id == song_id)
    )

    return session.exec(statement).one_or_none()