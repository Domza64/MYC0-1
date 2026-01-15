import { FaFolder } from "react-icons/fa";
import type { Folder } from "../../../types/folder";

export default function FolderCard({
  folder,
  onClick,
}: {
  folder: Folder;
  onClick?: () => void;
}) {
  return (
    <div
      className="w-24 h-24 flex flex-col rounded-lg justify-center items-center select-none cursor-grab hover:bg-stone-800 hover:scale-105 transition-all duration-300"
      onClick={onClick}
    >
      <FaFolder className="text-[90px] text-stone-700/80" />
      <span className="text-center p-2 pb-3 text-stone-400 truncate w-24">
        {folder.name}
      </span>
    </div>
  );
}
