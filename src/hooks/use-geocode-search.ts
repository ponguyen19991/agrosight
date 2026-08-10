import { useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { GeocodeResult } from "@/lib/geocode";

async function fetchGeocode(query: string): Promise<GeocodeResult[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to search locations");
  return res.json();
}

export function useGeocodeSearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 350);

  return useQuery({
    queryKey: ["geocode", debounced],
    queryFn: () => fetchGeocode(debounced),
    enabled: debounced.length >= 2,
  });
}
