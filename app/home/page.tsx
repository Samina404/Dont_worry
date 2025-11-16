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

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/"); 
        return;
      }

      setUser(data.user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!error) {
        setProfile(profileData);
      }

      // mood check
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
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Top Navigation Bar */}
      <header className="w-full flex justify-between items-center px-5 py-4 bg-black border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Don’t Worry</h1>

        <nav className="flex gap-6 text-gray-400">

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

          <div className="flex flex-col items-center cursor-pointer hover:text-white">
            <MoreHorizontal size={22} />
            <span className="text-xs mt-1">More</span>
          </div>
        </nav>

        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-600 cursor-pointer">
          <Image
            src="/OIP.webp"
            alt="Profile"
            width={36}
            height={36}
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-2xl font-semibold mb-3">
          Hello, {profile?.full_name || user?.email} 👋
        </h2>

        <p className="text-gray-400 mb-6 max-w-md">
          Welcome back!{" "}
          {profile?.preferences
            ? `Your preferences: ${profile.preferences}`
            : "Let's make today great!"}
        </p>

        <button
          onClick={() => router.push("/moodcheckin")}
          className="bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
        >
          Go to Mood Check-In
        </button>

        <button
          onClick={() => router.push("/moodhistory")}
          className="mt-4 bg-blue-600 px-6 py-2 rounded-full hover:bg-blue-700 transition"
        >
          View Mood History
        </button>

        <button
          onClick={handleLogout}
          className="mt-4 text-gray-400 hover:text-red-500 text-sm"
        >
          Logout
        </button>
      </main>
    </div>
  );
}
