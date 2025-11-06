import { useEffect, useState, type RefObject } from "react";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function ProgressBar({
  audioRef,
}: {
  audioRef: RefObject<HTMLAudioElement | null>;
}) {
  const { state, dispatch } = usePlayer();
  const { currentTime, duration } = state;
  const [isDragging, setIsDragging] = useState(false);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    if (audioRef?.current) {
      audioRef.current.currentTime = newTime;
      dispatch({ type: "SET_CURRENT_TIME", payload: newTime });
    }
  };

  const handleTimeUpdate = () => {
    if (!isDragging && audioRef?.current) {
      dispatch({
        type: "SET_CURRENT_TIME",
        payload: audioRef.current.currentTime,
      });
    }
  };

  // Sync audio element with player state
  useEffect(() => {
    const audio = audioRef?.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [isDragging]);

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleSeek(e);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      handleSeek(moveEvent as unknown as React.MouseEvent<HTMLDivElement>);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      <div
        className="h-2 bg-stone-600 cursor-pointer mb-3 rounded-full overflow-hidden"
        onClick={handleSeek}
        onMouseDown={handleProgressDrag}
      >
        <div
          className="h-full bg-rose-500 transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
