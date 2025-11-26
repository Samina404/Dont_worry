"use client";

import { useState, useEffect } from "react";
import { Quote, Loader2, Share2, RefreshCw, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface QuoteData {
  text: string;
  author: string;
  date: string;
}

export default function QuotePage() {
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/quote");
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
      alert("Quote copied to clipboard!");
    }
  };

  // ---------------- Loading Screen  ----------------
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(180deg, #2e1350 0%, #7a2f6b 50%, #f59e4a 100%)",
        }}
      >
        <Loader2 className="w-14 h-14 animate-spin text-orange-300 drop-shadow-xl" />
      </div>
    );
  }

  // ---------------- Error Screen ----------------
  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        style={{
          background:
            "linear-gradient(180deg, #2e1350 0%, #7a2f6b 50%, #f59e4a 100%)",
        }}
      >
        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-3xl border border-white/20 max-w-xl text-center shadow-2xl">
          <p className="text-white text-lg mb-6">{error}</p>
          <button
            onClick={fetchQuote}
            className="px-6 py-3 bg-gradient-to-r from-pink-400 to-yellow-400 
            text-black font-semibold rounded-full shadow-lg hover:opacity-90 transition flex 
            items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // ---------------- MAIN UI ----------------
  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans flex items-center justify-center"
      style={{
        background:
          "linear-gradient(180deg, #2e1350 0%, #7a2f6b 50%, #f59e4a 100%)",
      }}
    >
      <div className="max-w-4xl w-full">
        {/* TOP NAV */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/10">
          <div className="max-w-5xl mx-auto flex items-center justify-between py-4 px-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-300 to-yellow-300 text-transparent bg-clip-text drop-shadow">
              Don’t Worry
            </h1>

            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white 
              hover:bg-white/30 transition font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
          </div>
        </header>

        {/* spacer for header */}
        <div className="h-24"></div>

        {/* Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-10 md:p-14 shadow-2xl"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-2xl shadow-lg">
                <Quote className="w-7 h-7 text-black" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white drop-shadow-md">
                  Quote Of The Day
                </h2>
                <p className="text-sm text-white/70">{quote?.date}</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition"
            >
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quote Text */}
          <div className="space-y-8">
            <blockquote className="relative text-3xl md:text-4xl font-serif text-white leading-relaxed">
              <Quote className="absolute -top-6 -left-4 w-14 h-14 text-pink-400/25" />
              {quote?.text}
            </blockquote>

            <p className="text-right text-2xl text-white/90 font-medium">
              — {quote?.author}
            </p>
          </div>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/20 text-center">
            <p className="text-white/60 text-sm">
              A fresh quote awaits you tomorrow ✨
            </p>
          </div>
        </motion.div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchQuote}
            className="text-white/70 hover:text-white text-sm flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Quote
          </button>
        </div>
      </div>
    </div>
  );
}
