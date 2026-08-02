from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from app.core.config import IMAGES_DIR, MUSIC_DIR
from app.session.cookie import cookie
from app.session.session_verifier import verifier
from app.session.session_data import SessionData

router = APIRouter()


def serve_file(base: str | Path, path: str) -> FileResponse:
    base = Path(base)
    file = (base / path).resolve()

    if not file.is_file():
        raise HTTPException(404)

    if base.resolve() not in file.parents:
        raise HTTPException(403)

    return FileResponse(file)


@router.get("/music/{path:path}", dependencies=[Depends(cookie)])
def music(
    path: str,
    _: SessionData = Depends(verifier),
) -> FileResponse:
    return serve_file(MUSIC_DIR, path)


@router.get("/images/{path:path}", dependencies=[Depends(cookie)])
def images(
    path: str,
    _: SessionData = Depends(verifier),
) -> FileResponse:
    return serve_file(IMAGES_DIR, path)
