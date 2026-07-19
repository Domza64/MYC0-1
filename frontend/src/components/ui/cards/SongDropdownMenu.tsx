import { useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useOnClickOutside } from "../../../hooks/useOnClickOutside";

export interface MenuAction {
  onClick: () => void;
  text: string;
}

interface SongDropdownMenuProps {
  actions?: MenuAction[];
  className?: string;
  iconClassName?: string;
  menuClassName?: string;
}

export default function SongDropdownMenu({
  actions,
  className = "",
  iconClassName = "",
  menuClassName = "",
}: SongDropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setIsOpen(false), isOpen);

  if (!actions || actions.length === 0) return null;

  return (
    <div ref={containerRef} className={`relative shrink-0 ${className}`}>
      <HiOutlineDotsVertical
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`cursor-pointer text-stone-400 hover:text-white ${iconClassName}`}
      />

      {isOpen && (
        <div
          className={`absolute z-10 min-w-[120px] rounded bg-stone-800 shadow-lg ${menuClassName}`}
        >
          <ul>
            {actions.map((action) => (
              <li
                key={action.text}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                  setIsOpen(false);
                }}
                className="cursor-pointer px-3 py-2 text-sm hover:bg-stone-900"
              >
                {action.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
