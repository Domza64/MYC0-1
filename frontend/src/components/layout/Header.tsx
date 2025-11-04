import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

export default function Header() {
  return (
    <header className="w-full max-w-7xl p-4 flex gap-4 items-center justify-between">
      <GiHamburgerMenu className="md:hidden block" />
      <div className="flex text-2xl">
        <MdKeyboardArrowLeft />
        <MdKeyboardArrowRight />
      </div>
      <input
        type="text"
        placeholder="Search your music"
        className="bg-stone-800 px-2 py-1 rounded-lg w-full max-w-3xl"
      />
      <div className="flex items-center gap-4">
        <span className="hidden lg:block font-semibold">Current user</span>
        <div className="w-8 h-8 rounded-full bg-rose-800"></div>
      </div>
    </header>
  );
}
