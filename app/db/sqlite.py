from sqlmodel import SQLModel, create_engine, Session, select, text
from app.lib.passwd import hash_password

sqlite_file_name = "data/myc0-1.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    enable_sqlite_wal()  
    SQLModel.metadata.create_all(engine)
    create_fts_tables()
    define_triggers()
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


def enable_sqlite_wal():
    with engine.connect() as conn:
        conn.execute(text("PRAGMA journal_mode=WAL;"))
        conn.execute(text("PRAGMA synchronous=NORMAL;"))
        conn.execute(text("PRAGMA foreign_keys=ON;"))
        conn.commit()


def create_fts_tables():
    with engine.connect() as conn:
        conn.execute(text("""
        CREATE VIRTUAL TABLE IF NOT EXISTS song_fts
        USING fts5(
            title,
            artist,
            album,
            filename,
            content='song',
            content_rowid='id'
        );
        """))
        conn.commit()


def define_triggers():
    with engine.connect() as conn:
        conn.execute(text("""
        CREATE TRIGGER IF NOT EXISTS song_insert AFTER INSERT ON song BEGIN
            INSERT INTO song_fts(rowid, title, artist, album, filename)
            SELECT
                new.id,
                COALESCE(new.title, ''),
                COALESCE(author.name, ''),
                COALESCE(album.title, ''),
                COALESCE(new.file_name, '')
            FROM song
            LEFT JOIN author ON author.id = new.author_id
            LEFT JOIN album ON album.id = new.album_id
            WHERE song.id = new.id;
        END;
        """))
        conn.commit()


def get_session():
    with Session(engine) as session:
        yield session
