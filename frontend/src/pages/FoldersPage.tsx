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
import { useSongMenuActions } from "../hooks/useSongMenuActions";
import { songsApi } from "../lib/api/songs";

// TODO: Does this need both folders and breadcrumns states? also put all updates in one useEffect
export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);

  const player = usePlayer();
  const { addModal, closeModal } = useModal();
  const { addToPlaylist, addToQueue } = useSongMenuActions();

  const handleBreadcrumbClick = (folder: Folder | null) => {
    setCurrentFolder(folder);
  };

  const handleFolderClick = (folder: Folder) => {
    setCurrentFolder(folder);
  };

  useEffect(() => {
    setSongs([]);
    setFolders([]);

    songsApi.getFolders(currentFolder?.id).then((folders) => {
      folders.sort((a, b) => a.name.localeCompare(b.name));
      setFolders(folders);
    });

    if (currentFolder !== null) {
      songsApi.getByFolder(currentFolder.id).then(setSongs);
    }
  }, [currentFolder]);

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
          <ul className="space-y-2">
            {songs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                menuActions={[addToPlaylist(song), addToQueue(song)]}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
