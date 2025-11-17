import Button from "../components/ui/buttons/Button";
import SongCard from "../components/ui/cards/SongCard";
import AddToPlaylistForm from "../components/ui/forms/AddToPlaylistForm";
import { useModal } from "../contexts/ModalContext";
import { usePlayer } from "../contexts/PlayerContext";
import type { Song } from "../types/Song";

export default function QueuePage() {
  const player = usePlayer();
  const { showModal, hideModal } = useModal();

  const handleClearQueue = (): void => {
    player.dispatch({ type: "CLEAR_QUEUE" });
  };

  const handleClick = (song: Song) => {
    const index = player.state.queue.findIndex((s) => s.id === song.id);
    if (index !== -1) {
      player.dispatch({ type: "SET_CURRENT_INDEX", payload: index });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1>{player.state.queue.length > 0 ? "Queue" : "Queue empty"}</h1>
        {player.state.queue.length > 0 && (
          <Button onClick={handleClearQueue}>
            <span>Clear Queue</span>
          </Button>
        )}
      </div>
      <ul>
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
                  showModal(
                    <AddToPlaylistForm songs={[song]} onSuccess={hideModal} />
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
