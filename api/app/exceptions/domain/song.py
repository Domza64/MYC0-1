from app.exceptions.api.handlers import ApiException


class SongNotFoundException(ApiException):
    def __init__(self, song_id: int):
        super().__init__(
            code="SONG_NOT_FOUND",
            message=f"Song: {song_id} not found.",
            status_code=404,
        )
