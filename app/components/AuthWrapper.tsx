"use client";

import { useEffect, useState, ReactNode } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface AuthWrapperProps {
  children: ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const user = data?.user;

      if (error || !user) {
        router.push("/login"); // redirect if not logged in
        return;
      }

      // Check if user has completed onboarding
      const { data: profile } = await supabase
        .from("profiles") // optional table if you track onboarding
        .select("onboarded")
        .eq("id", user.id)
        .single();

      if (!profile || !profile.onboarded) {
        router.push("/onboarding"); // new user
        return;
      }

      // Check if mood submitted today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data: mood } = await supabase
        .from("user_moods")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString())
        .limit(1)
        .single();

      if (!mood) {
        router.push("/moodcheck"); // redirect to MoodCheck if not done today
        return;
      }

      setLoading(false); // all checks passed, render children
    };

    checkUser();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return <>{children}</>;
}
