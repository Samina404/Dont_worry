import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Sun, CloudDrizzle } from "lucide-react";

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
    icon: any;
    high: number;
    low: number;
    feelsLike: number;
    windSpeed: number;
    windDirection: number; // degrees
    humidity: number;
    visibility: number; // km
    pressure: number;
    uvIndex: number;
    sunrise: string;
    sunset: string;
    isDay: boolean;
  };
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  airQuality: {
    pm10: number;
    pm2_5: number;
    carbon_monoxide: number;
    nitrogen_dioxide: number;
    sulphur_dioxide: number;
    ozone: number;
    us_aqi: number;
  };
}

export interface DailyForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  icon: any;
  rainChance: number;
}

export interface HourlyForecast {
  time: string;
  temp: number;
  condition: string;
  icon: any;
}

export interface LocationData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Map WMO Weather Codes to readable format and icons
export const getWeatherInfo = (code: number, isDay: boolean = true) => {
  const info = {
    0: { label: "Clear sky", icon: Sun },
    1: { label: "Mainly clear", icon: isDay ? Sun : Cloud },
    2: { label: "Partly cloudy", icon: Cloud },
    3: { label: "Overcast", icon: Cloud },
    45: { label: "Fog", icon: CloudFog },
    48: { label: "Depositing rime fog", icon: CloudFog },
    51: { label: "Light drizzle", icon: CloudDrizzle },
    53: { label: "Moderate drizzle", icon: CloudDrizzle },
    55: { label: "Dense drizzle", icon: CloudDrizzle },
    56: { label: "Light freezing drizzle", icon: CloudDrizzle },
    57: { label: "Dense freezing drizzle", icon: CloudDrizzle },
    61: { label: "Slight rain", icon: CloudRain },
    63: { label: "Moderate rain", icon: CloudRain },
    65: { label: "Heavy rain", icon: CloudRain },
    66: { label: "Light freezing rain", icon: CloudRain },
    67: { label: "Heavy freezing rain", icon: CloudRain },
    71: { label: "Slight snow fall", icon: CloudSnow },
    73: { label: "Moderate snow fall", icon: CloudSnow },
    75: { label: "Heavy snow fall", icon: CloudSnow },
    77: { label: "Snow grains", icon: CloudSnow },
    80: { label: "Slight rain showers", icon: CloudRain },
    81: { label: "Moderate rain showers", icon: CloudRain },
    82: { label: "Violent rain showers", icon: CloudLightning },
    85: { label: "Slight snow showers", icon: CloudSnow },
    86: { label: "Heavy snow showers", icon: CloudSnow },
    95: { label: "Thunderstorm", icon: CloudLightning },
    96: { label: "Thunderstorm with slight hail", icon: CloudLightning },
    99: { label: "Thunderstorm with heavy hail", icon: CloudLightning },
  };
  return info[code as keyof typeof info] || { label: "Unknown", icon: Cloud };
};

export const searchLocation = async (query: string): Promise<LocationData[]> => {
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query
      )}&count=5&language=en&format=json`
    );
    const data = await res.json();
    if (!data.results) return [];
    
    return data.results.map((item: any) => ({
      name: item.name,
      country: item.country,
      lat: item.latitude,
      lon: item.longitude,
    }));
  } catch (error) {
    console.error("Error searching location:", error);
    return [];
  }
};

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m",
      hourly: "temperature_2m,weather_code,visibility",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max",
      timezone: "auto",
      forecast_days: "7"
    });

    // Fetch Air Quality separately as it's a different endpoint
    const aqParams = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: "us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone",
        timezone: "auto"
    });

    const [weatherRes, aqRes] = await Promise.all([
        fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`),
        fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${aqParams.toString()}`)
    ]);

    const weatherData = await weatherRes.json();
    const aqData = await aqRes.json();

    const current = weatherData.current;
    const daily = weatherData.daily;
    const weatherInfo = getWeatherInfo(current.weather_code, current.is_day === 1);

    // Process forecast
    const forecast: DailyForecast[] = daily.time.map((time: string, index: number) => {
        const date = new Date(time);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const info = getWeatherInfo(daily.weather_code[index]);
        
        return {
            date: time,
            dayName,
            tempMax: Math.round(daily.temperature_2m_max[index]),
            tempMin: Math.round(daily.temperature_2m_min[index]),
            condition: info.label,
            icon: info.icon,
            rainChance: daily.precipitation_probability_max[index]
        };
    });

    return {
      current: {
        temp: Math.round(current.temperature_2m),
        condition: weatherInfo.label,
        description: weatherInfo.label,
        icon: weatherInfo.icon,
        high: Math.round(daily.temperature_2m_max[0]),
        low: Math.round(daily.temperature_2m_min[0]),
        feelsLike: Math.round(current.apparent_temperature),
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        humidity: current.relative_humidity_2m,
        visibility: weatherData.hourly.visibility[0] / 1000, // Convert m to km (using first hourly point as proxy for current if needed, or fetch current visibility if available)
        pressure: current.surface_pressure,
        uvIndex: daily.uv_index_max[0],
        sunrise: daily.sunrise[0],
        sunset: daily.sunset[0],
        isDay: current.is_day === 1,
      },
      forecast,
      hourly: [], // Populate if needed
      airQuality: {
          pm10: aqData.current.pm10,
          pm2_5: aqData.current.pm2_5,
          carbon_monoxide: aqData.current.carbon_monoxide,
          nitrogen_dioxide: aqData.current.nitrogen_dioxide,
          sulphur_dioxide: aqData.current.sulphur_dioxide,
          ozone: aqData.current.ozone,
          us_aqi: aqData.current.us_aqi
      }
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};
