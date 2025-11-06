from app.config import MUSIC_DIR
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.db.sqlite import create_db_and_tables
from app.routes.song import router as music_router
from app.routes.scan import router as scan_router
from app.routes.folder import router as folder_router
from app.routes.auth import router as auth_router
from app.routes.user import router as user_router

app = FastAPI()

app.mount("/music", StaticFiles(directory=MUSIC_DIR), name="music")
app.include_router(music_router)
app.include_router(scan_router)
app.include_router(folder_router)
# TODO - Rate limiting
app.include_router(auth_router)
app.include_router(user_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
