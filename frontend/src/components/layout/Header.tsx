import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RiMenu2Fill } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { auth } = useAuth();

  return (
    <header className="w-full max-w-7xl px-4 h-16 flex gap-4 items-center justify-between sticky top-0 bg-stone-950/80 backdrop-blur-md z-10">
      <RiMenu2Fill
        className="lg:hidden block text-5xl"
        onClick={onMenuToggle}
      />
      <div className="flex text-2xl">
        <MdKeyboardArrowLeft />
        <MdKeyboardArrowRight />
      </div>
      <input
        type="text"
        placeholder="Search your music"
        className="bg-stone-800 px-2 py-1 rounded-lg w-full max-w-3xl"
      />
      <Link
        to={"profile"}
        className="flex items-center gap-3 select-none hover:cursor-pointer"
      >
        <span className="hidden lg:block font-semibold">{auth.username}</span>
        <div className="rounded-full bg-rose-600 w-8 h-8 flex justify-center items-center font-semibold">
          <img src="pfp.png" alt={auth?.username?.charAt(0) || "?"} />
        </div>
      </Link>
    </header>
  );
}
