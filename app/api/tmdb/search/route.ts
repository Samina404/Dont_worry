// app/api/tmdb/search/route.ts
import { NextResponse } from "next/server";
import { fetchFromTMDB } from "../_lib";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const query = url.searchParams.get("q") || "";
    const page = url.searchParams.get("page") || "1";

    if (!query) {
      return NextResponse.json({ error: "Missing q parameter" }, { status: 400 });
    }

    const data = await fetchFromTMDB("search/movie", {
      query,
      page,
      include_adult: false,
    });

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Search route error:", err.message ?? err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
