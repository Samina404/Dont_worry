// app/api/weather/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    let lat: number | undefined = body.lat;
    let lon: number | undefined = body.lon;

    // if city provided -> geocode
    if (!lat || !lon) {
      if (!body.city) return NextResponse.json({ error: "missing lat/lon or city" }, { status: 400 });
      const g = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(body.city)}&count=1&language=en`
      ).then((r) => r.json());
      const hit = g?.results?.[0];
      if (!hit) return NextResponse.json({ error: "city not found" }, { status: 404 });
      lat = hit.latitude;
      lon = hit.longitude;
    }

    // build forecast URL
    const forecastUrl = [
      "https://api.open-meteo.com/v1/forecast?",
      `latitude=${lat}&longitude=${lon}`,
      "&current_weather=true",
      "&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m,winddirection_10m,visibility",
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset,uv_index_max",
      "&timezone=auto",
    ].join("");

    const aqUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm10,pm2_5&timezone=auto`;

    const [fRes, aqRes] = await Promise.all([
      fetch(forecastUrl).then((r) => r.json()),
      fetch(aqUrl).then((r) => r.json()),
    ]);

    // attach coordinates
    const out = { forecast: fRes, air: aqRes, lat, lon };
    return NextResponse.json(out);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "unknown" }, { status: 500 });
  }
}
