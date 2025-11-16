"use client";


import { useEffect, useState } from "react";
import MediaGrid from "../components/MediaGrid";
import { useRouter } from "next/navigation";


const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";


export default function MoviesPage() {
const [items, setItems] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const router = useRouter();


useEffect(() => {
let mounted = true;
async function load() {
try {
const res = await fetch(`/api/tmdb/search?q=mental%20health&page=1`);
const data = await res.json();
if (!mounted) return;
const mapped = (data.results || []).map((m: any) => ({
id: m.id,
title: m.title || m.name,
image: m.poster_path ? `${IMAGE_BASE}${m.poster_path}` : "/placeholder.png",
description: m.overview,
}));
setItems(mapped);
} catch (err) {
console.error(err);
} finally {
if (mounted) setLoading(false);
}
}
load();
return () => { mounted = false; };
}, []);


if (loading)
return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading movies...</div>;


return (
<div className="min-h-screen bg-black text-white p-6">
<div className="max-w-6xl mx-auto">
<div className="flex justify-between items-center mb-6">
<h1 className="text-3xl font-bold">🎬 Movies About Mental Health</h1>
<button
className="text-sm text-gray-400 hover:text-white"
onClick={() => router.push("/movies/see-all")}
>
See all
</button>
</div>


<MediaGrid
items={items}
onItemClick={(it: any) => router.push(`/movies/${encodeURIComponent(it.id)}`)}
/>
</div>
</div>
);
}