"use client";

import { useState } from "react";
import { MoreVertical, UserCog, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { ROLES_LIST, ROLE_LABEL, type Role } from "@/lib/roles";
import type { FieldSummary } from "@/types";
import type { Member } from "./team-data";
import {
  useRemoveMember,
  useSetMemberStatus,
  useUpdateMemberFieldAccess,
  useUpdateMemberRole,
} from "./team-store";

export function MemberRowActions({ member, fields }: { member: Member; fields: FieldSummary[] }) {
  const [fieldAccessOpen, setFieldAccessOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(member.fieldAccess === "all" ? fields.map((f) => f.name) : member.fieldAccess)
  );

  const updateRole = useUpdateMemberRole();
  const updateFieldAccess = useUpdateMemberFieldAccess();
  const setStatus = useSetMemberStatus();
  const removeMember = useRemoveMember();

  const handleRoleChange = (role: string) => {
    updateRole(member.id, role as Role);
    toast({
      variant: "success",
      title: "Role updated",
      description: `${member.name} is now ${ROLE_LABEL[role as Role]}.`,
    });
  };

  const handleToggleStatus = () => {
    const next = member.status === "active" ? "suspended" : "active";
    setStatus(member.id, next);
    toast({
      variant: next === "suspended" ? "warning" : "success",
      title: next === "suspended" ? "Member suspended" : "Member reactivated",
      description: member.name,
    });
  };

  const handleSaveFieldAccess = () => {
    updateFieldAccess(member.id, Array.from(selectedFields));
    setFieldAccessOpen(false);
    toast({ variant: "success", title: "Field access updated", description: member.name });
  };

  const handleRemove = () => {
    removeMember(member.id);
    setRemoveOpen(false);
    toast({ variant: "success", title: "Member removed", description: member.name });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              toast({ variant: "default", title: member.name, description: member.email })
            }
          >
            View profile
          </DropdownMenuItem>

          {member.role !== "owner" && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserCog className="h-3.5 w-3.5" />
                Edit role
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={member.role} onValueChange={handleRoleChange}>
                  {ROLES_LIST.filter((r) => r !== "owner").map((r) => (
                    <DropdownMenuRadioItem key={r} value={r}>
                      {ROLE_LABEL[r]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}

          {member.role !== "owner" && (
            <DropdownMenuItem onClick={() => setFieldAccessOpen(true)}>
              Manage field access
            </DropdownMenuItem>
          )}

          {member.role !== "owner" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleToggleStatus}>
                {member.status === "active" ? "Suspend member" : "Reactivate member"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setRemoveOpen(true)}
              >
                <UserX className="h-3.5 w-3.5" />
                Remove member
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={fieldAccessOpen} onOpenChange={setFieldAccessOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Field access</DialogTitle>
            <DialogDescription>Choose which fields {member.name} can access.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {fields.map((field) => (
              <label key={field.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedFields.has(field.name)}
                  onCheckedChange={(checked) => {
                    setSelectedFields((prev) => {
                      const next = new Set(prev);
                      if (checked === true) next.add(field.name);
                      else next.delete(field.name);
                      return next;
                    });
                  }}
                />
                {field.name}
              </label>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFieldAccessOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFieldAccess}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove {member.name}?</DialogTitle>
            <DialogDescription>
              They&apos;ll immediately lose access to this farm. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
