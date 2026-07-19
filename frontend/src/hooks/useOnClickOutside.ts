import { useEffect, type RefObject } from "react";

/**
 * Calls `onClickOutside` when a click/tap lands outside `ref`'s element.
 * Pass `enabled = false` to skip attaching the listener entirely —
 * useful for only listening while something like a dropdown is open.
 */

// TODO: Can and should this be used in ModalContext.tsx?
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onClickOutside: () => void,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onClickOutside();
    };

    // mousedown (not click) so this resolves before any click-based
    // toggle handler on the trigger element itself.
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [ref, onClickOutside, enabled]);
}
