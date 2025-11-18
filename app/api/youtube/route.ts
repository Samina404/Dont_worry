// app/api/youtube/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "calm music";
    const maxResults = Number(searchParams.get("maxResults") || "12");
    const pageToken = searchParams.get("pageToken") || undefined;

    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing server YOUTUBE_API_KEY" },
        { status: 500 }
      );
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("q", q);
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("key", API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString());
    const data = await res.json();

    // If YouTube throws an error, forward it
    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    // 🟣 FIX: Transform API response → frontend-friendly
    const videos = (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    return NextResponse.json({
      videos,
      nextPageToken: data.nextPageToken || null,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
