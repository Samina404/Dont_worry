"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

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

      // Fetch profile from Supabase
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
    router.push("/"); // redirect to landing page after logout
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Not logged in. Redirecting...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Hello, {profile?.full_name || user.email} 👋
      </h1>
      <p className="text-gray-400 mb-6">
        Welcome back! {profile?.preferences ? `Your preferences: ${profile.preferences}` : ""}
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
