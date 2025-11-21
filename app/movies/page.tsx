"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Movie = {
  id: number;
  title: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  popularity?: number;
  vote_average?: number;
};

const MOODS = [
  { key: "happy", label: "😄 Happy" },
  { key: "calm", label: "🧘 Calm" },
  { key: "stressed", label: "😣 Stress Relief" },
  { key: "motivated", label: "🚀 Motivated" },
  { key: "sad", label: "😢 Emotional" },
  { key: "comedy", label: "😂 Comedy" },
];

export default function MoviesPage() {
  const [mood, setMood] = useState<string>("happy");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState<number>(1);
  const [perPage] = useState<number>(18);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // trailer modal
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [shuffleMode, setShuffleMode] = useState(false);

  async function loadMovies(opts: { reset?: boolean; mood?: string; q?: string; p?: number } = {}) {
    const m = opts.mood ?? mood;
    const q = opts.q ?? "";
    const p = opts.p ?? (opts.reset ? 1 : page);

    setLoading(true);
    try {
      const url = new URL("/api/tmdb/movies", window.location.origin);
      url.searchParams.set("mood", m);
      if (q) url.searchParams.set("q", q);
      url.searchParams.set("page", String(p));
      url.searchParams.set("perPage", String(perPage));

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.error) {
        console.error("Movies API error:", data.error);
        setLoading(false);
        return;
      }

      if (opts.reset) {
        setMovies(data.movies || []);
      } else {
        setMovies((prev) => [...prev, ...(data.movies || [])]);
      }
      setTotal(data.total ?? 0);
      setPage(p);
    } catch (err) {
      console.error("Failed to fetch movies", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    loadMovies({ reset: true, mood, p: 1 });
  }, []); // eslint-disable-line

  // when mood changed
  useEffect(() => {
    setMovies([]);
    setPage(1);
    loadMovies({ reset: true, mood, p: 1 });
  }, [mood]);

  const loadMore = () => {
    if (loading) return;
    if (movies.length >= total) return;
    loadMovies({ reset: false, p: page + 1 });
  };

  // open trailer
  const openTrailer = async (movieTitle: string, releaseDate?: string) => {
    try {
      // include release year if available
      const year = releaseDate ? ` ${releaseDate.slice(0, 4)}` : "";
      const res = await fetch("/api/youtube/trailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieName: movieTitle + year }),
      });

      const data = await res.json();
      if (data.key) {
        setTrailerKey(data.key);
        setTrailerOpen(true);
      } else {
        alert("Trailer not available");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load trailer");
    }
  };

  const openDetails = (id: number) => {
    // navigate to detail route
    window.location.href = `/movies/${id}`;
  };

  const doSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setMovies([]);
    setPage(1);
    loadMovies({ reset: true, mood, q: search, p: 1 });
  };

  const doShuffle = () => {
    setShuffleMode((s) => !s);
    if (!shuffleMode) {
      // shuffle current list
      setMovies((prev) => {
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    } else {
      // reload to original order (reset)
      setMovies([]);
      setPage(1);
      loadMovies({ reset: true, mood, q: search, p: 1 });
    }
  };

  // UI classes
  const bg = "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-[#e6e6ff]";
  const neon = "text-[#c084fc]";
  const cardBg = "bg-[#151225] border border-[#2b1e4a]";

  return (
    <div className={`${bg} min-h-screen p-6`}>
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className={`text-4xl font-bold ${neon}`}>Mood Movies</h1>
            <p className="text-gray-300 mt-1">Movies chosen to lift mood, calm the mind or make you laugh.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <form onSubmit={doSearch} className="flex gap-2 w-full md:w-auto">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search (movie title or keyword)..."
                className="px-3 py-2 rounded-md bg-[#1b1330] border border-[#35214f] placeholder-gray-400"
              />
              <button className="px-4 py-2 rounded-md bg-[#c084fc] text-white">Search</button>
            </form>

            <button
              onClick={doShuffle}
              className={`px-3 py-2 rounded-md ${shuffleMode ? "bg-[#7c3aed] text-white" : "bg-[#2a234e] text-white"}`}
            >
              {shuffleMode ? "Unshuffle" : "Shuffle"}
            </button>
          </div>
        </header>

        {/* Mood tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`px-3 py-2 rounded-md ${m.key === mood ? "bg-[#7c3aed] text-white" : "bg-[#201533] text-gray-200"}`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Featured movie (hero) */}
        {!loading && movies[0] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className={`lg:col-span-2 rounded-xl overflow-hidden ${cardBg} cursor-pointer`} onClick={() => openDetails(movies[0].id)}>
              {movies[0].backdrop_path ? (
                <img src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`} className="w-full h-80 object-cover" />
              ) : (
                <div className="w-full h-80 bg-[#201533] flex items-center justify-center">No image</div>
              )}
              <div className="p-6">
                <h2 className="text-2xl font-semibold">{movies[0].title}</h2>
                <p className="text-gray-300 mt-2 line-clamp-3">{movies[0].overview}</p>
                <div className="mt-3 flex gap-3">
                  <button className="px-4 py-2 bg-[#c084fc] rounded text-black" onClick={(e) => { e.stopPropagation(); openTrailer(movies[0].id); }}>
                    ▶ Watch Trailer
                  </button>
                  <button className="px-4 py-2 border border-[#45336a] rounded text-gray-200" onClick={(e) => { e.stopPropagation(); openDetails(movies[0].id); }}>
                    Details
                  </button>
                </div>
              </div>
            </div>

            {/* Right small column (next 4 unique movies) */}
            <aside className="space-y-4">
              {movies.slice(1, 5).map((m) => (
                <div key={m.id} className={`${cardBg} rounded-lg p-3 cursor-pointer`} onClick={() => openDetails(m.id)}>
                  <div className="flex gap-3">
                    {m.poster_path ? (
                      <img src={`https://image.tmdb.org/t/p/w200${m.poster_path}`} className="w-24 h-32 object-cover rounded" />
                    ) : (
                      <div className="w-24 h-32 bg-[#201533] rounded" />
                    )}
                    <div>
                      <h4 className="font-semibold">{m.title}</h4>
                      <p className="text-xs text-gray-300 mt-1">{m.release_date}</p>
                      <div className="mt-2 flex gap-2">
                        <button className="px-2 py-1 bg-[#6d28d9] rounded text-xs" onClick={(e) => { e.stopPropagation(); openTrailer(m.id); }}>Trailer</button>
                        <button className="px-2 py-1 border border-[#45336a] rounded text-xs" onClick={(e) => { e.stopPropagation(); openDetails(m.id); }}>Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </aside>
          </motion.div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading && movies.length === 0 ? (
            Array.from({ length: perPage }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg h-72 bg-[#201533]" />
            ))
          ) : (
            movies.slice(5).map((m) => (
              <motion.div whileHover={{ scale: 1.02 }} key={m.id} className={`${cardBg} rounded-lg overflow-hidden`}>
                {m.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} className="w-full h-64 object-cover" />
                ) : (
                  <div className="w-full h-64 bg-[#201533] flex items-center justify-center">No image</div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-3">{m.overview}</p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => openTrailer(m.id)} className="px-3 py-1 bg-[#c084fc] rounded text-black">▶ Trailer</button>
                    <button onClick={() => openDetails(m.id)} className="px-3 py-1 border border-[#45336a] rounded text-gray-200">Details</button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-8">
          {movies.length < total ? (
            <button onClick={loadMore} className="px-6 py-3 bg-[#c084fc] hover:bg-[#a05ee0] rounded-md">
              {loading ? "Loading..." : "Load more"}
            </button>
          ) : (
            <div className="text-gray-400">No more movies</div>
          )}
        </div>
      </div>

      {/* Trailer modal */}
      {trailerOpen && trailerKey && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" onClick={() => setTrailerOpen(false)}>
          <div className="bg-black rounded-lg overflow-hidden w-[90%] max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative pb-[56.25%]">
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media; picture-in-picture"
              />
            </div>
            <button className="w-full py-3 bg-[#c084fc] text-black font-semibold" onClick={() => setTrailerOpen(false)}>Close Trailer</button>
          </div>
        </div>
      )}
    </div>
  );
}
