export default function WeatherCard({
  city,
  temperature,
  description,
  high,
  low,
}: {
  city: string;
  temperature: number;
  description: string;
  high: number;
  low: number;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-lg shadow-xl">
      <h1 className="text-3xl font-semibold">{city}</h1>

      <div className="flex items-center justify-between mt-4">
        <div>
          <p className="text-6xl font-bold">{temperature}°</p>
          <p className="text-lg">{description}</p>
        </div>

        <div className="text-right text-sm">
          <p>High: {high}°</p>
          <p>Low: {low}°</p>
        </div>
      </div>
    </div>
  );
}
