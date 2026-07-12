from typing import Annotated
from fastapi import APIRouter, Depends
from sqlmodel import Session
from app.session.cookie import cookie
from app.session.session_data import SessionData
from app.db.sqlite import get_session
from app.session.session_verifier import verifier
from app.schemas.user import UserCreateRequest, UserUpdateRequest, BasicUserResponse
from app.services import user_service
from app.schemas.success import SuccessResponse

router = APIRouter(prefix="/api/users")
SessionDep = Annotated[Session, Depends(get_session)]


@router.get("", response_model=list[BasicUserResponse], dependencies=[Depends(cookie)])
def get_all_users(
        session: SessionDep,
        _: SessionData = Depends(verifier)
) -> list[BasicUserResponse]:
    """
    Get all users.
    """
    users = user_service.get_all_users(session)

    return [
        BasicUserResponse.model_validate(user)
        for user in users
    ]

@router.post("", response_model=BasicUserResponse, dependencies=[Depends(cookie)])
def create_user(
        user_data: UserCreateRequest,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> BasicUserResponse:
    """
    Create a new user.
    """
    user = user_service.create_new_user(session, session_data, user_data)
    return BasicUserResponse.model_validate(user)


@router.patch("/{user_id}", response_model=BasicUserResponse, dependencies=[Depends(cookie)])
def update_user(
        user_id: int,
        user_data: UserUpdateRequest,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> BasicUserResponse:
    """
    Update an existing user.
    """
    user = user_service.update_user(session, session_data, user_data, user_id)
    return BasicUserResponse.model_validate(user)


@router.delete("/{user_id}", response_model=SuccessResponse, dependencies=[Depends(cookie)])
def delete_user(
        user_id: int,
        session: SessionDep,
        session_data: SessionData = Depends(verifier)
) -> SuccessResponse:
    """
    Delete a user by id.
    """
    user_service.delete_user(session, session_data, user_id)
    return SuccessResponse(message="User deleted successfully")