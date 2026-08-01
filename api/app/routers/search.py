from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.schemas.search import SearchResponse
from app.services import search_service

router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/search", response_model=SearchResponse, dependencies=[Depends(cookie)])
def search(
        query: str,
        page: int = 0,
        session: Session = Depends(get_session),
        session_data: SessionData = Depends(verifier)
) -> SearchResponse:
    """Returns list of songs, authors and albums that match the search query"""
    return search_service.search(session, session_data.user_id, query, page)
