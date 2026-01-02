import { useEffect, useState } from "react";
import type { Album } from "../types/data";
import { useParams } from "react-router-dom";
import { albumsApi } from "../lib/api/albums";
import type { Song } from "../types/Song";
import SongCard from "../components/ui/cards/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";

export default function AlbumPage() {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<Album>();
  const [songs, setSongs] = useState<Song[]>([]);
  const { dispatch } = usePlayer();
  const { addModal, closeModal } = useModal();
  const { id } = useParams();

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

  const handleSongClick = (song: Song) => {
    dispatch({ type: "ADD_TO_QUEUE", payload: [song], replace: true });
    dispatch({ type: "PLAY_SONG", payload: song });
  };

  return (
    <div>
      <h1>{album.title}</h1>
      <ul className="space-y-2">
        {songs.map((song: Song, index: number) => (
          <SongCard
            key={index}
            song={song}
            onClick={() => handleSongClick(song)}
            menuActions={[
              {
                onClick: () =>
                  addModal(
                    <AddToPlaylistForm songs={[song]} onSuccess={closeModal} />
                  ),
                text: "Add to playlist",
              },
              {
                onClick: () => {
                  dispatch({
                    type: "ADD_TO_QUEUE",
                    payload: [song],
                    showMessage: true,
                  });
                },
                text: "Add to queue",
              },
            ]}
          />
        ))}
      </ul>
    </div>
  );
}
