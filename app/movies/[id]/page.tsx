"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

const IMAGE_BASE3 = "https://image.tmdb.org/t/p/w500";

export default function MovieDetail() {
  const router = useRouter();
  const params = useParams() as any;
  const id = params?.id;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/tmdb/movie/${id}`);
        const data = await res.json();
        if (!mounted) return;
        setMovie({
          title: data.title,
          poster: data.poster_path ? `${IMAGE_BASE3}${data.poster_path}` : "/placeholder.png",
          description: data.overview,
          themes: (data.genres || []).map((g: any) => g.name),
          why: `Rating: ${data.vote_average} — ${data.tagline || ""}`,
        });
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (id) load();
    return () => { mounted = false; };
  }, [id]);

  if (loading)
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  if (!movie)
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Not found</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button className="text-sm text-gray-400 mb-4" onClick={() => router.back()}>
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="rounded-lg overflow-hidden border border-gray-800">
<Image
  src={movie.poster}
  alt={movie?.title ?? "Movie Poster"}
  width={600}
  height={900}
  className="w-full h-auto object-cover"
/>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex gap-2 mb-4">
              {movie.themes.map((t: string) => (
                <span key={t} className="text-xs bg-gray-800 px-2 py-1 rounded">{t}</span>
              ))}
            </div>

            <p className="text-gray-300 mb-4">{movie.description}</p>

            <div className="mb-4">
              <h3 className="font-semibold">Why we recommend it</h3>
              <p className="text-gray-300">{movie.why}</p>
            </div>

            <div className="flex gap-3">
              <button className="bg-red-600 px-4 py-2 rounded hover:bg-red-700">Watch Trailer</button>
              <button className="bg-gray-800 px-4 py-2 rounded border border-gray-700">Add to favorites</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
