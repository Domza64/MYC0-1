from typing import Annotated
from fastapi import APIRouter, Depends, status, BackgroundTasks, Response
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.services import scan_service

router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]


@router.post("/scan-library", status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(cookie)])
def scan_files(
        background_tasks: BackgroundTasks,
        session_data: SessionData = Depends(verifier)
) -> Response:
    """Initiate a library scan"""
    scan_service.scan_library(session_data, background_tasks)
    return Response(status_code=status.HTTP_202_ACCEPTED)
