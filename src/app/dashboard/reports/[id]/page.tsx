import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { ReportDetailView } from "@/components/dashboard/reports/report-detail-view";

export default function ReportDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardPageShell>
      <ReportDetailView id={params.id} />
    </DashboardPageShell>
  );
}
