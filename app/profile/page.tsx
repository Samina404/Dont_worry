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
    <div className="min-h-screen bg-black text-white font-sans max-w-lg mx-auto pb-10 flex flex-col relative">
      {/* Header */}
      <div className="p-6 flex items-center">
        <button onClick={() => router.push("/home")} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center px-6 mb-8">
        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/20 mb-6 bg-gray-800 flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="text-4xl font-bold text-gray-500 uppercase">{name[0]}</div>
          )}
        </div>
        <h1 className="text-2xl font-bold mb-1 tracking-tight">{name}</h1>
        <p className="text-gray-500 text-sm mb-8">{user?.email}</p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mb-4">
          <button 
            onClick={() => router.push("/moodhistory")}
            className="flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            <Activity className="w-4 h-4" />
            My Activity
          </button>
          <button 
            onClick={() => router.push("/profile/posts")}
            className="flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
          >
            <FileText className="w-4 h-4" />
            My Post
          </button>
        </div>
        <button 
          onClick={() => router.push("/more/chat")}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors"
        >
          <Layout className="w-4 h-4" />
          Personal Space
        </button>
      </div>

      {/* Personal Information */}
      <div className="px-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Personal Information</h2>
          {!isEditing ? (
            <button 
              onClick={handleEditClick}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Edit3 className="w-5 h-5 text-gray-400" />
            </button>
          ) : (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 text-xs font-bold bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-3 py-1 text-xs font-bold bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20"
              >
                Save
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6 text-[15px]">
          {[
            { label: "Favorite Music Type", key: "music" },
            { label: "Favorite Book/Movie", key: "hobby" },
            { label: "Likes", key: "likes" },
            { label: "Dislikes", key: "dislikes" },
            { label: "Trustworthy Person", key: "trustmost" },
            { label: "Water Intake", key: "waterintake", suffix: " Glass" },
            { label: "Sleep", key: "sleephours", suffix: " Hours" },
          ].map((item) => (
            <div key={item.key} className="flex flex-col">
              <span className="text-gray-400 font-medium mb-1">{item.label}</span>
              {isEditing ? (
                <input 
                  type="text"
                  value={editForm[item.key] || ""}
                  onChange={(e) => setEditForm({ ...editForm, [item.key]: e.target.value })}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-3 outline-none focus:border-pink-500/50 focus:bg-white/[0.05] transition-all text-sm"
                  placeholder={`Enter ${item.label.toLowerCase()}...`}
                />
              ) : (
                <span className="text-white font-semibold">
                  {onboardingData?.[item.key] ? `${onboardingData[item.key]}${item.suffix || ""}` : "Not specified"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 mt-auto">
        <button 
          onClick={handleLogout}
          className="w-full py-4 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </div>
  );
}
