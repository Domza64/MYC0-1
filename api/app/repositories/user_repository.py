from sqlmodel import Session, select
from app.models.user import User


def get_user_by_username(session: Session, username: str) -> User | None:
    return session.exec(
        select(User).where(User.username == username)
    ).first()


def create_user(session: Session, user: User) -> User:
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_all_users(session: Session) -> list[User]:
    return list(session.exec(select(User)).all())


def get_user(session: Session, user_id: int) -> User | None:
    return session.exec(
        select(User).where(User.id == user_id)
    ).first()


def delete_user(session: Session, user: User):
    session.delete(user)
    session.commit()


def save_user(session: Session, user) -> User:
    session.commit()
    session.refresh(user)
    return user