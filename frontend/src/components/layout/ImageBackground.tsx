import { useEffect, useState } from "react";
import { usePlayer } from "../../contexts/PlayerContext";

export default function ImageBackground() {
  const { state } = usePlayer();
  const [imgURL, setImgURL] = useState<string | null>(null);

  useEffect(() => {
    if (state.currentSong?.album_art) {
      setImgURL(`/images/${encodeURIComponent(state.currentSong.album_art)}`);
    } else {
      setImgURL(null);
    }
  }, [state.currentSong]);

  return (
    <div
      className="fixed w-full h-full bg-cover bg-no-repeat bg-center blur-2xl lg:blur-3xl -z-10 opacity-30"
      style={{
        backgroundImage: `url("${imgURL}")`,
      }}
    ></div>
  );
}
