import { useQuery } from "@tanstack/react-query";
import type { FieldSummary } from "@/types";

async function fetchFields(farmId: string): Promise<FieldSummary[]> {
  const res = await fetch(`/api/fields?farmId=${encodeURIComponent(farmId)}`);
  if (!res.ok) throw new Error("Failed to load fields");
  return res.json();
}

export function useFields(farmId: string | undefined) {
  return useQuery({
    queryKey: ["fields", farmId],
    queryFn: () => fetchFields(farmId as string),
    enabled: Boolean(farmId),
  });
}
