import { FaRepeat } from "react-icons/fa6";
import { usePlayer } from "../../../contexts/PlayerContext";

export default function RepeatButton() {
  const { state, dispatch } = usePlayer();

  const handleToggleRepeat = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    dispatch({ type: "TOGGLE_REPEAT" });
    e.stopPropagation();
  };

  return (
    <FaRepeat
      onClick={handleToggleRepeat}
      className={`${
        state.repeat ? "text-rose-500" : "text-stone-400"
      } transition-all duration-300 cursor-grab`}
    />
  );
}
