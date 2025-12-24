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

  const subCardStyle = "bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-xl transition-all duration-300 hover:bg-white/10";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      
      {/* Air Quality Index */}
      <div className={subCardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-white">Air Quality Index</h3>
          <div className="flex gap-2 text-gray-500">
            <button className="hover:text-pink-400 p-1.5 transition-colors"><Download className="w-5 h-5" /></button>
            <button className="hover:text-pink-400 p-1.5 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Health</span>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-blue-500/30"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Normal Range</span>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <Line options={aqOptions} data={aqData} />
        </div>
      </div>

      {/* Chance of Rain */}
      <div className={subCardStyle}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-white">Precipitation</h3>
          <div className="flex gap-2 text-gray-500">
            <button className="hover:text-yellow-400 p-1.5 transition-colors"><Download className="w-5 h-5" /></button>
            <button className="hover:text-yellow-400 p-1.5 transition-colors"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
           <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">High Probability</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className="w-3 h-3 rounded-full bg-white/10"></div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Low Probability</span>
          </div>
        </div>

        <div className="h-[220px] w-full">
          <Bar options={rainOptions} data={rainData} />
        </div>
      </div>

    </div>
  );
}
