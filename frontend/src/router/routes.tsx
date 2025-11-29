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
const Authors = lazy(() => import("../pages/AuthorsPage"));
const AuthorPage = lazy(() => import("../pages/AuthorPage"));
const Playlist = lazy(() => import("../pages/PlaylistPage"));
const Albums = lazy(() => import("../pages/AlbumsPage"));
const AlbumPage = lazy(() => import("../pages/AlbumPage"));

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
    path: "/authors",
    element: <Authors />,
  },
  {
    path: "/authors/:id",
    element: <AuthorPage />,
  },
  {
    path: "/albums",
    element: <Albums />,
  },
  {
    path: "/albums/:id",
    element: <AlbumPage />,
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
