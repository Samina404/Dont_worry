// app/movies/[id]/MovieDetailClient.tsx
"use client";

import { useEffect, useState } from "react";

export default function MovieDetailClient({ movieId }: { movieId: string }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      try {
        // Fetch details
        const res = await fetch(`/api/tmdb/movie/${movieId}`);
        const data = await res.json();
        if (data.error) {
          console.error("Detail fetch error", data.error);
          setLoading(false);
          return;
        }
        setMovie(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [movieId]);

  // Fetch trailer when button clicked
  const fetchTrailer = async () => {
    try {
      const res = await fetch(`/api/tmdb/trailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }), // send movieId to server
      });
      const data = await res.json();
      if (data.error) return alert(data.error);
      setTrailerUrl(`https://www.youtube.com/embed/${data.key}`);
      setShowTrailer(true);
    } catch (e) {
      alert("Failed to load trailer");
      console.error(e);
    }
  };

  if (loading || !movie)
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="p-6 min-h-screen bg-[#0a0016] text-purple-200">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <p className="mb-4">{movie.overview}</p>
      <button
        onClick={fetchTrailer}
        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-md"
      >
        🎬 Watch Trailer
      </button>

      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-[70%] lg:w-[55%] bg-black rounded-xl p-4">
            <button
              className="text-right w-full text-purple-400 text-2xl"
              onClick={() => setShowTrailer(false)}
            >
              ✕
            </button>
            <iframe
              width="100%"
              height="420"
              src={trailerUrl}
              allowFullScreen
              className="rounded-xl mt-4"
            />
          </div>
        </div>
      )}
    </div>
  );
}
