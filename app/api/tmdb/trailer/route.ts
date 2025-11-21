// app/api/tmdb/trailer/route.ts
"use server";

import { NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export async function POST(req: Request) {
  try {
    const { movieId } = await req.json();

    if (!movieId) {
      return NextResponse.json({ error: "Missing movieId" }, { status: 400 });
    }

    // Try multiple languages (TMDB sometimes stores only in one)
    const LANGS = ["en-US", "en", ""];

    let allVideos: any[] = [];

    for (const lang of LANGS) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=${lang}`;

      console.log("🔍 Checking:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("TMDB video results for", movieId, lang, ":", data.results?.length);

      if (data.results?.length) {
        allVideos = data.results;
        break;
      }
    }

    if (!allVideos.length) {
      console.log("❌ No trailer found for:", movieId);
      return NextResponse.json({ error: "No trailer found" }, { status: 404 });
    }

    const trailer =
      allVideos.find((v: any) => v.type === "Trailer" && v.site === "YouTube") ||
      allVideos.find((v: any) => v.type === "Teaser" && v.site === "YouTube");

    if (!trailer) {
      console.log("❌ Trailer not found in results:", allVideos);
      return NextResponse.json({ error: "No YouTube trailer" }, { status: 404 });
    }

    return NextResponse.json({ key: trailer.key });
  } catch (e: any) {
    console.error("Trailer API error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
