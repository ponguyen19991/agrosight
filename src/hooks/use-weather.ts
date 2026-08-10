import { useQuery } from "@tanstack/react-query";
import type { WeatherResponse } from "@/lib/weather";

async function fetchWeather(lat: number, lng: number): Promise<WeatherResponse> {
  const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
  if (!res.ok) throw new Error("Failed to load weather");
  return res.json();
}

export function useWeather(lat: number | undefined, lng: number | undefined) {
  return useQuery({
    queryKey: ["weather", lat, lng],
    queryFn: () => fetchWeather(lat as number, lng as number),
    enabled: lat !== undefined && lng !== undefined,
    staleTime: 5 * 60 * 1000,
  });
}
