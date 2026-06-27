import { useState } from "react";
import { FaStar } from "react-icons/fa6";
import type { Song } from "../../types/Song";
import { songsApi } from "../../lib/api/songs";

export default function SongRating({
  song,
  className,
}: {
  song: Song;
  className: string;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rating, setRating] = useState<null | number>(song.rating);

  const updateRating = async (newRating: number) => {
    const oldRating = rating;
    setRating(newRating);
    songsApi.rateSong(song.id, newRating).catch(() => setRating(oldRating)); // TODO: Test this catch
  };

  return (
    <div className={`hidden gap-1 lg:flex ${className}`}>
      {Array.from({ length: 5 }, (_, i) => {
        const starValue = i + 1;

        const isFilled = (hovered ?? rating ?? 0) >= starValue;

        return (
          <FaStar
            key={i}
            onClick={() => updateRating(starValue)}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            className={`cursor-pointer transition-colors ${
              isFilled ? "text-rose-500" : "text-stone-700"
            }`}
          />
        );
      })}
    </div>
  );
}
