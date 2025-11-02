from typing import Union
from app.config import MUSIC_DIR
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.db.sqlite import create_db_and_tables
from app.routes.song import router as music_router
from app.routes.scan import router as scan_router
from app.routes.folder import router as folder_router

app = FastAPI()

# TEMP for dev
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/music", StaticFiles(directory=MUSIC_DIR), name="music")
app.include_router(music_router)
app.include_router(scan_router)
app.include_router(folder_router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
