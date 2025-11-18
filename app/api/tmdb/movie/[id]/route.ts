"use server";

import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not set in environment variables!");
}

// Utility function to fetch from TMDB
async function fetchFromTMDB<T>(endpoint: string): Promise<T> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `https://api.themoviedb.org/3/${endpoint}${separator}api_key=${TMDB_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`TMDB API error ${res.status}: ${text}`);
  }
  return res.json();
}

// TypeScript interface for basic TMDB movie data (optional)
interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string | null;
  release_date?: string;
  genres?: { id: number; name: string }[];
  [key: string]: any;
}

// GET handler
export async function GET(_: Request, { params }: any) {
  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing movie ID" }, { status: 400 });
    }

    const data: TMDBMovie = await fetchFromTMDB(`movie/${id}?language=en-US`);

    // Return data exactly as received from TMDB
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("TMDB API route error:", err.message);
    return NextResponse.json(
      { error: err.message || "Unknown error fetching movie" },
      { status: 400 }
    );
  }
}
