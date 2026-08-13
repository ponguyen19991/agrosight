import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { ReportsListView } from "@/components/dashboard/reports/reports-list-view";

export default function ReportsPage() {
  return (
    <DashboardPageShell>
      <ReportsListView />
    </DashboardPageShell>
  );
}
