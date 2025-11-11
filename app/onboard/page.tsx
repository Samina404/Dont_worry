"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/"); // not logged in → landing page
        return;
      }

      setUser(data.user);

      // Check if profile already exists
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileData) {
        // If profile exists, redirect to home
        router.push("/home");
        return;
      }

      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleSubmit = async () => {
    if (!name || !location) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const updates = {
        id: user.id,
        full_name: name,
        location: location,
        preferences: preferences || null,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates);
      if (error) throw error;

      router.push("/home"); // redirect to home after onboarding
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black text-white flex justify-center items-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-6">Complete Your Profile</h1>

      <div className="w-full max-w-md p-6 rounded-xl bg-gray-900 shadow-lg flex flex-col">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded mb-4 text-black"
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 rounded mb-4 text-black"
        />
        <input
          type="text"
          placeholder="Preferences (optional)"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          className="w-full px-4 py-2 rounded mb-4 text-black"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-white text-black py-2 rounded font-semibold hover:bg-gray-200 transition"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
