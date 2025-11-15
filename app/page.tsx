"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import animationData from "../public/animations/Girl yoga.json";
import { supabase } from "../lib/supabaseClient";
import Navbar from "./nav/NavBar";
import Head from "next/head";
import Footer from "./components/Footer";

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
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );
//absolute inset-0 bg-gradient-to-br from-purple-700/30 via-blue-700/20 to-black blur-3xl
  return (
    <>
      {/* SEO */}
      <Head>
        <title>Mental Wellness – Mood Tracking & Stress Relief</title>
        <meta
          name="description"
          content="Track your mood, reflect daily, reduce stress, improve sleep, and build emotional wellness. Your private safe space for mental peace."
        />
      </Head>

      <div className="min-h-screen bg-[#4b2c54] text-white">
        {/* Navbar */}
        <Navbar isAuthenticated={!!user} onCtaClick={handleGetStarted} />

        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-6 md:px-12  pt-28">
            <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="relative rounded-3xl bg-gradient-to-br from-[#141627] via-[#1f200f] to-[#df5cb3] p-10 md:p-16 shadow-xl flex flex-col md:flex-row items-center gap-10 md:gap-20 border border-white/10"
  >
            {/* Left Text */}
            <div className="flex-1 space-y-5 md:space-y-7">
             

              <h1 className="text-4xl md:text-6xl font-extrabold leading-snug">
                Sleep Better,
                <br />
                Boost Energy,
                <br />
                <span className="italic bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                  Embrace Wellness
                </span>
              </h1>

              {/* ORIGINAL PARAGRAPH — unchanged as you asked */}
              <p className="text-gray-300 text-lg md:text-xl">
                Track your mood, share your thoughts, and take care of your mind — 
                one day at a time. This is your peaceful digital space to relax and 
                reflect.
              </p>

              <motion.button
                onClick={handleGetStarted}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,255,255,0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="mt-2 px-10 py-3 rounded-full bg-gradient-to-r from-pink-400 to-yellow-400 cursor-pointer text-white
                font-semibold text-lg shadow-md transition-all"
              >
                Enter Your Space
              </motion.button>
            </div>

            {/* RIGHT ANIMATION */}
            <div className="flex-1 flex justify-center">
              <div className="w-64 md:w-80 lg:w-[380px] drop-shadow-2xl">
                <Lottie animationData={animationData} loop={true} />
              </div>
            </div>
            
          </motion.div>
        </div>

        {/* FEATURE SECTIONS */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-20">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-300">
            Transform Your Mind, One Day at a Time
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-12">
            {/* Feature Card */}
            <FeatureCard
              title="Mood Tracking"
              icon="😊"
              text="Understand emotional patterns with daily reflections and insights."
            />
            <FeatureCard
              title="Sleep Guidance"
              icon="🌙"
              text="Adopt healthier sleep habits and calming bedtime routines."
            />
            <FeatureCard
              title="Stress Relief"
              icon="🧘"
              text="Reduce anxiety with breathing exercises, journaling, and mindfulness."
            />
          </div>

          {/* Second Row of Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 mt-8">
            <FeatureCard
              title="Private Journaling"
              icon="📔"
              text="Your thoughts are safe — a private journal to express freely."
            />
            <FeatureCard
              title="Guided Meditations"
              icon="🎧"
              text="Relax through soothing sessions crafted for mental clarity."
            />
            <FeatureCard
              title="Daily Insights"
              icon="⚡"
              text="Get personalized suggestions based on mood and sleep data."
            />
          </div>
        </div>

        {/* FOOTER */}
       <Footer/>
      </div>
    </>
  );
}

function FeatureCard({
  title,
  icon,
  text,
}: {
  title: string;
  icon: string;
  text: string;
}) {
  return (
    <div className="bg-[#111322] p-6 rounded-2xl border border-white/10 shadow-lg hover:shadow-xl transition">
      <div className="text-3xl">{icon}</div>
      <h3 className="text-xl font-semibold mt-4 text-white">{title}</h3>
      <p className="text-gray-400 mt-2">{text}</p>
    </div>
  );
}
