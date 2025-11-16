"use server";

import { NextResponse } from "next/server";
import { fetchFromTMDB } from "../../../../lib/tmdb";

export async function GET(req: Request) {
  try {
    console.log("🔍 Search API called:", req.url);

    const url = new URL(req.url);
    const q = url.searchParams.get("q") || "mental health";
    const page = url.searchParams.get("page") || "1";

    console.log("Query:", q, "Page:", page);

    const data = await fetchFromTMDB("search/movie", { query: q, page });

    console.log("TMDB Response OK");
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("⚠️ API ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
