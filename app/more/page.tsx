"use client";

import Link from "next/link";
import { Quote, CloudSun, MapPin, ArrowRight, Sparkles, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

const MENU_ITEMS = [
  {
    title: "Daily Quote",
    description: "Get inspired with a new quote every day.",
    icon: Quote,
    href: "/more/quote",
    color: "from-pink-500 to-rose-500",
    delay: 0.1,
  },
  {
    title: "Weather Forecast",
    description: "Check real-time weather and forecasts.",
    icon: CloudSun,
    href: "/more/weather",
    color: "from-blue-500 to-cyan-500",
    delay: 0.2,
  },
  {
    title: "Explore Nearby",
    description: "Discover amazing places around you.",
    icon: MapPin,
    href: "/more/explore",
    color: "from-purple-500 to-violet-500",
    delay: 0.3,
  },
  {
    title: "Social Space",
    description: "Connect, share, and see what others are up to.",
    icon: MessageCircleHeart,
    href: "/more/social",
    color: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
];

export default function MorePage() {
  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  
  return (
    <div className="min-h-screen bg-[#3b234a] font-sans text-white flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-purple-900/40 bg-[#3b234a]/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-400 to-yellow-400 rounded-2xl shadow-lg shadow-pink-500/30">
                <Sparkles className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${neonText}`}>
                  More Options
                </h1>
                <p className="text-gray-300 text-sm mt-1">Explore additional features and tools</p>
              </div>
            </div>
            <BackButton variant="themed" href="/home" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MENU_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className="h-full bg-[#1a0f1f] border border-purple-700/30 rounded-3xl p-8 relative overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
                >
                  {/* Background Gradient Blob */}
                  <div
                    className={`absolute -right-16 -top-16 w-48 h-48 bg-gradient-to-br ${item.color} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Text */}
                  <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-yellow-400 transition-all">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 text-base leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">Explore</span>
                    <ArrowRight className="w-5 h-5 text-pink-400 group-hover:translate-x-2 transition-transform" />
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-full" />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 p-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/30 rounded-3xl backdrop-blur-sm"
          >
            <h3 className={`text-xl font-bold mb-3 ${neonText}`}>
              ✨ Discover More Features
            </h3>
            <p className="text-gray-300 leading-relaxed">
              These tools are designed to enhance your mental wellness journey. From daily inspiration 
              to weather updates and local exploration, we've got everything you need to stay balanced and informed.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
