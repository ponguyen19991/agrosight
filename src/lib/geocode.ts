const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";

export interface GeocodeResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  lat: number;
  lng: number;
}

export async function searchLocations(query: string): Promise<GeocodeResult[]> {
  const url = new URL(OPEN_METEO_GEOCODING_URL);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "6");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Open-Meteo geocoding request failed with status ${res.status}`);
  }
  const data = await res.json();

  return (data.results ?? []).map(
    (result: {
      id: number;
      name: string;
      country: string;
      admin1?: string;
      latitude: number;
      longitude: number;
    }) => ({
      id: result.id,
      name: result.name,
      country: result.country,
      admin1: result.admin1,
      lat: result.latitude,
      lng: result.longitude,
    })
  );
}
