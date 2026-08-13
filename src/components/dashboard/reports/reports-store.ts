"use client";

// Reports have no backend model — this treats the React Query cache as a
// lightweight client-only store instead. It's seeded once and survives
// client-side navigation within the session (e.g. list → detail page),
// same as any other query in the cache, but resets on a hard reload —
// consistent with the rest of the app's "demo, no persistence" pattern.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { INITIAL_REPORTS, type Report } from "./reports-data";

const REPORTS_QUERY_KEY = ["reports"];

export function useReports() {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () => Promise.resolve(INITIAL_REPORTS),
    staleTime: Infinity,
  });
}

export function useReportById(id: string) {
  const { data, isLoading } = useReports();
  return { report: data?.find((r) => r.id === id), isLoading };
}

export function useAddReport() {
  const queryClient = useQueryClient();
  return (report: Report) => {
    queryClient.setQueryData<Report[]>(REPORTS_QUERY_KEY, (old) => [report, ...(old ?? [])]);
  };
}
