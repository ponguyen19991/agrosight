import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { TeamView } from "@/components/dashboard/team/team-view";

export default function TeamPage() {
  return (
    <DashboardPageShell>
      <TeamView />
    </DashboardPageShell>
  );
}
