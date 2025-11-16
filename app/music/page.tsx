"use client";

import MediaGrid from "../components/MediaGrid";
import { useRouter } from "next/navigation";

const musicSeed = [
  {
    id: "lofi",
    title: "Lo-fi Beats",
    image: "/music/lofi.jpg",
    description: "Relaxing lo-fi tracks to calm your mind & reduce anxiety.",
  },
  {
    id: "meditation",
    title: "Meditation Music",
    image: "/music/meditation.jpg",
    description: "Soft ambient music to help you breathe and focus.",
  },
  {
    id: "piano",
    title: "Piano Peacefulness",
    image: "/music/piano.jpg",
    description: "Slow piano melodies for mental peace & emotional balance.",
  },
];

export default function MusicPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">🎵 Music for Mental Wellness</h1>
          <button className="text-sm text-gray-400 hover:text-white" onClick={() => router.push('/music/see-all')}>See all</button>
        </div>

        <MediaGrid items={musicSeed} onItemClick={(it: any) => router.push(`/music/${it.id}`)} />
      </div>
    </div>
  );
}