import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import type { Song } from "../../types/Song";
import SongCard from "./cards/SongCard";
import { searchApi } from "../../lib/api/search";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useSongMenuActions } from "../../hooks/useSongMenuActions";

export default function SearchBar() {
  const [results, setResults] = useState<Song[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const { addToPlaylist, addToQueue } = useSongMenuActions();

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!search) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    const timeoutId = setTimeout(() => {
      searchApi
        .getSongs(search)
        .then(setResults)
        .finally(() => setLoading(false));
    }, 400); // debounce delay

    setShowResults(true);

    // Cleanup: cancel previous request
    return () => clearTimeout(timeoutId);
  }, [search]);

  // TODO: Extract this into reusable hook
  useEffect(() => {
    function handleOutside(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener("pointerdown", handleOutside);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
    };
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-3xl">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 text-base" />
        <input
          type="text"
          placeholder="Search music..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => {
            setShowResults(true);
          }}
          className="w-full bg-stone-950 shadow shadow-stone-950 border-stone-700 rounded-full pl-10 py-1.5 text-stone-300 placeholder-stone-500 border focus:border-2 focus:outline-none focus:border-rose-500 focus:bg-stone-800 transition-colors"
        />
      </div>
      {showResults && search && (
        <div className="bg-stone-950 shadow shadow-stone-950 border-stone-700 border mt-2 p-2 rounded-2xl w-full absolute">
          {loading ? (
            <div>
              <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {results.map((song: Song, index) => (
                <SongCard
                  song={song}
                  key={index}
                  menuActions={[addToPlaylist(song), addToQueue(song)]}
                />
              ))}
            </div>
          ) : (
            <div>Nothing found</div>
          )}
        </div>
      )}
    </div>
  );
}
