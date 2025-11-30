"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

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

// Mood → TMDB Genres
const MOOD_GENRES: Record<string, number[]> = {
  happy: [35, 10751, 10749],
  calm: [16, 10751, 18],
  stressed: [35, 12],
  motivated: [18, 12],
  sad: [18, 10749],
  comedy: [35],
};

const MOODS = [
  { key: "happy", label: "😄 Happy" },
  { key: "calm", label: "🧘 Calm" },
  { key: "stressed", label: "😣 Stress Relief" },
  { key: "motivated", label: "🚀 Motivated" },
  { key: "sad", label: "😢 Emotional" },
  { key: "comedy", label: "😂 Comedy" },
];

export default function MoodMoviesPage() {
  const [mood, setMood] = useState("happy");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [shuffleMode, setShuffleMode] = useState(false);

  // Fetch by mood
  async function fetchMovies(selected: string) {
    setLoading(true);
    try {
      const genres = MOOD_GENRES[selected].join(",");
      const res = await fetch(`/api/tmdb/movies/byGenre?genres=${genres}`);
      const data = await res.json();
      if (!data.error) setMovies(data.movies);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMovies(mood);
  }, [mood]);

  const doSearch = async (e?: any) => {
    e?.preventDefault();
    if (!search.trim()) return fetchMovies(mood);

    const res = await fetch(`/api/tmdb/movies/search?q=${search}`);
    const data = await res.json();

    if (!data.error) setMovies(data.movies);
  };

  const doShuffle = () => {
    setShuffleMode((x) => !x);
    if (!shuffleMode) {
      setMovies((prev) => {
        let arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    } else fetchMovies(mood);
  };

  const openDetails = (id: number) => {
    window.location.href = `/movies/${id}`;
  };

  // THEME
  const bg = "bg-[#3b234a] text-white";
  const neonText =
    "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  const cardBg =
    "bg-[#1a0f1f] border border-purple-700/30 rounded-2xl shadow-xl shadow-purple-900/20 hover:shadow-purple-500/30 transition";

  return (
    <div className={`${bg} min-h-screen p-4`}>
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-2 backdrop-blur-md bg-[#3b234a]/70 border-b border-purple-900/40 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <h1 className={`text-3xl font-semibold ${neonText}`}>
              Mood Movies
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <BackButton variant="themed" />
            <button
              onClick={doShuffle}
              className="px-4 py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 text-black shadow-lg hover:scale-105 transition"
            >
              {shuffleMode ? "Unshuffle" : "Shuffle"}
            </button>
          </div>
        </header>

        {/* SEARCH BAR (unchanged but themed) */}
        <form onSubmit={doSearch}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="w-full p-3 my-4 rounded-xl bg-[#1a0f1f] border border-purple-700/40 text-white placeholder-gray-300 focus:ring-2 focus:ring-pink-400/40 outline-none transition"
          />
        </form>

        {/* Mood Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
          {MOODS.map((m) => (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                mood === m.key
                  ? "bg-gradient-to-r from-pink-400 to-yellow-400 text-black shadow-lg"
                  : "bg-[#1a0f1f] border border-purple-700 text-gray-300 hover:bg-purple-700/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* FEATURED MOVIE */}
        {movies[0] && (
          <div
            className="relative overflow-hidden mb-10 cursor-pointer rounded-2xl shadow-2xl shadow-purple-900/20 group"
            onClick={() => openDetails(movies[0].id)}
          >
            {/* Background Cover */}
            <div className="absolute inset-0">
              {movies[0].backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/original${movies[0].backdrop_path}`}
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  alt="Background"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-900 to-black" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f0518] via-[#0f0518]/80 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              {/* Small Poster */}
              <div className="flex-shrink-0">
                {movies[0].poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movies[0].poster_path}`}
                    className="w-32 md:w-48 rounded-xl shadow-lg border border-white/10 group-hover:scale-105 transition-transform duration-300"
                    alt={movies[0].title}
                  />
                ) : (
                  <div className="w-32 md:w-48 h-48 md:h-72 bg-gray-800 rounded-xl flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-2">
                  <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider border border-pink-500/20">
                    Featured Movie
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-bold mb-3 text-white leading-tight">
                  {movies[0].title}
                </h2>
                
                <p className="text-gray-300 mb-6 line-clamp-3 leading-relaxed max-w-2xl">
                  {movies[0].overview}
                </p>

                <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
                  <span className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-semibold border border-yellow-500/20">
                    ⭐ {Math.round((movies[0].vote_average || 0) * 10)}%
                  </span>
                  {movies[0].release_date && (
                    <span className="px-3 py-1.5 bg-white/10 text-gray-300 rounded-lg text-sm border border-white/10">
                      📅 {movies[0].release_date.slice(0, 4)}
                    </span>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(movies[0].id);
                    }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOVIE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20">
          {loading
            ? [...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-64 bg-[#1a0f1f] rounded-xl"
                />
              ))
            : movies.map((m) => (
                <motion.div
                  key={m.id}
                  whileHover={{ scale: 1.04 }}
                  className={`${cardBg} p-2 cursor-pointer`}
                  onClick={() => openDetails(m.id)}
                >
                  {m.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                      className="w-full h-56 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-56 bg-[#1a0f1f]" />
                  )}

                  <p className="text-sm mt-2">{m.title}</p>
                </motion.div>
              ))}
        </div>
      </div>
    </div>
  );
}
