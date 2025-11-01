import { lazy } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Library = lazy(() => import("../pages/Library"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes = [
  {
    path: "/",
    element: <Home />,
    protected: true,
  },
  {
    path: "/library",
    element: <Library />,
    protected: true,
  },
  /*{
    path: "/playlists/:id",
    element: lazy(
      () => import("../pages/Playlists/PlaylistDetail/PlaylistDetail")
    ),
    protected: true,
  },*/
  /*{
    path: "/playlists/create",
    element: lazy(
      () => import("../pages/Playlists/CreatePlaylist/CreatePlaylist")
    ),
    protected: true,
  },*/
  {
    path: "/settings",
    element: <Settings />,
    protected: true,
  },
  {
    path: "*",
    element: <NotFound />,
    protected: false,
  },
];
