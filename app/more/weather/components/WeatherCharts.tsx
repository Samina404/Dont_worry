"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { WeatherData, DailyForecast } from "../utils/weatherApi";
import { Download, MoreVertical } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface WeatherChartsProps {
  data: WeatherData;
}

export default function WeatherCharts({ data }: WeatherChartsProps) {
  const { airQuality, forecast } = data;

  // Air Quality Data (Mocking history for visual consistency with design, or could use hourly if available)
  // Since we only have current AQI, we'll create a mock trend for the visual
  const aqLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  const aqDataPoints = [20, 30, 40, 35, 50, 45, 60, 55, 65, airQuality.us_aqi]; // Ending with current

  const aqData = {
    labels: aqLabels,
    datasets: [
      {
        fill: true,
        label: "AQI",
        data: aqDataPoints,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(59, 130, 246)",
      },
    ],
  };

  const aqOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  // Rain Chance Data from Forecast
  const rainLabels = forecast.map(d => d.dayName);
  const rainDataPoints = forecast.map(d => d.rainChance);

  const rainData = {
    labels: rainLabels,
    datasets: [
      {
        label: "Chance of Rain",
        data: rainDataPoints,
        backgroundColor: rainDataPoints.map((val, i) => 
          i === 0 ? "rgb(59, 130, 246)" : "rgba(59, 130, 246, 0.3)"
        ),
        borderRadius: 20,
        barThickness: 12,
      },
    ],
  };

  const rainOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(0,0,0,0.05)" },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Air Quality Index */}
      <div className="bg-white rounded-[30px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-800">Air quality index</h3>
          <div className="flex gap-2 text-gray-400">
            <button className="hover:text-gray-600"><Download className="w-5 h-5" /></button>
            <button className="hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-500">Clean air</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-200"></div>
                <span className="text-xs text-gray-500">Average quality</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                <span className="text-xs text-gray-500">Harmful level</span>
            </div>
        </div>

        <div className="h-[200px] w-full">
          <Line options={aqOptions} data={aqData} />
        </div>
      </div>

      {/* Chance of Rain */}
      <div className="bg-white rounded-[30px] p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-800">Chance Of Rain</h3>
          <div className="flex gap-2 text-gray-400">
            <button className="hover:text-gray-600"><Download className="w-5 h-5" /></button>
            <button className="hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
            <span className="text-xs text-gray-500">Cloudy: 0-30%</span>
            <span className="text-xs text-gray-500">Rain: 60-80%</span>
            <span className="text-xs text-gray-500">Heavy rain: 80-100%</span>
        </div>

        <div className="h-[200px] w-full">
          <Bar options={rainOptions} data={rainData} />
        </div>
      </div>
    </div>
  );
}
