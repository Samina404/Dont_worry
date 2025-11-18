"use server";
import { NextResponse } from "next/server";
import { fetchFromTMDB } from "../../../../lib/tmdb";
import { moodMap } from "../../../components/MoodGenreMap";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const movieId = url.searchParams.get("id");
    const mood = url.searchParams.get("mood") || "";

    if (!movieId) {
      return NextResponse.json({ error: "Missing movie id" }, { status: 400 });
    }

    // Similar
    const similar = await fetchFromTMDB(`movie/${movieId}/similar`);
    // Detail (for genres)
    const detail = await fetchFromTMDB(`movie/${movieId}`);
    const genreId = detail.genres?.[0]?.id;

    // Genre Movies
    let genreMovies = [];
    if (genreId) {
      genreMovies = await fetchFromTMDB("discover/movie", {
        with_genres: genreId,
        sort_by: "popularity.desc",
        page: 1,
      });
    }

    // Mood Movies
    let moodMovies = [];
    const keywords = moodMap[mood] || [];

    if (keywords.length > 0) {
      moodMovies = await fetchFromTMDB("discover/movie", {
        sort_by: "popularity.desc",
        with_keywords: keywords.join(","),
        include_adult: false,
        page: 1,
      });
    }

    // Merge + remove posterless + no duplicates
    const all = [
      ...(similar?.results || []),
      ...(genreMovies?.results || []),
      ...(moodMovies?.results || []),
    ]
      .filter(m => m.poster_path)
      .reduce((acc: any[], m: any) => {
        if (!acc.some(x => x.id === m.id)) acc.push(m);
        return acc;
      }, []);

    return NextResponse.json(all);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
