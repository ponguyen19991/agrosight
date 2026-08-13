"use client";

// No backend model exists for team members/invitations — same pattern as
// reports-store.ts: the React Query cache acts as a client-only store,
// seeded once and mutated directly, surviving client-side navigation
// within the session but resetting on a hard reload.
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Role } from "@/lib/roles";
import {
  INITIAL_ACTIVITY,
  INITIAL_INVITATIONS,
  INITIAL_MEMBERS,
  type ActivityItem,
  type Invitation,
  type Member,
} from "./team-data";

const MEMBERS_KEY = ["team-members"];
const INVITATIONS_KEY = ["team-invitations"];
const ACTIVITY_KEY = ["team-activity"];

export function useMembers() {
  return useQuery({
    queryKey: MEMBERS_KEY,
    queryFn: () => Promise.resolve(INITIAL_MEMBERS),
    staleTime: Infinity,
  });
}

export function useInvitations() {
  return useQuery({
    queryKey: INVITATIONS_KEY,
    queryFn: () => Promise.resolve(INITIAL_INVITATIONS),
    staleTime: Infinity,
  });
}

export function useActivity() {
  return useQuery({
    queryKey: ACTIVITY_KEY,
    queryFn: () => Promise.resolve(INITIAL_ACTIVITY),
    staleTime: Infinity,
  });
}

function useAddActivity() {
  const queryClient = useQueryClient();
  return (description: string, actorName = "You") => {
    queryClient.setQueryData<ActivityItem[]>(ACTIVITY_KEY, (old) => [
      { id: `activity-${Date.now()}`, actorName, description, timestamp: new Date().toISOString() },
      ...(old ?? []),
    ]);
  };
}

export function useAddInvitation() {
  const queryClient = useQueryClient();
  const addActivity = useAddActivity();
  return (invitation: Invitation) => {
    queryClient.setQueryData<Invitation[]>(INVITATIONS_KEY, (old) => [invitation, ...(old ?? [])]);
    addActivity(`invited ${invitation.email}`);
  };
}

export function useCancelInvitation() {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.setQueryData<Invitation[]>(INVITATIONS_KEY, (old) =>
      (old ?? []).filter((i) => i.id !== id)
    );
  };
}

export function useResendInvitation() {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.setQueryData<Invitation[]>(INVITATIONS_KEY, (old) =>
      (old ?? []).map((i) => (i.id === id ? { ...i, invitedAt: new Date().toISOString() } : i))
    );
  };
}

export function useUpdateMemberRole() {
  const queryClient = useQueryClient();
  return (id: string, role: Role) => {
    queryClient.setQueryData<Member[]>(MEMBERS_KEY, (old) =>
      (old ?? []).map((m) => (m.id === id ? { ...m, role } : m))
    );
  };
}

export function useUpdateMemberFieldAccess() {
  const queryClient = useQueryClient();
  return (id: string, fieldAccess: Member["fieldAccess"]) => {
    queryClient.setQueryData<Member[]>(MEMBERS_KEY, (old) =>
      (old ?? []).map((m) => (m.id === id ? { ...m, fieldAccess } : m))
    );
  };
}

export function useSetMemberStatus() {
  const queryClient = useQueryClient();
  return (id: string, status: Member["status"]) => {
    queryClient.setQueryData<Member[]>(MEMBERS_KEY, (old) =>
      (old ?? []).map((m) => (m.id === id ? { ...m, status } : m))
    );
  };
}

export function useRemoveMember() {
  const queryClient = useQueryClient();
  return (id: string) => {
    queryClient.setQueryData<Member[]>(MEMBERS_KEY, (old) => (old ?? []).filter((m) => m.id !== id));
  };
}
