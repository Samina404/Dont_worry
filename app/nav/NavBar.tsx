"use client";

import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

interface NavProps {
  isAuthenticated: boolean;
  onCtaClick: () => void;
}

export default function NavPage({ isAuthenticated, onCtaClick }: NavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Sleep", path: "/sleep" },
    { label: "Mindfulness", path: "/mindfulness" },
    { label: "Mental Health", path: "/mental-health" },
    { label: "About Us", path: "/about" },
    { label: "Articles", path: "/articles" },
  ];

  const toggleMenu = () => setOpen(!open);

  const closeMenuAndNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/5 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <h1
          onClick={() => closeMenuAndNavigate("/")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400 cursor-pointer"
        >
          Don’t Worry
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex bg-white/10 backdrop-blur-md px-6 py-2 rounded-full items-center space-x-4 shadow-sm border border-white/20">
          {menuItems.map((item) => {
            const isActive = pathname === item.path && item.path !== "/";
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`relative px-4 py-1 rounded-full text-sm transition-all duration-300
                ${
                  isActive
                    ? "bg-white/80 text-gray-800 shadow-md"
                    : "text-gray-200 hover:text-white hover:bg-white/10 hover:shadow-md"
                }
                hover:scale-105`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-4">
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

        {/* MOBILE BURGER BUTTON */}
        <button
          className="md:hidden text-white"
          onClick={toggleMenu}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20 px-6 py-4 space-y-4"
        >
          {menuItems.map((item) => {
            const isActive = pathname === item.path && item.path !== "/";
            return (
              <button
                key={item.label}
                onClick={() => closeMenuAndNavigate(item.path)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all
                ${
                  isActive
                    ? "bg-white/80 text-gray-800"
                    : "text-gray-100 hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {/* Mobile CTA */}
          <div className="pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <button
                onClick={() => closeMenuAndNavigate("/home")}
                className="w-full text-gray-200 hover:text-white text-sm font-medium py-2"
              >
                Home
              </button>
            ) : (
              <>
                <button
                  onClick={() => closeMenuAndNavigate("/login")}
                  className="w-full text-left text-gray-300 hover:text-white text-sm py-2"
                >
                  Login
                </button>

                <button
                  onClick={onCtaClick}
                  className="w-full mt-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 
                             text-black font-semibold text-sm shadow-md hover:shadow-lg"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
