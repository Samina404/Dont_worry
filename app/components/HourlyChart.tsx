export default function HourlyCard({ time, temp }: any) {
  return (
    <div className="flex flex-col items-center gap-2 text-white">

      <p className="text-sm opacity-80">{time}</p>

      <img
        src="https://cdn-icons-png.flaticon.com/512/414/414825.png"
        className="w-10 drop-shadow-md"
      />

      <p className="text-lg font-semibold">{temp}°C</p>
    </div>
  );
}
