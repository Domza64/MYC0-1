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
      className="p-2 bg-stone-800 my-2 flex justify-center items-center select-none cursor-grab"
      onClick={onClick}
    >
      {folder.name}
    </li>
  );
}
