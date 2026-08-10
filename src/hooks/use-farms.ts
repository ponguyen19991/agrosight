import { useQuery } from "@tanstack/react-query";
import type { FarmSummary } from "@/types";

async function fetchFarms(): Promise<FarmSummary[]> {
  const res = await fetch("/api/farms");
  if (!res.ok) throw new Error("Failed to load farms");
  return res.json();
}

export function useFarms() {
  return useQuery({ queryKey: ["farms"], queryFn: fetchFarms });
}
