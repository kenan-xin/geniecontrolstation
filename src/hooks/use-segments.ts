import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Segment, NewSegment } from "@/types";

// Query key factory
export const segmentKeys = {
  all: ["segments"] as const,
  byStation: (stationId: number) => [...segmentKeys.all, "station", stationId] as const,
};

// GET /api/stations/[stationId]/segments
export function useSegments(stationId: number | undefined) {
  return useQuery({
    queryKey: segmentKeys.byStation(stationId!),
    queryFn: async (): Promise<Segment[]> => {
      const response = await fetch(`/api/stations/${stationId}/segments`);
      if (!response.ok) throw new Error("Failed to fetch segments");
      return response.json();
    },
    enabled: !!stationId,
  });
}

// POST /api/stations/[stationId]/segments
export function useCreateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      stationId,
      data,
    }: {
      stationId: number;
      data: NewSegment;
    }): Promise<Segment> => {
      const response = await fetch(`/api/stations/${stationId}/segments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create segment");
      return response.json();
    },
    onSuccess: (_, { stationId }) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.byStation(stationId) });
    },
  });
}

// PUT /api/segments/[id]
export function useUpdateSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      stationId,
    }: {
      id: number;
      data: Partial<NewSegment>;
      stationId: number;
    }): Promise<Segment> => {
      const response = await fetch(`/api/segments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update segment");
      return response.json();
    },
    onSuccess: (_, { stationId }) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.byStation(stationId) });
    },
  });
}

// DELETE /api/segments/[id]
export function useDeleteSegment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stationId,
    }: {
      id: number;
      stationId: number;
    }): Promise<{ message: string }> => {
      const response = await fetch(`/api/segments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete segment");
      return response.json();
    },
    onSuccess: (_, { stationId }) => {
      queryClient.invalidateQueries({ queryKey: segmentKeys.byStation(stationId) });
    },
  });
}
