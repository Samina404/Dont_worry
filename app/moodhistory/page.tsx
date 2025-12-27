"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Calendar, 
  Smile, 
  Meh, 
  Frown, 
  Angry, 
  MessageSquare,
  TrendingUp,
  History as HistoryIcon,
  Trash2,
  Clock
} from "lucide-react";
import BackButton from "@/components/BackButton";

type MoodEntry = {
  id: string;
  mood: string;
  note: string;
  created_at: string;
};

const MOOD_CONFIG: Record<string, { emoji: string, color: string, bg: string }> = {
  Happy: { emoji: "😄", color: "text-green-400", bg: "bg-green-400/10" },
  Okay: { emoji: "🙂", color: "text-blue-400", bg: "bg-blue-400/10" },
  Neutral: { emoji: "😐", color: "text-gray-400", bg: "bg-gray-400/10" },
  Sad: { emoji: "😔", color: "text-indigo-400", bg: "bg-indigo-400/10" },
  Angry: { emoji: "😡", color: "text-red-400", bg: "bg-red-400/10" },
};

export default function MoodHistoryPage() {
  const router = useRouter();
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/");
        return;
      }
      setUser(userData.user);

      const { data, error } = await supabase
        .from("user_moods")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setMoods(data);
      }
      setLoading(false);
    };

    fetchMoods();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    
    const { error } = await supabase
      .from("user_moods")
      .delete()
      .eq("id", id);

    if (!error) {
      setMoods(prev => prev.filter(m => m.id !== id));
    }
  };

  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400";
  const glassCard = "bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07040e] text-white flex flex-col justify-center items-center gap-6">
        <div className="relative">
           <div className="w-12 h-12 border-b-2 border-pink-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/30 animate-pulse">Retrieving Memories</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07040e] text-white font-sans selection:bg-pink-500/30">
      
      {/* 🌌 Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#07040e]/80 backdrop-blur-[40px] border-b border-white/5 py-8 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <BackButton variant="themed" href="/home" />
            <div>
                <h1 className={`text-3xl md:text-4xl font-black tracking-tighter ${neonText}`}>
                Mood History
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Your emotional journey</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
            <TrendingUp className="w-4 h-4 text-pink-400" />
            <span className="text-xs font-bold text-gray-300">{moods.length} days data</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10">
        
        {moods.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-[3rem] p-20 text-center`}
          >
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
                <HistoryIcon className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">No History Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-8 font-medium">Start logging your daily mood to see your emotional patterns over time.</p>
            <button 
              onClick={() => router.push('/moodcheckin')}
              className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
            >
              Log Today's Mood
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {moods.map((entry, index) => {
                 const config = MOOD_CONFIG[entry.mood] || MOOD_CONFIG.Neutral;
                 const date = new Date(entry.created_at);
                 
                 return (
                   <motion.div
                     key={entry.id}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.05 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     className={`${glassCard} rounded-[2rem] p-6 hover:bg-white/[0.06] transition-all duration-300 group`}
                   >
                     <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Left Side: Mood Icon & Date */}
                        <div className="flex items-center gap-4 min-w-[200px]">
                           <div className={`w-16 h-16 ${config.bg} rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/5`}>
                              {config.emoji}
                           </div>
                           <div>
                              <div className="flex items-center gap-2 text-gray-400 mb-1">
                                 <Calendar size={12} className="text-pink-400" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                 </span>
                              </div>
                              <h3 className={`text-xl font-black tracking-tight ${config.color}`}>
                                 {entry.mood}
                              </h3>
                           </div>
                        </div>

                        {/* Middle: Note */}
                        <div className="flex-1 bg-black/20 rounded-2xl p-4 border border-white/5 relative">
                           <div className="absolute -top-2 -left-2 p-1.5 bg-[#07040e] rounded-lg border border-white/5">
                              <MessageSquare size={12} className="text-gray-500" />
                           </div>
                           <p className="text-gray-300 text-sm leading-relaxed italic">
                              {entry.note || "No notes provided for this day."}
                           </p>
                           <div className="flex items-center gap-1.5 mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              <Clock size={10} />
                              {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2">
                           <button 
                             onClick={() => handleDelete(entry.id)}
                             className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                             title="Delete entry"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                 );
              })}
            </AnimatePresence>
          </div>
        )}

      </main>

      {/* Footer Decoration */}
      <footer className="py-20 flex flex-col items-center gap-4 opacity-30">
        <div className="flex gap-2">
            {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white" />)}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">End of History</p>
      </footer>

    </div>
  );
}
