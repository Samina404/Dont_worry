"use server";

export async function fetchFromTMDB(endpoint: string, params: any = {}) {
  const base = "https://api.themoviedb.org/3";
  const url = new URL(`${base}/${endpoint}`);

  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  url.searchParams.set("api_key", process.env.TMDB_API_KEY!);

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status}`);
  }

  return res.json();
}
