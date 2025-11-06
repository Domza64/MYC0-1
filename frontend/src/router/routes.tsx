import { lazy } from "react";

// Lazy load pages for better performance
const Home = lazy(() => import("../pages/Home"));
const Library = lazy(() => import("../pages/Library"));
const Settings = lazy(() => import("../pages/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Folders = lazy(() => import("../pages/Folders"));
const Queue = lazy(() => import("../pages/Queue"));
const Profile = lazy(() => import("../pages/Profile"));

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
