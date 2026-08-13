"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format, subDays } from "date-fns";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { reportDetailRoute } from "@/lib/routes";
import type { FarmSummary, FieldSummary } from "@/types";
import { buildReport, DATE_RANGES, REPORT_TYPES, type DateRangeOption, type ReportType } from "./reports-data";
import { useAddReport } from "./reports-store";

type Step = "form" | "generating";

const INCLUDE_OPTIONS = [
  { key: "charts", label: "Charts" },
  { key: "aiSummary", label: "AI Summary" },
  { key: "weather", label: "Weather" },
  { key: "resourceUsage", label: "Resource usage" },
] as const;

type IncludeKey = (typeof INCLUDE_OPTIONS)[number]["key"];

function computePeriodLabel(range: DateRangeOption) {
  const days = DATE_RANGES.find((r) => r.value === range)?.days ?? 7;
  const end = new Date();
  const start = subDays(end, days);
  return `${format(start, "MMM dd, yyyy")} — ${format(end, "MMM dd, yyyy")}`;
}

export function GenerateReportDialog({
  open,
  onOpenChange,
  farm,
  fields,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  farm: FarmSummary | undefined;
  fields: FieldSummary[];
}) {
  const router = useRouter();
  const addReport = useAddReport();

  const [step, setStep] = useState<Step>("form");
  const [type, setType] = useState<ReportType>("farm-performance");
  const [dateRange, setDateRange] = useState<DateRangeOption>("7d");
  const [selectedFieldIds, setSelectedFieldIds] = useState<Set<string>>(new Set());
  const [includes, setIncludes] = useState<Record<IncludeKey, boolean>>({
    charts: true,
    aiSummary: true,
    weather: true,
    resourceUsage: true,
  });
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("Analyzing field performance");

  // Reset to a fresh form (and default to "all fields checked") every time
  // the dialog opens, rather than resuming a stale selection from last time.
  useEffect(() => {
    if (open) {
      setStep("form");
      setSelectedFieldIds(new Set(fields.map((f) => f.id)));
    }
  }, [open, fields]);

  useEffect(() => {
    if (step !== "generating") return;
    setProgress(12);
    setProgressLabel("Analyzing field performance");

    const timers = [
      setTimeout(() => setProgress(70), 900),
      setTimeout(() => setProgressLabel("Generating AI summary..."), 1300),
      setTimeout(() => setProgress(100), 1900),
      setTimeout(() => {
        const scopedFields = fields.filter((f) => selectedFieldIds.has(f.id));
        const report = buildReport({
          type,
          periodLabel: computePeriodLabel(dateRange),
          farm,
          fields: scopedFields.length ? scopedFields : fields,
        });
        if (!includes.aiSummary) report.aiSummary = "";
        addReport(report);
        onOpenChange(false);
        toast({ variant: "success", title: "Report generated", description: report.title });
        router.push(reportDetailRoute(report.id));
      }, 2300),
    ];

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const toggleField = (id: string) => {
    setSelectedFieldIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => step === "form" && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Generate Report</DialogTitle>
              <DialogDescription>Choose scope and content for the new report.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Report</p>
                <Select value={type} onValueChange={(v) => setType(v as ReportType)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                        {t.recommended ? " ⭐" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Date range</p>
                <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRangeOption)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Fields</p>
                <div className="max-h-32 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                  {fields.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No fields available.</p>
                  ) : (
                    fields.map((field) => (
                      <label key={field.id} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={selectedFieldIds.has(field.id)}
                          onCheckedChange={() => toggleField(field.id)}
                        />
                        {field.name}
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-medium">Include</p>
                <div className="grid grid-cols-2 gap-2">
                  {INCLUDE_OPTIONS.map((option) => (
                    <label key={option.key} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={includes[option.key]}
                        onCheckedChange={(checked) =>
                          setIncludes((prev) => ({ ...prev, [option.key]: checked === true }))
                        }
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => setStep("generating")}>
              Generate Report
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Sparkles className="h-6 w-6 animate-pulse" strokeWidth={1.75} />
            </span>
            <div>
              <p className="font-medium">Generating your report...</p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                {progressLabel}
              </p>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
