"use server";
import { NextResponse } from "next/server";
import { fetchFromTMDB } from "../../../../../lib/tmdb";


export async function GET(req: Request, { params }: { params: { id: string } }) {
try {
const id = params.id;
if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });


const data = await fetchFromTMDB(`movie/${id}`, { append_to_response: "videos,credits" });
return NextResponse.json(data);
} catch (err: any) {
return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
}
}