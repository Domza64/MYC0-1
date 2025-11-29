import { useEffect, useState } from "react";
import type { Album } from "../types/data";
import { albumsApi } from "../lib/api/albums";
import { Link } from "react-router-dom";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    albumsApi.getAll().then(setAlbums);
  }, []);

  return (
    <div>
      <h1>Albums</h1>
      <ul>
        {albums.map((album, index) => (
          <li className="my-2 bg-stone-800 rounded-lg px-4 py-2" key={index}>
            <Link to={`/albums/${album.id}`}>
              <span>{album.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
