import { lazy } from "react";
import Folders from "../pages/Folders";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Library = lazy(() => import("../pages/Library"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

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
    path: "/folders",
    element: <Folders />,
  },
  /*{
    path: "/playlists/:id",
    element: lazy(
      () => import("../pages/Playlists/PlaylistDetail/PlaylistDetail")
    ),
  },*/
  /*{
    path: "/playlists/create",
    element: lazy(
      () => import("../pages/Playlists/CreatePlaylist/CreatePlaylist")
    ),
  },*/
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
