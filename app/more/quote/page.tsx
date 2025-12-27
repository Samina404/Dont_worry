"use client";

import { useState, useEffect } from "react";
import { Quote, Loader2, Share2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BackButton from "@/components/BackButton";
import { toast } from "sonner";

interface QuoteData {
  text: string;
  author: string;
  date: string;
}

export default function QuotePage() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async (isRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const url = isRefresh ? "/api/quote?random=true" : "/api/quote";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch quote");
      const data = await response.json();
      setQuote(data);
    } catch (err) {
      setError("Failed to load quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  const handleShare = async () => {
    if (!quote) return;

    const shareText = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Daily Quote", text: shareText });
      } catch {}
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Quote copied to clipboard!");
    }
  };

  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  const glassCard = "bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden";

  // ---------------- Loading Screen  ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#2e1350] to-[#12081a] flex flex-col items-center justify-center gap-6">
        <div className="relative">
           <div className="w-20 h-20 border-t-4 border-pink-500 rounded-full animate-spin"></div>
           <Quote className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-pink-500/50" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.4em] text-pink-500/50 animate-pulse">Summoning Wisdom</p>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#2e1350] to-[#12081a] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Lighting */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-pink-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <h1 className={`text-2xl font-black uppercase tracking-tighter ${neonText}`}>
            Daily Wisdom
          </h1>
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-500">Sanctuary of thought</p>
        </div>
        <div className="pointer-events-auto">
          <BackButton href="/more" variant="themed" />
        </div>
      </header>

      <div className="max-w-2xl w-full relative z-10">
        
        {error ? (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className={`${glassCard} rounded-[2.5rem] p-10 text-center`}
           >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
                 <RefreshCw className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-3">Energy Interrupted</h2>
              <p className="text-gray-400 font-medium mb-8 text-sm">{error}</p>
              <button
                onClick={() => fetchQuote(false)}
                className="bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] px-8 py-3 rounded-xl border border-white/10 transition-all"
              >
                Reconnect
              </button>
           </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className={`${glassCard} rounded-[3rem] p-8 md:p-14 relative`}
          >
            {/* Background Icon */}
            <Quote className="absolute top-8 left-8 w-32 h-32 text-white/[0.02] -z-10" />

            {/* Card Header */}
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-2xl shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                  <Quote className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-500">Chronicle</h2>
                  <p className="text-base font-black text-white">{quote?.date}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleShare}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
              >
                <Share2 className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </motion.button>
            </div>

            {/* Quote Text */}
            <div className="space-y-8">
              <blockquote className="text-2xl md:text-4xl font-serif text-white leading-[1.4] font-medium italic">
                “{quote?.text}”
              </blockquote>

              <div className="flex items-center gap-3 justify-end">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-pink-500/50" />
                <p className="text-xl text-pink-400 font-black tracking-tighter italic">
                  — {quote?.author}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-14 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-black italic">
                New Wisdom in 24 hours
              </p>
              <button
                onClick={() => fetchQuote(true)}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all group"
              >
                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-700" />
                Refresh wisdom
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
