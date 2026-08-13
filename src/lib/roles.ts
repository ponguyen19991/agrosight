// Team/RBAC model: an Account owns one Farm; a Farm has Members, each with
// one Role and a set of Fields they can access. Kept to 4 roles and 8
// permissions deliberately — enough to demonstrate real RBAC without
// building a full permission-matrix editor.
export type Role = "owner" | "manager" | "agronomist" | "worker";

export const ROLES_LIST: Role[] = ["owner", "manager", "agronomist", "worker"];

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  manager: "Farm Manager",
  agronomist: "Agronomist",
  worker: "Field Worker",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  owner: "Full access — manage the farm, invite members, and configure the system.",
  manager: "Runs day-to-day operations. Can't delete the farm or transfer ownership.",
  agronomist: "Reviews field health, soil data, crop info, and AI recommendations.",
  worker: "Works the fields directly — logs irrigation, fertilizer, and issues.",
};

export type Permission =
  | "viewFields"
  | "editFields"
  | "analytics"
  | "aiInsights"
  | "reports"
  | "inviteMembers"
  | "manageFarm"
  | "deleteFarm";

export const PERMISSIONS_LIST: Permission[] = [
  "viewFields",
  "editFields",
  "analytics",
  "aiInsights",
  "reports",
  "inviteMembers",
  "manageFarm",
  "deleteFarm",
];

export const PERMISSION_LABEL: Record<Permission, string> = {
  viewFields: "View fields",
  editFields: "Edit fields",
  analytics: "Analytics",
  aiInsights: "AI insights",
  reports: "Reports",
  inviteMembers: "Invite members",
  manageFarm: "Manage farm",
  deleteFarm: "Delete farm",
};

const PERMISSION_MATRIX: Record<Permission, Record<Role, boolean>> = {
  viewFields: { owner: true, manager: true, agronomist: true, worker: true },
  editFields: { owner: true, manager: true, agronomist: true, worker: true },
  analytics: { owner: true, manager: true, agronomist: true, worker: false },
  aiInsights: { owner: true, manager: true, agronomist: true, worker: false },
  reports: { owner: true, manager: true, agronomist: true, worker: false },
  inviteMembers: { owner: true, manager: true, agronomist: false, worker: false },
  manageFarm: { owner: true, manager: true, agronomist: false, worker: false },
  deleteFarm: { owner: true, manager: false, agronomist: false, worker: false },
};

export function hasPermission(role: Role, permission: Permission) {
  return PERMISSION_MATRIX[permission][role];
}
