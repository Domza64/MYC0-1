import { useEffect, useState } from "react";
import type { Album, Author } from "../types/data";
import { useParams } from "react-router-dom";
import { albumsApi } from "../lib/api/albums";
import { authorsApi } from "../lib/api/authors";
import type { Song } from "../types/Song";
import AlbumCard from "../components/ui/cards/AlbumCard";
import { songsApi } from "../lib/api/songs";
import SongCard from "../components/ui/cards/SongCard";
import { FaPlay } from "react-icons/fa6";
import Button from "../components/ui/buttons/Button";
import { MdOutlineQueueMusic } from "react-icons/md";
import { usePlayer } from "../contexts/PlayerContext";

export default function AuthorPage() {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  const player = usePlayer();
  const [songs, setSongs] = useState<Song[]>([]);
  const [author, setAuthor] = useState<Author>();
  const { id } = useParams();

  useEffect(() => {
    authorsApi
      .get(Number(id))
      .then((a: Author) => {
        setAuthor(a);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!author) return;
    albumsApi.getByAuthor(author.id).then(setAlbums);
    songsApi.getByAuthor(author.id).then(setSongs);
  }, [author]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <div className="space-y-4">
      <h1>{author.name}</h1>
      <h2>Albums</h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {albums.map((album, index) => (
          <li key={index} className="max-w-[420px] w-full justify-self-start">
            <AlbumCard album={album} />
          </li>
        ))}
      </ul>
      <div className="flex justify-between">
        <h2>Songs</h2>
        <div>
          <div className="flex gap-2">
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                player.dispatch({
                  type: "ADD_TO_QUEUE",
                  payload: songs,
                  replace: true,
                });
                player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
              }}
            >
              <FaPlay />
              <span>Play</span>
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => {
                player.dispatch({
                  type: "ADD_TO_QUEUE",
                  payload: songs,
                  showMessage: true,
                });
                if (player.state.currentQueue.length === 0) {
                  player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
                }
              }}
            >
              <MdOutlineQueueMusic />
              <span>Queue</span>
            </Button>
          </div>
        </div>
      </div>
      <ul>
        {songs.map((song, index) => (
          <SongCard song={song} key={index} />
        ))}
      </ul>
    </div>
  );
}
