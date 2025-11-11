"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient"; // adjust path

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login"); // redirect if not logged in
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return <div className="min-h-screen bg-black"></div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.email}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-600 px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
