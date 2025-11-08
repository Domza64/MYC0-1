import { useEffect, useRef, useState } from "react";
import type { Song } from "../types/music";
import SongCard from "../components/ui/SongCard";
import { usePlayer } from "../contexts/PlayerContext";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";

const LIMIT = 30;

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);
  const [offset, setOffset] = useState(0);
  const hasFetchedInitial = useRef(false);
  const { ref, inView } = useInView();

  const { dispatch } = usePlayer();

  const fetchSongs = async () => {
    setIsLoading(true);
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

  const handleAddToPlaylst = async (song: Song) => {
    try {
      const response = await fetch(`/api/playlists/songs/${2}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ song_ids: [song.id] }),
      });

      if (response.ok) {
        toast.success("Song(s) added to playlist");
      } else {
        throw new Error("Failed to add song to playlist");
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
    }
  };

  return (
    <div>
      <h1>My Library</h1>
      <ul>
        {songs.map((song, index) => {
          const isLastSong = index === songs.length - 10;

          return (
            <div key={song.id} ref={isLastSong ? ref : null}>
              <SongCard
                song={song}
                onClick={() => handleSongClick(song)}
                menuActions={[
                  {
                    onClick: () => handleAddToPlaylst(song),
                    text: "Add to playlist",
                  },
                ]}
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
