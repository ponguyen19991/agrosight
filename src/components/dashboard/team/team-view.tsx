"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFarms } from "@/hooks/use-farms";
import { useFields } from "@/hooks/use-fields";
import { InviteMemberDialog } from "./invite-member-dialog";
import { MemberTable } from "./member-table";
import { PendingInvitations } from "./pending-invitations";
import { PermissionMatrix } from "./permission-matrix";
import { RecentActivity } from "./recent-activity";
import { TeamHeader } from "./team-header";
import { TeamStats } from "./team-stats";
import { useActivity, useInvitations, useMembers } from "./team-store";

export function TeamView() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const { data: farms } = useFarms();
  const farm = farms?.[0];
  const { data: fields } = useFields(farm?.id);
  const fieldList = fields ?? [];

  const { data: members, isLoading: isMembersLoading } = useMembers();
  const { data: invitations, isLoading: isInvitationsLoading } = useInvitations();
  const { data: activity, isLoading: isActivityLoading } = useActivity();

  const memberList = members ?? [];
  const invitationList = invitations ?? [];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl min-w-0 flex-col gap-5">
      <TeamHeader onInvite={() => setIsInviteOpen(true)} />

      <TeamStats members={memberList} isLoading={isMembersLoading} />

      <Tabs defaultValue="members">
        <TabsList className="h-10 rounded-full bg-muted p-1">
          <TabsTrigger value="members" className="rounded-full">
            Members {memberList.length}
          </TabsTrigger>
          <TabsTrigger value="pending" className="rounded-full">
            Pending invitations {invitationList.length}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="mt-4">
          <MemberTable members={memberList} fields={fieldList} isLoading={isMembersLoading} />
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <PendingInvitations invitations={invitationList} isLoading={isInvitationsLoading} />
        </TabsContent>
      </Tabs>

      <PermissionMatrix />

      <RecentActivity activity={activity ?? []} isLoading={isActivityLoading} />

      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        farmName={farm?.name ?? "your farm"}
        fields={fieldList}
      />
    </div>
  );
}
