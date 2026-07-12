from uuid import UUID
from fastapi_sessions.backends.implementations import InMemoryBackend
from app.session.session_data import SessionData

backend = InMemoryBackend[UUID, SessionData]()
