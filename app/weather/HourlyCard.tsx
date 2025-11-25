export default function HourlyCard({
  time,
  temp,
}: {
  time: string;
  temp: number;
}) {
  return (
    <div className="p-4 rounded-xl bg-white/10 backdrop-blur-md text-center">
      <p className="mb-2 text-sm">{time}</p>
      <p className="text-xl font-semibold">{temp}°</p>
    </div>
  );
}
