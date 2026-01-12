import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMusic,
  FiFolder,
  FiBook,
  FiUsers,
  FiDisc,
  FiSettings,
  FiStar,
} from "react-icons/fi";
import { MdOutlineQueueMusic } from "react-icons/md";
import type { IconType } from "react-icons";
import { TbMoodEmpty } from "react-icons/tb";

export default function SideMenu({
  onMenuToggle,
}: {
  onMenuToggle: () => void;
}) {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/playlists", label: "My Playlists", icon: FiMusic },
    { path: "library", label: "My Library", icon: FiBook },
    { path: "/folders", label: "My Folders", icon: FiFolder },
    { type: "divider" },
    { path: "/smart-playlists", label: "Smart Playlists", icon: FiStar },
    { path: "/queue", label: "Current Queue", icon: MdOutlineQueueMusic },
    { type: "divider" },
    { path: "/authors", label: "Authors", icon: FiUsers },
    { path: "/albums", label: "Albums", icon: FiDisc },
    { type: "divider" },
    { path: "/settings", label: "Settings", icon: FiSettings },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="h-full border-r border-stone-800">
      <div className="h-16 flex items-center px-6 sticky top-0">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl font-bold">
            <img
              src="/static/MYC0-1-rose-500.svg"
              className="opacity-90"
              alt="MYC0-1"
              width={120}
            />
          </h2>
          <span className="text-xs text-stone-400">pre-alpha</span>
        </div>
      </div>

      <nav className="p-4 sticky top-16">
        <ul className="space-y-0 md:space-y-1">
          {menuItems.map((item, index) => {
            if (item.type === "divider") {
              return (
                <li key={`divider-${index}`} className="my-2 md:my-3">
                  <div className="h-px bg-stone-700"></div>
                </li>
              );
            }

            const Icon: IconType = item.icon || TbMoodEmpty;
            const isItemActive = item.path ? isActive(item.path) : false;

            return (
              <li key={item.label}>
                <Link
                  to={item.path || "#"}
                  onClick={onMenuToggle}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isItemActive
                      ? "bg-rose-500/20 text-rose-600"
                      : "text-stone-300 hover:bg-stone-700/50 hover:text-stone-100"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors ${
                      isItemActive
                        ? "text-rose-600"
                        : "text-stone-300 group-hover:text-stone-100"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
