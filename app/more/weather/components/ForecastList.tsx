import { DailyForecast } from "../utils/weatherApi";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export default function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="p-8 text-white h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">Forecast</h2>
        <div className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-gray-400">
          7 Days
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 flex-1">
        {forecast.map((day, index) => (
          <div 
            key={day.date}
            className={`flex flex-col items-center justify-center p-4 rounded-3xl transition-all duration-300 ${
              index === 0 
                ? 'bg-white/10 border border-white/20 shadow-xl' 
                : 'hover:bg-white/5 border border-transparent hover:border-white/10'
            }`}
          >
            <span className={`font-bold mb-1 ${index === 0 ? 'text-pink-400' : 'text-gray-200'}`}>{day.dayName}</span>
            <span className="text-xs mb-4 text-gray-500 font-medium">
              {new Date(day.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
            </span>
            
            {day.icon && <day.icon className={`w-10 h-10 mb-4 ${index === 0 ? 'text-yellow-300 drop-shadow-glow' : 'text-gray-400'}`} />}
            
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-black text-white">{day.tempMax}°</span>
              <span className="text-xs text-gray-500 font-bold">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
