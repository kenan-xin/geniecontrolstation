import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Station, NewStation, StationWithSchedules } from "@/types";

// Query key factory
export const stationKeys = {
  all: ["stations"] as const,
  lists: () => [...stationKeys.all, "list"] as const,
  list: () => [...stationKeys.lists()] as const,
  details: () => [...stationKeys.all, "detail"] as const,
  detail: (id: number) => [...stationKeys.details(), id] as const,
};

// GET /api/stations
export function useStations() {
  return useQuery({
    queryKey: stationKeys.list(),
    queryFn: async (): Promise<StationWithSchedules[]> => {
      const response = await fetch("/api/stations");
      if (!response.ok) throw new Error("Failed to fetch stations");
      return response.json();
    },
  });
}

// GET /api/stations/[id]
export function useStation(id: number | undefined) {
  return useQuery({
    queryKey: stationKeys.detail(id!),
    queryFn: async (): Promise<StationWithSchedules> => {
      const response = await fetch(`/api/stations/${id}`);
      if (!response.ok) throw new Error("Failed to fetch station");
      return response.json();
    },
    enabled: !!id,
  });
}

// POST /api/stations
export function useCreateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewStation): Promise<StationWithSchedules> => {
      const response = await fetch("/api/stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create station");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
    },
  });
}

// PUT /api/stations/[id]
export function useUpdateStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<NewStation>;
    }): Promise<StationWithSchedules> => {
      const response = await fetch(`/api/stations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update station");
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: stationKeys.detail(id) });
    },
  });
}

// DELETE /api/stations/[id]
export function useDeleteStation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<{ message: string }> => {
      const response = await fetch(`/api/stations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete station");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: stationKeys.lists() });
    },
  });
}
