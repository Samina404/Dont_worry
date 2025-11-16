"use client";

import MediaGrid from "../components/MediaGrid";
import { useRouter } from "next/navigation";

const articlesSeed = [
  { id: "manage-anxiety", title: "How to Manage Anxiety", image: "/articles/anxiety.jpg", description: "Simple steps, breathing exercises & grounding techniques." },
  { id: "understand-depression", title: "Understanding Depression", image: "/articles/depression.jpg", description: "Learn symptoms, triggers & ways to support yourself." },
  { id: "habits", title: "Healthy Mindset Habits", image: "/articles/habits.jpg", description: "Build small daily habits for long-term emotional wellness." },
];

export default function ArticlesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">📰 Mental Health Articles</h1>
          <button className="text-sm text-gray-400 hover:text-white" onClick={() => router.push('/articles/see-all')}>See all</button>
        </div>

        <MediaGrid items={articlesSeed} onItemClick={(it: any) => router.push(`/articles/${it.id}`)} />
      </div>
    </div>
  );
}