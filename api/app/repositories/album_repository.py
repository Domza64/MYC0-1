from sqlmodel import Session, select
from app.models.album import Album


def get_albums(session: Session, author_id: int | None = None) -> list[Album]:
    """
    Returns all albums or all albums belonging to an author.
    """
    statement = select(Album)

    if author_id:
        statement = statement.where(Album.author_id == author_id)

    return list(session.exec(statement).all())


def get_album(session: Session, album_id: int) -> Album | None:
    """
    Returns album by id.
    """
    statement = select(Album).where(Album.id == album_id)
    return session.exec(statement).one_or_none()
