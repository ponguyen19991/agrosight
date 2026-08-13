"use client";

import { createContext, useContext, useState } from "react";
import type { Role } from "@/lib/roles";

// No real auth exists, so there's no "logged-in user's role" to read. This
// simulates one: defaults to Owner, switchable from the Team page, and read
// by the sidebar to demonstrate role-driven navigation (a Field Worker
// shouldn't see Analytics/Team/Settings in their menu).
interface RolePreviewContextValue {
  role: Role;
  setRole: (role: Role) => void;
}

const RolePreviewContext = createContext<RolePreviewContextValue | null>(null);

export function RolePreviewProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("owner");
  return (
    <RolePreviewContext.Provider value={{ role, setRole }}>{children}</RolePreviewContext.Provider>
  );
}

export function useRolePreview() {
  const ctx = useContext(RolePreviewContext);
  if (!ctx) {
    throw new Error("useRolePreview must be used within a RolePreviewProvider");
  }
  return ctx;
}
