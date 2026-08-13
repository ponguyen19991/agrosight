"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import { GenerateReportDialog } from "./generate-report-dialog";
import { ReportCard } from "./report-card";
import { useReports } from "./reports-store";

export function ReportsListView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: farms } = useFarms();
  const farm = farms?.[0];
  const { data: fields } = useFields(farm?.id);
  const { data: reports, isLoading } = useReports();

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports ?? [];
    return (reports ?? []).filter(
      (r) => r.title.toLowerCase().includes(q) || r.periodLabel.toLowerCase().includes(q)
    );
  }, [reports, query]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl min-w-0 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate, review and export farm performance reports.
        </p>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Button onClick={() => setIsDialogOpen(true)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            Generate Report
          </Button>
          <div className="relative w-full max-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-9 pl-9"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Recent Reports
        </p>
        <div className="mt-3 flex flex-col gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-28 w-full rounded-2xl" />
            </>
          ) : filteredReports.length === 0 ? (
            <div className="glass-panel rounded-2xl p-8 text-center text-sm text-muted-foreground">
              No reports match your search.
            </div>
          ) : (
            filteredReports.map((report) => <ReportCard key={report.id} report={report} />)
          )}
        </div>
      </div>

      <GenerateReportDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        farm={farm}
        fields={fields ?? []}
      />
    </div>
  );
}
