import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { SettingsView } from "@/components/dashboard/settings/settings-view";

export default function SettingsPage() {
  return (
    <DashboardPageShell>
      <SettingsView />
    </DashboardPageShell>
  );
}
