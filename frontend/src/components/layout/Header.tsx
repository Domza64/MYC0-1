import { RiMenu2Fill } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { auth } = useAuth();

  return (
    <header className="w-full md:px-4 px-2 h-16 sticky flex items-center top-0 bg-stone-950/60 backdrop-blur-md z-10">
      <div className="max-w-400 flex w-full gap-4 items-center justify-between">
        <RiMenu2Fill
          className="lg:hidden block text-2xl min-w-max"
          onClick={onMenuToggle}
        />
        <div className="relative w-full max-w-3xl">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-500 text-base" />
            <input
              type="text"
              placeholder="Search music..."
              className="w-full bg-stone-900 rounded-full pl-10 py-2 text-stone-300 placeholder-stone-500 focus:border-2 focus:outline-none focus:border-rose-500 focus:bg-stone-800 transition-colors"
            />
          </div>
        </div>
        <Link
          to={"profile"}
          className="flex items-center gap-3 select-none hover:cursor-pointer"
        >
          <span className="hidden lg:block font-semibold">{auth.username}</span>
          <div className="rounded-full bg-rose-600 w-8 h-8 flex justify-center items-center font-semibold">
            <img src="pfp.png" alt={auth?.username?.charAt(0) || "?"} />
          </div>
        </Link>
      </div>
    </header>
  );
}
