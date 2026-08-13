"use client";

import Link from "next/link";
import { ArrowLeft, Download, FileSpreadsheet, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/routes";
import { useReportById } from "./reports-store";

function OverviewTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted/60 p-4 text-center">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function ReportDetailView({ id }: { id: string }) {
  const { report, isLoading } = useReportById(id);

  const handleExport = (kind: string) => {
    toast({
      variant: "success",
      title: `Export started`,
      description: `Preparing ${kind} export...`,
    });
  };

  const handleShare = () => {
    toast({
      variant: "success",
      title: "Link copied",
      description: "Report link copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-3xl min-w-0 flex-col gap-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto flex max-w-3xl min-w-0 flex-col items-center gap-3 py-16 text-center">
        <p className="font-medium">Report not found</p>
        <p className="text-sm text-muted-foreground">
          It may have expired — reports are only kept for this session.
        </p>
        <Link href={ROUTES.dashboard.reports} className="text-sm font-medium text-primary hover:underline">
          Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl min-w-0 flex-col gap-4">
      <Link
        href={ROUTES.dashboard.reports}
        className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Reports
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">{report.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{report.periodLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => handleExport("PDF")}>
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={() => handleExport("CSV")}>
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShare}>
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>
        </div>
      </div>

      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <p className="font-medium">Farm Overview</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <OverviewTile value={`${report.totalAreaHectares.toFixed(1)} ha`} label="Total Area" />
            <OverviewTile value={`${report.healthPct}%`} label="Health" />
            <OverviewTile
              value={`${report.yieldDeltaPct >= 0 ? "+" : ""}${report.yieldDeltaPct.toFixed(1)}%`}
              label="Yield"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-panel border-0">
        <CardContent className="pt-5">
          <p className="font-medium">Field Performance</p>
          {report.fieldRows.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">No fields included in this report.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="whitespace-nowrap pb-2 font-medium">Field</th>
                    <th className="whitespace-nowrap pb-2 font-medium">Health</th>
                    <th className="whitespace-nowrap pb-2 font-medium">Moisture</th>
                    <th className="whitespace-nowrap pb-2 font-medium">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {report.fieldRows.map((row) => (
                    <tr key={row.name}>
                      <td className="whitespace-nowrap py-2.5 font-medium">{row.name}</td>
                      <td className="whitespace-nowrap py-2.5 text-muted-foreground">{row.health}%</td>
                      <td className="whitespace-nowrap py-2.5 text-muted-foreground">{row.moisture}%</td>
                      <td
                        className={
                          row.yieldDeltaPct >= 0
                            ? "whitespace-nowrap py-2.5 text-emerald-500"
                            : "whitespace-nowrap py-2.5 text-amber-500"
                        }
                      >
                        {row.yieldDeltaPct >= 0 ? "+" : ""}
                        {row.yieldDeltaPct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {report.aiSummary && (
        <Card className="glass-panel border-0">
          <CardContent className="pt-5">
            <p className="font-medium">AI Summary</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{report.aiSummary}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
