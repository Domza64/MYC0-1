from sqlmodel import Session
from app.repositories import user_repository
from app.schemas.user import UserCreateRequest, UserUpdateRequest
from app.utils.passwd import hash_password
from app.models.user import User
from app.exceptions.domain.user import UsernameAlreadyExistsException, CannotDeleteSelfException, UserNotFoundException
from app.exceptions.domain.admin import NotAllowedException
from app.session.session_data import SessionData
from app.session.roles import ADMIN_ROLE


def get_all_users(session: Session) -> list[User]:
    """Get all users."""
    return user_repository.get_all_users(session)


def create_new_user(
        session: Session,
        current_user: SessionData,
        user_data: UserCreateRequest
) -> User:
    """Create a new user."""

    if current_user.role != ADMIN_ROLE:
        raise NotAllowedException("You must be an administrator to create new users.")

    # Prevent duplicate usernames.
    if user_repository.get_user_by_username(session, user_data.username):
        raise UsernameAlreadyExistsException(user_data.username)

    user = User(
        username=user_data.username,
        role=user_data.role,
        password=hash_password(user_data.password)
    )

    return user_repository.create_user(session, user)


# TODO: Invalidate active sessions after password change.
def update_user(
        session: Session,
        current_user: SessionData,
        new_user_data: UserUpdateRequest,
        user_id: int
) -> User:
    """Update an existing user."""

    # Updating another user requires admin privileges.
    if current_user.user_id != user_id and current_user.role != ADMIN_ROLE:
        raise NotAllowedException("You must be an administrator to update other users.")

    existing_user: User | None = user_repository.get_user(session, user_id)

    if not existing_user:
        raise UserNotFoundException.by_id(user_id)

    # UPDATING USERNAME
    if new_user_data.username is not None:
        # Allow keeping the current username, but prevent duplicates.
        user_with_username = user_repository.get_user_by_username(
            session,
            new_user_data.username,
        )

        if user_with_username and user_with_username.id != user_id:
            raise UsernameAlreadyExistsException(new_user_data.username)

        existing_user.username = new_user_data.username

    # UPDATING PASSWORD
    if new_user_data.password is not None:
        existing_user.password = hash_password(new_user_data.password)

    # UPDATING ROLE
    if new_user_data.role is not None:
        # Users cannot change their own role.
        if user_id == current_user.user_id:
            raise NotAllowedException("You can't change your own role.")
        existing_user.role = new_user_data.role

    session.commit()
    session.refresh(existing_user)
    return existing_user


def delete_user(session: Session, current_user: SessionData, user_id: int) -> None:
    """Delete a user."""

    # Prevent users from deleting their own accounts.
    if user_id == current_user.user_id:
        raise CannotDeleteSelfException()

    user: User | None = user_repository.get_user(session, user_id)
    if not user:
        raise UserNotFoundException.by_id(user_id)

    user_repository.delete_user(session, user)
