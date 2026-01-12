import { useEffect, useState } from "react";
import type { Album } from "../types/data";
import { Link, useNavigate, useParams } from "react-router-dom";
import { albumsApi } from "../lib/api/albums";
import type { Song } from "../types/Song";
import SongCard from "../components/ui/cards/SongCard";
import { useSongMenuActions } from "../hooks/useSongMenuActions";
import Button from "../components/ui/buttons/Button";
import { FaPlay } from "react-icons/fa";
import { IoChevronBack } from "react-icons/io5";
import { usePlayer } from "../contexts/PlayerContext";
import { MdOutlineQueueMusic } from "react-icons/md";

export default function AlbumPage() {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<Album>();
  const [songs, setSongs] = useState<Song[]>([]);
  const player = usePlayer();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToPlaylist, addToQueue } = useSongMenuActions();

  useEffect(() => {
    albumsApi
      .get(Number(id))
      .then((a: Album) => {
        setAlbum(a);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!album) return;
    albumsApi.getSongs(album.id).then(setSongs);
  }, [album]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!album) {
    return <div>Album not found</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <IoChevronBack
            className="text-2xl cursor-pointer mt-1"
            onClick={() => navigate(-1)}
          />
          <div>
            <h1 className="text-xl">{album.title}</h1>
            <Link
              to={"/authors/" + album.author.id}
              className="text-md text-stone-400 hover:text-white transition-colors duration-300"
            >
              {album.author.name}
            </Link>
          </div>
        </div>
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
              if (player.state.queue.length === 0) {
                player.dispatch({ type: "PLAY_SONG", payload: songs[0] });
              }
            }}
          >
            <MdOutlineQueueMusic />
            <span>Queue</span>
          </Button>
        </div>
      </div>

      <ul className="flex flex-col space-y-2">
        {songs.length > 0 &&
          songs.map((song, index) => (
            <SongCard
              key={index}
              song={song}
              menuActions={[addToPlaylist(song), addToQueue(song)]}
            />
          ))}
      </ul>
    </div>
  );
}
