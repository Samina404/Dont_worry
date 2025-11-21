import { NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(_: Request, { params }: any) {
  try {
    const { id } = params;

    if (!id)
      return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const url = `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.status_message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
