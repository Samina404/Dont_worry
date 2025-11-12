"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function OnboardPage() {
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus("Saving...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

console.log("User:", user);

    if (!user) {
      setStatus("User not logged in");
      return;
    }

    const { error } = await supabase.from("user_onboarding").insert([
      {
        user_id: user.id,
        ...form,
      },
    ]);

    if (error) {
    console.error("Error saving data:", error.message, error.details);

      setStatus("Error saving data.");
    } else {
      setStatus("✅ Data saved successfully!");
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
              value={(form as any)[name]}
              onChange={handleChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
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
