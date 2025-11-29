from http.client import HTTPException
from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.model.author import Author
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData


router = APIRouter(prefix="/api/authors")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[Author], dependencies=[Depends(cookie)])
def get_all_authors(session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    """
    Get all authors.
    """
    authors = session.exec(
        select(Author)
    ).all()

    return authors


@router.get("/{author_id}", response_model=Author, dependencies=[Depends(cookie)])
def get_author(author_id: int, session: Session = Depends(get_session), session_data: SessionData = Depends(verifier)):
    """
    Get an author by ID.
    """
    author = session.get(Author, author_id)

    if not author:
        raise HTTPException(status_code=404, detail="Author not found")
    return author
    