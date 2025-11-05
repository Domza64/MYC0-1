import { FaFolder } from "react-icons/fa";
import type { Folder } from "../../types/folder";

export default function FolderCard({
  folder,
  onClick,
}: {
  folder: Folder;
  onClick?: () => void;
}) {
  return (
    <li
      className="w-32 h-32 rounded-xl bg-stone-800 flex flex-col justify-center items-center select-none cursor-grab hover:bg-stone-800/50 transition-all duration-300"
      onClick={onClick}
    >
      <FaFolder className="mb-2 text-7xl text-stone-700/80" />
      <span className="text-center text-stone-400">{folder.name}</span>
    </li>
  );
}
