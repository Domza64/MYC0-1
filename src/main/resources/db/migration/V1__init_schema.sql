-- I'll be editing this file until I get some stable first release, from then I'll be creating actual migration versions
CREATE TABLE folders
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name      TEXT NOT NULL,
    parent_id BIGINT DEFAULT NULL,

    CONSTRAINT fk_parent_folder
        FOREIGN KEY (parent_id)
            REFERENCES folders (id)
            ON DELETE CASCADE
);

CREATE TABLE songs
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title     TEXT,
    genres    TEXT[] NOT NULL DEFAULT '{}',
    image     TEXT,
    year      INTEGER,
    duration  INTEGER,
    file_path TEXT   NOT NULL,
    file_name TEXT   NOT NULL,
    file_size BIGINT NOT NULL,
    folder_id BIGINT DEFAULT NULL,

    CONSTRAINT chk_song_filesize
        CHECK (file_size > 0),

    CONSTRAINT fk_song_folder
        FOREIGN KEY (folder_id)
            REFERENCES folders (id)
            ON DELETE SET DEFAULT
);

CREATE TABLE authors
(
    id   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE authors_songs
(
    author_id BIGINT NOT NULL,
    song_id   BIGINT NOT NULL,

    CONSTRAINT pk_authors_songs
        PRIMARY KEY (author_id, song_id),

    CONSTRAINT fk_author_song
        FOREIGN KEY (author_id)
            REFERENCES authors (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_song_author
        FOREIGN KEY (song_id)
            REFERENCES songs (id)
            ON DELETE CASCADE
);

CREATE TABLE albums
(
    id    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    cover TEXT
);

CREATE TABLE albums_songs
(
    album_id BIGINT NOT NULL,
    song_id  BIGINT NOT NULL,

    CONSTRAINT pk_albums_songs
        PRIMARY KEY (album_id, song_id),

    CONSTRAINT fk_album_song
        FOREIGN KEY (album_id)
            REFERENCES albums (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_song_album
        FOREIGN KEY (song_id)
            REFERENCES songs (id)
            ON DELETE CASCADE
);

CREATE TABLE authors_albums
(
    author_id BIGINT NOT NULL,
    album_id  BIGINT NOT NULL,

    CONSTRAINT pk_authors_albums
        PRIMARY KEY (author_id, album_id),

    CONSTRAINT fk_author_album
        FOREIGN KEY (author_id)
            REFERENCES authors (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_album_author
        FOREIGN KEY (album_id)
            REFERENCES albums (id)
            ON DELETE CASCADE
);

CREATE TABLE users
(
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        VARCHAR(30) NOT NULL,
    role            VARCHAR(20) NOT NULL,
    password        TEXT        NOT NULL,
    profile_picture TEXT,

    CONSTRAINT uk_username UNIQUE (username)
);

CREATE TABLE playlists
(
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    shared      BOOLEAN      NOT NULL DEFAULT FALSE,
    user_id     BIGINT       NOT NULL,
    image       TEXT,
    created_at  TIMESTAMPTZ  NOT NULL,
    updated_at  TIMESTAMPTZ  NOT NULL,

    CONSTRAINT fk_playlist_user
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);

CREATE TABLE playlists_songs -- TODO: Create Indexes?
(
    playlist_id BIGINT  NOT NULL,
    song_id     BIGINT  NOT NULL,
    position    INTEGER NOT NULL,

    CONSTRAINT pk_playlists_songs
        PRIMARY KEY (playlist_id, song_id),

    CONSTRAINT uk_playlist_song_position
        UNIQUE (playlist_id, position),

    CONSTRAINT fk_playlist_song
        FOREIGN KEY (playlist_id)
            REFERENCES playlists (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_song_playlist
        FOREIGN KEY (song_id)
            REFERENCES songs (id)
            ON DELETE CASCADE,

    CONSTRAINT chk_playlist_song_position
        CHECK (position >= 0)
);

CREATE TABLE song_play_record -- TODO: Create Indexes?
(
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id    BIGINT      NOT NULL,
    song_id    BIGINT      NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,

    CONSTRAINT fk_user_play_record
        FOREIGN KEY (song_id)
            REFERENCES songs (id)
            ON DELETE CASCADE,

    CONSTRAINT fk_song_play_record
        FOREIGN KEY (user_id)
            REFERENCES users (id)
            ON DELETE CASCADE
);