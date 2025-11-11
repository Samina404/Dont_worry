"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import animationData from "../public/animations/Girl yoga.json";
import { supabase } from "../lib/supabaseClient"; // adjust path

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleGetStarted = () => {
    if (user) {
      router.push("/home"); // user logged in → home
    } else {
      router.push("/signup"); // not logged in → signup
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      {/* Animated Logo / Lottie */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-64 h-64"
      >
        <Lottie animationData={animationData} loop={true} />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-4xl font-bold mt-6"
      >
        Don’t Worry 🌤️
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-gray-400 mt-4 text-center max-w-md"
      >
        Track your mood, share your thoughts, and take care of your mind — one day at a time.
      </motion.p>

      {/* Get Started Button */}
      <motion.button
        onClick={handleGetStarted}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7 }}
        whileHover={{ scale: 1.1, backgroundColor: "#222" }}
        className="mt-8 px-6 py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-300 transition"
      >
        Get Started
      </motion.button>
    </div>
  );
}
