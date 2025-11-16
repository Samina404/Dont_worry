"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function MoodHistory() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [moods, setMoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/"); // redirect if not logged in
        return;
      }

      setUser(userData.user);

      const { data: moodData, error } = await supabase
        .from("user_moods")
        .select("mood, created_at")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (!error && moodData) {
        setMoods(moodData);
      }

      setLoading(false);
    };

    fetchMoods();
  }, [router]);

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Mood History</h1>

      {moods.length === 0 ? (
        <p className="text-gray-400 text-center">You haven't logged any moods yet.</p>
      ) : (
        <div className="max-w-md mx-auto space-y-4">
          {moods.map((mood, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <span className="font-semibold">{mood.mood}</span>
              <span className="text-gray-400 text-sm">
                {new Date(mood.created_at).toLocaleDateString()}{" "}
                {new Date(mood.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => router.push("/home")}
        className="mt-8 mx-auto block bg-red-600 px-6 py-2 rounded-full hover:bg-red-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
}
