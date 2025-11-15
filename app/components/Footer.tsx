"use client";

export default function Footer() {
  return (
    <footer className="mt-20 bg-[#102315] text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* ABOUT */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-300">MindSpace</h3>
          <p className="mt-3 text-sm leading-relaxed">
            A calm and caring mental wellness platform helping you track mood,
            improve sleep, reduce stress, and feel emotionally balanced.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-300">Quick Links</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Sleep Tracking</li>
            <li>Mood Journal</li>
            <li>Guided Meditations</li>
            <li>Stress Relief</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-300">Support</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
            <li>Feedback</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-lg font-semibold text-yellow-300">Stay Connected</h3>
          <div className="flex space-x-4 mt-3 text-xl">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>▶️</span>
          </div>
        </div>
      </div>

      {/* BOTTOM TEXT */}
      <div className="text-center mt-12 text-sm text-gray-400 border-t border-gray-700 pt-6">
        © {new Date().getFullYear()} MindSpace – Built with care and calmness 💚
      </div>
    </footer>
  );
}
