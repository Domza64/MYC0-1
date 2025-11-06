export default function Button({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-rose-600 py-1 px-3 rounded text-stone-100 font-medium hover:bg-rose-700 transition-all duration-300 cursor-grab"
    >
      {text}
    </button>
  );
}
