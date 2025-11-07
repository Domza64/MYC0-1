from sqlmodel import SQLModel, create_engine, Session, select
from app.lib.passwd import hash_password

sqlite_file_name = "data/myc0-1.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    create_default_user()

def create_default_user():
    with Session(engine) as session:
        from app.model.user import User
        
        statement = select(User)
        results = session.exec(statement)
        users = results.all()
        
        # If no users exist, create default user
        if not users:
            default_user = User(
                username="admin",
                password=hash_password("admin"),
                role="ADMIN"
            )
            session.add(default_user)
            session.commit()
            print("Default user created!")


def get_session():
    with Session(engine) as session:
        yield session
