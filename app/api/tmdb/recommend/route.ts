"use server";

import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// TMDB API helper
async function tmdb(endpoint: string) {
  const url = `https://api.themoviedb.org/3/${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=${TMDB_API_KEY}&language=en-US`;

  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text(); // TMDB might return HTML if broken
    console.error("TMDB Error Response:", text);
    throw new Error(`TMDB error: ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    const keywordQuery =
      "mental health, mental, mindfulness, relax, calm, peace, stress relief";

    // FIXED: must use ?query= not &query=
    const keywordResults = await tmdb(
      `search/movie?query=${encodeURIComponent(keywordQuery)}`
    );

    // Comedy = genre 35
    const comedyResults = await tmdb("discover/movie?with_genres=35");

    // Merge + dedupe
    const combined = [
      ...keywordResults.results,
      ...comedyResults.results,
    ];

    const unique = combined.filter(
      (v, i, arr) => arr.findIndex((t) => t.id === v.id) === i
    );

    return NextResponse.json(unique);
  } catch (e: any) {
    const msg = e instanceof Error ? e.message : "Unknown server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
