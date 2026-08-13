"use client";

import { Check, Minus } from "lucide-react";
import { hasPermission, PERMISSIONS_LIST, PERMISSION_LABEL, ROLES_LIST, ROLE_LABEL } from "@/lib/roles";

export function PermissionMatrix() {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Role Permissions
      </p>
      <div className="glass-panel mt-3 overflow-x-auto rounded-2xl p-4">
        <table className="w-full min-w-[420px] text-left text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground">
              <th className="pb-2 font-medium">Permission</th>
              {ROLES_LIST.map((role) => (
                <th key={role} className="pb-2 text-center font-medium">
                  {ROLE_LABEL[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {PERMISSIONS_LIST.map((permission) => (
              <tr key={permission}>
                <td className="py-2.5 text-muted-foreground">{PERMISSION_LABEL[permission]}</td>
                {ROLES_LIST.map((role) => (
                  <td key={role} className="py-2.5 text-center">
                    {hasPermission(role, permission) ? (
                      <Check className="mx-auto h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
                    ) : (
                      <Minus className="mx-auto h-3.5 w-3.5 text-muted-foreground/40" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
