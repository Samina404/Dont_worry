"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const user = data.user;
      if (!user) throw new Error("User not found");

      // Check if mood already submitted today
      const { data: moods } = await supabase
        .from("user_moods")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMoodDate = moods?.[0]?.created_at
        ? new Date(moods[0].created_at)
        : null;

      const todayStr = new Date().toISOString().split("T")[0];

      if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== todayStr) {
        // Redirect to mood check-in page
        router.push("/mood-check-in");
      } else {
        // Already submitted today, go to home
        router.push("/home");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden text-white">
      {/* Background neon gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-purple-700/30 to-black blur-3xl"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-[380px] p-8 rounded-2xl backdrop-blur-xl bg-gray-900/60 shadow-2xl border border-white/10"
      >
        {/* Tabs Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="px-3 py-1 text-sm font-semibold text-gray-400 hover:text-white transition"
            >
              Sign up
            </button>
            <button className="px-3 py-1 text-sm font-semibold bg-white text-black rounded-full">
              Sign in
            </button>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-6">Welcome back</h2>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="relative">
            <MdEmail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800/70 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <MdLock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/70 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            {loading ? "Logging in..." : "Sign in"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-700 w-1/3"></div>
            <span className="text-gray-500 text-sm mx-2">OR SIGN IN WITH</span>
            <div className="h-px bg-gray-700 w-1/3"></div>
          </div>

          {/* OAuth Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-gray-800/70 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center">
              <FcGoogle size={22} />
            </button>
            <button className="flex-1 bg-gray-800/70 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center">
              <FaApple size={22} />
            </button>
          </div>

          {/* Footer */}
          <p className="text-gray-400 mt-6 text-center text-sm">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-400 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
