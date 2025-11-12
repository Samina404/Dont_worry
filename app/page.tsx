"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import animationData from "../public/animations/Girl yoga.json";
import { supabase } from "../lib/supabaseClient";
import Navbar from "./nav/page";

// Colors
const BACKGROUND_COLOR = "bg-[#1A1A2E]";
const TEXT_COLOR = "text-white";

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
    router.push(user ? "/home" : "/signup");
  };

  if (loading)
    return (
      <div className={`min-h-screen ${BACKGROUND_COLOR} flex items-center justify-center ${TEXT_COLOR} text-xl font-semibold`}>
        Loading...
      </div>
    );

  return (
    <div className={`min-h-screen ${BACKGROUND_COLOR} ${TEXT_COLOR} flex flex-col relative overflow-hidden`}>
      {/* Navbar */}
      <Navbar isAuthenticated={!!user} onCtaClick={handleGetStarted} />

      {/* Wave Background */}
      <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#0f0f1a"
            d="M0,64L60,85.3C120,107,240,149,360,149.3C480,149,600,107,720,90.7C840,75,960,85,1080,101.3C1200,117,1320,139,1380,149.3L1440,160L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Hero Section */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 px-8 lg:px-20 py-24 items-center gap-12 relative z-10">
        
        {/* Left Column: Text */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col space-y-6 max-w-lg"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            Don’t Worry 
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Track your mood, share your thoughts, and take care of your mind — one day at a time. This is your safe space to breathe and reflect.
          </p>
          <motion.button
            onClick={handleGetStarted}
            whileHover={{ scale: 1.05 }}
            className="px-10 py-4 text-lg rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-xl hover:from-orange-600 hover:to-pink-600 transition duration-300"
          >
            Enter Your Space
          </motion.button>
        </motion.div>

        {/* Right Column: Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <div className="w-full max-w-lg h-auto">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-[#0F0F1A] py-6 text-center border-t border-gray-700 relative z-10">
        <p className="text-gray-500 text-sm md:text-base">
          A mental wellness journal application. 🌿
        </p>
      </div>
    </div>
  );
}
