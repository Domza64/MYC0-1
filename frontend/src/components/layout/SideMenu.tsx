import { Link } from "react-router-dom";

export default function SideMenu() {
  return (
    <aside className="h-full">
      <h2>MYC0-1</h2>
      <ul>
        <li>
          <Link to={"/"}>Home</Link>
        </li>
        <li>My playlists</li>
        <li>My Library</li>
        <li>
          <Link to={"folders"}>Folders</Link>
        </li>
        <li>Artists</li>
        <li>Albums</li>
        <li>Smart playlists</li>
        <li>Current queue</li>
        <li>
          <Link to={"settings"}>Settings</Link>
        </li>
      </ul>
    </aside>
  );
}
