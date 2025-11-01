import { PlayerProvider } from "./contexts/PlayerContext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <PlayerProvider>
      <AppRouter />
    </PlayerProvider>
  );
}
