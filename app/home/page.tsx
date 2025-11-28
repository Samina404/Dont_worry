"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import {
  Home,
  Music,
  Film,
  Newspaper,
  MoreHorizontal,
  LogOut,
  History,
  Heart,
  User,
  MapPin,
  ExternalLink,
  PlayCircle,
  BookOpen,
  Quote,
  TrendingUp
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---

type UserProfile = {
  full_name?: string;
  avatar_url?: string;
  email?: string;
};

type SocialPost = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: string[];
  user_email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
  type: "post";
};

type Article = {
  id: string;
  title: string;
  description?: string;
  url?: string;
  urlToImage?: string;
  source?: string;
  publishedAt?: string;
  type: "article";
};

type MusicVideo = {
  id: string;
  title: string;
  thumbnail: string;
  type: "music";
};

type Place = {
  id: string;
  name: string;
  vicinity: string;
  rating: number;
  photos: any[];
  geometry: {
    lat: number;
    lng: number;
  };
  type: "place";
};

type FeedItem = SocialPost | Article | MusicVideo | Place;

// --- Components ---

const SocialPostCard = ({ post, user, onLike }: { post: SocialPost; user: any; onLike: (p: SocialPost) => void }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e1e1e] border border-white/5 p-4 rounded-xl mb-4"
  >
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px]">
          <div className="w-full h-full rounded-full bg-black p-[1.5px] overflow-hidden">
            {post.user_metadata?.avatar_url ? (
              <img src={post.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover rounded-full" />
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">{post.user_email?.[0].toUpperCase() || "U"}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <h3 className="font-semibold text-white text-sm">
            {post.user_metadata?.full_name || post.user_metadata?.name || post.user_email?.split("@")[0] || "Anonymous"}
          </h3>
          <span className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <p className="text-gray-200 text-sm mt-1 mb-3 whitespace-pre-wrap">{post.content}</p>
        <div className="flex items-center gap-4">
          <button onClick={() => onLike(post)} className="flex items-center gap-1 text-gray-400 hover:text-pink-500 transition-colors">
            <Heart className={`w-5 h-5 ${post.likes?.includes(user?.id) ? "fill-pink-500 text-pink-500" : ""}`} />
            <span className="text-xs">{post.likes?.length || 0}</span>
          </button>
        </div>
      </div>
    </div>
  </motion.article>
);

const ArticleCard = ({ article }: { article: Article }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden mb-4 cursor-pointer hover:bg-[#252525] transition-colors"
    onClick={() => window.open(article.url, "_blank")}
  >
    {article.urlToImage && (
      <div className="h-48 w-full relative">
        <img src={article.urlToImage} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
          <BookOpen size={12} /> Article
        </div>
      </div>
    )}
    <div className="p-4">
      <h3 className="font-bold text-white mb-2 line-clamp-2">{article.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-3 mb-3">{article.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{article.source}</span>
        <span className="flex items-center gap-1 text-pink-400">Read more <ExternalLink size={12} /></span>
      </div>
    </div>
  </motion.article>
);

const MusicCard = ({ video }: { video: MusicVideo }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden mb-4 cursor-pointer hover:bg-[#252525] transition-colors"
    onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}
  >
    <div className="relative">
      <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
        <PlayCircle className="w-12 h-12 text-white opacity-80" />
      </div>
      <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
        <Music size={12} /> Music
      </div>
    </div>
    <div className="p-3">
      <h3 className="font-semibold text-white text-sm line-clamp-1">{video.title}</h3>
      <p className="text-xs text-gray-500 mt-1">Recommended for you</p>
    </div>
  </motion.article>
);

const PlaceCard = ({ place }: { place: Place }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-[#1e1e1e] border border-white/5 rounded-xl overflow-hidden mb-4 cursor-pointer hover:bg-[#252525] transition-colors"
    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${place.geometry.lat},${place.geometry.lng}&query_place_id=${place.id}`, "_blank")}
  >
    <div className="relative h-48 bg-gray-800">
        {/* Placeholder for place image since API might not return direct photo URLs easily without key */}
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
            <MapPin className="w-12 h-12 text-white/50" />
        </div>
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white flex items-center gap-1">
            <MapPin size={12} /> Place
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
             <h3 className="font-bold text-white text-lg">{place.name}</h3>
        </div>
    </div>
    <div className="p-3">
      <p className="text-gray-300 text-sm mb-2">{place.vicinity}</p>
      <div className="flex items-center gap-1 text-yellow-400 text-xs">
        <span>★</span> <span>{place.rating}</span>
      </div>
    </div>
  </motion.article>
);

// --- Main Page Component ---

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper to shuffle array
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);

      // 1. Fetch Social Posts
      let posts: SocialPost[] = [];
      const { data: postData } = await supabase
        .from("social_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (postData) {
        posts = postData.map(p => ({ ...p, type: "post" as const }));
      }

      // 2. Fetch Articles
      let articles: Article[] = [];
      try {
        const res = await fetch("/api/news?q=mental health&pageSize=5");
        const data = await res.json();
        if (data.articles) {
          articles = data.articles.map((a: any) => ({ ...a, id: a.url, type: "article" as const }));
        }
      } catch (e) { console.error("Error fetching articles", e); }

      // 3. Fetch Music
      let music: MusicVideo[] = [];
      try {
        const res = await fetch("/api/youtube?q=calm music");
        const data = await res.json();
        if (data.videos) {
          music = data.videos.slice(0, 5).map((v: any) => ({ ...v, type: "music" as const }));
        }
      } catch (e) { console.error("Error fetching music", e); }

      // 4. Fetch Places (Try to get location, else skip or use default)
      let places: Place[] = [];
      // Note: Skipping places for auto-fetch to avoid permission prompts on load, 
      // or we could fetch a default set if we had a default lat/lng. 
      // For now, let's keep it simple and focus on the other 3 streams to ensure speed.

      // Combine and Shuffle
      const combinedFeed = shuffleArray([...posts, ...articles, ...music]);
      setFeed(combinedFeed);
      setLoading(false);
    };

    init();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleLike = async (post: SocialPost) => {
    if (!user) return;
    const isLiked = post.likes?.includes(user.id);
    const newLikes = isLiked
      ? post.likes.filter((id) => id !== user.id)
      : [...(post.likes || []), user.id];

    // Optimistic update
    setFeed((prev) =>
      prev.map((item) => {
        if (item.type === "post" && item.id === post.id) {
            return { ...item, likes: newLikes };
        }
        return item;
      })
    );

    await supabase.from("social_posts").update({ likes: newLikes }).eq("id", post.id);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#000000] text-white flex justify-center items-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans pb-20 md:pb-0">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full flex justify-between items-center px-4 md:px-8 py-4 bg-black/80 backdrop-blur-md border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent hidden md:block">
          Don’t Worry
        </h1>

        <nav className="flex gap-6 md:gap-8 text-gray-400 mx-auto md:mx-0">
          <div className="flex flex-col items-center cursor-pointer text-white" onClick={() => router.push("/home")}>
            <Home size={22} />
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/music")}>
            <Music size={22} />
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/movies")}>
            <Film size={22} />
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/articles")}>
            <Newspaper size={22} />
          </div>
          <div className="flex flex-col items-center cursor-pointer hover:text-white transition-colors" onClick={() => router.push("/more")}>
            <MoreHorizontal size={22} />
          </div>
        </nav>

        <div className="flex items-center gap-4">
            <button 
                onClick={() => router.push("/moodhistory")}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300"
                title="History"
            >
                <History size={20} />
            </button>
            <button 
                onClick={handleLogout}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-red-400"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer">
                {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <User size={14} className="text-gray-400" />
                    </div>
                )}
            </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto w-full p-4 md:p-6">
        {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-pink-500 rounded-full animate-spin"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN (Music & Articles) - Spans 3 cols */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    
                    {/* Music Widget */}
                    <div className="bg-[#111] rounded-3xl p-5 border border-white/5 flex flex-col h-[420px]">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-white">Relaxing Music</h3>
                            <button onClick={() => router.push('/music')} className="text-xs text-pink-400 hover:text-pink-300">View All</button>
                        </div>
                        
                        {/* Featured Song (Top) */}
                        {feed.filter(i => i.type === 'music')[0] && (
                            <div className="relative rounded-xl overflow-hidden aspect-video mb-4 group cursor-pointer" 
                                 onClick={() => window.open(`https://www.youtube.com/watch?v=${feed.filter(i => i.type === 'music')[0].id}`, "_blank")}>
                                <img src={(feed.filter(i => i.type === 'music')[0] as MusicVideo).thumbnail} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                                    <PlayCircle className="w-10 h-10 text-white opacity-90" />
                                </div>
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white text-sm font-bold truncate">{(feed.filter(i => i.type === 'music')[0] as MusicVideo).title}</p>
                                </div>
                            </div>
                        )}

                        {/* List */}
                        <div className="flex-1 overflow-y-auto pr-1 space-y-3 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {feed.filter(i => i.type === 'music').slice(1, 5).map((video: any) => (
                                <div key={video.id} className="flex gap-3 items-center cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                                     onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank")}>
                                    <img src={video.thumbnail} className="w-12 h-12 rounded-md object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-200 line-clamp-2">{video.title}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Music Therapy</p>
                                    </div>
                                    <PlayCircle size={14} className="text-gray-500" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Articles Widget (Small) */}
                    <div className="bg-[#111] rounded-3xl p-5 border border-white/5 flex-1">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-white">Reads</h3>
                            <button onClick={() => router.push('/articles')} className="text-xs text-pink-400 hover:text-pink-300">More</button>
                        </div>
                        <div className="space-y-4">
                             {feed.filter(i => i.type === 'article').slice(0, 2).map((article: any) => (
                                <div key={article.id} className="group cursor-pointer" onClick={() => window.open(article.url, "_blank")}>
                                    <div className="flex gap-3">
                                        {article.urlToImage && (
                                            <img src={article.urlToImage} className="w-16 h-16 rounded-lg object-cover" />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="text-sm font-medium text-gray-200 line-clamp-2 group-hover:text-pink-400 transition-colors">{article.title}</h4>
                                            <p className="text-[10px] text-gray-500 mt-1">{article.source}</p>
                                        </div>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </div>

                </div>

                {/* CENTER COLUMN (Featured / Daily Focus) - Spans 5 cols */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    
                    {/* Hero Card */}
                    <div className="relative h-[500px] rounded-[32px] overflow-hidden group">
                        <img 
                            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000&auto=format&fit=crop" 
                            alt="Nature" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        
                        <div className="absolute top-6 left-6">
                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium text-white border border-white/10">
                                Daily Focus
                            </span>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
                                Find clarity in <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">the chaos.</span>
                            </h2>
                            <p className="text-gray-300 text-sm mb-6 max-w-md">
                                Take a moment to breathe. Your mental health is a priority, not an option.
                            </p>
                            <button onClick={() => router.push('/moodcheckin')} className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-orange-500/20">
                                <PlayCircle className="w-6 h-6 text-white fill-white" />
                            </button>
                        </div>
                    </div>

                    {/* Daily Quotes (Replaces Quick Tabs) */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="bg-[#111] p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                             <Quote className="w-8 h-8 text-pink-500/20 absolute top-6 right-6" />
                             <p className="text-lg font-medium text-gray-200 leading-relaxed pr-8">"The only way to do great work is to love what you do."</p>
                             <div className="flex items-center gap-2 mt-4">
                                <div className="w-1 h-1 rounded-full bg-pink-500"></div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Steve Jobs</p>
                             </div>
                        </div>
                         <div className="bg-[#111] p-6 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                             <Quote className="w-8 h-8 text-blue-500/20 absolute top-6 right-6" />
                             <p className="text-lg font-medium text-gray-200 leading-relaxed pr-8">"Believe you can and you're halfway there."</p>
                             <div className="flex items-center gap-2 mt-4">
                                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Theodore Roosevelt</p>
                             </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Stats & Social) - Spans 4 cols */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Mood Stats Widget (Enhanced) */}
                    <div className="bg-[#111] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                                    <p className="text-xs text-orange-400 uppercase tracking-wider font-bold">Mood Analysis</p>
                                </div>
                                <h3 className="text-3xl font-bold text-white">Positive <span className="text-gray-500 text-lg font-normal">+12%</span></h3>
                            </div>
                            <button 
                                onClick={() => router.push('/moodhistory')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <span className="text-xs font-medium text-gray-400 group-hover:text-white">History</span>
                                <TrendingUp className="w-4 h-4 text-orange-400" />
                            </button>
                        </div>
                        
                        {/* Attractive Line Chart Style */}
                        <div className="h-40 w-full relative z-10">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                {/* Gradient Defs */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Area */}
                                <path d="M0,50 L0,30 C10,35 20,20 30,25 S50,5 60,15 S80,30 100,20 L100,50 Z" fill="url(#chartGradient)" />
                                {/* Line */}
                                <path d="M0,30 C10,35 20,20 30,25 S50,5 60,15 S80,30 100,20" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                                {/* Points */}
                                <circle cx="30" cy="25" r="2" fill="#fff" stroke="#f97316" strokeWidth="1" />
                                <circle cx="60" cy="15" r="2" fill="#fff" stroke="#f97316" strokeWidth="1" />
                                <circle cx="100" cy="20" r="3" fill="#fff" stroke="#f97316" strokeWidth="2" />
                                
                                {/* Tooltip-like label */}
                                <g transform="translate(75, 0)">
                                    <rect x="0" y="0" width="25" height="12" rx="4" fill="#f97316" />
                                    <text x="12.5" y="8" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">85%</text>
                                </g>
                            </svg>
                        </div>
                        
                        <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest px-1">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Social Feed Widget */}
                    <div className="bg-[#111] rounded-3xl p-5 border border-white/5 flex-1 h-[300px] flex flex-col">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-white">Community</h3>
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                            {feed.filter(i => i.type === 'post').length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No recent posts</p>
                            ) : (
                                feed.filter(i => i.type === 'post').slice(0, 5).map((post: any) => (
                                    <div key={post.id} className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
                                        <div className="flex gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-[1px] flex-shrink-0">
                                                <div className="w-full h-full rounded-full bg-black overflow-hidden">
                                                    {post.user_metadata?.avatar_url ? (
                                                        <img src={post.user_metadata.avatar_url} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-[10px]">{post.user_email?.[0]}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-white">
                                                    {post.user_metadata?.full_name || 
                                                     post.user_metadata?.name || 
                                                     post.user_email?.split('@')[0] || 
                                                     "Anonymous"}
                                                </p>
                                                <p className="text-[10px] text-gray-500">Just now</p>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-300 line-clamp-2">{post.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <button onClick={() => router.push('/more/social')} className="w-full mt-4 py-2 rounded-xl bg-white/5 text-xs font-medium text-gray-300 hover:bg-white/10 transition">
                            Open Social Space
                        </button>
                    </div>

                </div>

            </div>
        )}
      </main>
    </div>
  );
}
