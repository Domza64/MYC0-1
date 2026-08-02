from app.exceptions.api.handlers import ApiException


class AlbumNotFoundException(ApiException):
    def __init__(self, album_id: int):
        super().__init__(
            code="ALBUM_NOT_FOUND",
            message=f"Album: {album_id} not found.",
            status_code=404,
        )
