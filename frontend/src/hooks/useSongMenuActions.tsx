import { useModal } from "../contexts/ModalContext";
import { usePlayer } from "../contexts/PlayerContext";
import AddToPlaylistForm from "../components/ui/modals/AddToPlaylistForm";
import type { Song } from "../types/Song";
import type { MenuAction } from "../types/UI";

export const useSongMenuActions = () => {
  const { addModal, closeModal } = useModal();
  const { dispatch } = usePlayer();

  const addToPlaylist = (song: Song): MenuAction => ({
    text: "Add to playlist",
    onClick: () => {
      addModal(<AddToPlaylistForm songs={[song]} onSuccess={closeModal} />);
    },
  });

  const addToQueue = (song: Song): MenuAction => ({
    text: "Add to queue",
    onClick: () => {
      dispatch({ type: "ADD_TO_QUEUE", payload: [song], showMessage: true });
    },
  });

  const playSong = (song: Song): MenuAction => ({
    text: "Play",
    onClick: () => {
      dispatch({ type: "PLAY_SONG", payload: song });
    },
  });

  const removeFromQueue = (song: Song): MenuAction => ({
    text: "Remove from queue",
    onClick: () => {
      alert(`TODO: remove ${song.id} from queue`);
      // dispatch({ type: "REMOVE_FROM_QUEUE", payload: song });
    },
  });

  return {
    removeFromQueue,
    addToPlaylist,
    addToQueue,
    playSong,
  };
};
