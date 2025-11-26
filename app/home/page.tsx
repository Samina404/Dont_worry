"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import {
  Home,
  Music,
  PlayCircle,
  Settings,
  Film,
  Newspaper,
  MoreHorizontal,
} from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
const [showMore, setShowMore] = useState(false);


  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
        return;
      }

      setUser(data.user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileData) setProfile(profileData);

      // Mood check
      const { data: moodData } = await supabase
        .from("user_moods")
        .select("created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMoodDate = moodData?.[0]?.created_at
        ? new Date(moodData[0].created_at)
        : null;

      const today = new Date().toISOString().split("T")[0];

      if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== today) {
        router.push("/moodcheckin");
        return;
      }

      setLoading(false);
    };

    fetchUserAndProfile();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#3b234a] text-white flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#3b234a] text-white flex flex-col">
      
      {/* Navigation Bar */}
      <header className="w-full flex justify-between items-center px-8 py-5 bg-[#3b234a]/70 backdrop-blur-md border-b border-purple-900/40">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
          Don’t Worry
        </h1>

        <nav className="flex gap-8 text-gray-300">

          <div
            className="flex flex-col items-center cursor-pointer hover:text-white"
            onClick={() => router.push("/home")}
          >
            <Home size={22} />
            <span className="text-xs mt-1">Home</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-white"
            onClick={() => router.push("/music")}
          >
            <Music size={22} />
            <span className="text-xs mt-1">Music</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-white"
            onClick={() => router.push("/movies")}
          >
            <Film size={22} />
            <span className="text-xs mt-1">Movies</span>
          </div>

          <div
            className="flex flex-col items-center cursor-pointer hover:text-white"
            onClick={() => router.push("/articles")}
          >
            <Newspaper size={22} />
            <span className="text-xs mt-1">Articles</span>
          </div>

          <div className="relative">
  <div
    className="flex flex-col items-center cursor-pointer hover:text-white"
    onClick={() => setShowMore(!showMore)}
  >
    <MoreHorizontal size={22} />
    <span className="text-xs mt-1">More</span>
  </div>

  {showMore && (
    <div className="absolute right-0 mt-2 w-32 bg-[#2a1535] border border-purple-800 rounded-xl shadow-lg p-2">
      <p
        className="px-3 py-2 text-sm hover:bg-purple-900 rounded-lg cursor-pointer"
        onClick={() => {
          setShowMore(false);
          router.push("/more/weather");
        }}
      >
        Weather
      </p>

      <p
        className="px-3 py-2 text-sm hover:bg-purple-900 rounded-lg cursor-pointer"
        onClick={() => {
          setShowMore(false);
          router.push("/more/quotes");
        }}
      >
        Quotes
      </p>
    </div>
  )}
</div>

        </nav>

        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-400 cursor-pointer">
          <Image
            src="/OIP.webp"
            alt="Profile"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center p-6">

        {/* Card */}
        <div className="max-w-xl w-full bg-gradient-to-br from-black via-[#1a0f1f] to-pink-700 p-8 rounded-3xl shadow-2xl border border-pink-400/20">

          <h2 className="text-3xl font-bold mb-4">
            Hello, {profile?.full_name || user?.email} 👋
          </h2>

          <p className="text-gray-300 mb-6 leading-relaxed">
            Welcome back!{" "}
            {profile?.preferences
              ? `Your preferences: ${profile.preferences}`
              : "Let’s make today amazing!"}
          </p>

          <button
            onClick={() => router.push("/moodhistory")}
            className="w-full mt-2 bg-gradient-to-r from-pink-400 to-yellow-400 text-black font-semibold px-6 py-3 rounded-full shadow-lg hover:opacity-90 transition"
          >
            View Mood History
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-4 text-gray-300 hover:text-red-400 text-sm"
          >
            Logout
          </button>

        </div>
      </main>
    </div>
  );
}
