import { Sunrise, Sunset, Wind, Eye, Droplets, Thermometer } from "lucide-react";
import { WeatherData } from "../utils/weatherApi";

interface WeatherHighlightsProps {
  data: WeatherData;
}

export default function WeatherHighlights({ data }: WeatherHighlightsProps) {
  const { current } = data;

  const formatTime = (timeStr: string) => {
    return new Date(timeStr).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const subCardStyle = "bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/10";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {/* Sunrise & Sunset */}
      <div className={subCardStyle}>
        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6">Sunrise & Sunset</h3>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl text-yellow-300 border border-yellow-400/20 shadow-[0_0_15px_rgba(253,224,71,0.1)]">
              <Sunrise className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Sunrise</p>
              <p className="text-2xl font-black text-white">
                {formatTime(current.sunrise)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-400/10 rounded-2xl text-orange-300 border border-orange-400/20 shadow-[0_0_15px_rgba(251,146,60,0.1)]">
              <Sunset className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-tighter">Sunset</p>
              <p className="text-2xl font-black text-white">
                {formatTime(current.sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wind Status */}
      <div className={subCardStyle}>
        <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-6">Wind Status</h3>
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-white">
                {current.windSpeed}
              </span>
              <span className="text-gray-500 font-bold">km/h</span>
            </div>
            <p className="text-pink-400/80 text-sm mt-3 font-semibold flex items-center gap-2">
              <Wind className="w-4 h-4" />
              {current.windSpeed < 10 ? "Light breeze" : "Moderate wind"}
            </p>
          </div>

          {/* Compass */}
          <div className="relative w-24 h-24 border-2 border-white/10 rounded-full flex items-center justify-center bg-black/20">
            <span className="absolute top-1 text-[10px] font-black text-gray-600">N</span>
            <span className="absolute bottom-1 text-[10px] font-black text-gray-600">S</span>
            <span className="absolute left-1 text-[10px] font-black text-gray-600">W</span>
            <span className="absolute right-1 text-[10px] font-black text-gray-600">E</span>

            <div
              className="w-1 h-10 bg-gradient-to-t from-pink-500 to-yellow-400 rounded-full origin-bottom shadow-glow"
              style={{
                transform: `rotate(${current.windDirection}deg) translateY(-50%)`,
              }}
            />
            <div className="w-2.5 h-2.5 bg-white rounded-full absolute border-2 border-black" />
          </div>
        </div>
      </div>

      {/* Humidity & Visibility */}
      <div className={`${subCardStyle} flex flex-col justify-between`}>
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Humidity</h3>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-5xl font-black text-white">
                {current.humidity}
              </span>
              <span className="text-2xl font-bold text-gray-500">%</span>
            </div>
            <Droplets className="w-8 h-8 text-blue-400 mb-2 drop-shadow-glow" />
          </div>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {current.humidity < 40
              ? "Dry"
              : current.humidity > 70
              ? "Humid"
              : "Normal"}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">Visibility</h3>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-black text-white">
                {current.visibility}
              </span>
              <span className="text-xl font-bold text-gray-500 ml-1">km</span>
            </div>
            <Eye className="w-6 h-6 text-gray-400 mb-1" />
          </div>
        </div>
      </div>

      {/* Feels Like & UV */}
      <div className={`${subCardStyle} flex flex-col justify-between`}>
        <div>
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-4">Feels Like</h3>
          <div className="flex justify-between items-end">
            <span className="text-5xl font-black text-white">
              {current.feelsLike}°
            </span>
            <Thermometer className="w-8 h-8 text-red-400 mb-2 drop-shadow-glow" />
          </div>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {current.feelsLike > current.temp ? "Warmer" : "Cooler"} than actual
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5">
          <h3 className="text-gray-400 font-bold uppercase tracking-wider text-xs mb-2">UV Index</h3>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-black text-white">
              {current.uvIndex}
            </span>

            <div
              className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest
              ${
                current.uvIndex < 3
                  ? "bg-green-500/20 text-green-400 border border-green-500/20"
                  : current.uvIndex < 6
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/20"
                  : "bg-red-500/20 text-red-400 border border-red-500/20"
              }`}
            >
              {current.uvIndex < 3
                ? "Low"
                : current.uvIndex < 6
                ? "Moderate"
                : "High"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
