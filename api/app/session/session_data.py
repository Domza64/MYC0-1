from pydantic import BaseModel

class SessionData(BaseModel):
    user_id: int
    username: str
    role: str
