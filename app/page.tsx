"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import animationData from "../public/animations/Girl yoga.json";
import { supabase } from "../lib/supabaseClient";
import Navbar from "./nav/NavBar";
import Head from "next/head";
import Footer from "./components/Footer";
import Image from "next/image";
import { Quote, ArrowUp } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    checkUser();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    router.push(user ? "/home" : "/signup");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  return (
    <>
      <Head>
        <title>Mental Wellness – Mood Tracking & Stress Relief</title>
        <meta
          name="description"
          content="Track your mood, reflect daily, reduce stress, improve sleep, and build emotional wellness. Your private safe space for mental peace."
        />
      </Head>

      <div className="min-h-screen bg-[#07040e] text-white font-sans selection:bg-pink-500/30 overflow-x-hidden relative">
        {/* 🌌 RADIANT ATMOSPHERE BACKGROUND */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.1),transparent_70%)]" />
          
          <motion.div 
            animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[0%] w-[80%] h-[80%] bg-pink-600/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ x: [0, -50, 0], y: [0, 80, 0], scale: [1.1, 1, 1.1] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-15%] left-[-10%] w-[90%] h-[90%] bg-purple-600/10 rounded-full blur-[140px]" 
          />
        </div>

        {/* Navbar */}
        <Navbar isAuthenticated={!!user} onCtaClick={handleGetStarted} />

        {/* HERO SECTION */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-[3rem] md:rounded-[4rem] bg-white/[0.03] backdrop-blur-[40px] p-8 md:p-14 shadow-2xl flex flex-col md:flex-row items-center gap-12 border border-white/10 overflow-hidden group min-h-[420px]"
          >
            {/* Soft Ambient Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-pink-500/[0.03]" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px]" />
            
            {/* Left Text */}
            <div className="flex-1 space-y-6 md:space-y-8 relative z-10">
              

              <h1 className="text-4xl md:text-5xl lg:text-5xl font-black leading-[1.05] tracking-tighter">
                Sleep Better,
                <br />
                Boost Energy,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400">
                  Embrace Life.
                </span>
              </h1>

              <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed max-w-lg">
                Track your mood, share your thoughts, and take care of your mind — 
                one day at a time. This is your peaceful digital space to relax and 
                reflect.
              </p>

              <motion.button
                onClick={handleGetStarted}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 bg-[length:200%_auto] hover:bg-right transition-all duration-500 text-white font-black text-[10px] uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(236,72,153,0.3)] flex items-center gap-2"
              >
                <span>Enter Your Space</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </motion.button>
            </div>

            <div className="flex-1 flex justify-center relative z-10">
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-64 md:w-full lg:w-[420px] drop-shadow-[0_20px_20px_rgba(236,72,151,0.1)]"
              >
                <Lottie animationData={animationData} loop={true} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* FEATURE SECTIONS */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
          <div className="text-center mb-12 space-y-2">
             <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter">
                Transform Your Mind
             </h2>
             <div className="flex items-center justify-center gap-3">
                <div className="h-px w-8 bg-white/10" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">
                  One Reflection at a Time
                </span>
                <div className="h-px w-8 bg-white/10" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Mood Tracking"
              icon="😊"
              accent="pink"
              text="Understand emotional patterns with daily reflections and insights."
              delay={0.1}
            />
            <FeatureCard
              title="Sleep Guidance"
              icon="🌙"
              accent="indigo"
              text="Adopt healthier sleep habits and calming bedtime routines."
              delay={0.2}
            />
            <FeatureCard
              title="Stress Relief"
              icon="🧘"
              accent="yellow"
              text="Reduce anxiety with breathing exercises, journaling, and mindfulness."
              delay={0.3}
            />
            <FeatureCard
              title="Private Journaling"
              icon="📔"
              accent="purple"
              text="Your thoughts are safe — a private journal to express freely."
              delay={0.4}
            />
            <FeatureCard
              title="Guided Meditations"
              icon="🎧"
              accent="blue"
              text="Relax through soothing sessions crafted for mental clarity."
              delay={0.5}
            />
            <FeatureCard
              title="Daily Insights"
              icon="⚡"
              accent="orange"
              text="Get personalized suggestions based on mood and sleep data."
              delay={0.6}
            />
          </div>
        </div>

        {/* MISSION & VISION SECTION */}
        <div id="mission" className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-5">
             <Quote className="w-6 h-6 text-pink-500/20 mx-auto" />
             <p className="text-lg md:text-2xl font-serif font-medium leading-[1.4] text-gray-200 italic">
               &quot;Think of us as your <span className="text-pink-400 font-bold not-italic">digital sanctuary</span>, here to guide you, offer a moment of pause, and remind you that you&apos;re capable of finding balance.&quot;
             </p>
             <div className="w-16 h-px bg-gradient-to-r from-transparent via-pink-500/50 to-transparent mx-auto" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[35%] h-[35%] bg-pink-500/[0.03] rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="w-8 h-1 bg-pink-500 rounded-full" />
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white">Our Mission</h2>
                </div>
                <p className="text-gray-400 leading-relaxed text-base font-medium">
                  Our mission is to create a safe haven for your mind. We strive to
                  empower you with tools for self-reflection, mood tracking, and
                  mindfulness, fostering a journey where mental well-being is
                  accessible, engaging, and stigma-free.
                </p>
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-black uppercase tracking-widest text-[8px] transition-all shadow-xl">
                  Deep Dive into Our Vision
                </button>
              </div>

              <div className="space-y-6">
                <div className="relative aspect-video w-full rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/5 group/img">
                  <Image
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099&auto=format&fit=crop"
                    alt="Peaceful meditation scene"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover/img:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover/img:opacity-40 transition-opacity" />
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-widest text-pink-400">Why Choose Us</h3>
                    <p className="text-gray-400 leading-relaxed text-sm font-medium">
                    Because your mental health deserves more than just a quick fix.
                    We combine data-driven insights with compassionate design to help
                    you understand yourself better through ethereal experiences.
                    </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CORNERSTONES SECTION */}
        <div id="cornerstones" className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Image */}
            <div className="flex-1 w-full">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-white/[0.02] backdrop-blur-3xl group"
              >
                <Image
                  src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop" 
                  alt="Meditation Illustration"
                  fill
                  className="object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07040e] to-transparent opacity-40" />
              </motion.div>
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[1.1]">
                The Cornerstones of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Mindfulness</span>
              </h2>

              <div className="space-y-6">
                <CornerstonePoint 
                  title="Breathing with Intention"
                  accent="orange"
                  text="Highlight the role of breathwork in regulating emotions and enhancing vitality."
                />
                <CornerstonePoint 
                  title="Purposeful Meditation"
                  accent="pink"
                  text="Delve into techniques that enhance mental clarity and alleviate stress."
                />
                <CornerstonePoint 
                  title="Embodied Awareness"
                  accent="yellow"
                  text="Integrating mindful awareness into daily activities to deepen your connection."
                />
              </div>
            </div>
          </div>
        </div>

        {/* PATH TO WELLNESS SECTION */}
        <div id="wellness" className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-[1.1]">
                  Find Your Path to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
                    Wellness
                  </span>
                </h2>
                <p className="text-gray-400 text-base font-medium leading-relaxed max-w-lg">
                  Discover personalized practices for mental clarity and emotional balance.
                </p>
              </div>

              <div className="space-y-4">
                <PathItem color="pink" num="01" title="Mindfulness & Meditation" desc="Learn techniques to stay present and reduce stress." />
                <PathItem color="purple" num="02" title="Emotional Balance" desc="Develop healthy coping strategies for life's challenges." />
                <PathItem color="yellow" num="03" title="Daily Wellness Habits" desc="Build sustainable routines for your mental health." />
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-3 bg-white/[0.02] border border-white/5 p-4 rounded-[1.5rem] w-fit">
                <div className="flex items-center -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#07040e] overflow-hidden relative shadow-2xl">
                      <Image 
                        src={`https://randomuser.me/api/portraits/women/${40 + i}.jpg`}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-lg font-black text-white tracking-tighter">110K+</p>
                  <p className="text-gray-500 text-[8px] uppercase tracking-widest font-black">Sanctuary Citizens</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 w-full">
              <div className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 bg-white/[0.02] group">
                <Image
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop"
                  alt="Woman meditating in nature"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07040e] to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS SECTION */}
        <div id="testimonials" className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-[1.1]">
              Stories of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Renewal.</span>
            </h2>
            <button className="text-[9px] font-black uppercase tracking-[0.3em] text-pink-400 hover:text-white transition-colors flex items-center gap-2 pb-2 border-b border-white/10 group">
              Explore more stories 
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TestimonialCard
              image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop"
              quote="I never thought wellness could feel so ethereal. It made me fall in love with taking care of myself."
              name="Nadia L."
              role="Art Director"
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop"
              quote="Each session feels like a soft sunrise. My anxiety dropped, & my sleep clarity improved significantly."
              name="Ken W."
              role="Tech Founder"
              isHighlighted={true}
            />
            <TestimonialCard
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
              quote="The community is everything — warm, supportive, and real. I finally feel truly understood."
              name="Minji T."
              role="Visual Artist"
            />
          </div>
        </div>

        {/* SCROLL TO TOP BUTTON */}
        <div className="fixed bottom-10 right-10 z-[100]">
          {typeof window !== 'undefined' && (
            <AnimatePresence>
              {showScrollTop && (
                <motion.button
                  initial={{ opacity: 0, scale: 0, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 45 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={scrollToTop}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-[0_15px_30px_rgba(236,72,153,0.4)] border border-white/20 backdrop-blur-md group"
                >
                  <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* FOOTER */}
        <Footer />
      </div>

    </>
  );
}

function FeatureCard({
  title,
  icon,
  text,
  accent,
  delay,
}: {
  title: string;
  icon: string;
  accent: string;
  text: string;
  delay: number;
}) {
  const accentColors: Record<string, string> = {
    pink: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    orange: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="group bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04] relative overflow-hidden"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border ${accentColors[accent]} mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-4 group-hover:text-pink-400 transition-colors">{title}</h3>
      <p className="text-gray-500 text-lg font-medium leading-relaxed group-hover:text-gray-400 transition-colors">{text}</p>
      
      {/* Subtle Glow */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
}

function CornerstonePoint({ title, accent, text }: { title: string; accent: string; text: string }) {
  const accents: Record<string, string> = {
    orange: "from-orange-400/50 to-orange-400",
    pink: "from-pink-400/50 to-pink-400",
    yellow: "from-yellow-400/50 to-yellow-400",
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group flex gap-8 items-start"
    >
      <div className={`w-1 h-20 bg-gradient-to-b ${accents[accent]} rounded-full opacity-30 group-hover:opacity-100 transition-all duration-500`} />
      <div className="space-y-3">
        <h3 className={`text-2xl font-black uppercase tracking-tighter transition-colors ${accent === 'orange' ? 'text-orange-400' : accent === 'pink' ? 'text-pink-400' : 'text-yellow-400'}`}>
          {title}
        </h3>
        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

function PathItem({ num, title, desc, color }: { num: string; title: string; desc: string; color: string }) {
  const bgColors: Record<string, string> = {
    pink: "from-pink-500 to-rose-500 shadow-pink-500/20",
    purple: "from-purple-500 to-indigo-600 shadow-purple-500/20",
    yellow: "from-yellow-500 to-orange-500 shadow-yellow-500/20",
  };

  const textColors: Record<string, string> = {
    pink: "group-hover:text-pink-400",
    purple: "group-hover:text-purple-400",
    yellow: "group-hover:text-yellow-400",
  };

  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="flex items-start gap-6 group cursor-pointer"
    >
      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${bgColors[color]} flex items-center justify-center text-white font-black text-lg shadow-2xl transition-transform duration-500 group-hover:scale-110`}>
        {num}
      </div>
      <div>
        <h3 className={`text-xl font-black uppercase tracking-widest text-white mb-2 transition-colors ${textColors[color]}`}>
          {title}
        </h3>
        <p className="text-gray-500 font-medium leading-relaxed max-w-sm">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  image,
  quote,
  name,
  role,
  isHighlighted = false,
}: {
  image: string;
  quote: string;
  name: string;
  role: string;
  isHighlighted?: boolean;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={`bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[3rem] transition-all duration-500 hover:bg-white/[0.04] group ${isHighlighted ? 'ring-1 ring-pink-500/30' : ''}`}
    >
      <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden mb-8 border border-white/5">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07040e] to-transparent opacity-60" />
      </div>

      <div className="space-y-6">
        <p className="text-xl md:text-2xl font-serif leading-relaxed text-gray-200 italic">
          &quot;{quote}&quot;
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div>
            <p className="font-black text-white text-lg tracking-tighter">{name}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest font-black">{role}</p>
          </div>
          <Quote className="w-8 h-8 text-pink-500/10" />
        </div>
      </div>
    </motion.div>
  );
}
