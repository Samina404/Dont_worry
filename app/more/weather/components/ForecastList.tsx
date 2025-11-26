import { DailyForecast } from "../utils/weatherApi";

interface ForecastListProps {
  forecast: DailyForecast[];
}

export default function ForecastList({ forecast }: ForecastListProps) {
  return (
    <div className="bg-gradient-to-b from-[#9a3f97] to-[#300770] rounded-[30px] p-8 shadow-lg text-white">
      <h2 className="text-xl font-bold mb-6">Forecast</h2>
      
      {/* City tabs placeholder */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        <button className="px-6 py-2 bg-white/20 text-white rounded-full font-medium whitespace-nowrap backdrop-blur-sm">
          7 Days
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => (
          <div 
            key={day.date}
            className={`flex flex-col items-center p-4 rounded-3xl transition-all ${
              index === 0 
                ? 'bg-white/20 border-2 border-white/30' 
                : 'hover:bg-white/10'
            }`}
          >
            <span className="font-medium mb-1">{day.dayName}</span>
            <span className="text-sm mb-4 opacity-70">
              {new Date(day.date).getDate()}
            </span>
            
            {day.icon && <day.icon className={`w-8 h-8 mb-4 ${index === 0 ? 'text-yellow-400' : 'text-white/70'}`} />}
            
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold">{day.tempMax}°</span>
              <span className="text-sm opacity-70">{day.tempMin}°</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
