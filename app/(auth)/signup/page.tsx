"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const { error } =
        tab === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (tab === "signup") {
        router.push("/onboard");
      } else {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData.user;
        if (user) {
          const { data: moods } = await supabase
            .from("user_moods")
            .select("created_at")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const lastMoodDate = moods?.[0]?.created_at ? new Date(moods[0].created_at) : null;
          const todayStr = new Date().toISOString().split("T")[0];

          if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== todayStr) {
            router.push("/moodcheckin");
          } else {
            router.push("/home");
          }
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.message === "Failed to fetch") {
        toast.error("Network error: Could not connect to Supabase.");
      } else {
        toast.error(err.message || "An error occurred during authentication");
      }
    } finally {
      setLoading(false);
    }
  };

  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07040e] relative overflow-hidden font-sans">
      
      {/* --- ATMOSPHERIC BACKGROUND --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]" />
        <motion.div 
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-pink-600/10 rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ x: [0, -30, 0], y: [0, 50, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] left-[-10%] w-[80%] h-[80%] bg-indigo-600/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* --- BACK BUTTON --- */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push('/')}
        className="absolute top-8 left-8 p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 group z-50"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-black uppercase tracking-widest hidden md:block">Back to Sanctuary</span>
      </motion.button>

      {/* --- AUTH CARD --- */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[420px] p-8 md:p-12"
      >
        <div className="bg-white/[0.03] backdrop-blur-[50px] rounded-[3rem] border border-white/10 p-8 shadow-2xl overflow-hidden relative">
          {/* Internal Glow */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
          
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className={`text-4xl font-black tracking-tighter mb-2 ${neonText}`}>
                {tab === "signup" ? "Begin Journey" : "Welcome Home"}
            </h2>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                Sanctuary of Peace
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 mb-2 block transition-colors group-focus-within:text-pink-400">Email Address</label>
                <div className="relative">
                    <MdEmail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                    <input
                      type="email"
                      placeholder="calm@mind.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 text-white placeholder-gray-700 pl-12 pr-6 py-4 rounded-2xl border border-white/5 outline-none focus:border-pink-500/50 focus:bg-black/60 transition-all font-medium text-sm"
                    />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-4 mb-2 block transition-colors group-focus-within:text-pink-400">Password</label>
                <div className="relative">
                    <MdLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-400 transition-colors" size={18} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 text-white placeholder-gray-700 pl-12 pr-6 py-4 rounded-2xl border border-white/5 outline-none focus:border-pink-500/50 focus:bg-black/60 transition-all font-medium text-sm"
                    />
                </div>
              </div>
            </div>

            <motion.button
              onClick={handleAuth}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-[length:200%_auto] hover:bg-right transition-all duration-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-pink-500/20 disabled:opacity-50"
            >
              {loading
                ? tab === "signup"
                  ? "Creating account..."
                  : "Signing in..."
                : tab === "signup"
                ? "Create Account"
                : "Sign In"}
            </motion.button>

            {/* Tab Switcher */}
            <div className="flex items-center justify-center gap-4 text-sm mt-6">
                <p className="text-gray-500 font-medium">
                    {tab === "signup" ? "Already have an account?" : "New to the sanctuary?"}
                </p>
                <button 
                    onClick={() => setTab(tab === "signup" ? "signin" : "signup")}
                    className="text-pink-400 font-bold hover:text-pink-300 transition-colors underline decoration-pink-500/30 underline-offset-4"
                >
                    {tab === "signup" ? "Sign In" : "Sign Up"}
                </button>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 py-2">
                <div className="h-px bg-white/5 flex-1" />
                <span className="text-[8px] font-black tracking-[0.4em] text-gray-700 uppercase">OR CONTINUE WITH</span>
                <div className="h-px bg-white/5 flex-1" />
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 py-3.5 rounded-2xl transition-all flex items-center justify-center group active:scale-95">
                <FcGoogle size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="flex-1 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 py-3.5 rounded-2xl transition-all flex items-center justify-center group active:scale-95 text-white">
                <FaFacebook size={20} className="group-hover:scale-110 transition-transform text-blue-500" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decoration */}
      <div className="fixed bottom-0 left-0 right-0 p-8 text-center pointer-events-none">
          <p className="text-[9px] font-bold text-gray-700 uppercase tracking-[0.5em]">Your journey to inner peace starts here.</p>
      </div>
    </div>
  );
}
