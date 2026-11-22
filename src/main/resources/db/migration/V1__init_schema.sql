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
    file_path TEXT   NOT NULL,
    file_name TEXT   NOT NULL,
    file_size BIGINT NOT NULL,
    folder_id BIGINT DEFAULT NULL,

    CONSTRAINT filesize
        CHECK (file_size > 0),
    CONSTRAINT fk_song_folder
        FOREIGN KEY (folder_id)
            REFERENCES folders (id)
            ON DELETE SET DEFAULT
);

CREATE TABLE users
(
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        VARCHAR(24) NOT NULL,
    roles           TEXT[]      NOT NULL,
    password        TEXT        NOT NULL,
    profile_picture TEXT
);
