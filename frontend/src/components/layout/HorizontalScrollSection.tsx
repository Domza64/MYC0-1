import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface HorizontalScrollSectionProps {
  children: ReactNode;
  title?: string;
}

export default function HorizontalScrollSection({
  children,
  title,
}: HorizontalScrollSectionProps) {
  const scrollRef = useRef<HTMLUListElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();

    // Catches window resizes, sidebar toggles, images/data loading in —
    // anything that changes container or content size.
    const observer = new ResizeObserver(updateScrollButtons);
    observer.observe(el);

    el.addEventListener("scroll", updateScrollButtons, { passive: true });

    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", updateScrollButtons);
    };
  }, [updateScrollButtons, children]);

  const scrollByPage = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const buttonClass =
    "hidden [@media(hover:hover)_and_(pointer:fine)]:flex absolute top-1/2 z-10 -translate-y-1/2 items-center justify-center rounded-full bg-gray-950/90 p-2 text-stone-300 hover:text-white focus-visible:outline-2 focus-visible:outline-rose-500";

  return (
    <section className="w-full min-w-0">
      {title && <h2 className="text-stone-300">{title}</h2>}

      <div className="relative mt-3 min-w-0">
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => scrollByPage("left")}
            className={`${buttonClass} left-0`}
          >
            <FaChevronLeft />
          </button>
        )}

        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => scrollByPage("right")}
            className={`${buttonClass} right-0`}
          >
            <FaChevronRight />
          </button>
        )}

        <ul
          ref={scrollRef}
          className="flex w-full min-w-0 gap-4 overflow-x-auto scroll-smooth snap-x snap-proximity scrollbar-hide select-none"
        >
          {React.Children.toArray(children).map((child, index) => (
            <li key={index} className="max-w-60 shrink-0 snap-start">
              {child}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
