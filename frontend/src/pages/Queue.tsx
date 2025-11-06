import Button from "../components/ui/buttons/Button";
import SongCard from "../components/ui/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import type { Song } from "../types/music";

export default function Queue() {
  const player = usePlayer();

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
        <h1>{player.state.queue.length > 0 ? "Currently playing" : "Queue"}</h1>
        <Button onClick={handleClearQueue}>
          <span>Clear Queue</span>
        </Button>
      </div>
      <ul>
        {player.state.queue.map((song) => (
          <SongCard
            song={song}
            onClick={() => {
              handleClick(song);
            }}
            key={song.id}
          />
        ))}
      </ul>
    </div>
  );
}
