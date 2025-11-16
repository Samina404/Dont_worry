"use client";
import MediaCard from "./MediaCard";


export default function MediaGrid({ items = [], onItemClick }: any) {
return (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
{items.map((it: any) => (
<MediaCard
key={it.id || it.title}
title={it.title}
image={it.image}
description={it.description}
subtitle={it.subtitle}
onClick={() => onItemClick?.(it)}
/>
))}
</div>
);
}

