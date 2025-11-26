import { NextResponse } from "next/server";

const API_KEY = process.env.OPEN_WEATHER_KEY;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city") || "Chattogram";

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    const res = await fetch(url);
    const data = await res.json();

    console.log("WEATHER API RESPONSE:", data); // 🔥 See real error

    if (data.cod !== "200") {
      return NextResponse.json({ error: data.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
