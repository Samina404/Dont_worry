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
import Image from "next/image";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-24 sm:pt-28 pb-8">
            <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#141627] via-[#1f200f] to-[#df5cb3] p-6 sm:p-10 md:p-16 shadow-xl flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-20 border border-white/10"
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
        <div className="max-w-6xl mx-auto px-6 md:px-12 mt-24 relative z-10">
          <h2 className="text-center text-3xl md:text-5xl font-serif font-bold text-white mb-16">
            Transform Your Mind, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">One Day at a Time</span>
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

        {/* MISSION & VISION SECTION */}
        <div id="mission" className="max-w-7xl mx-auto px-6 md:px-12 mt-32 mb-32">
          {/* Intro Text */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto mb-6"></div>
            <p className="text-xl md:text-2xl leading-relaxed text-gray-200">
              We&apos;re all about spreading{" "}
              <span className="text-pink-400 font-semibold">
                calm vibes and inner peace
              </span>{" "}
              while tackling life&apos;s stresses head-on. Think of us as your
              digital sanctuary, here to guide you, offer a moment of pause, and
              remind you that you&apos;re capable of finding balance in this busy world.
            </p>
          </div>

          {/* Single Container with All Content */}
          <div className="bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-pink-500/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Our Mission */}
              <div className="space-y-6">
                <div>
                  <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-orange-400 mb-4"></div>
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Our Mission</h2>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Our mission is to create a safe haven for your mind. We strive to
                  empower you with tools for self-reflection, mood tracking, and
                  mindfulness, fostering a journey where mental well-being is
                  accessible, engaging, and stigma-free.
                </p>
                <button className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-pink-500/25 hover:scale-105">
                  Learn More
                </button>
              </div>

              {/* Right Column - Image and Why Choose Us */}
              <div className="space-y-6">
                {/* Image */}
                <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                  <Image
                    src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2099&auto=format&fit=crop"
                    alt="Peaceful meditation scene"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                {/* Why Choose Us */}
                <div className="space-y-4">
                  <div>
                    <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mb-3"></div>
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-3">Why Choose Us</h2>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    Because your mental health deserves more than just a quick fix.
                    We combine data-driven insights with compassionate design to help
                    you understand yourself better.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORNERSTONES SECTION */}
        <div id="cornerstones" className="max-w-7xl mx-auto px-6 md:px-12 mb-32">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            {/* Left Image (Illustration style) */}
            <div className="flex-1 w-full">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-md flex items-center justify-center group">
                 {/* Using a high-quality Unsplash image that has a warm, meditative vibe to match the request */}
                <Image
                  src="https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop" 
                  alt="Meditation Illustration"
                  fill
                  className="object-cover opacity-100 transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 space-y-10">
              <h2 className="text-4xl md:text-5xl font-serif leading-tight text-white">
                The Cornerstones of Our <br />
                <span className="text-pink-300">Breathing & Meditation</span> Practice
              </h2>

              <div className="space-y-8">
                {/* Point 1 */}
                <div className="group pl-4 border-l-2 border-orange-300/30 hover:border-orange-300 transition-colors">
                  <h3 className="text-2xl font-bold text-orange-300 mb-2">
                    Breathing with Intention
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Highlight the crucial role of breathwork in regulating emotions 
                    and enhancing overall vitality. A simple breath can change your whole day.
                  </p>
                </div>

                {/* Point 2 */}
                <div className="group pl-4 border-l-2 border-pink-300/30 hover:border-pink-300 transition-colors">
                  <h3 className="text-2xl font-bold text-pink-300 mb-2">
                    Purposeful Meditation
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Delve into different meditation techniques and discover how they 
                    can enhance mental clarity and alleviate stress in just minutes.
                  </p>
                </div>

                {/* Point 3 */}
                <div className="group pl-4 border-l-2 border-yellow-300/30 hover:border-yellow-300 transition-colors">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-2">
                    Embodied Awareness
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    Integrating mindful awareness into your daily activities can 
                    deepen your connection with yourself and the surrounding world.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* PATH TO WELLNESS SECTION */}
        <div id="wellness" className="max-w-6xl mx-auto px-6 md:px-12 mb-32">
          <div className="flex flex-col md:flex-row items-center gap-10">
            {/* Left Content */}
            <div className="flex-1 space-y-6">
              <div>
                <div className="w-full h-0.5 bg-gradient-to-r from-pink-400 to-yellow-400 mb-4"></div>
                <h2 className="text-3xl md:text-4xl font-serif leading-tight text-white mb-3">
                  Find Your Path to{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
                    Wellness
                  </span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed">
                  Discover personalized practices that help you achieve mental clarity, 
                  emotional balance, and lasting peace of mind.
                </p>
              </div>

              <div className="space-y-4">
                {/* Path Item 1 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    01
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">
                      Mindfulness & Meditation
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Learn techniques to stay present, reduce stress, and cultivate inner peace through guided practices.
                    </p>
                  </div>
                </div>

                {/* Path Item 2 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    02
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      Emotional Balance
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Develop healthy coping strategies and build resilience to navigate life's challenges with confidence.
                    </p>
                  </div>
                </div>

                {/* Path Item 3 */}
                <div className="flex items-start gap-3 group cursor-pointer">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                    03
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                      Daily Wellness Habits
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Build sustainable routines that support your mental health and overall well-being every day.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#4b2c54] overflow-hidden relative bg-gray-700 shadow-lg">
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
                  <p className="text-xl font-bold text-white">110K+</p>
                  <p className="text-gray-400 text-xs">People on their wellness journey</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 w-full">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2070&auto=format&fit=crop"
                  alt="Woman meditating in nature"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* TESTIMONIALS SECTION */}
        <div id="testimonials" className="max-w-7xl mx-auto px-6 md:px-12 mt-32 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight max-w-2xl">
              Stories of Renewal. <br />
              <span className="text-pink-300">Real People.</span> Real Peace.
            </h2>
            <a href="#" className="group flex items-center gap-2 text-lg font-medium hover:text-pink-300 transition-colors">
              Explore more stories 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <TestimonialCard
              image="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop"
              quote="I never thought wellness could feel so fun. It made me fall in love with taking care of myself."
              name="Nadia L."
              role="Designer"
            />

            {/* Testimonial 2 */}
            <TestimonialCard
              image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop"
              quote="Each session feels like a soft sunrise. My anxiety dropped, & my sleep improved significantly."
              name="Ken W."
              role="Entrepreneur"
              isHighlighted={true}
            />

            {/* Testimonial 3 */}
            <TestimonialCard
              image="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop"
              quote="The community is everything — warm, supportive, and real. I finally feel understood."
              name="Minji T."
              role="Artist"
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
    <div className="group bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 shadow-lg hover:shadow-pink-500/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1">
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mt-4 text-white group-hover:text-pink-200 transition-colors">{title}</h3>
      <p className="text-gray-400 mt-3 leading-relaxed group-hover:text-gray-300 transition-colors">{text}</p>
    </div>
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
    <div className="bg-white text-black p-6 md:p-8 rounded-none shadow-lg flex flex-col gap-6 relative group hover:-translate-y-2 transition-transform duration-300">
      {/* Image Container */}
      <div className="relative w-full h-64 md:h-72 overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

      </div>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <p className="text-lg md:text-xl font-serif leading-relaxed">
          &quot;{quote}&quot;
        </p>
        <div>
          <p className="font-bold text-lg">{name}</p>
          <p className="text-gray-500 text-sm uppercase tracking-wide">{role}</p>
        </div>
      </div>
    </div>
  );
}
