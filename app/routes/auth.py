from typing import Annotated
from app.lib.passwd import verify_password
from app.model.user import User
from app.session.session_data import SessionData
from fastapi import APIRouter, Depends
from fastapi.responses import Response, JSONResponse
from sqlmodel import Session
from pydantic import BaseModel
from app.db.sqlite import get_session
from app.session.backend import backend
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from sqlmodel import Session, select
from uuid import UUID, uuid4
from app.limiter import limiter
from starlette.requests import Request

class LoginRequest(BaseModel):
    username: str
    password: str


router = APIRouter(prefix="/api/auth")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/login")
@limiter.limit("20/minute")
async def create_session(login_data: LoginRequest, response: Response, session: SessionDep, request: Request):
    username = login_data.username
    password = login_data.password

    user = session.exec(select(User).where(User.username == username)).first()
    
    if not user or verify_password(password, user.password) == False:
        return JSONResponse(status_code=401, content={"message": "Invalid credentials"})

    auth_session = uuid4()
    data = SessionData(username=user.username, role=user.role)

    await backend.create(auth_session, data)
    cookie.attach_to_response(response, auth_session)

    return data


@router.get("/whoami", dependencies=[Depends(cookie)])
async def whoami(session_data: SessionData = Depends(verifier)):
    return session_data


@router.post("/logout")
async def logout(response: Response, session_id: UUID = Depends(cookie)):
    await backend.delete(session_id)
    cookie.delete_from_response(response)
    return "Logout successfull"
