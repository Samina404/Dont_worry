// components/MediaGrid.tsx
"use client";
import React from "react";
import Image from "next/image";

type Item = {
  id: number | string;
  title: string;
  image: string;
  description?: string;
};

export default function MediaGrid({
  items,
  onItemClick,
}: {
  items: Item[];
  onItemClick: (item: Item) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="bg-gray-900 rounded overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform"
          onClick={() => onItemClick(it)}
        >
          <div className="relative w-full h-64">
            <Image
              src={it.image}
              alt={it.title}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={(e) => {
                // fallback handled by Next Image config + placeholder path
              }}
            />
          </div>
          <div className="p-2">
            <h3 className="text-sm font-semibold truncate">{it.title}</h3>
            <p className="text-xs text-gray-400 ">{it.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
