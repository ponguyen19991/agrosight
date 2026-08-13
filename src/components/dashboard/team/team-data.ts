import type { Role } from "@/lib/roles";

export type MemberStatus = "active" | "suspended";

export interface Member {
  id: string;
  name: string;
  email: string;
  role: Role;
  fieldAccess: "all" | string[];
  status: MemberStatus;
}

export interface Invitation {
  id: string;
  email: string;
  role: Role;
  fieldAccess: "all" | string[];
  message?: string;
  invitedAt: string; // ISO
}

export interface ActivityItem {
  id: string;
  actorName: string;
  description: string;
  timestamp: string; // ISO
}

export function fieldAccessLabel(access: "all" | string[]) {
  if (access === "all") return "All fields";
  if (access.length === 1) return access[0];
  return `${access.length} fields`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) => new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "member-owner",
    name: "Nguyen Van A",
    email: "owner@farm.vn",
    role: "owner",
    fieldAccess: "all",
    status: "active",
  },
  {
    id: "member-manager",
    name: "Tran Minh B",
    email: "manager@farm.vn",
    role: "manager",
    fieldAccess: "all",
    status: "active",
  },
  {
    id: "member-agronomist",
    name: "Le Minh C",
    email: "agronomist@farm.vn",
    role: "agronomist",
    fieldAccess: ["North Field A1", "East Field B2", "South Field C3"],
    status: "active",
  },
  {
    id: "member-worker",
    name: "Pham Van D",
    email: "worker@farm.vn",
    role: "worker",
    fieldAccess: ["South Field C3"],
    status: "active",
  },
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: "invite-seed-1",
    email: "minh@example.com",
    role: "agronomist",
    fieldAccess: ["North Field A1", "East Field B2"],
    message: "You've been invited to Green Valley Farm",
    invitedAt: hoursAgo(2),
  },
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: "activity-1",
    actorName: "Tran Minh B",
    description: "updated North Field A1",
    timestamp: hoursAgo(0.2),
  },
  {
    id: "activity-2",
    actorName: "Le Minh C",
    description: "reviewed an AI recommendation",
    timestamp: hoursAgo(1),
  },
  {
    id: "activity-3",
    actorName: "Nguyen Van A",
    description: "invited Pham Van D",
    timestamp: daysAgo(1),
  },
];
