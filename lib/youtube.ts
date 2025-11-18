export function getYouTubeEmbedUrl(query: string) {
  const searchQuery = encodeURIComponent(query);
  return `https://www.youtube.com/embed?listType=search&list=${searchQuery}`;
}
