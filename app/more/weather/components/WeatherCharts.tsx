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
import { WeatherData } from "../utils/weatherApi";
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

  // Mock trend for AQI
  const aqLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue"];
  const aqDataPoints = [20, 30, 40, 35, 50, 45, 60, 55, 65, airQuality.us_aqi];

  const aqData = {
    labels: aqLabels,
    datasets: [
      {
        fill: true,
        label: "AQI",
        data: aqDataPoints,
        borderColor: "rgb(96,165,250)", // blue-400
        backgroundColor: "rgba(96,165,250,0.15)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "rgb(96,165,250)",
      },
    ],
  };

  const aqOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(20,20,20,0.9)",
        titleColor: "#fff",
        bodyColor: "#ddd",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#aaa" },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#aaa" },
        border: { display: false },
      },
    },
  };

  // Rain chance chart
  const rainLabels = forecast.map((d) => d.dayName);
  const rainDataPoints = forecast.map((d) => d.rainChance);

  const rainData = {
    labels: rainLabels,
    datasets: [
      {
        label: "Chance of Rain",
        data: rainDataPoints,
        backgroundColor: rainDataPoints.map((val, i) =>
          i === 0 ? "rgb(96,165,250)" : "rgba(96,165,250,0.3)"
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
      tooltip: {
        backgroundColor: "rgba(20,20,20,0.9)",
        titleColor: "#fff",
        bodyColor: "#ddd",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#aaa" },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#aaa" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Air Quality Index */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-100">Air Quality Index</h3>
          <div className="flex gap-2 text-gray-400">
            <button className="hover:text-gray-200"><Download className="w-5 h-5" /></button>
            <button className="hover:text-gray-200"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-400">Clean air</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-200"></div>
            <span className="text-xs text-gray-400">Average quality</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            <span className="text-xs text-gray-400">Harmful level</span>
          </div>
        </div>

        <div className="h-[200px] w-full">
          <Line options={aqOptions} data={aqData} />
        </div>
      </div>

      {/* Chance of Rain */}
      <div className="bg-[#2b2b2d] rounded-[30px] p-6 shadow-lg border border-[#3a3a3c]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-gray-100">Chance Of Rain</h3>
          <div className="flex gap-2 text-gray-400">
            <button className="hover:text-gray-200"><Download className="w-5 h-5" /></button>
            <button className="hover:text-gray-200"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <span className="text-xs text-gray-400">Cloudy: 0-30%</span>
          <span className="text-xs text-gray-400">Rain: 60-80%</span>
          <span className="text-xs text-gray-400">Heavy rain: 80-100%</span>
        </div>

        <div className="h-[200px] w-full">
          <Bar options={rainOptions} data={rainData} />
        </div>
      </div>

    </div>
  );
}
