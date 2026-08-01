from app.exceptions.api.handlers import ApiException


class UsernameAlreadyExistsException(ApiException):
    def __init__(self, username: str):
        super().__init__(
            code="USERNAME_ALREADY_EXISTS",
            message=f"Username '{username}' already exists",
            status_code=409,
        )


class CannotDeleteSelfException(ApiException):
    def __init__(self):
        super().__init__(
            code="CANNOT_DELETE_SELF",
            message=f"You cannot delete yourself ;/",
            status_code=400,
        )


class UserNotFoundException(ApiException):
    def __init__(self, message: str):
        super().__init__(
            code="USER_NOT_FOUND",
            message=message,
            status_code=404,
        )

    @classmethod
    def by_id(cls, user_id: int):
        return cls(f"User with id {user_id} not found.")

    @classmethod
    def by_username(cls, username: str):
        return cls(f"User '{username}' not found.")