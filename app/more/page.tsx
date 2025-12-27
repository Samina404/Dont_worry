"use client";

import Link from "next/link";
import { Quote, CloudSun, MapPin, ArrowRight, Sparkles, MessageCircleHeart, Navigation, Sun, Compass } from "lucide-react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

const MENU_ITEMS = [
  {
    title: "Daily Quote",
    description: "Get inspired with a new quote every day.",
    icon: Quote,
    href: "/more/quote",
    accent: "bg-pink-500/10 text-pink-400",
    delay: 0.1,
  },
  {
    title: "Weather Forecast",
    description: "Check real-time weather and forecasts.",
    icon: Sun,
    href: "/more/weather",
    accent: "bg-blue-500/10 text-blue-400",
    delay: 0.2,
  },
  {
    title: "Explore Nearby",
    description: "Discover amazing places around you.",
    icon: Compass,
    href: "/more/explore",
    accent: "bg-yellow-500/10 text-yellow-400",
    delay: 0.3,
  },
  {
    title: "Social Space",
    description: "Connect, share, and see what others are up to.",
    icon: Sparkles,
    href: "/more/social",
    accent: "bg-purple-500/10 text-purple-400",
    delay: 0.4,
  },
  
];

export default function MorePage() {
  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400";
  const glassCard = "bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-2xl transition-all duration-500";
  
  return (
    <div className="min-h-screen bg-[#130b1b] font-sans text-white flex flex-col relative overflow-hidden">
      
      {/* 🌌 RADIANT SANCTUARY BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Main Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.15),transparent_70%)]" />
        
        {/* Header Specific Glow */}
        <div className="absolute top-0 left-0 w-[50%] h-[30%] bg-purple-600/10 rounded-full blur-[120px]" />
        
        {/* Shifting Orbs */}
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[70%] h-[70%] bg-pink-600/15 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 rounded-full blur-[130px]" 
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[100px]" 
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/[0.02] backdrop-blur-[40px] border-b border-white/10 py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              More Options
            </h1>
            <p className="text-gray-500 max-w-lg font-medium text-sm">
              Discover additional dimensions of mindfulness and utility tailored for your journey.
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <BackButton variant="themed" href="/home" className="scale-110" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          {/* Section Divider */}
          <div className="flex items-center gap-4 mb-12">
             <div className="flex-1 h-px bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {MENU_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay, duration: 0.8 }}
                  className={`${glassCard} rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 relative overflow-hidden group-hover:bg-white/[0.08] group-hover:border-white/20`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-8">
                    {/* Icon Container */}
                    <div className={`p-6 rounded-[2rem] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.accent}`}>
                      <item.icon className="w-8 h-8" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-2xl font-black tracking-tight text-white group-hover:text-pink-400 transition-colors">
                          {item.title}
                        </h2>
                        <ArrowRight className="w-5 h-5 text-gray-700 group-hover:text-white group-hover:translate-x-2 transition-all" />
                      </div>
                      <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Aesthetic Corner Glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}
