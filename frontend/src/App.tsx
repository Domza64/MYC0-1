import { AuthProvider } from "./contexts/AuthContext";
import { ModalProvider } from "./contexts/ModalContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <ModalProvider>
      <AuthProvider>
        <PlayerProvider>
          <AppRouter />
        </PlayerProvider>
      </AuthProvider>
    </ModalProvider>
  );
}
