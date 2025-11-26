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
    <div className="relative w-full h-[300px] rounded-[30px] overflow-hidden p-8 text-white shadow-xl group">

      {/* 🌅 PURPLE → ORANGE THEME BACKGROUND */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          current.isDay
            ? "bg-gradient-to-br from-[#3A0CA3] via-[#7209B7] to-[#F97316]"
            : "bg-gradient-to-br from-[#1a1028] via-[#3A0CA3] to-[#D35400]"
        }`}
      >
        {/* GLOWING DECORATIVE ORBS */}
        <div className="absolute top-[-15%] right-[-10%] w-64 h-64 bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-purple-500/20 rounded-full blur-2xl" />
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 flex flex-col justify-between h-full">

        {/* Location + Temp Unit */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-lg px-4 py-2 rounded-full">
            <MapPin className="w-4 h-4" />
            <span className="font-medium">
              {location.name}, {location.country}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-lg px-3 py-2 rounded-full">
            <span>°C</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Temperature Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <h1 className="text-7xl font-extrabold tracking-tighter">
              {current.temp}°C
            </h1>

            {/* Weather Icon */}
            {current.icon && (
              <current.icon className="w-16 h-16 text-orange-300 drop-shadow-glow" />
            )}
          </div>

          <p className="text-2xl font-medium mt-2">{current.condition}</p>

          <div className="flex gap-4 text-white/80 mt-1">
            <span>High: {current.high}°</span>
            <span>Low: {current.low}°</span>
          </div>
        </div>

      </div>
    </div>
  );
}
