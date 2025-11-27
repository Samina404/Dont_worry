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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Sunrise & Sunset */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c]">
        <h3 className="text-gray-300 font-medium mb-4">Sunrise & Sunset</h3>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-full text-yellow-300">
              <Sunrise className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sunrise</p>
              <p className="text-xl font-bold text-gray-100">
                {formatTime(current.sunrise)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-400/10 rounded-full text-orange-300">
              <Sunset className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Sunset</p>
              <p className="text-xl font-bold text-gray-100">
                {formatTime(current.sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Wind Status */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c]">
        <h3 className="text-gray-300 font-medium mb-4">Wind Status</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-100">
                {current.windSpeed}
              </span>
              <span className="text-gray-400">km/h</span>
            </div>
            <p className="text-gray-400 mt-2 flex items-center gap-2">
              <Wind className="w-4 h-4" />
              {current.windSpeed < 10 ? "Light breeze" : "Moderate wind"}
            </p>
          </div>

          {/* Compass */}
          <div className="relative w-24 h-24 border-2 border-[#3a3a3c] rounded-full flex items-center justify-center">
            <span className="absolute top-1 text-xs font-bold text-gray-500">
              N
            </span>
            <span className="absolute bottom-1 text-xs font-bold text-gray-500">
              S
            </span>
            <span className="absolute left-1 text-xs font-bold text-gray-500">
              W
            </span>
            <span className="absolute right-1 text-xs font-bold text-gray-500">
              E
            </span>

            <div
              className="w-1 h-10 bg-blue-400 rounded-full origin-bottom"
              style={{
                transform: `rotate(${current.windDirection}deg) translateY(-50%)`,
              }}
            />
            <div className="w-2 h-2 bg-blue-500 rounded-full absolute" />
          </div>
        </div>
      </div>

      {/* Humidity & Visibility */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c] flex flex-col justify-between">
        <div>
          <h3 className="text-gray-300 font-medium mb-2">Humidity</h3>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-bold text-gray-100">
                {current.humidity}
              </span>
              <span className="text-xl font-medium text-gray-300">%</span>
            </div>
            <Droplets className="w-6 h-6 text-blue-300 mb-2" />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {current.humidity < 40
              ? "Dry"
              : current.humidity > 70
              ? "Humid"
              : "Normal"}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#3a3a3c]">
          <h3 className="text-gray-300 font-medium mb-2">Visibility</h3>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-4xl font-bold text-gray-100">
                {current.visibility}
              </span>
              <span className="text-xl font-medium text-gray-300">km</span>
            </div>
            <Eye className="w-6 h-6 text-blue-300 mb-2" />
          </div>
        </div>
      </div>

      {/* Feels Like & UV */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c] flex flex-col justify-between">
        <div>
          <h3 className="text-gray-300 font-medium mb-2">Feels Like</h3>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold text-gray-100">
              {current.feelsLike}°
            </span>
            <Thermometer className="w-6 h-6 text-red-300 mb-2" />
          </div>
          <p className="text-gray-400 text-sm mt-2">
            {current.feelsLike > current.temp ? "Warmer" : "Cooler"} than
            actual
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-[#3a3a3c]">
          <h3 className="text-gray-300 font-medium mb-2">UV Index</h3>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-bold text-gray-100">
              {current.uvIndex}
            </span>

            <div
              className={`px-3 py-1 rounded-full text-xs font-bold
              ${
                current.uvIndex < 3
                  ? "bg-green-400/10 text-green-300"
                  : current.uvIndex < 6
                  ? "bg-yellow-400/10 text-yellow-300"
                  : "bg-red-400/10 text-red-300"
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
