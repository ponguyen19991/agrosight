import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CreateFieldInput, UpdateFieldInput } from "@/lib/validations/field";
import type { FieldSummary } from "@/types";

async function fetchFields(farmId: string): Promise<FieldSummary[]> {
  const res = await fetch(`/api/fields?farmId=${encodeURIComponent(farmId)}`);
  if (!res.ok) throw new Error("Failed to load fields");
  return res.json();
}

export function useFields(farmId: string | undefined) {
  return useQuery({
    queryKey: ["fields", farmId],
    queryFn: () => fetchFields(farmId as string),
    enabled: Boolean(farmId),
  });
}

async function fetchField(id: string): Promise<FieldSummary> {
  const res = await fetch(`/api/fields/${id}`);
  if (!res.ok) throw new Error("Failed to load field");
  return res.json();
}

export function useField(id: string | undefined) {
  return useQuery({
    queryKey: ["field", id],
    queryFn: () => fetchField(id as string),
    enabled: Boolean(id),
  });
}

async function createField(input: CreateFieldInput): Promise<FieldSummary> {
  const res = await fetch("/api/fields", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to create field");
  return res.json();
}

export function useCreateField(farmId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", farmId] });
    },
  });
}

async function updateField(id: string, input: UpdateFieldInput): Promise<FieldSummary> {
  const res = await fetch(`/api/fields/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("Failed to update field");
  return res.json();
}

async function deleteField(id: string): Promise<void> {
  const res = await fetch(`/api/fields/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete field");
}

export function useDeleteField(farmId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fields", farmId] });
    },
  });
}

export function useUpdateField(farmId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFieldInput }) => updateField(id, input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fields", farmId] });
      queryClient.invalidateQueries({ queryKey: ["field", variables.id] });
    },
  });
}
