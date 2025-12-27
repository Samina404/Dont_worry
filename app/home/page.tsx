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
    className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 rounded-[2rem] mb-4 hover:bg-white/[0.06] transition-all duration-300"
  >
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[1.5px]">
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
    className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden mb-4 cursor-pointer hover:bg-white/[0.06] transition-all duration-300 group"
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
    className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden mb-4 cursor-pointer hover:bg-white/[0.06] transition-all duration-300 group"
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
    className="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden mb-4 cursor-pointer hover:bg-white/[0.06] transition-all duration-300 group"
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

// --- Fallback Data ---
const MOCK_ARTICLES: Article[] = [
  {
    id: "mock-1",
    title: "The Architecture of a Peaceful Mind",
    description: "Explore how cognitive spatial awareness can help reduce daily anxiety and boost focus.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
    source: "Sanctuary Journal",
    type: "article"
  },
  {
    id: "mock-2",
    title: "Circadian Rhythms & Digital Wellness",
    description: "Aligning your screen time with natural light cycles for deeper, restorative sleep.",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1511295742362-92c96b504802?q=80&w=800&auto=format&fit=crop",
    source: "Wellness Tech",
    type: "article"
  }
];

const MOCK_MUSIC: MusicVideo[] = [
  {
    id: "jfKfPfyJRdk",
    title: "Deep Focus: Lofi Beats for Study & Meditation",
    thumbnail: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&auto=format&fit=crop",
    type: "music"
  },
  {
    id: "5qap5aO4i9A",
    title: "Ambient Zen: Ethereal Sounds for Sleep",
    thumbnail: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?q=80&w=800&auto=format&fit=crop",
    type: "music"
  }
];

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

      // 1. Check Mood Check-in status FIRST
      const { data: moodData } = await supabase
        .from("user_moods")
        .select("created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      const lastMoodDate = moodData?.[0]?.created_at
        ? new Date(moodData[0].created_at)
        : null;

      const today = new Date().toISOString().split("T")[0];

      if (!lastMoodDate || lastMoodDate.toISOString().split("T")[0] !== today) {
        router.push("/moodcheckin");
        return;
      }

      // 2. Continue with other data fetching
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
        if (data.articles && data.articles.length > 0) {
          articles = data.articles.map((a: any) => ({ ...a, id: a.url, type: "article" as const }));
        } else {
          articles = MOCK_ARTICLES;
        }
      } catch (e) { 
        console.error("Error fetching articles", e);
        articles = MOCK_ARTICLES;
      }

      // 3. Fetch Music
      let music: MusicVideo[] = [];
      try {
        const res = await fetch(`/api/youtube?q=${encodeURIComponent("calm music")}`);
        const data = await res.json();
        if (data.videos && data.videos.length > 0) {
          music = data.videos.slice(0, 5).map((v: any) => ({ ...v, type: "music" as const }));
        } else {
          music = MOCK_MUSIC;
        }
      } catch (e) { 
        console.error("Error fetching music", e);
        music = MOCK_MUSIC;
      }


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
      <div className="min-h-screen bg-[#07040e] text-white flex flex-col justify-center items-center gap-6">
        <div className="relative">
           <div className="w-12 h-12 border-b-2 border-pink-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500/30 animate-pulse">Loading the page </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#07040e] text-white font-sans pb-20 md:pb-8 relative overflow-hidden">
      
      {/* 🌌 ATMOSPHERIC SANCTUARY BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Radiant Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]" />
        
        {/* Dynamic Orbs */}
        <motion.div 
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-pink-500/[0.07] rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 60, 0], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -left-1/4 w-[80%] h-[80%] bg-blue-600/[0.07] rounded-full blur-[140px]" 
        />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 w-full flex justify-between items-center px-4 md:px-8 py-6 bg-[#07040e]/80 backdrop-blur-[40px] border-b border-white/[0.03]">
        <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400 hidden md:block">
          Don’t Worry
        </h1>

        <nav className="flex gap-6 md:gap-8 text-gray-400 mx-auto md:mx-0">
          <div className="flex flex-col items-center gap-1 cursor-pointer text-white group" onClick={() => router.push("/home")}>
            <Home size={22} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] font-medium group-hover:text-pink-400 transition-colors duration-200">Home</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors group" onClick={() => router.push("/music")}>
            <Music size={22} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] font-medium group-hover:text-pink-400 transition-colors duration-200">Music</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors group" onClick={() => router.push("/movies")}>
            <Film size={22} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] font-medium group-hover:text-pink-400 transition-colors duration-200">Movies</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors group" onClick={() => router.push("/articles")}>
            <Newspaper size={22} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] font-medium group-hover:text-pink-400 transition-colors duration-200">Reads</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white transition-colors group" onClick={() => router.push("/more")}>
            <MoreHorizontal size={22} className="group-hover:scale-110 transition-transform duration-200" />
            <span className="text-[10px] font-medium group-hover:text-pink-400 transition-colors duration-200">More</span>
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
            
            <div 
                className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer"
                onClick={() => router.push("/profile")}
            >
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
      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-12">
        {loading ? (
             <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-pink-500 rounded-full animate-spin"></div>
             </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LEFT COLUMN (Music & Articles) - Spans 3 cols */}
                <div className="lg:col-span-3 flex flex-col gap-6">
                    
                    {/* Music Widget */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5 flex flex-col h-[400px] md:h-[460px] shadow-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl text-white tracking-tight">Musics for you</h3>
                            <button onClick={() => router.push('/music')} className="text-[10px] font-black uppercase tracking-widest text-pink-400 hover:text-white transition-colors">Listen All</button>
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
                    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl text-white tracking-tight">Insights</h3>
                            <button onClick={() => router.push('/articles')} className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors">Read More</button>
                        </div>
                        <div className="space-y-4">
                             {feed.filter(i => i.type === 'article').slice(0, 3).map((article: any) => (
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
                    <div className="relative h-[350px] md:h-[500px] rounded-[3rem] overflow-hidden group shadow-2xl">
                        <img 
                            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?q=80&w=1000&auto=format&fit=crop" 
                            alt="Nature" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0616] via-[#0b0616]/20 to-transparent" />
                        
                        <div className="absolute top-8 left-8">
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                                Daily Sanctuary
                            </span>
                        </div>

                        <div className="absolute bottom-8 left-8 right-8">
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                                Find clarity in <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">the chaos.</span>
                            </h2>
                            <p className="text-gray-300 text-sm mb-6 max-w-md">
                                Take a moment to breathe. Your mental health is a priority, not an option.
                            </p>
                            <button onClick={() => router.push('/moodcheckin')} className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-pink-500/20">
                                <PlayCircle className="w-6 h-6 text-white fill-white" />
                            </button>
                        </div>
                    </div>

                    {/* Daily Quotes */}
                    <div className="flex flex-col gap-4 flex-1">
                        <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:bg-white/[0.06] transition-all duration-500">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                             <Quote className="w-8 h-8 text-pink-500/10 absolute top-8 right-8" />
                             <p className="text-xl font-serif font-medium text-white/90 leading-relaxed italic pr-12">"The only way to do great work is to love what you do."</p>
                             <div className="flex items-center gap-3 mt-6">
                                <div className="h-px w-6 bg-pink-500/30"></div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Steve Jobs</p>
                             </div>
                        </div>
                         <div className="bg-white/[0.03] backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group hover:bg-white/[0.06] transition-all duration-500">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                             <Quote className="w-8 h-8 text-blue-500/10 absolute top-8 right-8" />
                             <p className="text-xl font-serif font-medium text-white/90 leading-relaxed italic pr-12">"Believe you can and you're halfway there."</p>
                             <div className="flex items-center gap-3 mt-6">
                                <div className="h-px w-6 bg-blue-500/30"></div>
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Theodore Roosevelt</p>
                             </div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN (Stats & Social) - Spans 4 cols */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    
                    {/* Mood Stats Widget (Enhanced) */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group flex-shrink-0">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                                    <p className="text-xs text-pink-400 uppercase tracking-wider font-bold">Mood Analysis</p>
                                </div>
                                <h3 className="text-3xl font-bold text-white">Positive <span className="text-gray-500 text-lg font-normal">+12%</span></h3>
                            </div>
                            <button 
                                onClick={() => router.push('/moodhistory')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full transition-colors group"
                            >
                                <span className="text-xs font-medium text-gray-400 group-hover:text-white">History</span>
                                <TrendingUp className="w-4 h-4 text-pink-400" />
                            </button>
                        </div>
                        
                        {/* Attractive Line Chart Style */}
                        <div className="h-40 w-full relative z-10">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                                {/* Gradient Defs */}
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Area */}
                                <path d="M0,50 L0,30 C10,35 20,20 30,25 S50,5 60,15 S80,30 100,20 L100,50 Z" fill="url(#chartGradient)" />
                                {/* Line */}
                                <path d="M0,30 C10,35 20,20 30,25 S50,5 60,15 S80,30 100,20" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" />
                                {/* Points */}
                                <circle cx="30" cy="25" r="2" fill="#fff" stroke="#ec4899" strokeWidth="1" />
                                <circle cx="60" cy="15" r="2" fill="#fff" stroke="#ec4899" strokeWidth="1" />
                                <circle cx="100" cy="20" r="3" fill="#fff" stroke="#ec4899" strokeWidth="2" />
                                
                                {/* Tooltip-like label */}
                                <g transform="translate(75, 0)">
                                    <rect x="0" y="0" width="25" height="12" rx="4" fill="#ec4899" />
                                    <text x="12.5" y="8" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">85%</text>
                                </g>
                            </svg>
                        </div>
                        
                        <div className="flex justify-between mt-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest px-1">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    {/* Social Feed Widget */}
                    <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 flex-1 min-h-[320px] flex flex-col relative overflow-hidden">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-xl text-white tracking-tight">Community</h3>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Online</span>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
                            {feed.filter(i => i.type === 'post').length === 0 ? (
                                <p className="text-gray-500 text-sm text-center py-4">No recent posts</p>
                            ) : (
                                feed.filter(i => i.type === 'post').slice(0, 3).map((post: any) => (
                                    <div key={post.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                                        <div className="flex gap-3 mb-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 p-[1px] flex-shrink-0">
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
