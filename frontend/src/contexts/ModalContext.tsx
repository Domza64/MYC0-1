import { createContext, useContext, useState, type ReactNode } from "react";

type ModalContextType = {
  addModal: (content: ReactNode) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalStack, setModalStack] = useState<ReactNode[]>([]);

  const addModal = (content: ReactNode) => {
    setModalStack((prev) => [...prev, content]);
  };

  const closeModal = () => {
    setModalStack((prev) => prev.slice(0, -1));
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const topModal = modalStack[modalStack.length - 1];

  return (
    <ModalContext.Provider value={{ addModal, closeModal }}>
      {children}
      {topModal && (
        <div
          onClick={handleBackdropClick}
          className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 text-stone-300"
        >
          <div className="w-full max-w-md bg-stone-950/70 border border-stone-800 rounded-xl flex justify-center items-center md:m-4 m-2">
            {topModal}
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
