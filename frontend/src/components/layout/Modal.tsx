export default function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 backdrop-blur flex items-center justify-center z-50 text-stone-300"
    >
      <div className="w-full max-w-md bg-stone-900/50 border border-stone-800 shadow-xl shadow-stone-900 rounded-xl flex justify-center items-center min-h-32 m-4">
        {children}
      </div>
    </div>
  );
}
