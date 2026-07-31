from sqlmodel import Session, select, text
from sqlalchemy import and_
from app.models.song import Song
from app.models.song_rating import SongRating
from app.models.song_fts import SongFTS


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


def search(session: Session,user_id: int, query: str, limit: int, offset: int,) -> list[tuple[Song, int | None]]:
    fts_query = f"{query}*"

    statement = (
        select(Song, SongRating.rating)
        .join(SongFTS, SongFTS.rowid == Song.id)
        .outerjoin(
            SongRating,
            and_(
                SongRating.song_id == Song.id,
                SongRating.user_id == user_id,
            ),
        )
        .where(text("song_fts MATCH :query"))
        .order_by(text("bm25(song_fts)"))
        .limit(limit)
        .offset(offset)
    )

    return list(
        session.exec(
            statement,
            params={"query": fts_query},
        ).all()
    )