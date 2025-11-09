import React from "react";
import { type ReactNode } from "react";

interface VerticalScrollSectionProps {
  children: ReactNode[] | ReactNode;
  title?: string;
}

export default function VerticalScrollSection({
  children,
  title,
}: VerticalScrollSectionProps) {
  return (
    <section>
      {title && (
        <h2 className="text-xl font-semibold text-stone-300 mb-4">{title}</h2>
      )}
      <div>
        <ul className="flex gap-6 overflow-x-auto w-full cursor-grab scrollbar-hide select-none">
          {React.Children.toArray(children).map((child, index) => (
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
