import AudioPlayer from "./AudioPlayer";
import Header from "./Header";
import SideMenu from "./SideMenu";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Main Content */}
      <div className="flex grow">
        {/* Side Menu */}
        <div className="hidden lg:block border-r border-stone-700 w-full max-w-xs">
          <SideMenu />
        </div>

        {/* Current Page */}
        <div className="w-full">
          <Header />
          <main className="grow overflow-x-scroll pb-24">{children}</main>
        </div>
      </div>

      {/* Audio Player */}
      <div className="fixed bottom-0 left-0 right-0 bg-stone-800/40 backdrop-blur-md border-t border-stone-700 px-4 py-3">
        <AudioPlayer />
      </div>
    </div>
  );
}
