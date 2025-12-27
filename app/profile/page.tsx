"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3, LogOut, Activity, FileText, Layout } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);

      const { data: profile, error: profileError } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Error fetching profile:", profileError);
      }
      
      setOnboardingData(profile);
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const handleEditClick = () => {
    setEditForm(onboardingData || {});
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("user_onboarding")
        .upsert({
          user_id: user.id,
          music: editForm.music || "",
          hobby: editForm.hobby || "",
          likes: editForm.likes || "",
          dislikes: editForm.dislikes || "",
          trustmost: editForm.trustmost || "",
          waterintake: editForm.waterintake || "",
          sleephours: editForm.sleephours || "",
          updated_at: new Date().toISOString(),
        }, { 
          onConflict: 'user_id' 
        });

      if (error) throw error;
      
      // Re-fetch to confirm it's saved and update state
      const { data: updatedProfile } = await supabase
        .from("user_onboarding")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setOnboardingData(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error("Error updating profile: " + err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";
  const avatar = user?.user_metadata?.avatar_url || null;

  return (
    <div className="min-h-screen bg-[#07040e] text-white font-sans pb-20 md:pb-8 relative overflow-hidden">
      {/* 🌌 ATMOSPHERIC BACKGROUND */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),transparent_70%)]" />
        <motion.div 
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] bg-pink-500/[0.07] rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button onClick={() => router.push("/home")} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all flex items-center gap-2 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest hidden md:block">Back Home</span>
          </button>
          
          <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-white to-yellow-400">
            My Sanctuary
          </h1>

          <button 
            onClick={handleLogout}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl border border-red-500/10 transition-all flex items-center gap-2 group"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-widest hidden md:block">Sign Out</span>
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* USER PROFILE CARD (Left/Top) */}
          <div className="md:col-span-4 lg:col-span-3">
             <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500/50 to-transparent" />
                
                <div className="relative w-32 h-32 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 mb-6 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                    {avatar ? (
                      <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-4xl font-black text-gray-500 uppercase">{name[0]}</div>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl font-black tracking-tight text-white mb-1">{name}</h2>
                <p className="text-gray-500 text-xs font-medium mb-8 break-all">{user?.email}</p>

                <div className="w-full space-y-3">
                   <button 
                    onClick={() => router.push("/moodhistory")}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-gray-200 transition-all shadow-xl shadow-white/5 active:scale-95"
                  >
                    <Activity className="w-4 h-4" />
                    My Activity
                  </button>
                  <button 
                    onClick={() => router.push("/profile/posts")}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                  >
                    <FileText className="w-4 h-4" />
                    My Posts
                  </button>
                   <button 
                    onClick={() => router.push("/more/chat")}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-400 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all active:scale-95"
                  >
                    <Layout className="w-4 h-4" />
                    Personal Space
                  </button>
                </div>
             </div>
          </div>

          {/* PERSONAL INFORMATION (Right/Center) */}
          <div className="md:col-span-8 lg:col-span-9 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl relative overflow-hidden">
             <div className="flex items-center justify-between mb-10">
                <div className="space-y-1">
                   <h2 className="text-2xl font-black tracking-tighter text-white">Identity & Wellness</h2>
                   <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em]">Personalized Sanctuary Settings</p>
                </div>

                {!isEditing ? (
                  <button 
                    onClick={handleEditClick}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all group"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-pink-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-white">Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { label: "Favorite Music Type", key: "music", icon: "🎵" },
                  { label: "Favorite Book/Movie", key: "hobby", icon: "📚" },
                  { label: "Likes", key: "likes", icon: "✨" },
                  { label: "Dislikes", key: "dislikes", icon: "🚫" },
                  { label: "Trustworthy Person", key: "trustmost", icon: "🤝" },
                  { label: "Water Intake", key: "waterintake", suffix: " Glass", icon: "💧" },
                  { label: "Sleep", key: "sleephours", suffix: " Hours", icon: "🌙" },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col group p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-xl">{item.icon}</span>
                       <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-pink-500 transition-colors">{item.label}</span>
                    </div>
                    
                    {isEditing ? (
                      <input 
                        type="text"
                        value={editForm[item.key] || ""}
                        onChange={(e) => setEditForm({ ...editForm, [item.key]: e.target.value })}
                        className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-pink-500/50 focus:bg-black/60 transition-all text-sm font-medium"
                        placeholder={`Your ${item.label.toLowerCase()}...`}
                      />
                    ) : (
                      <p className="text-white font-bold text-lg leading-tight group-hover:text-pink-100 transition-colors">
                        {onboardingData?.[item.key] ? `${onboardingData[item.key]}${item.suffix || ""}` : "Not specified"}
                      </p>
                    )}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>

  );
}
