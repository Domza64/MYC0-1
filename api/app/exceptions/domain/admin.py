from app.exceptions.api.handlers import ApiException


class NotAllowedException(ApiException):
    def __init__(self, message: str = "You are not allowed to perform this action."):
        super().__init__(
            code="FORBIDDEN",
            message=message,
            status_code=403,
        )