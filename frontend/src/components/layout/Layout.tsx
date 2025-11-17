import { useState } from "react";
import AudioPlayer from "./audio-player/AudioPlayer";
import Header from "./Header";
import SideMenu from "./SideMenu";
import ImageBackground from "./ImageBackground";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Image background */}
      <ImageBackground />
      {/* Main Content */}
      <div className="flex grow">
        {/* Side Menu */}
        <div
          className={`
          fixed lg:static
          left-0 top-0 h-full lg:h-auto
          z-30 lg:z-auto border-r border-stone-800
          min-w-xs transition-transform lg:transform-none
          ${isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <div
            className={`w-full h-full bg-stone-950/${isMenuOpen ? "60" : "15"}`}
          >
            <SideMenu onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          </div>
        </div>

        {/* Overlay for mobile */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 lg:hidden backdrop-blur-sm bg-stone-950/30 z-20"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        )}

        {/* Current Page */}
        <div className="w-full">
          <Header onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          <main className="md:p-4 p-2 md:pb-26 pb-20">{children}</main>
        </div>
      </div>

      {/* Audio Player */}
      <div
        className={`${
          isPlayerOpen ? "h-screen" : "md:h-24"
        } fixed z-40 bottom-0 left-0 right-0 flex justify-center bg-stone-800/40 backdrop-blur-md border-t border-stone-700 px-4 py-3`}
        onClick={() => setIsPlayerOpen((isOpen) => !isOpen)}
      >
        <AudioPlayer playerOpen={isPlayerOpen} />
      </div>
    </div>
  );
}
