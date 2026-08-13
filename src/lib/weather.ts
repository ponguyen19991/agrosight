const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export type WeatherCondition =
  | "clear"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

export interface WeatherSummary {
  condition: WeatherCondition;
  label: string;
  isDay: boolean;
}

export interface WeatherResponse {
  timezone: string;
  current: {
    temperatureC: number;
    humidityPct: number;
    windSpeedKmh: number;
    time: string;
  } & WeatherSummary;
  today: {
    temperatureMaxC: number;
    temperatureMinC: number;
    precipitationProbabilityPct: number;
  };
  forecast: {
    date: string;
    temperatureMaxC: number;
    temperatureMinC: number;
    precipitationProbabilityPct: number;
  }[];
}

// WMO weather interpretation codes: https://open-meteo.com/en/docs
function describeWeatherCode(code: number, isDay: boolean): WeatherSummary {
  const day = isDay;
  if (code === 0) return { condition: "clear", label: day ? "Sunny Day" : "Clear Night", isDay };
  if ([1, 2, 3].includes(code))
    return { condition: "cloudy", label: "Partly Cloudy", isDay };
  if ([45, 48].includes(code)) return { condition: "fog", label: "Foggy", isDay };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code))
    return { condition: "rain", label: "Rainy", isDay };
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return { condition: "snow", label: "Snowy", isDay };
  if ([95, 96, 99].includes(code))
    return { condition: "storm", label: "Thunderstorm", isDay };
  return { condition: "cloudy", label: "Overcast", isDay };
}

export async function getWeather(lat: number, lng: number): Promise<WeatherResponse> {
  const url = new URL(OPEN_METEO_FORECAST_URL);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,is_day"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max"
  );
  url.searchParams.set("timezone", "auto");

  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo request failed with status ${res.status}`);
  }
  const data = await res.json();

  const isDay = data.current.is_day === 1;
  const summary = describeWeatherCode(data.current.weather_code, isDay);

  return {
    timezone: data.timezone,
    current: {
      temperatureC: Math.round(data.current.temperature_2m),
      humidityPct: Math.round(data.current.relative_humidity_2m),
      windSpeedKmh: Math.round(data.current.wind_speed_10m),
      time: data.current.time,
      ...summary,
    },
    today: {
      temperatureMaxC: Math.round(data.daily.temperature_2m_max[0]),
      temperatureMinC: Math.round(data.daily.temperature_2m_min[0]),
      precipitationProbabilityPct: Math.round(
        data.daily.precipitation_probability_max[0] ?? 0
      ),
    },
    forecast: (data.daily.time as string[]).map((date: string, i: number) => ({
      date,
      temperatureMaxC: Math.round(data.daily.temperature_2m_max[i]),
      temperatureMinC: Math.round(data.daily.temperature_2m_min[i]),
      precipitationProbabilityPct: Math.round(data.daily.precipitation_probability_max[i] ?? 0),
    })),
  };
}
