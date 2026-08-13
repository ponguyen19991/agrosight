"use client";

import { Eye, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRolePreview } from "@/hooks/use-role-preview";
import { ROLES_LIST, ROLE_LABEL, type Role } from "@/lib/roles";

export function TeamHeader({ onInvite }: { onInvite: () => void }) {
  const { role, setRole } = useRolePreview();

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl">Team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People who work with your farm.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-border py-1 pl-3 pr-1">
          <Eye className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Preview as</span>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger className="h-6 w-[132px] border-0 bg-transparent px-2 text-xs shadow-none focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLES_LIST.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_LABEL[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={onInvite} className="gap-1.5">
          <Plus className="h-4 w-4" />
          Invite member
        </Button>
      </div>
    </div>
  );
}
