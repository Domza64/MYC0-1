from fastapi import BackgroundTasks
from app.session.session_data import SessionData
from app.tasks.scan import library_scan
from app.session.roles import ADMIN_ROLE
from app.exceptions.domain.admin import NotAllowedException


def scan_library(session_data: SessionData, background_tasks: BackgroundTasks) -> None:
    """Initiates scan library background task"""
    if session_data.role != ADMIN_ROLE:
        raise NotAllowedException("You must be an administrator to start library scan.")

    background_tasks.add_task(library_scan)
