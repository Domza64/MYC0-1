import { useEffect, useState } from "react";
import type { Folder } from "../types/folder";
import FolderCard from "../components/ui/cards/FolderCard";
import type { Song } from "../types/music";
import SongCard from "../components/ui/cards/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import Button from "../components/ui/buttons/Button";
import { FaPlay } from "react-icons/fa6";
import { MdOutlineQueueMusic } from "react-icons/md";
import AddToPlaylistForm from "../components/ui/forms/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);

  const player = usePlayer();
  const { showModal, hideModal } = useModal();

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
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl">Songs:</h2>
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
                <span>Add</span>
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
                      showModal(
                        <AddToPlaylistForm
                          songs={[song]}
                          onSuccess={hideModal}
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
