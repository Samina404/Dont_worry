"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Navbar({
  isAuthenticated,
  onCtaClick,
}: {
  isAuthenticated: boolean;
  onCtaClick: () => void;
}) {
  const router = useRouter();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 cursor-pointer"
        >
          Don’t Worry 🌙
        </h1>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => router.push("/home")}
              className="text-gray-200 hover:text-white text-sm font-medium"
            >
              Home
            </motion.button>
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => router.push("/login")}
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCtaClick}
                className="px-5 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 
                           text-black font-semibold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Get Started
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
