import os

# For production with Docker
MUSIC_DIR = "/app/music"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGES_DIR = os.path.join(BASE_DIR, "data", "images")

os.makedirs(IMAGES_DIR, exist_ok=True)

# Or if you want to keep the original for development:
if os.path.exists("/app/music"):  # Docker environment
    MUSIC_DIR = "/app/music"
else:  # Local development
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MUSIC_DIR = os.path.join(BASE_DIR, "music")