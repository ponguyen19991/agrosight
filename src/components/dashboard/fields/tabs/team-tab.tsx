"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMembers } from "@/components/dashboard/team/team-store";
import { initials } from "@/components/dashboard/team/team-data";
import { ROLE_LABEL } from "@/lib/roles";
import { ROUTES } from "@/lib/routes";
import type { FieldSummary } from "@/types";
import { ChartCard } from "../../analytics/analytics-shared";

export function TeamTab({ field }: { field: FieldSummary }) {
  const router = useRouter();
  const { data: members, isLoading } = useMembers();

  const withAccess = (members ?? []).filter(
    (m) => m.fieldAccess === "all" || m.fieldAccess.includes(field.name)
  );

  return (
    <ChartCard title="People with access">
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : withAccess.length === 0 ? (
        <p className="text-sm text-muted-foreground">No one has been assigned to this field yet.</p>
      ) : (
        <div className="divide-y divide-border">
          {withAccess.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarFallback className="bg-secondary text-xs">
                  {initials(member.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABEL[member.role]}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={() => router.push(ROUTES.dashboard.team)}
      >
        Manage access
      </Button>
    </ChartCard>
  );
}
