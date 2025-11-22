import { NextResponse } from "next/server";

const API_KEY = process.env.TMDB_API_KEY;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const genres = searchParams.get("genres");

  if (!genres) {
    return NextResponse.json({ error: "Missing genres" }, { status: 400 });
  }

  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genres}&include_adult=false&sort_by=popularity.desc&api_key=${API_KEY}`;

  const res = await fetch(url);
  const data = await res.json();

  let movies = data.results || [];

  // remove movies with no poster
  movies = movies.filter((m: any) => m.poster_path);

  return NextResponse.json({ movies });
}
