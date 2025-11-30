"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

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

const DEFAULT_QUERY = "mental health OR meditation OR mindfulness";

const CATEGORIES: { key: string; label: string }[] = [
  { key: "", label: "All" },
  { key: "health", label: "Health" },
  { key: "science", label: "Science" },
  { key: "technology", label: "Tech" },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [totalResults, setTotalResults] = useState<number | null>(null);

  const fetchArticles = useCallback(
    async (opts: { reset?: boolean; q?: string; p?: number; cat?: string } = {}) => {
      const reset = opts.reset ?? false;
      const q = opts.q ?? query;
      const p = opts.p ?? (reset ? 1 : page);
      const cat = opts.cat ?? category;

      setLoading(true);
      try {
        const url = new URL("/api/news", window.location.origin);
        url.searchParams.set("q", q);
        url.searchParams.set("page", String(p));
        url.searchParams.set("pageSize", String(pageSize));
        if (cat) url.searchParams.set("category", cat);

        const res = await fetch(url.toString());
        const data = await res.json();

        if (data.error) {
          console.error("News API error:", data.error);
          setLoading(false);
          return;
        }

        if (reset) setArticles(data.articles || []);
        else setArticles((prev) => [...prev, ...(data.articles || [])]);

        setTotalResults(data.totalResults ?? null);
        setPage(p);
      } catch (err) {
        console.error("Failed to load articles", err);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, query, category]
  );

  useEffect(() => {
    fetchArticles({ reset: true, q: query, p: 1 });
  }, []); // eslint-disable-line

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    setArticles([]);
    setPage(1);
    fetchArticles({ reset: true, q: query, p: 1 });
  };

  const onCategory = (cat: string) => {
    setCategory(cat);
    setArticles([]);
    setPage(1);
    fetchArticles({ reset: true, q: query, p: 1, cat });
  };

  const loadMore = () => {
    if (loading) return;
    fetchArticles({ reset: false, q: query, p: page + 1 });
  };

  const hero = articles[0];

  const bg = "bg-[#3b234a] text-white";
  const neon = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  const cardBg = "bg-[#1a0f1f] rounded-2xl shadow-2xl border border-pink-400/20";
  const buttonActive = "bg-gradient-to-r from-pink-400 to-yellow-400 text-black shadow-lg";
  const buttonInactive = "bg-[#1a0f1f] text-gray-300 border border-purple-700 hover:bg-purple-700/50";

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`animate-pulse ${cardBg} h-64`} />
      ))}
    </div>
  );

  const openArticle = (a: Article) => {
    if (a.url) window.open(a.url, "_blank");
  };

  return (
    <div className={`${bg} min-h-screen p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className={`text-4xl font-bold ${neon}`}>Wellness & Mindfulness</h1>
            <p className="mt-1 text-gray-300">
              Latest articles, guides and expert tips for calm, focus and mental peace.
            </p>
          </div>
          <BackButton variant="themed" />
        </header>

        {/* Search & categories */}
        <form onSubmit={onSearch} className="flex gap-3 mb-6 backdrop-blur-md bg-[#3b234a]/50 p-4 rounded-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles (e.g. meditation, anxiety, mindfulness)..."
            className="flex-1 rounded-lg border border-purple-700 px-4 py-3 bg-[#1a0f1f] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          />
          <button className="px-4 py-3 rounded-lg bg-gradient-to-r from-pink-400 to-yellow-400 text-black font-semibold hover:opacity-90 transition">
            Search
          </button>
        </form>

        <div className="flex gap-3 mb-8 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.key || "all"}
              onClick={() => onCategory(c.key)}
              className={`px-3 py-2 rounded-lg font-medium transition ${category === c.key ? buttonActive : buttonInactive}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* HERO ARTICLE */}
        {hero && !loading && (
          <section className="mb-10">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <div className="lg:col-span-2">
                <div onClick={() => openArticle(hero)} className={`cursor-pointer overflow-hidden ${cardBg}`}>
                  {hero.urlToImage ? (
                    <img src={hero.urlToImage} alt={hero.title} className="w-full h-80 object-cover" />
                  ) : (
                    <div className="w-full h-80 bg-[#2a254b] flex items-center justify-center">No image</div>
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold mb-2">{hero.title}</h2>
                    <p className="text-gray-300">{hero.description}</p>
                    <div className="mt-3 text-sm text-gray-400">
                      {hero.source && <span>{hero.source} • </span>}
                      {hero.publishedAt && <span>{new Date(hero.publishedAt).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                {articles.slice(1, 5).map((a) => (
                  <div key={a.id} onClick={() => openArticle(a)} className={`p-3 cursor-pointer ${cardBg}`}>
                    <div className="flex gap-3">
                      {a.urlToImage ? (
                        <img src={a.urlToImage} alt={a.title} className="w-24 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-24 h-16 bg-[#2a254b] rounded" />
                      )}
                      <div>
                        <h4 className="text-sm font-semibold">{a.title}</h4>
                        <p className="text-xs text-gray-400">{a.source} • {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </aside>
            </motion.div>
          </section>
        )}

        {/* GRID */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(5).map((a) => (
              <article key={a.id} className={`${cardBg}`}>
                <div className="cursor-pointer" onClick={() => openArticle(a)}>
                  {a.urlToImage ? (
                    <img src={a.urlToImage} alt={a.title} className="w-full h-48 object-cover rounded-t-2xl" />
                  ) : (
                    <div className="w-full h-48 bg-[#2a254b] rounded-t-2xl flex items-center justify-center">No image</div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-white">{a.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{a.description}</p>
                    <div className="text-xs text-gray-400">
                      {a.source} • {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ""}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {totalResults !== null && articles.length < totalResults ? (
              <button onClick={loadMore} className="px-6 py-3 bg-gradient-to-r from-pink-400 to-yellow-400 text-black rounded-xl shadow-lg hover:opacity-90 transition">
                {loading ? "Loading..." : "Load More"}
              </button>
            ) : (
              <div className="text-gray-400 mt-4">No more articles</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
