import { lazy } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/HomePage"));
const Library = lazy(() => import("../pages/LibraryPage"));
const Settings = lazy(() => import("../pages/SettingsPage"));
const NotFound = lazy(() => import("../pages/NotFoundPage"));
const Folders = lazy(() => import("../pages/FoldersPage"));
const Queue = lazy(() => import("../pages/QueuePage"));
const Playlists = lazy(() => import("../pages/PlaylistsPage"));
const Profile = lazy(() => import("../pages/ProfilePage"));
const Playlist = lazy(() => import("../pages/PlaylistPage"));

export const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/library",
    element: <Library />,
  },
  {
    path: "/playlists",
    element: <Playlists />,
  },
  {
    path: "/playlists/:id",
    element: <Playlist />,
  },
  {
    path: "/folders",
    element: <Folders />,
  },
  {
    path: "/queue",
    element: <Queue />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
