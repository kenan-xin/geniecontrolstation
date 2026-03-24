import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Application, NewApplication } from "@/types";

// Query key factory
export const applicationKeys = {
  all: ["applications"] as const,
  lists: () => [...applicationKeys.all, "list"] as const,
  list: (status?: string) => [...applicationKeys.lists(), { status }] as const,
  details: () => [...applicationKeys.all, "detail"] as const,
  detail: (id: number) => [...applicationKeys.details(), id] as const,
};

// GET /api/applications
export function useApplications(status?: string) {
  return useQuery({
    queryKey: applicationKeys.list(status),
    queryFn: async (): Promise<Application[]> => {
      const url = status
        ? `/api/applications?status=${encodeURIComponent(status)}`
        : "/api/applications";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch applications");
      return response.json();
    },
  });
}

// GET /api/applications/[id]
export function useApplication(id: number | undefined) {
  return useQuery({
    queryKey: applicationKeys.detail(id!),
    queryFn: async (): Promise<Application> => {
      const response = await fetch(`/api/applications/${id}`);
      if (!response.ok) throw new Error("Failed to fetch application");
      return response.json();
    },
    enabled: !!id,
  });
}

// POST /api/applications
export function useCreateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewApplication): Promise<Application> => {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create application");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
}

// PUT /api/applications/[id]
export function useUpdateApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<NewApplication>;
    }): Promise<Application> => {
      const response = await fetch(`/api/applications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update application");
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: applicationKeys.detail(id) });
    },
  });
}

// DELETE /api/applications/[id]
export function useDeleteApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<{ message: string }> => {
      const response = await fetch(`/api/applications/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete application");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
    },
  });
}
