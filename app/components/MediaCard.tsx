"use client";
import Image from "next/image";

// MediaCard: a single reusable card component. Exported as default for real-file usage.
// Note: we do not import React explicitly here to avoid duplicate identifier issues in some test/concatenated environments.

export default function MediaCard({
  title,
  image,
  description,
  onClick,
  subtitle,
}: any) {
  return (
    <div
      onClick={onClick}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition cursor-pointer border border-gray-800"
    >
      {image && (
        <div className="w-full h-48 relative">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        {subtitle && <div className="text-xs text-gray-400 mb-2">{subtitle}</div>}
        <p className="text-gray-400 text-sm line-clamp-3">{description}</p>
      </div>
    </div>
  );
}
