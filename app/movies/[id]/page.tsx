// app/movies/[id]/page.tsx
import MovieDetailClient from "./MovieDetailClient";

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <MovieDetailClient movieId={id} />;
}
