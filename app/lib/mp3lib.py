from pathlib import Path
from typing import Optional

from sqlmodel import Session, select
from app.lib.file_utils import save_picture
from app.model.album import Album
from app.model.author import Author
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


def extract_image(audio, file_stem: str) -> Optional[str]:
    """Extract image to IMAGES_DIR; return filename if successful."""
    if not audio or not audio.tag or not audio.tag.images:
        return None
    
    img = audio.tag.images[0]
    return save_picture(img.image_data, file_stem, "jpg")


def extract_metadata(audio) -> dict:
    """Extract metadata dict safely from an eyeD3 audio object."""
    tag = getattr(audio, "tag", None)
    info = getattr(audio, "info", None)

    return {
        "title": getattr(tag, "title", None),
        "author": getattr(tag, "artist", None),
        "album": getattr(tag, "album", None),
        "genre": str(tag.genre) if getattr(tag, "genre", None) else None,
        "year": 2000, # TODO: Replace with year extraction:
        "duration": int(info.time_secs) if info else None,
    }


def get_or_create_author(session: Session, name: Optional[str]):
    if not name:
        return None

    author = session.exec(select(Author).where(Author.name == name)).first()
    if not author:
        author = Author(name=name)
        session.add(author)
        session.commit()
        session.refresh(author)
    return author


def get_or_create_album(session: Session, title: Optional[str], author: Optional[Author], image: Optional[str] = None):
    if not title:
        return None

    statment = select(Album).where(Album.title == title)
    if author:
        statment = statment.where(Album.author_id == author.id)

    album = session.exec(statment).first()

    if not album:
        album = Album(title=title, author_id=author.id if author else None, image=image)
        session.add(album)
        session.commit()
        session.refresh(album)

    return album


def create_song(session: Session, file_path: Path, relative_path: Path) -> Song:
    """Create a Song instance with metadata if available."""
    if file_path.suffix.lower() != ".mp3":
        return create_default_song(file_path, relative_path)

    try:
        audio = eyed3.load(file_path)
        if not audio:
            return create_default_song(file_path, relative_path)

        metadata = extract_metadata(audio)
        image = extract_image(audio, file_path.stem)

        author = get_or_create_author(session, metadata["author"])
        album = get_or_create_album(session, metadata["album"], author, image="/TODO-add-image-when-creating-album")

        song = Song(
            title=metadata["title"],
            genre=metadata["genre"],
            year=metadata["year"],
            duration=metadata["duration"],
            author_id=author.id if author else None,
            album_id=album.id if album else None,
            file_path=str(relative_path),
            file_name=file_path.name,
            file_size=file_path.stat().st_size,
            file_format=file_path.suffix.lstrip('.').lower(),
            image=image,
            play_count=0,
            last_played=None,
        )

        return song
    except:
        return create_default_song(file_path, relative_path)