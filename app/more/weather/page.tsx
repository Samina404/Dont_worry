"use client";

import { useState, useEffect } from "react";
import WeatherSearch from "./components/WeatherSearch";
import CurrentWeather from "./components/CurrentWeather";
import ForecastList from "./components/ForecastList";
import WeatherHighlights from "./components/WeatherHighlights";
import WeatherCharts from "./components/WeatherCharts";
import { getWeatherData, WeatherData, LocationData } from "./utils/weatherApi";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-pink-500" />
      </div>
    );
  }

  const neonText = "text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-yellow-400";
  const cardStyle = "rounded-3xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0f1f] via-[#2e1350] to-[#12081a] text-white p-4 md:p-8 font-sans">
      {/* Background Lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-pink-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* ===== Header Section ===== */}
        <header className="mb-8 flex flex-col md:flex-row items-start justify-between gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <h1 className={`text-4xl md:text-5xl font-bold ${neonText}`}>
              Weather Sanctuary
            </h1>
            <p className="mt-2 text-gray-400 max-w-2xl text-lg">
              Check the atmosphere around you. Plan your mindfulness sessions and outdoor activities with precision.
            </p>
          </motion.div>
          <div className="flex items-center gap-4">
            <BackButton variant="themed" href="/more" />
          </div>
        </header>

        {/* ===== Search Section ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-50 flex justify-end"
        >
          <div className="w-full md:w-80 bg-white/5 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-lg">
            <WeatherSearch onLocationSelect={handleLocationSelect} />
          </div>
        </motion.div>

        {/* ===== Main Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ===== Current Weather Card ===== */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4"
          >
            <div className={cardStyle}>
              {data && <CurrentWeather data={data} location={location} />}
            </div>
          </motion.div>

          {/* ===== Forecast List ===== */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <div className={cardStyle}>
              {data && <ForecastList forecast={data.forecast} />}
            </div>
          </motion.div>
        </div>

        {/* ===== Highlights Section ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={cardStyle}
        >
          {data && <WeatherHighlights data={data} />}
        </motion.div>

        {/* ===== Charts Section ===== */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={cardStyle}
        >
          {data && <WeatherCharts data={data} />}
        </motion.div>

      </div>
    </div>
  );
}
