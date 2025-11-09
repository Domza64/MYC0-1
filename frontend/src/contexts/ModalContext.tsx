import { createContext, useContext, useState, type ReactNode } from "react";

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);

  const showModal = (content: ReactNode) => setModalContent(content);
  const hideModal = () => setModalContent(null);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      hideModal();
    }
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalContent && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 text-stone-300"
        >
          <div className="w-full max-w-md bg-stone-950/70 border border-stone-800 shadow-xl shadow-stone-900 rounded-xl flex justify-center items-center min-h-32 md:m-4 m-2">
            {modalContent}
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used inside a ModalProvider");
  }
  return ctx;
};
