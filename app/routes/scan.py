from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Response
from sqlmodel import Session
from app.db.sqlite import get_session
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData
from app.tasks.scan import library_scan

router = APIRouter(prefix="/api")
SessionDep = Annotated[Session, Depends(get_session)]


# TODO: Make this async background task cause this is not a good now but works for testing
@router.post("/scan-library", status_code=status.HTTP_202_ACCEPTED, dependencies=[Depends(cookie)])
def scan_files(background_tasks: BackgroundTasks, session_data: SessionData = Depends(verifier)) -> Response:
    if session_data.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )

    background_tasks.add_task(library_scan)
    return Response(status_code=status.HTTP_202_ACCEPTED)
