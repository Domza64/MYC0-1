import { RiMenu2Fill } from "react-icons/ri";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import SearchBar from "../ui/SearchBar";
import { FaUser } from "react-icons/fa6";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const { auth } = useAuth();

  return (
    <header className="w-full sticky top-0 md:px-4 px-3 h-16 flex items-center backdrop-blur-md z-10">
      <div className="max-w-400 flex w-full gap-4 items-center justify-between">
        <RiMenu2Fill
          className="lg:hidden block text-3xl min-w-max"
          onClick={onMenuToggle}
        />
        <SearchBar />
        <Link
          to={"profile"}
          className="flex items-center gap-3 select-none hover:cursor-pointer"
        >
          <span className="hidden lg:block font-semibold">
            {auth?.username}
          </span>
          <div className="rounded-full bg-rose-600 w-8 h-8 flex justify-center items-center font-semibold">
            <FaUser className="text-black" />
            {/* <img src={auth.picure} alt={auth?.username?.charAt(0)} /> */}
          </div>
        </Link>
      </div>
    </header>
  );
}
