"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

export default function MovieDetailClient({ movieId }: { movieId: string }) {
  const [trailerUrl, setTrailerUrl] = useState("");
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [recommendedMovies, setRecommendedMovies] = useState<any[]>([]);

  useEffect(() => {
    async function loadMovie() {
      setLoading(true);
      try {
        const res = await fetch(`/api/tmdb/movie/${movieId}`);
        const data = await res.json();
        if (data.error) {
          console.error("Detail fetch error", data.error);
          setLoading(false);
          return;
        }
        setMovie(data);
        
        // Fetch recommended movies based on genres
        if (data.genres && data.genres.length > 0) {
          const genreIds = data.genres.map((g: any) => g.id).slice(0, 2).join(",");
          const recRes = await fetch(`/api/tmdb/movies/byGenre?genres=${genreIds}`);
          const recData = await recRes.json();
          if (!recData.error) {
            // Filter out the current movie and limit to 6 recommendations
            const filtered = recData.movies.filter((m: any) => m.id !== parseInt(movieId)).slice(0, 6);
            setRecommendedMovies(filtered);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [movieId]);

  const fetchTrailer = async () => {
    try {
      const res = await fetch(`/api/tmdb/trailer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
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
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#0a0016] text-white">

      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-40 blur-lg"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />

      {/* Back Button - Floating */}
      <div className="absolute top-6 left-6 z-20">
        <BackButton variant="light" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 md:p-16 flex flex-col md:flex-row gap-10 items-start">

        {/* Poster */}
        {movie.poster_path && (
          <motion.img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            className="w-full md:w-72 rounded-xl shadow-[0_0_20px_rgba(170,0,255,0.4)] border border-purple-700/40"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          />
        )}

        {/* Text Side */}
        <div className="max-w-2xl">

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            {movie.title}
          </h1>

          {/* Overview */}
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            {movie.overview}
          </p>

          {/* Rating / Duration / Year */}
          <div className="flex items-center gap-6 mb-6">
            <p className="flex items-center gap-2 text-yellow-400 text-2xl font-bold">
              <span className="text-yellow-400">IMDb</span> {movie.vote_average?.toFixed(1)}
            </p>

            <p className="text-gray-300 text-lg">
              ⏱ {movie.runtime} min
            </p>

            <p className="text-gray-300 text-lg">
              📅 {movie.release_date?.slice(0, 4)}
            </p>
          </div>

          {/* Genres */}
          <div className="flex gap-2 flex-wrap mb-8">
            {movie.genres?.map((g: any) => (
              <span
                key={g.id}
                className="px-4 py-1 bg-white/20 rounded-full text-sm backdrop-blur-md"
              >
                {g.name}
              </span>
            ))}
          </div>

            {/* Trailer Button */}
            <motion.button
    onClick={fetchTrailer}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.97 }}
    className="
      px-10 py-4 
      rounded-xl 
      font-semibold 
      text-black 
      text-lg
      bg-gradient-to-r from-yellow-400 to-orange-500
      hover:from-yellow-300 hover:to-orange-400
      shadow-[0_0_25px_rgba(255,160,0,0.5)]
      transition
  "
>
  ▶ Play Trailer
</motion.button>


        </div>
      </div>

      {/* Recommended Movies Section */}
      {recommendedMovies.length > 0 && (
        <div className="relative z-10 px-8 md:px-16 pb-16">
          <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendedMovies.map((m) => (
              <motion.div
                key={m.id}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer bg-[#1a0f1f] rounded-xl p-2 border border-purple-700/30 hover:border-purple-500/50 transition"
                onClick={() => window.location.href = `/movies/${m.id}`}
              >
                {m.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${m.poster_path}`}
                    className="w-full h-40 object-cover rounded-lg"
                    alt={m.title}
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl opacity-30">🎬</span>
                  </div>
                )}
                <p className="text-sm mt-2 line-clamp-2">{m.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {showTrailer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-[90%] md:w-[70%] lg:w-[55%] bg-black rounded-2xl p-4"
          >
            <button
              className="w-full text-right text-3xl text-gray-300 hover:text-white"
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
          </motion.div>
        </motion.div>
      )}

    </div>
  );
}
