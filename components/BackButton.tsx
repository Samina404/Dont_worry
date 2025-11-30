"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface BackButtonProps {
  variant?: "light" | "dark" | "themed";
  className?: string;
  href?: string; // Optional custom destination
}

export default function BackButton({ variant = "themed", className = "", href }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  const variants = {
    light: "bg-white/10 hover:bg-white/20 text-white border-white/20",
    dark: "bg-black/20 hover:bg-black/30 text-white border-black/30",
    themed: "bg-gradient-to-r from-pink-400/20 to-yellow-400/20 hover:from-pink-400/30 hover:to-yellow-400/30 text-white border-purple-700/40"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-full 
        border backdrop-blur-md
        transition-all duration-300
        shadow-lg
        ${variants[variant]}
        ${className}
      `}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="font-medium">Back</span>
    </motion.button>
  );
}
