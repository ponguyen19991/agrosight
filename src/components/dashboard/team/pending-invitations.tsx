"use client";

import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { ROLE_LABEL } from "@/lib/roles";
import { fieldAccessLabel, type Invitation } from "./team-data";
import { useCancelInvitation, useResendInvitation } from "./team-store";

export function PendingInvitations({
  invitations,
  isLoading,
}: {
  invitations: Invitation[];
  isLoading?: boolean;
}) {
  const resend = useResendInvitation();
  const cancel = useCancelInvitation();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-sm text-muted-foreground">
        No pending invitations.
      </div>
    );
  }

  return (
    <div className="glass-panel divide-y divide-border rounded-2xl px-5">
      {invitations.map((invite) => (
        <div
          key={invite.id}
          className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-medium">{invite.email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ROLE_LABEL[invite.role]} · {fieldAccessLabel(invite.fieldAccess)}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Invited {formatDistanceToNow(new Date(invite.invitedAt), { addSuffix: true })}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resend(invite.id);
                toast({ variant: "success", title: "Invitation resent", description: invite.email });
              }}
            >
              Resend
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => {
                cancel(invite.id);
                toast({ variant: "default", title: "Invitation canceled", description: invite.email });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
