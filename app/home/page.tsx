"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { Home, Music, PlayCircle, Settings } from "lucide-react";
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
        router.push("/"); // redirect to landing if not logged in
        return;
      }
      setUser(data.user);

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (error) {
        console.log("Profile fetch error:", error.message);
      } else {
        setProfile(profileData);
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

        <nav className="flex gap-5 text-gray-400">
          <Home className="hover:text-white cursor-pointer" size={22} />
          <Music className="hover:text-white cursor-pointer" size={22} />
          <PlayCircle className="hover:text-white cursor-pointer" size={22} />
          <Settings className="hover:text-white cursor-pointer" size={22} />
        </nav>

        <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-600 cursor-pointer">
          <Image
            src={profile?.avatar_url || "/default-avatar.png"}
            alt="Profile"
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center text-center p-6">
        <h2 className="text-2xl font-semibold mb-3">
          Hello, {profile?.full_name || user?.email} 👋
        </h2>
        <p className="text-gray-400 mb-6 max-w-md">
          Welcome back! {profile?.preferences
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
          onClick={handleLogout}
          className="mt-4 text-gray-400 hover:text-red-500 text-sm"
        >
          Logout
        </button>
      </main>
    </div>
  );
}
