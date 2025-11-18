// app/api/news/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "mental health";
    const page = Number(searchParams.get("page") || "1");
    const pageSize = Number(searchParams.get("pageSize") || "12");

    const API_KEY = process.env.NEWSAPI_KEY;
    if (!API_KEY) {
      return NextResponse.json({ error: "Missing server NEWSAPI_KEY" }, { status: 500 });
    }

    const url = new URL("https://newsapi.org/v2/everything");
    url.searchParams.set("q", q);
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("language", "en");
    url.searchParams.set("apiKey", API_KEY);

    console.log("Fetching NewsAPI:", url.toString());

    const res = await fetch(url.toString());

    if (!res.ok) {
      const text = await res.text();
      console.error("NewsAPI fetch failed:", res.status, text);
      return NextResponse.json({ error: "NewsAPI fetch failed" }, { status: 500 });
    }

    const data = await res.json();

    // Normalize the articles
    const articles = (data.articles || []).map((a: any, i: number) => ({
      id: a.url ? encodeURIComponent(a.url) : `article-${page}-${i}`,
      title: a.title,
      description: a.description,
      content: a.content,
      url: a.url,
      urlToImage: a.urlToImage,
      publishedAt: a.publishedAt,
      source: a.source?.name || null,
    }));

    return NextResponse.json({
      totalResults: data.totalResults || articles.length,
      page,
      pageSize,
      articles,
    });
  } catch (err: any) {
    console.error("NewsAPI route error:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
