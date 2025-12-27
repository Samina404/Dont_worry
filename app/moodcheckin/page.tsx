"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
      toast.warning("Please select a mood!");
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

  if (!showMoodCheck) return null;

  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400";
  const glassCard = "bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl";

  return (
    <div className="min-h-screen bg-[#130b1b] text-white flex flex-col items-center justify-center px-6 relative overflow-hidden font-sans">
      
      {/* 🌌 Atmospheric Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_70%)]" />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-pink-600/15 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[130px]" 
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`${glassCard} w-full max-w-2xl rounded-[3.5rem] p-8 md:p-16 relative z-10 flex flex-col items-center`}
      >
        <div className="mb-10 text-center">
            <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-4xl md:text-5xl font-black tracking-tighter mb-4 ${neonText}`}
            >
            Daily Check-In
            </motion.h1>
            <p className="text-gray-400 font-medium text-sm md:text-base max-w-sm mx-auto">
            A moment for yourself. How is your inner world feeling today?
            </p>
        </div>

        <div className="grid grid-cols-5 gap-3 md:gap-6 mb-12 w-full">
            {moods.map((m) => (
            <div key={m.label} className="flex flex-col items-center gap-3">
                <motion.button
                onClick={() => setSelectedMood(m.label)}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className={`text-3xl md:text-4xl w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-[1.5rem] border-2 transition-all duration-300 ${
                    selectedMood === m.label
                    ? "border-pink-500 bg-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
                    : "border-white/5 bg-white/5 hover:border-pink-400/50"
                }`}
                >
                {m.emoji}
                </motion.button>
                <p className={`text-[10px] font-black uppercase tracking-widest ${selectedMood === m.label ? "text-pink-400" : "text-gray-500"}`}>
                    {m.label}
                </p>
            </div>
            ))}
        </div>

        <div className="w-full relative group mb-8">
            <textarea
                placeholder="What's on your mind? (Optional notes...)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full h-40 rounded-[2rem] p-6 bg-black/40 border border-white/5 text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 transition-all resize-none font-medium"
            />
        </div>

        <motion.button
            onClick={handleSubmit}
            disabled={loading || !selectedMood}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm transition-all duration-300 shadow-2xl ${
                selectedMood 
                ? "bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-[length:200%_auto] hover:bg-right text-white shadow-pink-500/20" 
                : "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
            }`}
        >
            {loading ? (
                <div className="flex items-center justify-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Pulse...</span>
                </div>
            ) : "Seal this Moment"}
        </motion.button>

        <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-gray-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500/50 animate-pulse" />
            Auto-saving neutral in 30 seconds
        </p>
      </motion.div>
    </div>
  );
}

