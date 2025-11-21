// app/api/tmdb/movies/route.ts
import { NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "TMDB_API_KEY missing" },
      { status: 500 }
    );
  }

  const queries = [
    "mental health",
    "stress relief",
    "feel good",
    "comedy",
    "funny movies",
    "uplifting",
    "positive mood",
    "wholesome"
  ];

  async function fetchMovies(q: string) {
    try {
      const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        q
      )}&include_adult=false&language=en-US&api_key=${API_KEY}`;

      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      console.log("📥 Raw TMDB response for", q, data);
      return data?.results || [];
    } catch {
      return [];
    }
  }

  // fetch all at once
  const results = await Promise.all(queries.map(fetchMovies));

  // merge all results
  let all = results.flat();

  // ❌ Remove duplicates
  const map = new Map();
  all.forEach((m) => {
    if (!map.has(m.id)) map.set(m.id, m);
  });
  all = [...map.values()];

  // ❌ Remove 18+ movies SAFELY
  const bannedWords = ["adult", "erotic", "porn", "xxx", "sex", "nsfw"];
  all = all.filter((m) => {
    if (m.adult === true) return false; // TMDB flag
    const t = (m.title || "").toLowerCase();
    const o = (m.overview || "").toLowerCase();
    return !bannedWords.some((w) => t.includes(w) || o.includes(w));
  });

  // sort by popularity
  all.sort((a, b) => b.popularity - a.popularity);

  console.log("✅ Final movie count:", all.length);

  if (!all.length) {
    return NextResponse.json(
      { error: "No movies found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ movies: all });
}
