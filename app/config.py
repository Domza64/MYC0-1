import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)) + "/app")

MUSIC_DIR = os.path.join(BASE_DIR, "music")
IMAGES_DIR = os.path.join(BASE_DIR, "data", "images")

os.makedirs(IMAGES_DIR, exist_ok=True)
