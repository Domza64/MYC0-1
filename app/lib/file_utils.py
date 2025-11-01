from urllib.parse import quote
from pathlib import Path

def read_all_files(folder_path: str):
    folder = Path(folder_path)
    for file_path in folder.rglob('*'):
        if file_path.is_file():
            relative_path = file_path.relative_to(folder)
            print(quote(str(relative_path)))