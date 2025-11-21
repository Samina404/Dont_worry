"use server";

import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export async function POST(req: Request) {
  try {
    const { movieName } = await req.json();

    if (!movieName) {
      return NextResponse.json({ error: "Missing movieName" }, { status: 400 });
    }

    const query = encodeURIComponent(`${movieName} official trailer`);
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${YOUTUBE_API_KEY}&maxResults=3&type=video`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: "No trailer found" }, { status: 404 });
    }

    const officialVideo = data.items.find((v: any) =>
      v.snippet.title.toLowerCase().includes("official")
    );
    const videoId = officialVideo ? officialVideo.id.videoId : data.items[0].id.videoId;

    return NextResponse.json({ key: videoId });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
