"use client";

import Link from "next/link";
import { Quote, CloudSun, MapPin, ArrowRight, Sparkles, MessageCircleHeart } from "lucide-react";
import { motion } from "framer-motion";

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
  return (
    <div className="min-h-screen bg-[#0f172a] font-sans text-white flex flex-col">
      {/* Header */}
      <header className="py-8 px-6 border-b border-white/10 bg-[#1e293b]/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 text-transparent bg-clip-text">
            More Options
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENU_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className="block group">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item.delay }}
                  className="h-full bg-[#1e293b] border border-white/5 rounded-3xl p-6 relative overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  {/* Background Gradient Blob */}
                  <div
                    className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity duration-500`}
                  />

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Text */}
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center gap-2 text-sm font-medium text-white/50 group-hover:text-white transition-colors">
                    <span>Open</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
