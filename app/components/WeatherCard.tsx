export default function WeatherCard({
  city,
  temperature,
  description,
  high,
  low,
  humidity,
  wind,
  pressure,
}: any) {
  return (
    <div className="rounded-3xl p-8 bg-gradient-to-br from-[#3e077a] via-[#5d178e] to-[#d7653d] text-white shadow-[0_0_40px_rgba(255,255,255,0.2)] border border-white/10">

      {/* Top Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">{city}</h1>
          <p className="opacity-80 capitalize">{description}</p>
          <p className="text-5xl font-extrabold mt-3">{temperature}°C</p>
        </div>

        {/* Cloud Icon */}
    
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-5 mt-8 text-sm">

        <div>
          <p className="font-semibold opacity-80">High</p>
          <p className="text-lg">{high}°C</p>
        </div>

        <div>
          <p className="font-semibold opacity-80">Low</p>
          <p className="text-lg">{low}°C</p>
        </div>

        <div>
          <p className="font-semibold opacity-80">Humidity</p>
          <p className="text-lg">{humidity}%</p>
        </div>

        <div>
          <p className="font-semibold opacity-80">Wind</p>
          <p className="text-lg">{wind} km/h</p>
        </div>

        <div>
          <p className="font-semibold opacity-80">Pressure</p>
          <p className="text-lg">{pressure} hPa</p>
        </div>

      </div>
    </div>
  );
}
