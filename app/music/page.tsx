"use client";

import { useEffect, useState, useCallback } from "react";
import BackButton from "@/components/BackButton";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
}

export default function MusicPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [query, setQuery] = useState("calm music");
  const [currentCategory, setCurrentCategory] = useState("Calm");
  const [pageToken, setPageToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = {
    Calm: "calm relaxing meditation zen",
    Meditation: "guided meditation mind peace",
    Sleep: "deep sleep music soothing insomnia",
    Nature: "ocean waves nature sounds forest rain",
    Focus: "focus concentration study music",
    Anxiety: "stress relief anxiety healing",
  };

  async function fetchVideos(reset = false) {
    if (loading) return;
    setLoading(true);
    try {
      const url = `/api/youtube?q=${encodeURIComponent(query)}${
        pageToken ? `&page=${pageToken}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      const newVideos = data.videos || [];
      setVideos((prev) => (reset ? newVideos : [...prev, ...newVideos]));
      setPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error("Error loading videos", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchVideos(true);
  }, [query]);

  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        fetchVideos();
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pageToken]);

  const playNext = () => {
    if (!selectedVideo) return;
    const index = videos.findIndex((v) => v.id === selectedVideo);
    const next = videos[index + 1];
    if (next) setSelectedVideo(next.id);
  };

  const shuffle = () => {
    if (!videos.length) return;
    const idx = Math.floor(Math.random() * videos.length);
    setSelectedVideo(videos[idx].id);
  };

  const dailyRecommended = useCallback(() => {
    if (!videos.length) return [];
    const day = new Date().toISOString().slice(0, 10);
    const seed = [...day].reduce((s, c) => s + c.charCodeAt(0), 0);
    const arr = [...videos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (seed + i) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, 6);
  }, [videos]);

  const bg = "bg-[#3b234a] text-white"; // same dark purple as HomePage
  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";

  return (
    <div className={`${bg} min-h-screen p-3`}>
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between mb-6 backdrop-blur-md bg-[#3b234a]/70 border-b border-purple-900/40 p-4 rounded-xl gap-4 md:gap-0">
          <h1 className={`text-3xl font-semibold ${neonText} text-center md:text-left`}>
            Music Therapy
          </h1>
          <div className="flex items-center gap-3">
            <BackButton />
            <button
              onClick={shuffle}
              className="px-4 py-2 font-semibold rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 text-black hover:opacity-90 transition"
            >
              Shuffle
            </button>
          </div>
        </header>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search relaxing music..."
          className="w-full p-3 my-4 rounded-xl bg-[#1a0f1f] border border-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          onChange={(e) => setQuery(e.target.value)}
        />

        {/* CATEGORY TABS */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {Object.keys(categories).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCurrentCategory(c);
                setQuery(c);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                currentCategory === c
                  ? "bg-gradient-to-r from-pink-400 to-yellow-400 text-black shadow-lg"
                  : "bg-[#1a0f1f] border border-purple-700 text-gray-300 hover:bg-purple-700/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* PLAYER */}
        {selectedVideo && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-2xl border border-pink-400/20">
            <iframe
              className="w-full h-72 md:h-96"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              allowFullScreen
              onLoad={() => setTimeout(playNext, 1000 * 60 * 20)}
            />
          </div>
        )}
        
        {/* DAILY RECOMMENDED */}
        <h2 className={`text-xl mb-3 font-semibold ${neonText}`}>
          Today's Recommendations
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {dailyRecommended().map((v, index) => (
            <div
              key={`${v.id}-${index}`}
              onClick={() => setSelectedVideo(v.id)}
              className="cursor-pointer bg-[#1a0f1f] rounded-2xl p-2 hover:scale-105 transition shadow-md border border-purple-700/20"
            >
              <img src={v.thumbnail} className="rounded-lg" />
              <p className="text-sm mt-2 text-gray-300">{v.title}</p>
            </div>
          ))}
        </div>

        {/* VIDEO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20">
          {videos.map((v, index) => (
            <div
              key={`${v.id}-${index}`}
              onClick={() => setSelectedVideo(v.id)}
              className="cursor-pointer bg-[#1a0f1f] rounded-2xl p-2 hover:scale-105 transition shadow-md border border-purple-700/20"
            >
              <img src={v.thumbnail} className="rounded-lg" />
              <p className="text-sm mt-2 text-gray-300">{v.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}