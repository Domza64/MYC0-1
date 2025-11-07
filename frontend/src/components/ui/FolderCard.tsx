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
      className="w-24 h-24 flex flex-col rounded-lg justify-center items-center select-none cursor-grab hover:bg-stone-800/50 transition-all duration-300"
      onClick={onClick}
    >
      <FaFolder className="mb-2 text-[120px] text-stone-700/50" />
      <span className="text-center text-stone-400">
        {folder.name.length > 10
          ? folder.name.slice(0, 10) + "..."
          : folder.name}
      </span>
    </li>
  );
}
