from typing import Annotated
from app.session.session_data import SessionData
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.backend import backend
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from uuid import UUID, uuid4


router = APIRouter(prefix="/api/auth")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/login/{name}")
async def create_session(name: str, response: Response):

    session = uuid4()
    data = SessionData(username=name)

    await backend.create(session, data)
    cookie.attach_to_response(response, session)

    return SessionData(username=name)


@router.get("/whoami", dependencies=[Depends(cookie)])
async def whoami(session_data: SessionData = Depends(verifier)):
    return session_data


@router.post("/logout")
async def logout(response: Response, session_id: UUID = Depends(cookie)):
    await backend.delete(session_id)
    cookie.delete_from_response(response)
    return "Logout successfull"
