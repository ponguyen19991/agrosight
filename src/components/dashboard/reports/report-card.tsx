"use client";

import { useRouter } from "next/navigation";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { reportDetailRoute } from "@/lib/routes";
import type { Report } from "./reports-data";

export function ReportCard({ report }: { report: Report }) {
  const router = useRouter();

  const handleExportPdf = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Demo only — no PDF renderer wired up.
    toast({
      variant: "success",
      title: "Export started",
      description: `${report.title} is being prepared as a PDF.`,
    });
  };

  return (
    <button
      type="button"
      onClick={() => router.push(reportDetailRoute(report.id))}
      className="glass-panel flex w-full flex-col gap-4 rounded-2xl p-5 text-left transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <FileText className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <p className="font-medium">{report.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{report.periodLabel}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {report.fieldCount} fields · {report.totalAreaHectares.toFixed(1)} ha
          </p>
          {report.type === "farm-performance" && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {report.quickStats.map((stat) => (
                <span key={stat.label} className="text-muted-foreground">
                  {stat.label}{" "}
                  <span className={stat.isPositive ? "text-emerald-500" : "text-amber-500"}>
                    {stat.value}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.stopPropagation();
            router.push(reportDetailRoute(report.id));
          }}
        >
          View
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={handleExportPdf}>
          <Download className="h-3.5 w-3.5" />
          PDF
        </Button>
      </div>
    </button>
  );
}
