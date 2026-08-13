import { DashboardPageShell } from "@/components/dashboard/dashboard-page-shell";
import { FieldDetailView } from "@/components/dashboard/fields/field-detail-view";

export default function FieldDetailPage({ params }: { params: { id: string } }) {
  return (
    <DashboardPageShell>
      <FieldDetailView id={params.id} />
    </DashboardPageShell>
  );
}
