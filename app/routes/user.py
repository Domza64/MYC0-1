from typing import Annotated

from pydantic import BaseModel
from app.lib.passwd import hash_password
from app.model.user import User
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.session.cookie import cookie
from app.session.session_data import SessionData
from app.session.session_verifier import require_admin
from app.db.sqlite import get_session
from fastapi.responses import JSONResponse
from app.session.session_verifier import verifier


router = APIRouter(prefix="/api/users")
SessionDep = Annotated[Session, Depends(get_session)]


class UserCreate(BaseModel):
    username: str
    role: str
    password: str

class UserUpdate(BaseModel):
    username: str
    role: str
    password: str | None = None


@router.get("", response_model=list[User], dependencies=[Depends(cookie)])
def get_all_users(session: SessionDep, session_data: SessionData = Depends(verifier)) -> list[User]:
    """
    Get all users.
    """
    users = session.exec(select(User)).all()
    return [user.model_dump(exclude={"password"}) for user in users]

@router.post("", response_model=User, dependencies=[Depends(cookie)])
def create_user(user_data: UserCreate, session: SessionDep, admin_session: SessionData = Depends(require_admin)):
    """
    Create a new user.
    """

    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.username == user_data.username)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    user = User(username=user_data.username, role=user_data.role, password=hash_password(user_data.password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return JSONResponse(status_code=200, content={"message": "User created successfully"})

@router.put("/{user_id}", response_model=User, dependencies=[Depends(cookie)])
def update_user(user_id: str, user_data: UserUpdate, session: SessionDep, admin_session: SessionData = Depends(require_admin)):
    """
    Update an existing user.
    """
    # TODO: Revoke session if session for this user exists

    # Check if username already exists
    existing_user = session.exec(
        select(User).where(User.username == user_data.username)
    ).first()
    # If the existing user is not the same as the one being updated
    if existing_user and existing_user.id != int(user_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    user.username = user_data.username
    user.role = user_data.role
    if user_data.password:
        user.password = hash_password(user_data.password)

    session.commit()
    session.refresh(user)
    return JSONResponse(status_code=200, content={"message": "User updated successfully"})

@router.delete("/{user_id}", dependencies=[Depends(cookie)])
def delete_user(user_id: str, session: SessionDep, admin_session: SessionData = Depends(require_admin)):
    """
    Delete a user by id.
    """
    if user_id == admin_session.user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete yourself :/"
        )

    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    session.delete(user)
    session.commit()
    return JSONResponse(status_code=200, content={"message": "User deleted successfully"})