"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface VerticalScrollSectionProps {
  children: ReactNode[];
  title?: string;
}

export default function VerticalScrollSection({
  children,
  title,
}: VerticalScrollSectionProps) {
  const sliderRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("active:cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove("active:cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove("active:cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 2;
      slider.scrollLeft = scrollLeft - walk;
    };

    // Add event listeners
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseleave", handleMouseLeave);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseleave", handleMouseLeave);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section>
      {title && (
        <h2 className="text-xl font-semibold text-stone-300 mb-4">{title}</h2>
      )}
      <div className="relative">
        <ul
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto cursor-grab scrollbar-hide select-none"
        >
          {children.map((child, index) => (
            <li key={index}>{child}</li>
          ))}
        </ul>

        {/* Gradient fade edges
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-stone-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-linear-to-l from-stone-950 to-transparent" />
         */}
      </div>
    </section>
  );
}
