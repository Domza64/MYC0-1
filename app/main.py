from typing import Union
import os
from app.lib.file_utils import read_all_files
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MUSIC_DIR = os.path.join(BASE_DIR, "music")

app = FastAPI()
app.mount("/music", StaticFiles(directory=MUSIC_DIR), name="music")

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.post("/scan-library/")
def scan_files():
    read_all_files(MUSIC_DIR)
    return