from app.config import IMAGES_DIR
from app.model.song import Song
import eyed3

def create_song(file_path: str, relative_path: str) -> Song:
    # if file is not mp3 just return basic empty song model
    if file_path.suffix.lower() != ".mp3":
        return Song(
            file_path=str(file_path),
            file_size=file_path.stat().st_size,
            file_format=file_path.suffix.lstrip('.').lower(),
            file_name=file_path.name,
            play_count=0,
            last_played=None
        )

    # Extract mp3 metadata and return song data
    audio_file = eyed3.load(file_path)
    image = None

    try:
        image_file = audio_file.tag.images[0]
        with open(IMAGES_DIR + f"/{file_path.stem}.jpg", "wb") as temp:
            temp.write(image_file.image_data)
        image = file_path.stem + ".jpg"
    except:
        print("No album art found for:", file_path)

    song = Song(
        title=audio_file.tag.title,
        artist=audio_file.tag.artist,
        album=audio_file.tag.album,
        genre=str(audio_file.tag.genre),
        year=2000, # int(audio_file.tag.getBestDate()),
        file_path=str(relative_path),
        duration=int(audio_file.info.time_secs),
        file_name=file_path.name,
        file_size=file_path.stat().st_size,
        file_format=file_path.suffix.lstrip('.').lower(),
        album_art=image,
        play_count=0,
        last_played=None
    )

    return song