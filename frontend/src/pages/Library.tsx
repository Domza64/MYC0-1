import { useEffect, useRef, useState } from "react";
import type { Song } from "../types/music";
import SongCard from "../components/ui/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import { useInView } from "react-intersection-observer";

const LIMIT = 25;

export default function Library() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [offset, setOffset] = useState(0);
  const hasFetchedInitial = useRef(false);
  const { ref, inView } = useInView();

  const { dispatch } = usePlayer();

  const fetchSongs = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const response = await fetch(
        "api/songs?offset=" + offset + "&limit=" + LIMIT
      );
      if (!response.ok) {
        throw new Error("Failed to fetch songs");
      }
      const data: Song[] = await response.json();
      if (data.length === 0) {
        setLoadedAll(true);
        return;
      }
      setSongs((prevSongs) => [...prevSongs, ...data]);
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

  const handleSongClick = (song: Song) => {
    dispatch({ type: "CLEAR_QUEUE" });
    dispatch({ type: "ADD_TO_QUEUE", payload: [song] });
    dispatch({ type: "PLAY_SONG", payload: song });
  };

  return (
    <div>
      <h1>My Library</h1>
      <ul>
        {songs.map((song, index) => {
          const isLastSong = index === songs.length - 10;

          return (
            <div key={song.id} ref={isLastSong ? ref : null}>
              <SongCard song={song} onClick={() => handleSongClick(song)} />
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
