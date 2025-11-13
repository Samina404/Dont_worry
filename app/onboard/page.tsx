"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function OnboardPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    music: "",
    likes: "",
    dislikes: "",
    trustmost: "",
    waterintake: "",
    hobby: "",
    sleephours: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData?.user) {
      setStatus("User not logged in");
      return;
    }

    const { user } = userData;

    const { error } = await supabase.from("user_onboarding").insert([
      {
        user_id: user.id,
        music: form.music,
        likes: form.likes,
        dislikes: form.dislikes,
        trustmost: form.trustmost,
        waterintake: form.waterintake,
        hobby: form.hobby,
        sleephours: form.sleephours,
      },
    ]);

    if (error) {
      console.error("Error saving data:", error);
      setStatus("Error saving data");
    } else {
      setStatus("Saved successfully!");
      router.push("/moodcheckin"); // redirect to mood check-in page
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-[90%] max-w-md bg-gray-900 p-6 rounded-2xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-1">
          Personal Information
        </h1>
        <p className="text-sm text-gray-400 text-center mb-4">
          This information is for tracking your activity.
        </p>

        {[
          ["music", "What kind of Music do you like?"],
          ["likes", "Name Some of Your Likes?"],
          ["dislikes", "Your Dislikes? (feel free to write)"],
          ["trustmost", "Who You Trust Most?"],
          ["waterintake", "How many glasses of water do you drink per day?"],
          ["hobby", "Music/Books/Movies?"],
          ["sleephours", "How Many Hours You Sleep a Day?"],
        ].map(([name, label]) => (
          <div key={name} className="mb-4">
            <label className="block mb-1 text-sm">{label}</label>
            <input
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              placeholder={label}
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full mt-2 py-2 rounded-full bg-red-600 hover:bg-red-700 transition"
        >
          Submit
        </button>

        {status && (
          <p className="text-center text-sm mt-3 text-gray-400">{status}</p>
        )}
      </form>
    </div>
  );
}
