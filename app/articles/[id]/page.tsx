// app/articles/[id]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Article = {
  id: string;
  title: string;
  description?: string | null;
  content?: string | null;
  url?: string | null;
  urlToImage?: string | null;
  publishedAt?: string | null;
  source?: string | null;
};

export default function ArticleDetailPage() {
  const params = useParams();
const raw = params?.id;
  const id = decodeURIComponent(Array.isArray(raw) ? raw[0] : raw || "");
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`article:${id}`);
      if (raw) {
        setArticle(JSON.parse(raw));
        return;
      }
    } catch (e) {
      console.warn("sessionStorage read failed", e);
    }
    // fallback: show minimal article with external link
    setArticle({ id, title: "Open in original source", url: decodeURIComponent(id) });
  }, [id]);

  if (!article) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <div className="text-sm text-gray-500 mb-4">{article.source} • {article.publishedAt ? new Date(article.publishedAt).toLocaleString() : ""}</div>

        {article.urlToImage && <img src={article.urlToImage} className="w-full h-64 object-cover rounded mb-6" />}

        {article.content ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        ) : (
          <div>
            <p>{article.description}</p>
            {article.url && (
              <p className="mt-4">
                Read original article:{" "}
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600">
                  Open source →
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
