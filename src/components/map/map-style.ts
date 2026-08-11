const MAPTILER_STYLE_ID = "satellite-v4";

/**
 * Builds the MapTiler satellite style URL from NEXT_PUBLIC_MAPTILER_KEY.
 * Returns null when the key isn't set so callers can render a clear
 * "missing key" state instead of letting MapLibre fail on a bad request.
 */
export function getMapTilerStyleUrl(): string | null {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  if (!key) return null;
  return `https://api.maptiler.com/maps/${MAPTILER_STYLE_ID}/style.json?key=${key}`;
}
