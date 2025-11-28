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

    const res = await fetch(url.toString(), {
      headers: {
        "User-Agent": "DontWorryApp/1.0",
      },
    });

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
    // Fallback to mock data so the UI doesn't break
    const mockArticles = [
      {
        id: "mock-1",
        title: "The Benefits of Mindfulness Meditation",
        description: "Discover how mindfulness can reduce stress and improve your overall well-being in just 10 minutes a day.",
        url: "https://www.mindful.org/",
        urlToImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        source: "Mindful.org",
      },
      {
        id: "mock-2",
        title: "Understanding Anxiety: Tips for Coping",
        description: "Practical strategies to manage anxiety and regain control of your thoughts and emotions.",
        url: "https://www.psychologytoday.com/",
        urlToImage: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=800&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        source: "Psychology Today",
      },
      {
        id: "mock-3",
        title: "The Science of Sleep: Why It Matters",
        description: "Explore the vital role sleep plays in mental health and cognitive function.",
        url: "https://www.sleepfoundation.org/",
        urlToImage: "https://images.unsplash.com/photo-1511295742362-92c96b504802?q=80&w=800&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        source: "Sleep Foundation",
      },
      {
        id: "mock-4",
        title: "Nature Therapy: Healing in the Outdoors",
        description: "How spending time in nature can lower cortisol levels and boost your mood.",
        url: "https://www.nationalgeographic.com/",
        urlToImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        source: "National Geographic",
      },
      {
        id: "mock-5",
        title: "Healthy Eating for a Healthy Mind",
        description: "The connection between your gut health and your mental state explained.",
        url: "https://www.healthline.com/",
        urlToImage: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
        publishedAt: new Date().toISOString(),
        source: "Healthline",
      }
    ];

    return NextResponse.json({
      totalResults: mockArticles.length,
      page: 1,
      pageSize: 12,
      articles: mockArticles,
    });
  }
}
