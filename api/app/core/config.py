
from pathlib import Path
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)) + "/app")

MUSIC_DIR = os.path.join("/music") # os.path.join(str(BASE_DIR), "../../music")
IMAGES_DIR = os.path.join("/data/images") # os.path.join(str(BASE_DIR), "../../data", "images")
STATIC_DIR = Path("/app/static")

os.makedirs(IMAGES_DIR, exist_ok=True)
