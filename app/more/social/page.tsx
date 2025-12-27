"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import { Heart, Send, User, MessageSquare, Share2, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";

// Types
type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: string[]; // array of user_ids
  user_email?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    name?: string;
  };
};

export default function SocialSpacePage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch User
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  // Fetch Posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("social_posts")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching posts:", error);
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Real-time subscription
    const channel = supabase
      .channel("social_posts_channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "social_posts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
          } else if (payload.eventType === "UPDATE") {
            setPosts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? (payload.new as Post) : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setSubmitting(true);

    try {
      const { error } = await supabase.from("social_posts").insert([
        {
          user_id: user.id,
          content: newPost,
          likes: [],
          user_email: user.email,
          user_metadata: user.user_metadata,
        },
      ]);

      if (error) throw error;
      setNewPost("");
    } catch (error) {
      console.error("Error posting:", error);
      toast.error("Failed to post. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (post: Post) => {
    if (!user) return;

    const isLiked = post.likes?.includes(user.id);
    const newLikes = isLiked
      ? post.likes.filter((id) => id !== user.id)
      : [...(post.likes || []), user.id];

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, likes: newLikes } : p))
    );

    try {
      const { error } = await supabase
        .from("social_posts")
        .update({ likes: newLikes })
        .eq("id", post.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error liking post:", error);
      // Revert on error
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, likes: post.likes } : p))
      );
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
  };

  const accentText = "text-white/90";
  const glassCard = "bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl overflow-hidden";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#12081a] to-[#0a0a0a] text-white font-sans overflow-x-hidden">
      
      {/* Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1a0f1f]/40 backdrop-blur-3xl border-b border-white/5 py-8 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400">
              Social Sanctuary
            </h1>
            <p className="text-gray-400 max-w-lg font-medium text-sm">
              Connect with your inner self through the reflections of our shared community.
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
             <BackButton href="/more" variant="themed" className="scale-100" />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Create Post Section - Centered */}
        <div className="max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${glassCard} rounded-[2rem] p-8`}
          >
            <div className="flex gap-6">
               <div className="hidden sm:block">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover opacity-80" />
                      ) : (
                        <User className="w-5 h-5 text-gray-600" />
                      )}
                  </div>
               </div>
               <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share a quiet reflection..."
                    className="w-full bg-transparent text-white placeholder-gray-600 resize-none outline-none text-xl font-light min-h-[80px]"
                  />
                  
                  <AnimatePresence>
                    {newPost.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-between items-center mt-6 pt-6 border-t border-white/5"
                      >
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{newPost.length} characters</span>
                        <button
                          onClick={handlePost}
                          disabled={submitting}
                          className="bg-white text-black hover:bg-gray-200 active:scale-95 px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-xl"
                        >
                          {submitting ? "Sharing..." : "Share Post"}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </motion.div>
        </div>

        {/* Feed Section Title */}
        <div className="flex items-center gap-4 mb-10">
           <Navigation className="w-5 h-5 text-pink-500/50" />
           <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500">Community Gallery</h2>
           <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
        </div>

        {/* Feed Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
               <div className="w-8 h-8 border-2 border-white/5 border-t-white/30 rounded-full animate-spin"></div>
               <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600">Gathering reflections</p>
            </div>
          ) : posts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="text-gray-600 font-medium uppercase tracking-widest text-xs">The sanctuary is currently silent.</p>
            </motion.div>
          ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`${glassCard} rounded-[2rem] p-6 hover:bg-white/[0.07] transition-all duration-500 flex flex-col h-full`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                     <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden">
                          {post.user_metadata?.avatar_url ? (
                            <img src={post.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover opacity-80" />
                          ) : (
                            <span className="text-xs font-bold text-gray-600 uppercase">
                               {post.user_email?.[0]}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                           <h3 className="font-black text-white text-[14px] tracking-tight truncate">
                              {post.user_metadata?.full_name || 
                               post.user_metadata?.name || 
                               post.user_email?.split('@')[0]}
                           </h3>
                           <p className="text-[9px] text-gray-500 font-bold tracking-widest mt-0.5 truncate max-w-[120px]">
                             {post.user_email?.split('@')[0]}
                           </p>
                        </div>
                     </div>
                     
                     <div className="flex flex-col items-end gap-2">
                        <span className="text-[9px] font-bold text-gray-600 border border-white/5 px-2 py-0.5 rounded-md">
                           {formatTime(post.created_at)}
                        </span>
                        <motion.button 
                           whileTap={{ scale: 0.8 }}
                           onClick={() => handleLike(post)}
                           className="group/btn"
                        >
                           <Heart className={`w-3.5 h-3.5 transition-all duration-500 ${post.likes?.includes(user?.id) ? 'fill-white text-white' : 'text-gray-700 group-hover/btn:text-white/40'}`} />
                        </motion.button>
                     </div>
                  </div>

                  <p className="text-white/70 text-[15px] font-light leading-relaxed mb-6 whitespace-pre-wrap selection:bg-white/20 flex-1">
                     {post.content}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
