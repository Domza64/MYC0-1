import { Suspense, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../components/layout/Layout";
import { usePlayer } from "../contexts/PlayerContext";
import Login from "../pages/LoginPage";
import { useAuth } from "../contexts/AuthContext";
import Loading from "../components/layout/Loading";

export default function AppRouter() {
  const player = usePlayer();
  const { auth, loading } = useAuth();

  useEffect(() => {
    // Set page title to song title if song is playing
    if (player.state.currentSong) {
      document.title = player.state.currentSong.title;
    }
  }, [player.state.currentSong]);

  if (loading) return <></>; // Put app logo here in the future
  if (!auth.username) return <Login />;

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<Loading />}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
