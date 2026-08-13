import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { AnalyticsView } from "@/components/dashboard/analytics/analytics-view";

export default function AnalyticsPage() {
  return (
    <DashboardPageShell>
      <AnalyticsView />
    </DashboardPageShell>
  );
}
