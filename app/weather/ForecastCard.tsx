export default function ForecastCard({
  day,
  high,
  low,
}: {
  day: string;
  high: number;
  low: number;
}) {
  return (
    <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-md">
      <p className="text-lg">{day}</p>
      <div className="flex gap-4">
        <p>H: {high}°</p>
        <p>L: {low}°</p>
      </div>
    </div>
  );
}
