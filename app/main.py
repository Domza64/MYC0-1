from app.limiter import limiter
from app.config import IMAGES_DIR, MUSIC_DIR
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from app.db.sqlite import create_db_and_tables
from app.routes.song import router as music_router
from app.routes.scan import router as scan_router
from app.routes.folder import router as folder_router
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router
from app.routes.playlist import router as playlist_router
from app.routes.author import router as author_router
from app.routes.album import router as album_router
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

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If the path starts with api/, music/, assets/, or static/, it should have been handled
    if any(full_path.startswith(prefix) for prefix in ["api/", "music/", "assets/", "static/"]):
        raise HTTPException(status_code=404, detail="Not found")
    
    # Serve index.html for all other routes (SPA routing)
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return FileResponse(index_path)
    else:
        raise HTTPException(status_code=404, detail="SPA not found")