import { MdClearAll, MdPlaylistAdd } from "react-icons/md";
import Button from "../components/ui/buttons/Button";
import SongCard from "../components/ui/cards/SongCard";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";
import { usePlayer } from "../contexts/PlayerContext";
import { useSongMenuActions } from "../hooks/useSongMenuActions";
export default function QueuePage() {
  const player = usePlayer();
  const { addModal, closeModal } = useModal();
  const { addToPlaylist, removeFromQueue } = useSongMenuActions();

  const handleClearQueue = (): void => {
    player.dispatch({ type: "CLEAR_QUEUE" });
  };

  const handleCreatePlaylist = (): void => {
    addModal(
      <AddToPlaylistForm
        songs={player.state.currentQueue}
        onSuccess={closeModal}
      />,
    );
  };

  return (
    <div>
      <div>
        <h1>
          {player.state.currentQueue.length > 0 ? "Queue" : "Queue empty"}
        </h1>
        <div className="flex w-full justify-between mt-4">
          <h2>
            <span className="font-medium">
              {player.state.currentQueue.length}
            </span>{" "}
            Songs
          </h2>
          {player.state.currentQueue.length > 0 && (
            <div className="flex gap-1">
              <Button onClick={handleCreatePlaylist}>
                <MdPlaylistAdd className="text-xl" />
                <span>Playlist</span>
              </Button>
              <Button onClick={handleClearQueue}>
                <MdClearAll className="text-xl" />
                <span>Clear</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {player.state.currentQueue.map((song) => (
          <SongCard
            song={song}
            menuActions={[addToPlaylist(song), removeFromQueue(song)]}
            key={song.id}
          />
        ))}
      </ul>
    </div>
  );
}
