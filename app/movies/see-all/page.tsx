"use client";


import { useEffect, useState } from "react";
import MediaGrid from "../../components/MediaGrid";
import { useRouter } from "next/navigation";


const IMAGE_BASE2 = "https://image.tmdb.org/t/p/w500";


export default function MoviesSeeAll() {
const [items, setItems] = useState<any[]>([]);
const [page, setPage] = useState(1);
const router = useRouter();


useEffect(() => {
let mounted = true;
async function loadPage(p: number) {
try {
const res = await fetch(`/api/tmdb/search?q=mental%20health&page=${p}`);
const data = await res.json();
if (!mounted) return;
const mapped = (data.results || []).map((m: any) => ({
id: m.id,
title: m.title || m.name,
image: m.poster_path ? `${IMAGE_BASE2}${m.poster_path}` : "/placeholder.png",
description: m.overview,
}));
setItems((prev) => (p === 1 ? mapped : [...prev, ...mapped]));
} catch (err) {
console.error(err);
}
}


loadPage(page);


return () => { mounted = false; };
}, [page]);


return (
<div className="min-h-screen bg-black text-white p-6">
<div className="max-w-6xl mx-auto">
<h1 className="text-3xl font-bold mb-6">All recommended movies</h1>


<MediaGrid items={items} onItemClick={(it: any) => router.push(`/movies/${it.id}`)} />


<div className="mt-8 flex justify-center">
<button className="bg-gray-800 px-4 py-2 rounded mr-2" onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
<button className="bg-gray-800 px-4 py-2 rounded" onClick={() => setPage((p) => p + 1)}>Load more</button>
</div>
</div>
</div>
);
}