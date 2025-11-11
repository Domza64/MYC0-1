import { FaShuffle } from "react-icons/fa6";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function ShuffleButton() {
  const { state, dispatch } = usePlayer();

  const handleToggleShuffle = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    dispatch({ type: "TOGGLE_SHUFFLE" });
    e.stopPropagation();
  };

  return (
    <FaShuffle
      onClick={handleToggleShuffle}
      className={`${
        state.shuffle ? "text-rose-500" : "text-stone-400"
      } transition-all duration-300 cursor-grab`}
    />
  );
}
