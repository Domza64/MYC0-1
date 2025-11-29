from pathlib import Path
from typing import Optional


AUDIO_EXTENSIONS = {".mp3", ".flac", ".wav", ".m4a", ".aac", ".ogg", ".wma"}


def read_all_audio_files(folder_path: str):
    """
    Recursively scans a folder for audio files and returns a list of Song objects.
    """
    folder = Path(folder_path)
    files = []

    for file_path in folder.rglob('*'):
        if file_path.is_file() and file_path.suffix.lower() in AUDIO_EXTENSIONS:
            relative_path = file_path.relative_to(folder)
            files.append((file_path, relative_path))

    return files


# TODO: implement this
def save_picture(image_data: bytes, file_stem: str) -> Optional[str]:
    """Save image data to IMAGES_DIR and return the filename if successful."""
    pass