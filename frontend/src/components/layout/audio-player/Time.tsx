import { usePlayer } from "../../../contexts/PlayerContext";
import { formatDuration } from "../../../lib/formatters";

export default function Time() {
  const { state } = usePlayer();
  const { currentTime, duration } = state;

  return (
    <div className="text-stone-400 text-sm whitespace-nowrap">
      {formatDuration(currentTime)} / {formatDuration(duration)}
    </div>
  );
}
