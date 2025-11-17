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
        "bg-rose-500/20 disabled:bg-stone-600 disabled:text-stone-400 border border-stone-950 py-0.5 px-2 rounded text-rose-600 font-semibold hover:bg-rose-500/30 transition-all duration-300 cursor-grab " +
        className
      }
    >
      {children}
    </button>
  );
}
