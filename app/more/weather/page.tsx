"use client";

import { useState, useEffect } from "react";
import WeatherSearch from "./components/WeatherSearch";
import CurrentWeather from "./components/CurrentWeather";
import ForecastList from "./components/ForecastList";
import WeatherHighlights from "./components/WeatherHighlights";
import WeatherCharts from "./components/WeatherCharts";
import { getWeatherData, WeatherData, LocationData } from "./utils/weatherApi";
import { Loader2 } from "lucide-react";

export default function WeatherPage() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<LocationData>({
    name: "New York",
    country: "USA",
    lat: 40.7128,
    lon: -74.0060
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async (lat: number, lon: number) => {
    setLoading(true);
    const weatherData = await getWeatherData(lat, lon);
    setData(weatherData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(location.lat, location.lon);
  }, [location]);

  const handleLocationSelect = (newLocation: LocationData) => {
    setLocation(newLocation);
  };

  if (loading && !data) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #2e1350 0%, #7a2f6b 50%, #f59e4a 100%)"
        }}
      >
        <Loader2 className="w-12 h-12 animate-spin text-orange-300" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:p-8 font-sans"
      style={{
        background: "linear-gradient(180deg, #2e1350 0%, #7a2f6b 50%, #f59e4a 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== Header Search Section ===== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-50">
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 overflow-visible">
            <WeatherSearch onLocationSelect={handleLocationSelect} />
          </div>
        </div>

        {/* ===== Main Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ===== Current Weather Card ===== */}
          <div className="lg:col-span-1">
            <div className="rounded-xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md p-4">
              {data && <CurrentWeather data={data} location={location} />}
            </div>
          </div>

          {/* ===== Forecast List ===== */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md p-4">
              {data && <ForecastList forecast={data.forecast} />}
            </div>
          </div>
        </div>

        {/* ===== Highlights Section ===== */}
        <div className="rounded-xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md p-6">
          {data && <WeatherHighlights data={data} />}
        </div>

        {/* ===== Charts Section ===== */}
        <div className="rounded-xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md p-6">
          {data && <WeatherCharts data={data} />}
        </div>

      </div>
    </div>
  );
}
