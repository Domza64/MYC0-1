import React, { useEffect, useRef, useState } from "react";
import { type ReactNode } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface VerticalScrollSectionProps {
  children: ReactNode[] | ReactNode;
  title?: string;
}

export default function VerticalScrollSection({
  children,
  title,
}: VerticalScrollSectionProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const checkOverflow = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check if content is wider than container
    const hasOverflow = container.scrollWidth > container.clientWidth;
    setIsOverflowing(hasOverflow);

    // Check scroll position to determine which buttons to show
    setShowLeftButton(container.scrollLeft > 0);
    setShowRightButton(
      container.scrollLeft < container.scrollWidth - container.clientWidth - 1
    );
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 300;

    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
  };

  // Check overflow on mount and when children change
  useEffect(() => {
    checkOverflow();

    // Also check on window resize
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [children]);

  // Update button visibility on scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("scroll", checkOverflow);

    return () => {
      container.removeEventListener("scroll", checkOverflow);
    };
  }, []);

  return (
    <section>
      {title && (
        <h2 className="text-xl font-semibold text-stone-300">{title}</h2>
      )}
      <div className="mt-4 relative">
        {isOverflowing && showLeftButton && (
          <div
            className="absolute z-10 bg-gray-950 rounded-full p-2 text-stone-300 top-1/2 -translate-y-1/2"
            onClick={() => scroll("left")}
          >
            <FaChevronLeft />
          </div>
        )}

        {isOverflowing && showRightButton && (
          <div
            className="absolute right-0 z-10 bg-gray-950 rounded-full p-2 text-stone-300 top-1/2 -translate-y-1/2"
            onClick={() => scroll("right")}
          >
            <FaChevronRight />
          </div>
        )}

        <ul
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto w-full cursor-grab scrollbar-hide select-none scroll-smooth"
        >
          {React.Children.toArray(children).map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
