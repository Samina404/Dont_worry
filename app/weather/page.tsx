"use client";

import WeatherCard from "./WeatherCard";
import HourlyCard from "../weather/HourlyCard";
import ForecastCard from "../weather/ForecastCard";

export default function WeatherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-700 to-blue-500 text-white p-6">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Main Weather Card */}
        <WeatherCard
          city="Chattogram"
          temperature={29}
          description="Partly Cloudy"
          high={32}
          low={25}
        />

        {/* Hourly Forecast */}
        <div>
          <h2 className="text-xl mb-3">Hourly Forecast</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {["1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"].map((time, i) => (
              <HourlyCard key={i} time={time} temp={29 + i} />
            ))}
          </div>
        </div>

        {/* Weekly Forecast */}
        <div>
          <h2 className="text-xl mb-3">Daily Forecast</h2>
          <div className="space-y-4">
            <ForecastCard day="Tuesday" high={32} low={26} />
            <ForecastCard day="Wednesday" high={30} low={25} />
            <ForecastCard day="Thursday" high={29} low={24} />
          </div>
        </div>

      </div>
    </div>
  );
}
