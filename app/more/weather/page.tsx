"use client";

import { useEffect, useState } from "react";
import WeatherCard from "../../components/WeatherCard";
import HourlyCard from "../../components/HourlyChart";
import ForecastCard from "../../components/ForecastCard";

export default function WeatherPage() {
  const [city, setCity] = useState("Chittagong");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch weather from API
  async function loadWeather(selectedCity: string) {
    setLoading(true);

    try {
      const res = await fetch(`/api/weather?city=${selectedCity}`);
      const json = await res.json();

      if (!json.error) setWeather(json.data);
    } catch (err) {
      console.error("Weather fetch error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadWeather(city);
  }, []);

  if (loading || !weather) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  const today = weather.list[0];
  const hourly = weather.list.slice(0, 6);

  // Better daily map
  const dailyMap: any = {};
  weather.list.forEach((item: any) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        high: item.main.temp_max,
        low: item.main.temp_min,
      };
    } else {
      dailyMap[date].high = Math.max(dailyMap[date].high, item.main.temp_max);
      dailyMap[date].low = Math.min(dailyMap[date].low, item.main.temp_min);
    }
  });

  const daily = Object.values(dailyMap).slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#320c5c] via-[#5b1f81] to-[#d66a3b] text-white p-8">

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-4 py-3 rounded-xl w-full text-black text-lg"
          />
          <button
            onClick={() => loadWeather(city)}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-xl text-white font-semibold"
          >
            Search
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT → LEFT + RIGHT */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* LEFT SIDE → Hourly + Daily */}
        <div className="flex flex-col space-y-6 md:col-span-2">

          {/* Hourly */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Hourly Forecast</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {hourly.map((h: any, i: number) => (
                <HourlyCard
                  key={i}
                  time={h.dt_txt.split(" ")[1].slice(0, 5)}
                  temp={Math.round(h.main.temp)}
                />
              ))}
            </div>
          </div>

          {/* Daily */}
          <div className="flex gap-4 overflow-x-auto pb-4">
  {daily.map((d: any, i: number) => (
    <ForecastCard
      key={i}
      day={new Date(d.date).toLocaleDateString("en-US", { weekday: "short" })}
      temp={Math.round(d.high)}
      icon="https://cdn-icons-png.flaticon.com/512/1146/1146869.png" // You choose icon
      selected={i === 0} // highlight today's card
    />
  ))}
</div>


        </div>

        {/* RIGHT SIDE → MAIN WEATHER CARD */}
        <div className="md:col-span-1">
          <WeatherCard
            city={weather.city.name}
            temperature={Math.round(today.main.temp)}
            description={today.weather[0].description}
            high={Math.round(today.main.temp_max)}
            low={Math.round(today.main.temp_min)}
            humidity={today.main.humidity}
            wind={today.wind.speed}
            pressure={today.main.pressure}
          />
        </div>

      </div>
    </div>
  );
}
