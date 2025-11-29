import { useEffect, useState } from "react";
import type { Folder } from "../types/folder";
import FolderCard from "../components/ui/cards/FolderCard";
import SongCard from "../components/ui/cards/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import Button from "../components/ui/buttons/Button";
import { FaPlay } from "react-icons/fa6";
import { MdOutlineQueueMusic, MdPlaylistAdd } from "react-icons/md";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";
import { Song } from "../types/Song";

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);

  const player = usePlayer();
  const { addModal, closeModal } = useModal();

  // Update breadcrumbs when currentFolder changes
  useEffect(() => {
    if (!currentFolder) {
      setBreadcrumbs([]);
      return;
    }

    const currentIndex = breadcrumbs.findIndex(
      (f) => f.id === currentFolder.id
    );

    if (currentIndex === -1) {
      setBreadcrumbs((prev) => [...prev, currentFolder]);
    } else {
      setBreadcrumbs((prev) => prev.slice(0, currentIndex + 1));
    }
  }, [currentFolder]);

  const handleBreadcrumbClick = (folder: Folder | null) => {
    setCurrentFolder(folder);
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder);
  };

  // Update data when currentFolder changes
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
        data.sort((a, b) => a.name.localeCompare(b.name));
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
        const data = await response.json();
        const songs = data.map(
          (item: any) =>
            new Song({
              id: item.id,
              title: item.title,
              artist: item.author?.name,
              album: item.album?.title,
              genre: item.genre,
              year: item.year,
              file_path: item.file_path,
              file_name: item.file_name,
              folder_id: item.folder_id,
              duration: item.duration,
              file_size: item.file_size,
              file_format: item.file_format,
              image: item.image,
              play_count: item.play_count,
              last_played: item.last_played,
            })
        );
        setSongs(songs);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchFolders();
    fetchSongs();
  }, [currentFolder]);

  const handleCreatePlaylist = (): void => {
    addModal(<AddToPlaylistForm songs={songs} onSuccess={closeModal} />);
  };

  return (
    <div>
      <h1>My Folders</h1>
      {/* Breadcrumbs Navigation */}
      <div className="text-stone-300 my-2">
        <span>/ </span>
        <button
          className="underline hover:cursor-grab"
          onClick={() => handleBreadcrumbClick(null)}
        >
          Root
        </button>

        {breadcrumbs.length > 0 && " / "}

        {breadcrumbs.map((folder, index) => (
          <span key={folder.id}>
            <button
              className="underline hover:cursor-grab"
              onClick={() => handleBreadcrumbClick(folder)}
            >
              {folder.name}
            </button>
            {index < breadcrumbs.length - 1 && " / "}
          </span>
        ))}
      </div>

      <ul className="flex gap-4 flex-wrap">
        {folders.map((folder) => (
          <FolderCard
            folder={folder}
            key={folder.id}
            onClick={() => handleFolderClick(folder)}
          />
        ))}
      </ul>

      {songs.length > 0 && (
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <h2>
              <span className="font-medium">{songs.length}</span> Songs
            </h2>
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
              <Button onClick={handleCreatePlaylist}>
                <MdPlaylistAdd className="text-xl" />
                <span>Playlist</span>
              </Button>
            </div>
          </div>
          <ul>
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                onClick={() => {
                  player.dispatch({
                    type: "ADD_TO_QUEUE",
                    payload: songs,
                    replace: true,
                  });
                  player.dispatch({ type: "PLAY_SONG", payload: song });
                }}
                menuActions={[
                  {
                    text: "Add to Playlist",
                    onClick() {
                      addModal(
                        <AddToPlaylistForm
                          songs={[song]}
                          onSuccess={closeModal}
                        />
                      );
                    },
                  },
                  {
                    text: "Add to Queue",
                    onClick() {
                      player.dispatch({
                        type: "ADD_TO_QUEUE",
                        payload: [song],
                        showMessage: true,
                      });
                    },
                  },
                ]}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
