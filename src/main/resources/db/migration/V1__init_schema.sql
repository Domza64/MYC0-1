-- I'll be editing this file until I get some stable first release, from then I'll be creating actual migration versions
CREATE TABLE song
(
    id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    file_path TEXT   NOT NULL,
    file_name TEXT   NOT NULL,
    file_size BIGINT NOT NULL,

    CONSTRAINT filesize CHECK (file_size > 0)
);