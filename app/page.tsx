"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import animationData from "../public/animations/Girl yoga.json";
import { supabase } from "../lib/supabaseClient";
import Navbar from "./nav/NavBar";

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
      <div className="min-h-screen bg-[#0B0C1A] flex items-center justify-center text-white text-xl font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0C1A] to-[#1B1E38] text-white overflow-hidden">
      {/* Navbar */}
      <Navbar isAuthenticated={!!user} onCtaClick={handleGetStarted} />

      {/* Floating background shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-pink-600 rounded-full blur-[150px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[150px]"
      />

      {/* Hero Section */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center justify-center px-8 lg:px-24 py-32 gap-16">
        {/* Left Text Section */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-6 max-w-lg"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Don’t Worry 
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Track your mood, share your thoughts, and take care of your mind —
            one day at a time. This is your peaceful digital space to relax and
            reflect.
          </p>

          <motion.button
            onClick={handleGetStarted}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(255, 182, 72, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-4 px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 
                       text-black font-semibold text-lg shadow-lg transition-all"
          >
            Enter Your Space
          </motion.button>
        </motion.div>

        {/* Right Animation Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="flex justify-center"
        >
          <div className="w-full max-w-md md:max-w-lg">
            <Lottie animationData={animationData} loop={true} />
          </div>
        </motion.div>
      </div>

      {/* Curved Bottom Wave */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#0B0C1A"
          fillOpacity="1"
          d="M0,224L60,224C120,224,240,224,360,208C480,192,600,160,720,149.3C840,139,960,149,1080,170.7C1200,192,1320,224,1380,240L1440,256L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        ></path>
      </svg>

      {/* Footer */}
      <div className="relative z-10 bg-[#0B0C1A] py-6 text-center border-t border-gray-800">
        <p className="text-gray-500 text-sm md:text-base">
          A mental wellness journal — created with 💜 and calmness.
        </p>
      </div>
    </div>
  );
}
