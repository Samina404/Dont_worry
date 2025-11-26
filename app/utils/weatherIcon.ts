export function getWeatherIcon(weather: string | undefined | null) {
  if (!weather) {
    return "https://cdn-icons-png.flaticon.com/512/4834/4834553.png"; // default cloud
  }

  const w = weather.toLowerCase();

  if (w.includes("clear"))
    return "https://cdn-icons-png.flaticon.com/512/6974/6974833.png";

  if (w.includes("cloud"))
    return "https://cdn-icons-png.flaticon.com/512/3982/3982117.png";

  if (w.includes("rain"))
    return "https://cdn-icons-png.flaticon.com/512/3076/3076129.png";

  if (w.includes("storm") || w.includes("thunder"))
    return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png";

  if (w.includes("snow"))
    return "https://cdn-icons-png.flaticon.com/512/2315/2315309.png";

  if (w.includes("mist") || w.includes("fog") || w.includes("haze"))
    return "https://cdn-icons-png.flaticon.com/512/4005/4005901.png";

  return "https://cdn-icons-png.flaticon.com/512/3982/3982117.png"; // fallback
}
