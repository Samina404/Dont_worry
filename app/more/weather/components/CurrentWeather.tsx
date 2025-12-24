import { MapPin, ChevronDown } from "lucide-react";
import { WeatherData, LocationData } from "../utils/weatherApi";

interface CurrentWeatherProps {
  data: WeatherData;
  location: LocationData;
}

export default function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const { current } = data;

  const date = new Date();
  const dateStr = date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative w-full h-[320px] p-8 text-white overflow-hidden group">

      {/* 🌌 ATMOSPHERIC BACKGROUND */}
      <div
        className={`absolute inset-0 transition-all duration-700 ${
          current.isDay
            ? "bg-white/5"
            : "bg-black/20"
        }`}
      >
        {/* SUBTLE GLOWING ORBS */}
        <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-pink-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-blue-400/10 rounded-full blur-[100px]" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Location + Units */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
            <MapPin className="w-4 h-4 text-pink-400" />
            <span className="font-medium text-gray-200">
              {location.name}, {location.country}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
            <span className="text-gray-200 font-semibold">°C</span>
          </div>
        </div>

        {/* Temperature Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-6">
            <h1 className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
              {current.temp}°
            </h1>

            {/* Weather Icon */}
            {current.icon && (
              <current.icon className="w-20 h-20 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.3)] animate-pulse" />
            )}
          </div>

          <div className="flex items-center gap-3">
             <p className="text-3xl font-bold text-white">{current.condition}</p>
             <div className="h-4 w-px bg-white/20"></div>
             <div className="flex gap-4 text-gray-400 font-medium">
                <span>H: {current.high}°</span>
                <span>L: {current.low}°</span>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
