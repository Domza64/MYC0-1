import { MdClearAll, MdPlaylistAdd } from "react-icons/md";
import Button from "../components/ui/buttons/Button";
import SongCard from "../components/ui/cards/SongCard";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";
import { usePlayer } from "../contexts/PlayerContext";
import type { Song } from "../types/Song";

export default function QueuePage() {
  const player = usePlayer();
  const { addModal, closeModal } = useModal();

  const handleClearQueue = (): void => {
    player.dispatch({ type: "CLEAR_QUEUE" });
  };

  const handleCreatePlaylist = (): void => {
    addModal(
      <AddToPlaylistForm songs={player.state.queue} onSuccess={closeModal} />
    );
  };

  const handleClick = (song: Song) => {
    const index = player.state.queue.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      player.dispatch({ type: "SET_CURRENT_INDEX", payload: index });
    }
  };

  return (
    <div>
      <div>
        <h1>{player.state.queue.length > 0 ? "Queue" : "Queue empty"}</h1>
        <div className="flex w-full justify-between mt-4">
          <h2>
            <span className="font-medium">{player.state.queue.length}</span>{" "}
            Songs
          </h2>
          {player.state.queue.length > 0 && (
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
        {player.state.queue.map((song) => (
          <SongCard
            song={song}
            onClick={() => {
              handleClick(song);
            }}
            menuActions={[
              {
                text: "Remove",
                onClick: () => {
                  // Remove from queue
                  alert("Remove from queue");
                },
              },
              {
                text: "Add to playlist",
                onClick: () => {
                  addModal(
                    <AddToPlaylistForm songs={[song]} onSuccess={closeModal} />
                  );
                },
              },
            ]}
            key={song.id}
          />
        ))}
      </ul>
    </div>
  );
}
