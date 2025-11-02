from pathlib import Path
from app.model.song import Song


AUDIO_EXTENSIONS = {".mp3", ".flac", ".wav", ".m4a", ".aac", ".ogg", ".wma"}


def read_all_audio_files(folder_path: str):
    """
    Recursively scans a folder for audio files and returns a list of Song objects.
    """
    folder = Path(folder_path)
    songs = []

    for file_path in folder.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in AUDIO_EXTENSIONS:
            relative_path = str(file_path.relative_to(folder))

            # extract stuff later using mutagen or pydub
            song = Song(
                title=file_path.stem,
                artist="Unknown",
                album="Unknown",
                genre=None,
                year=None,
                file_path=str(relative_path),
                duration=0,
                file_size=file_path.stat().st_size,
                file_format=file_path.suffix.lstrip('.').lower(),
                album_art=None,
                play_count=0,
                last_played=None
            )
            songs.append(song)

    return songs
            