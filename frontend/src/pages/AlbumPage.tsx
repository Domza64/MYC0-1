import { useEffect, useState } from "react";
import type { Album } from "../types/data";
import { useParams } from "react-router-dom";
import { albumsApi } from "../lib/api/albums";
import type { Song } from "../types/Song";
import SongCard from "../components/ui/cards/SongCard";
import { useSongMenuActions } from "../hooks/useSongMenuActions";

export default function AlbumPage() {
  const [loading, setLoading] = useState(true);
  const [album, setAlbum] = useState<Album>();
  const [songs, setSongs] = useState<Song[]>([]);
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
    <div>
      <h1>{album.title}</h1>
      <ul className="space-y-2">
        {songs.map((song: Song, index: number) => (
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
