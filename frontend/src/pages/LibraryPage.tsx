import { useEffect, useRef, useState } from "react";
import SongCard from "../components/ui/cards/SongCard";
import { useInView } from "react-intersection-observer";
import { useSongMenuActions } from "../hooks/useSongMenuActions";
import { Song } from "../types/Song";

const LIMIT = 30;

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [offset, setOffset] = useState(0);

  const hasFetchedInitial = useRef(false);
  const { ref, inView } = useInView();

  const { addToPlaylist, addToQueue } = useSongMenuActions();

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "api/songs?offset=" + offset + "&limit=" + LIMIT
      );
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      const data = await response.json();
      const songs = data.map((item: any) => new Song(item));
      if (songs.length === 0) {
        setLoadedAll(true);
        return;
      }
      setSongs((prevSongs) => [...prevSongs, ...songs]);
      setOffset((prevOffset) => prevOffset + LIMIT);
    } catch (error) {
      console.error("Error fetching songs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedInitial.current && songs.length === 0) {
      hasFetchedInitial.current = true;
      fetchSongs();
    }
  }, []);

  useEffect(() => {
    if (inView && !isLoading && !loadedAll) {
      fetchSongs();
    }
  }, [inView]);

  return (
    <div>
      <h1 className="mb-4">My Library</h1>
      <ul className="space-y-2">
        {songs.map((song, index) => {
          const isLastSong = index === songs.length - 10;

          return (
            <div key={song.id} ref={isLastSong ? ref : null}>
              <SongCard
                song={song}
                menuActions={[addToPlaylist(song), addToQueue(song)]}
              />
            </div>
          );
        })}
      </ul>
      <div className="text-center text-stone-300 mt-4" ref={ref}>
        {isLoading ? (
          <p className="animate-pulse">Loading...</p>
        ) : loadedAll ? (
          <p>You have reached the end!</p>
        ) : (
          <div>
            <span>Didn't load automatically? </span>
            <button onClick={fetchSongs} className="underline cursor-grab">
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
