import { Suspense, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { routes } from "./routes";
import Layout from "../components/layout/Layout";
import { usePlayer } from "../contexts/PlayerContext";
// import ProtectedRoute from "../components/auth/ProtectedRoute/ProtectedRoute";

export default function AppRouter() {
  const player = usePlayer();

  useEffect(() => {
    // Set page title to song title if song is playing
    if (player.state.currentSong) {
      document.title = player.state.currentSong.title;
    }
  }, [player.state.currentSong]);

  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.protected
                    ? /*<ProtectedRoute>{route.element}</ProtectedRoute>*/
                      route.element
                    : route.element
                }
              />
            ))}
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
