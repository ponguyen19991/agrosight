import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { KnowledgeBaseView } from "@/components/dashboard/knowledge/knowledge-base-view";

export default function KnowledgeBasePage() {
  return (
    <DashboardPageShell>
      <KnowledgeBaseView />
    </DashboardPageShell>
  );
}
