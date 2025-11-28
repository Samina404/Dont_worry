"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import { ArrowLeft, Heart, Send, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
type Post = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  likes: string[]; // array of user_ids
  user_email?: string; // We might store this or fetch it
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
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
      alert("Failed to post. Please try again.");
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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans pb-20 md:pb-0">
      {/* Top Navigation Bar - Glassmorphic */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/more" className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <h1 className="text-lg font-bold tracking-wide">Social Space</h1>
        </div>
      </header>

      <div className="max-w-xl mx-auto">
        {/* Create Post Section - Refined */}
        <div className="p-4 border-b border-white/10 bg-black">
          <div className="flex gap-4">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px] flex-shrink-0">
              <div className="w-full h-full rounded-full bg-black p-[2px] overflow-hidden">
                 {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="User" className="w-full h-full object-cover rounded-full" />
                 ) : (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-400" />
                    </div>
                 )}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none text-[15px] min-h-[60px] py-2"
              />
              <AnimatePresence>
                {newPost && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="flex justify-end overflow-hidden"
                  >
                    <button
                      onClick={handlePost}
                      disabled={submitting}
                      className="bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed px-5 py-1.5 rounded-full text-sm font-semibold transition-all"
                    >
                      {submitting ? "Posting..." : "Post"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="pb-20">
          {loading ? (
            <div className="flex justify-center py-12">
               <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              <p className="text-lg font-medium text-gray-400">No posts yet</p>
              <p className="text-sm mt-2 text-gray-600">Start the conversation!</p>
            </div>
          ) : (
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="border-b border-white/5 p-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px] cursor-pointer">
                      <div className="w-full h-full rounded-full bg-black p-[1.5px] overflow-hidden">
                        {post.user_metadata?.avatar_url ? (
                          <img
                            src={post.user_metadata.avatar_url}
                            alt="User"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-400">
                              {post.user_email?.[0].toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content & Like Button */}
                  <div className="flex-1 flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-[15px] cursor-pointer hover:underline decoration-white/30 underline-offset-4 truncate">
                          {post.user_metadata?.full_name ||
                            post.user_metadata?.name ||
                            post.user_email?.split("@")[0] ||
                            "Anonymous"}
                        </h3>
                        <span className="text-[13px] text-gray-500 flex-shrink-0">
                          • {formatTime(post.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-200 text-[15px] leading-relaxed whitespace-pre-wrap break-words font-light">
                        {post.content}
                      </p>
                    </div>

                    {/* Like Button */}
                    <div className="flex flex-col items-center gap-1 pt-1 pl-2">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => handleLike(post)}
                        className="group focus:outline-none p-2 -mr-2 rounded-full hover:bg-white/5 transition-colors"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all duration-300 ${
                            post.likes?.includes(user?.id)
                              ? "text-red-500 fill-red-500 scale-110"
                              : "text-gray-500 group-hover:text-gray-300"
                          }`}
                        />
                      </motion.button>
                      {post.likes?.length > 0 && (
                        <span className="text-[11px] font-medium text-gray-500">
                          {post.likes.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
