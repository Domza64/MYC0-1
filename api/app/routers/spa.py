from fastapi import APIRouter
from fastapi.responses import FileResponse
from app.core.config import STATIC_DIR

router = APIRouter()


@router.get("/")
async def root():
    return FileResponse(STATIC_DIR / "index.html")


@router.get("/{full_path:path}")
async def spa(full_path: str):
    return FileResponse(STATIC_DIR / "index.html")
