"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ROLES_LIST, ROLE_LABEL, type Role } from "@/lib/roles";
import type { FieldSummary } from "@/types";
import { fieldAccessLabel, initials, type Member } from "./team-data";
import { MemberRowActions } from "./member-row-actions";

const ROLE_BADGE_CLASS: Record<Role, string> = {
  owner: "bg-primary/15 text-primary",
  manager: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  agronomist: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  worker: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

export function MemberTable({
  members,
  fields,
  isLoading,
}: {
  members: Member[];
  fields: FieldSummary[];
  isLoading?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | Role>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesRole = roleFilter === "all" || m.role === roleFilter;
      const matchesQuery = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [members, query, roleFilter]);

  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Team Members
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members..."
            className="h-9 pl-9"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as "all" | Role)}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            {ROLES_LIST.map((r) => (
              <SelectItem key={r} value={r}>
                {ROLE_LABEL[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="glass-panel mt-3 divide-y divide-border rounded-2xl px-4">
        {isLoading ? (
          <div className="space-y-3 py-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No members match.</p>
        ) : (
          filtered.map((member) => (
            <div key={member.id} className="flex items-center gap-3 py-3.5">
              <Avatar className="h-9 w-9 shrink-0 border border-border">
                <AvatarFallback className="bg-secondary text-xs">
                  {initials(member.name)}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{member.name}</p>
                <p className="truncate text-xs text-muted-foreground">{member.email}</p>
              </div>

              <Badge
                variant="outline"
                className={cn("hidden shrink-0 border-transparent font-medium sm:inline-flex", ROLE_BADGE_CLASS[member.role])}
              >
                {ROLE_LABEL[member.role]}
              </Badge>

              <span className="hidden w-24 shrink-0 truncate text-xs text-muted-foreground md:inline">
                {fieldAccessLabel(member.fieldAccess)}
              </span>

              <span
                className={cn(
                  "hidden shrink-0 items-center gap-1.5 text-xs sm:flex",
                  member.status === "active" ? "text-emerald-500" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    member.status === "active" ? "bg-emerald-500" : "bg-muted-foreground"
                  )}
                />
                {member.status === "active" ? "Active" : "Suspended"}
              </span>

              <MemberRowActions member={member} fields={fields} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
