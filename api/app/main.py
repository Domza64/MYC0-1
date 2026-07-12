from app.core import limiter
from app.core.config import IMAGES_DIR, MUSIC_DIR
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.db.sqlite import create_db_and_tables
from app.routers.song import router as music_router
from app.routers.scan import router as scan_router
from app.routers.folder import router as folder_router
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.playlist import router as playlist_router
from app.routers.author import router as author_router
from app.routers.album import router as album_router
from app.routers.search import router as search_router
from app.routers.telemetry import router as telemetry
from app.routers.recommendations import router as recommendations
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded


# App
app = FastAPI()

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Music directory
app.mount("/music", StaticFiles(directory=MUSIC_DIR), name="music")
app.mount("/images", StaticFiles(directory=IMAGES_DIR), name="images")

# Static files for frontend in production
STATIC_DIR = Path("/app/static")
if STATIC_DIR.exists():
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")
    
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

app.include_router(auth_router)
app.include_router(music_router)
app.include_router(scan_router)
app.include_router(folder_router)
app.include_router(user_router)
app.include_router(playlist_router)
app.include_router(author_router)
app.include_router(album_router)
app.include_router(search_router)
app.include_router(telemetry)
app.include_router(recommendations)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
async def root():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/{full_path:path}")
async def spa(full_path: str):
    return FileResponse(STATIC_DIR / "index.html")