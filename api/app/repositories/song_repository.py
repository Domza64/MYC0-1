from sqlmodel import Session, select
from sqlalchemy import and_, text, func
from app.models.song import Song
from app.models.song_rating import SongRating
from app.models.song_play_record import SongPlayRecord


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


def search(session: Session, user_id: int, query: str, limit: int, offset: int) -> list[tuple[Song, int | None]]:
    fts_query = f"{query}*"

    statement = text("""
        SELECT
            song.*,
            song_rating.rating
        FROM song_fts
        JOIN song
            ON song.id = song_fts.rowid
        LEFT JOIN song_rating
            ON song_rating.song_id = song.id
           AND song_rating.user_id = :user_id
        WHERE song_fts MATCH :query
        ORDER BY bm25(song_fts)
        LIMIT :limit
        OFFSET :offset
    """)

    result = session.execute(
        statement,
        {
            "query": fts_query,
            "user_id": user_id,
            "limit": limit,
            "offset": offset,
        }
    )

    return [
        (Song.model_validate(row._mapping), row.rating)
        for row in result
    ]


def recently_played_songs(session: Session, user_id: int, page: int, page_size: int = 15) -> list[tuple[Song, int | None]]:
    """
    SELECT song.*, song_rating.rating
    FROM (
        SELECT song_id, MAX(record_id) AS last_record
        FROM song_play_record
        WHERE user_id = 1
        GROUP BY song_id
    ) recent
    JOIN song ON song.id = recent.song_id
    LEFT JOIN song_rating ON song_rating.song_id = song.id AND song_rating.user_id = 1
    ORDER BY recent.last_record
    LIMIT 10 OFFSET 0;
    """

    subq = (
        select(
            SongPlayRecord.song_id,
            func.max(SongPlayRecord.record_id).label("last_record")
        )
        .where(SongPlayRecord.user_id == user_id)
        .group_by(SongPlayRecord.song_id)
        .subquery()
    )

    statement = (
        select(Song, SongRating.rating)
        .join(subq, subq.c.song_id == Song.id)
        .outerjoin(
            SongRating,
            and_(
                SongRating.song_id == Song.id,
                SongRating.user_id == user_id,
            ),
        )
        .order_by(subq.c.last_record.desc())
        .offset(page * page_size)
        .limit(page_size)
    )

    return list(session.exec(statement).all())
