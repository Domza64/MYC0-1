from app.exceptions.api.handlers import ApiException


class PlaylistNotFoundException(ApiException):
    def __init__(self, playlist_id: int):
        super().__init__(
            code="PLAYLIST_NOT_FOUND",
            message=f"Playlist: {playlist_id} not found.",
            status_code=404,
        )
