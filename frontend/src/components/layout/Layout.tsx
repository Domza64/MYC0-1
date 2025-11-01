import AudioPlayer from "./AudioPlayer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen h-full flex flex-col bg-stone-950">
      <main className="grow overflow-x-scroll pb-24">{children}</main>
      <AudioPlayer />
    </div>
  );
}
