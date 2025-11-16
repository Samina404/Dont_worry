"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

export default function MusicPlayerPage() {
  const params = useParams() as any;
  const id = params?.id;
  const router = useRouter();

  const seed: any = {
    lofi: {
      title: "Lo-fi Beats",
      image: "/music/lofi.jpg",
      src: "/music-samples/lofi.mp3",
      description: "A mellow lo-fi playlist to help you focus and relax.",
    },
    meditation: {
      title: "Meditation Music",
      image: "/music/meditation.jpg",
      src: "/music-samples/meditation.mp3",
      description: "Soft ambient music to guide breathing.",
    },
  };

  const [playing, setPlaying] = useState(false);

  const cur = seed[id] || seed.lofi;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <button className="text-sm text-gray-400 mb-4" onClick={() => router.back()}>
          ← Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="rounded-lg overflow-hidden border border-gray-800">
              <Image src={cur.image} alt={cur.title} width={600} height={600} className="w-full h-auto object-cover" />
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{cur.title}</h1>
            <p className="text-gray-300 mb-4">{cur.description}</p>

            <audio src={cur.src} controls className="w-full bg-gray-900 rounded" />

            <div className="mt-4 flex gap-3">
              <button className="bg-blue-600 px-4 py-2 rounded">Add to playlist</button>
              <button className="bg-gray-800 px-4 py-2 rounded border border-gray-700">Share</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

