export function tmdbImage(path: string | null, size = "w500") {
  if (!path) return "/placeholder.png";
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
