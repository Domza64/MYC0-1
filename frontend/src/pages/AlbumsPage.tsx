import { useEffect, useState } from "react";
import type { Album } from "../types/data";
import { albumsApi } from "../lib/api/albums";
import AlbumCard from "../components/ui/cards/AlbumCard";

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    albumsApi.getAll().then(setAlbums);
  }, []);

  return (
    <div className="max-w-400">
      <h1 className="mb-4">My Albums</h1>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {albums.map((album, index) => (
          <li key={index} className="max-w-[420px] w-full justify-self-start">
            <AlbumCard album={album} />
          </li>
        ))}
      </ul>
    </div>
  );
}
