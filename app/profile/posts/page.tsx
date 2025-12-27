"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabaseClient";
import { Heart, ArrowLeft, User, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Post = {
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
};

export default function MyPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
        return;
      }
      setUser(data.user);

      const { data: userPosts, error } = await supabase
        .from("social_posts")
        .select("*")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      if (userPosts) {
        setPosts(userPosts);
      }
      setLoading(false);
    };

    init();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reflection?")) return;

    const { error } = await supabase.from("social_posts").delete().eq("id", id);
    if (!error) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans p-6 max-w-2xl mx-auto">
      <header className="flex items-center gap-4 mb-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">My Reflections</h1>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading your journey</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">You haven't shared any reflections yet.</p>
          <button 
            onClick={() => router.push("/more/social")}
            className="mt-4 text-pink-500 font-bold hover:underline"
          >
            Go to Social Space
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:bg-white/[0.08] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    {formatTime(post.created_at)}
                  </span>
                  <button 
                    onClick={() => handleDelete(post.id)}
                    className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-white/80 font-light leading-relaxed mb-6 whitespace-pre-wrap">
                  {post.content}
                </p>
                <div className="flex items-center gap-2 text-pink-500">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold">{post.likes?.length || 0} Likes</span>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
