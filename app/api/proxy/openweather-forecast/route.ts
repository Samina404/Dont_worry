import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");
  const lat = url.searchParams.get("lat");
  const lon = url.searchParams.get("lon");
  const appid = process.env.NEXT_PUBLIC_WEATHER_KEY;

  if (!appid)
    return NextResponse.json({ error: "Weather API key missing" }, { status: 500 });

  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?appid=${appid}&units=metric`;

  if (q) apiUrl += `&q=${q}`;
  if (lat && lon) apiUrl += `&lat=${lat}&lon=${lon}`;

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch forecast" }, { status: 500 });
  }
}
