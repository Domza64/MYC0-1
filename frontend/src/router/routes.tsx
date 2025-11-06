import { lazy } from "react";
import Folders from "../pages/Folders";
import Profile from "../pages/Profile";

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
