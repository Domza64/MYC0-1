from pathlib import Path
from app.lib.mp3lib import create_song


AUDIO_EXTENSIONS = {".mp3", ".flac", ".wav", ".m4a", ".aac", ".ogg", ".wma"}


def read_all_audio_files(folder_path: str):
    """
    Recursively scans a folder for audio files and returns a list of Song objects.
    """
    folder = Path(folder_path)
    songs = []

    for file_path in folder.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in AUDIO_EXTENSIONS:
            relative_path = file_path.relative_to(folder)
            song = create_song(file_path, relative_path)
            songs.append(song)

    return songs
