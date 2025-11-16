from pathlib import Path
from typing import Optional
from app.config import IMAGES_DIR
from app.model.song import Song
import eyed3


def create_default_song(path: Path, relative_path: Path) -> Song:
    """Create a minimal Song instance from a file path."""
    return Song(
        file_path=str(relative_path),
        file_size=path.stat().st_size,
        file_format=path.suffix.lstrip('.').lower(),
        file_name=path.name,
        play_count=0,
        last_played=None,
    )


def extract_album_art(audio, file_stem: str) -> Optional[str]:
    """Extract album art to IMAGES_DIR; return filename if saved."""
    if not audio or not audio.tag or not audio.tag.images:
        return None

    try:
        img = audio.tag.images[0]
        output = Path(IMAGES_DIR) / f"{file_stem}.jpg"
        output.write_bytes(img.image_data)
        return output.name
    except Exception as e:
        print(f"Error extracting album art: {e}")
        return None


def extract_metadata(audio) -> dict:
    """Extract metadata dict safely from an eyeD3 audio object."""
    tag = getattr(audio, "tag", None)
    info = getattr(audio, "info", None)

    return {
        "title": getattr(tag, "title", None),
        "artist": getattr(tag, "artist", None),
        "album": getattr(tag, "album", None),
        "genre": str(tag.genre) if getattr(tag, "genre", None) else None,
        "year": 2000, # TODO: Replace with year extraction:
        "duration": int(info.time_secs) if info else None,
    }



def create_song(file_path: Path, relative_path: Path) -> Song:
    """Create a Song instance from an audio file path with metadata if available."""
    if file_path.suffix.lower() != ".mp3":
        return create_default_song(file_path, relative_path)

    try:
        audio = eyed3.load(file_path)
        if not audio:
            return create_default_song(file_path, relative_path)

        metadata = extract_metadata(audio)
        album_art = extract_album_art(audio, file_path.stem)

        return Song(
            **metadata,
            file_path=str(relative_path),
            file_name=file_path.name,
            file_size=file_path.stat().st_size,
            file_format=file_path.suffix.lstrip('.').lower(),
            album_art=album_art,
            play_count=0,
            last_played=None,
        )
    except:
        print(f"Error getting metadata or for: {file_path}")
        return create_default_song(file_path, relative_path)