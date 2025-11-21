import { NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("🔥 API ROUTE HIT: /api/tmdb/movie/[id]");

  try {
    const resolvedParams = await context.params;

    console.log("📌 Raw params =", resolvedParams);

    const id = resolvedParams.id;

    console.log("🎯 Extracted id =", id);

    if (!id) {
      console.error("❌ ERROR: params.id is missing!");
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits`;

    console.log("🌐 TMDB Request URL =", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("📥 TMDB response status =", res.status);
    console.log("📦 TMDB data =", data);

    if (!res.ok) {
      console.error("❌ TMDB Error:", data);
      return NextResponse.json(
        { error: data.status_message || "TMDB request failed" },
        { status: 500 }
      );
    }

    console.log("✅ SUCCESS: Returning movie detail");
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("💥 SERVER CRASHED:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
