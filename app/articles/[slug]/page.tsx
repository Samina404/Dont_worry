"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function ArticleDetail() {
  const params = useParams() as any;
  const slug = params?.slug;
  const router = useRouter();

  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    const seed: any = {
      "manage-anxiety": {
        title: "How to Manage Anxiety",
        image: "/articles/anxiety.jpg",
        content: `Breathing exercises, grounding, CBT techniques and short actionable steps... (you can replace with full content).`,
      },
      "understand-depression": {
        title: "Understanding Depression",
        image: "/articles/depression.jpg",
        content: `Depression is a medical condition... (replace with full article).`,
      },
    };

    setArticle(seed[slug] || { title: "Not found", image: "/placeholder.png", content: "" });
  }, [slug]);

  if (!article) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-3xl mx-auto">
        <button className="text-sm text-gray-400 mb-4" onClick={() => router.back()}>← Back</button>

        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        <div className="rounded overflow-hidden mb-4 border border-gray-800">
          <Image src={article.image} alt={article.title} width={1200} height={600} className="w-full h-auto object-cover" />
        </div>

        <div className="prose prose-invert max-w-none text-gray-200">
          <p>{article.content}</p>
        </div>

        <div className="mt-8">
          <h3 className="font-semibold mb-2">Related articles</h3>
          <div className="flex gap-4">
            <button className="text-sm text-gray-400">Understanding Depression</button>
            <button className="text-sm text-gray-400">Healthy Mindset Habits</button>
          </div>
        </div>
      </div>
    </div>
  );
}
