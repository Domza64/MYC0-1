export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
}) {
  return (
    <button
      onClick={() => onClick?.()}
      disabled={disabled}
      type={type}
      className={
        "bg-stone-300 disabled:bg-stone-600 py-0.5 px-2 rounded text-stone-950 font-semibold hover:bg-stone-400 transition-all duration-300 cursor-grab " +
        className
      }
    >
      {children}
    </button>
  );
}
