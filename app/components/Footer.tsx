"use client";

import { Facebook, Linkedin, MessageCircle, Send } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 bg-gradient-to-b from-[#3a1f42] to-[#1a0f1f] text-gray-300 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ABOUT */}
          <div className="space-y-4">
            <h3 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              Don't Worry
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              Your digital sanctuary for mental wellness. Track your mood,
              improve sleep, reduce stress, and embrace emotional balance — one day at a time.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Mood Tracking</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Sleep Guidance</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Guided Meditations</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Stress Relief</li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Feedback</li>
              <li className="hover:text-pink-300 transition-colors cursor-pointer">Contact Us</li>
            </ul>
          </div>

          {/* STAY CONNECTED */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Follow us on social media for daily wellness tips and inspiration.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-400 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Messenger"
              >
                <MessageCircle className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="WhatsApp"
              >
                <Send className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM TEXT */}
        <div className="text-center mt-12 pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400">
            © {currentYear} <span className="text-pink-300 font-semibold">Don't Worry</span> — Built with care, compassion, and calmness 💜
          </p>
        </div>
      </div>
    </footer>
  );
}
