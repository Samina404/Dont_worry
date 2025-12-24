"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function MoodCheckInPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMoodCheck, setShowMoodCheck] = useState(false);

  const moods = [
    { emoji: "😄", label: "Happy" },
    { emoji: "🙂", label: "Okay" },
    { emoji: "😐", label: "Neutral" },
    { emoji: "😔", label: "Sad" },
    { emoji: "😡", label: "Angry" },
  ];

  // -----------------------------------------------------------
  // 1️⃣ Check if today's mood is already submitted
  // -----------------------------------------------------------
  useEffect(() => {
    const checkMoodToday = async () => {
      const { data, error } = await supabase.auth.getUser();
      const currentUser = data?.user;
      setUser(currentUser);

      if (!currentUser) return;

      const { data: moodsData } = await supabase
        .from("user_moods")
        .select("created_at")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMoodDate = moodsData?.[0]?.created_at
        ? new Date(moodsData[0].created_at)
        : null;

      const today = new Date().toISOString().split("T")[0];

      if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== today) {
        setShowMoodCheck(true); // show mood check-in
      } else {
        router.push("/home"); // already logged mood → go home
      }
    };

    checkMoodToday();
  }, [router]);

  // -----------------------------------------------------------
  // 2️⃣ Auto-save Neutral mood if user does nothing
  // -----------------------------------------------------------
  useEffect(() => {
    if (!user || !showMoodCheck) return;

    const autoSaveMood = async () => {
      const { data: moodsData } = await supabase
        .from("user_moods")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMoodDate = moodsData?.[0]?.created_at
        ? new Date(moodsData[0].created_at)
        : null;

      const today = new Date().toISOString().split("T")[0];

      // only auto-save if NO mood today
      if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== today) {
        await supabase.from("user_moods").insert([
          {
            user_id: user.id,
            mood: "Neutral",
            note: "Auto-saved",
          },
        ]);
        router.push("/home");
      }
    };

    const timer = setTimeout(() => autoSaveMood(), 30000);
    return () => clearTimeout(timer);
  }, [user, showMoodCheck, router]);

  // -----------------------------------------------------------
  // 3️⃣ Manual Submit (merged logic)
  // -----------------------------------------------------------
  const handleSubmit = async () => {
    if (!selectedMood) {
      alert("Please select a mood!");
      return;
    }

    setLoading(true);

    await supabase.from("user_moods").insert({
      user_id: user?.id,
      mood: selectedMood,
      note,
    });

    setLoading(false);
    router.push("/home");
  };

  if (!showMoodCheck) return null; // don't show UI until ready

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Daily Mood Check-In
      </motion.h1>

      <p className="text-gray-400 mb-8 text-center max-w-md">
        How are you feeling today? Choose the emoji that best describes your mood and leave an optional note.
      </p>

      <div className="flex space-x-6 mb-6">
        {moods.map((m) => (
          <div key={m.label} className="flex flex-col items-center">
            <motion.button
              onClick={() => setSelectedMood(m.label)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`text-4xl p-3 rounded-full border-2 transition ${
                selectedMood === m.label
                  ? "border-pink-500 bg-pink-500/20"
                  : "border-gray-700 hover:border-pink-400"
              }`}
            >
              {m.emoji}
            </motion.button>
            <p className="text-sm text-gray-300 mt-2">{m.label}</p>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Write about your feelings (optional)..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full max-w-md h-32 rounded-lg p-4 bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-pink-500"
      />

      <motion.button
        onClick={handleSubmit}
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
      >
        {loading ? "Saving..." : "Save Mood"}
      </motion.button>
    </div>
  );
}
