// app/api/youtube/route.ts
import { NextResponse } from "next/server";

// Backup videos to show if API fails (quota exceeded or no key)
const BACKUP_VIDEOS = [
  // Calm / General
  { id: "7NOSDKb0HlU", title: "Lofi Hip Hop Mix - Beats to Relax/Study to", thumbnail: "https://img.youtube.com/vi/7NOSDKb0HlU/mqdefault.jpg" },
  { id: "WJ3-F02-F_Y", title: "Relaxing Piano Music - Stress Relief", thumbnail: "https://img.youtube.com/vi/WJ3-F02-F_Y/mqdefault.jpg" },
  { id: "lTRiuFIWV54", title: "Beautiful Relaxing Music - Peaceful Piano & Guitar", thumbnail: "https://img.youtube.com/vi/lTRiuFIWV54/mqdefault.jpg" },

  // Sleep
  { id: "1ZYbU82GVz4", title: "Relaxing Music for Sleep - Water Sounds", thumbnail: "https://img.youtube.com/vi/1ZYbU82GVz4/mqdefault.jpg" },
  { id: "h2v975q3y1g", title: "Deep Sleep Music - Insomnia Healing", thumbnail: "https://img.youtube.com/vi/h2v975q3y1g/mqdefault.jpg" },
  { id: "2OEL4P1Rz04", title: "Rain Sounds for Sleep & Relaxation", thumbnail: "https://img.youtube.com/vi/2OEL4P1Rz04/mqdefault.jpg" },

  // Nature
  { id: "eKFTSSKCzWA", title: "Forest Sounds - Nature Sounds", thumbnail: "https://img.youtube.com/vi/eKFTSSKCzWA/mqdefault.jpg" },
  { id: "Ip05C5vXF3w", title: "Ocean Waves - Nature Sounds", thumbnail: "https://img.youtube.com/vi/Ip05C5vXF3w/mqdefault.jpg" },

  // Focus / Study
  { id: "sjkrrmBnpGE", title: "Focus Music - Study Music", thumbnail: "https://img.youtube.com/vi/sjkrrmBnpGE/mqdefault.jpg" },
  { id: "WPni755-Krg", title: "Classical Music for Studying & Brain Power", thumbnail: "https://img.youtube.com/vi/WPni755-Krg/mqdefault.jpg" },
  { id: "TURbeWK2wwg", title: "Lofi Girl - 1 A.M Study Session", thumbnail: "https://img.youtube.com/vi/TURbeWK2wwg/mqdefault.jpg" },

  // Meditation / Anxiety
  { id: "FjHGZj2IjBk", title: "Guided Meditation for Sleep & Anxiety", thumbnail: "https://img.youtube.com/vi/FjHGZj2IjBk/mqdefault.jpg" },
  { id: "MCkTebktHVc", title: "Calming Music for Nerves & Anxiety", thumbnail: "https://img.youtube.com/vi/MCkTebktHVc/mqdefault.jpg" },

  // Jazz
  { id: "Dx5qFachd3A", title: "Relaxing Jazz Piano - Background Music", thumbnail: "https://img.youtube.com/vi/Dx5qFachd3A/mqdefault.jpg" },
];

function getFilteredBackup(query: string) {
  const lowerQ = query.toLowerCase();
  // Simple keyword matching
  const filtered = BACKUP_VIDEOS.filter(v => {
    const title = v.title.toLowerCase();
    // Check for common keywords in query
    if (lowerQ.includes("sleep") && (title.includes("sleep") || title.includes("rain"))) return true;
    if (lowerQ.includes("nature") && (title.includes("nature") || title.includes("forest") || title.includes("ocean"))) return true;
    if ((lowerQ.includes("focus") || lowerQ.includes("study")) && (title.includes("focus") || title.includes("study") || title.includes("reading") || title.includes("mozart"))) return true;
    if ((lowerQ.includes("meditation") || lowerQ.includes("anxiety")) && (title.includes("meditation") || title.includes("stress") || title.includes("calming"))) return true;
    if (lowerQ.includes("jazz") && title.includes("jazz")) return true;
    return false;
  });

  // If we found matches, return them. Otherwise return a random subset of all videos.
  if (filtered.length > 0) return filtered;

  // Return mixed subset if no specific match
  return BACKUP_VIDEOS.sort(() => 0.5 - Math.random()).slice(0, 10);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "calm music";
    const maxResults = Number(searchParams.get("maxResults") || "12");
    const pageToken = searchParams.get("pageToken") || undefined;

    const API_KEY = process.env.YOUTUBE_API_KEY;

    // 1. Check for API Key
    if (!API_KEY) {
      console.warn("⚠️ [YouTube API] No API Key found. Returning backup videos.");
      return NextResponse.json({ videos: getFilteredBackup(q), nextPageToken: null });
    }

    const url = new URL("https://www.googleapis.com/youtube/v3/search");
    url.searchParams.set("part", "snippet");
    url.searchParams.set("type", "video");
    url.searchParams.set("q", q);
    url.searchParams.set("maxResults", String(maxResults));
    url.searchParams.set("key", API_KEY);
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    // 2. Call API
    const res = await fetch(url.toString());
    const data = await res.json();

    // 3. Handle API Errors (e.g. Quota Exceeded)
    if (data?.error) {
      console.error("⚠️ [YouTube API] Error:", data.error.message);
      return NextResponse.json({ videos: getFilteredBackup(q), nextPageToken: null });
    }

    // 4. Transform Data
    const videos = (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
    }));

    return NextResponse.json({
      videos,
      nextPageToken: data.nextPageToken || null,
    });

  } catch (err: any) {
    console.error("❌ [YouTube API] Critical Error:", err.message);
    const { searchParams } = new URL(req.url); // Re-parse to be safe in catch block
    const q = searchParams.get("q") || "calm music";
    return NextResponse.json({ videos: getFilteredBackup(q), nextPageToken: null });
  }
}