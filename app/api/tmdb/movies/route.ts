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

  // 🎯 Genres for mental health + feel-good movies
  const GENRES = [
    35,  // Comedy
    18,  // Drama (light / emotional)
    10751, // Family
    16,  // Animation
    10749, // Romance
    12, // Adventure
  ];

  async function fetchGenre(genreId: number) {
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&include_adult=false&language=en-US&sort_by=popularity.desc`;

      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      return data?.results || [];
    } catch {
      return [];
    }
  }

  // ⏳ Fetch from all genres at same time
  const results = await Promise.all(GENRES.map(fetchGenre));

  // 🔄 Merge all
  let all = results.flat();

  // 🧹 Remove duplicates
  const map = new Map();
  all.forEach((m) => {
    if (!map.has(m.id)) map.set(m.id, m);
  });
  all = [...map.values()];

  // 🧹 Remove movies without posters
  all = all.filter((m) => m.poster_path);

  // 🚫 Remove 18+ movies + banned keywords
  const bannedWords = ["adult", "erotic", "porn", "xxx", "sex", "nsfw"];
  all = all.filter((m) => {
    if (m.adult === true) return false;
    const t = (m.title || "").toLowerCase();
    const o = (m.overview || "").toLowerCase();
    return !bannedWords.some((w) => t.includes(w) || o.includes(w));
  });

  // ⭐ Sort by popularity
  all.sort((a, b) => b.popularity - a.popularity);

  console.log("🎉 Final movie count:", all.length);

  if (!all.length) {
    return NextResponse.json(
      { error: "No movies found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ movies: all });
}
