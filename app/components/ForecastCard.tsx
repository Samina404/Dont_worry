import React from "react";

export default function ForecastCard({
  day,
  temp,
  selected = false,
  icon,
}: {
  day: string;
  temp: number;
  selected?: boolean;
  icon: string; // direct icon URL
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center w-24 h-32 rounded-2xl shadow-md transition-all 
      ${
        selected
          ? "bg-gradient-to-b from-[#FF7A32] to-[#FFB36A] text-white"
          : "bg-white/20 backdrop-blur-md text-white"
      }
    `}
    >
      {/* Icon */}
      <img src={icon} alt="weather" className="w-10 h-10 mb-2" />

      {/* Day */}
      <p className="text-sm font-medium">{day}</p>

      {/* Temperature */}
      <p className="text-lg font-semibold">{temp}°</p>
    </div>
  );
}
