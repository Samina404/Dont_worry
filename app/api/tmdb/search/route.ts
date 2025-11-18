"use server";
import { NextResponse } from "next/server";
import { fetchFromTMDB } from "../../../../lib/tmdb";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "mental health";
    const page = url.searchParams.get("page") || "1";

    const data = await fetchFromTMDB("search/movie", { query: q, page });

    // 🚀 Filter out movies without posters
    data.results = (data.results || []).filter((m: any) => m.poster_path);

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || String(err) },
      { status: 500 }
    );
  }
}
