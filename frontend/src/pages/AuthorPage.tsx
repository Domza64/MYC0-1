import { useEffect, useState } from "react";
import type { Album, Author } from "../types/data";
import { Link, useParams } from "react-router-dom";
import { albumsApi } from "../lib/api/albums";
import { authorsApi } from "../lib/api/authors";
import type { Song } from "../types/Song";

export default function AuthorPage() {
  const [loading, setLoading] = useState(true);
  const [albums, setAlbums] = useState<Album[]>([]);
  // @ts-ignore
  const [songs, setSongs] = useState<Song[]>([]); // TODO: Load songs by author
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
  }, [author]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!author) {
    return <div>Author not found</div>;
  }

  return (
    <div>
      <h1>{author.name}</h1>
      <h2>Albums</h2>
      <ul>
        {albums.map((album, index) => (
          <li className="my-2 bg-stone-800 rounded-lg px-4 py-2" key={index}>
            <Link to={`/albums/${album.id}`}>
              <span>{album.title}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2>Songs</h2>
      <ul>
        {songs.map((song, index) => (
          <li className="my-2 bg-stone-800 rounded-lg px-4 py-2" key={index}>
            <span>{song.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
