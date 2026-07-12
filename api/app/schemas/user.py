from pydantic import BaseModel, ConfigDict


class UserCreateRequest(BaseModel):
    username: str
    role: str
    password: str

class UserUpdateRequest(BaseModel):
    username: str | None = None
    role: str | None = None
    password: str | None = None

class BasicUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    role: str
    user_image: str | None