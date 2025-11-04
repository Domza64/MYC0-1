import { useEffect, useState } from "react";
import type { Folder } from "../types/folder";
import FolderCard from "../components/ui/FolderCard";
import type { Song } from "../types/music";
import SongCard from "../components/ui/SongCard";

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(
          currentFolder?.id
            ? `/api/folders/${currentFolder.id}`
            : "/api/folders/"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch folders");
        }
        const data: Folder[] = await response.json();
        setFolders(data);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    const fetchSongs = async () => {
      try {
        if (!currentFolder) {
          setSongs([]);
          return;
        }
        const response = await fetch(`/api/songs/folder/${currentFolder.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch songs");
        }
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchFolders();
    fetchSongs();
  }, [currentFolder]);

  return (
    <div>
      <h1>Folders</h1>
      <button onClick={() => setCurrentFolder(null)}>Root</button>
      <h2>Current folder: {currentFolder?.path}</h2>
      <ul>
        {folders.map((folder) => (
          <FolderCard
            folder={folder}
            key={folder.id}
            onClick={() => setCurrentFolder(folder)}
          />
        ))}
      </ul>
      <div>
        <h2>Songs:</h2>
        <ul>
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </ul>
      </div>
    </div>
  );
}
