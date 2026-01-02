from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, text
from app.db.sqlite import get_session
from app.model.song import SongRead
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]

# TODO: In future also search albums, playlists, authors... returns {albums: [Album], "songs": [Song]...}
@router.get("/search", dependencies=[Depends(cookie)])
def search(query: str, page: int = 0, session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)) -> list[SongRead]:
    if not query.strip():
        return []
    
    fts_query = f"{query}*"
    limit = 10
    offset = page * limit
    
    stmt = text(f"""
        SELECT song.*
        FROM song
        JOIN song_fts ON song.id = song_fts.rowid
        WHERE song_fts MATCH :query
        ORDER BY bm25(song_fts)
        LIMIT {limit} OFFSET {offset}
    """)
    
    rows = session.exec(stmt, params={"query": fts_query}).all()
    songs = [SongRead(**r._mapping) for r in rows]
    return songs

