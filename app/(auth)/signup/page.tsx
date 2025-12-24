"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebook } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signup" | "signin">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);
      const { error } =
        tab === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      router.push(tab === "signup" ? "/onboard" : "/home");
    } catch (err: any) {
      console.error("Auth error:", err);
      if (err.message === "Failed to fetch") {
        alert("Network error: Could not connect to Supabase. Please check your internet connection and Supabase configuration.");
      } else {
        alert(err.message || "An error occurred during authentication");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* Background gradient lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700/30 via-blue-700/20 to-black blur-3xl"></div>

      {/* Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-[380px] p-8 rounded-2xl backdrop-blur-xl bg-gray-900/60 shadow-2xl border border-white/10 text-white"
      >
        {/* Tab Switch */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <button
              onClick={() => setTab("signup")}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                tab === "signup"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign up
            </button>
            <button
              onClick={() => setTab("signin")}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                tab === "signin"
                  ? "bg-white text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
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

        {/* Form */}
        <h2 className="text-2xl font-semibold mb-6">
          {tab === "signup" ? "Create an account" : "Welcome back"}
        </h2>

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

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-white text-black py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            {loading
              ? tab === "signup"
                ? "Creating account..."
                : "Signing in..."
              : tab === "signup"
              ? "Create an account"
              : "Sign in"}
          </button>

          <div className="flex items-center justify-center my-4">
            <div className="h-px bg-gray-700 w-1/3"></div>
            <div></div>
            <span className=" w-full text-center text-gray-500 text-sm mx-2">OR SIGN IN WITH</span>
            <div className="h-px bg-gray-700 w-1/3"></div>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 bg-gray-800/70 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center">
              <FcGoogle size={22} />
            </button>
            <button className="flex-1 bg-gray-800/70 py-2 rounded-lg hover:bg-gray-700 transition flex items-center justify-center">
              <FaFacebook size={22} />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-400 hover:underline">
              Terms & Service
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
