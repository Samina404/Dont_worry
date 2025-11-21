// app/api/tmdb/_lib.ts
import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) {
  // Fail fast on dev if missing
  console.error("TMDB_API_KEY not set in environment variables.");
}

export async function fetchFromTMDB(endpoint: string, params: Record<string, any> = {}) {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is not configured on the server.");
  }

  const base = "https://api.themoviedb.org/3";
  const url = new URL(`${base}/${endpoint}`);

  // Add params
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
  });

  url.searchParams.set("api_key", TMDB_API_KEY);
  // prefer english for consistent fields
  if (!url.searchParams.get("language")) url.searchParams.set("language", "en-US");

  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB API error ${res.status}: ${text}`);
  }
  return res.json();
}
