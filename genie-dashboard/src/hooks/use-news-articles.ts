import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { NewsArticle, NewNewsArticle } from "@/types";

// Query key factory
export const newsArticleKeys = {
  all: ["news-articles"] as const,
  lists: () => [...newsArticleKeys.all, "list"] as const,
  list: (status?: string) => [...newsArticleKeys.lists(), { status }] as const,
  details: () => [...newsArticleKeys.all, "detail"] as const,
  detail: (id: number) => [...newsArticleKeys.details(), id] as const,
};

// GET /api/news-articles
export function useNewsArticles(status?: string) {
  return useQuery({
    queryKey: newsArticleKeys.list(status),
    queryFn: async (): Promise<NewsArticle[]> => {
      const url = status
        ? `/api/news-articles?status=${encodeURIComponent(status)}`
        : "/api/news-articles";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch news articles");
      return response.json();
    },
  });
}

// GET /api/news-articles/[id]
export function useNewsArticle(id: number | undefined) {
  return useQuery({
    queryKey: newsArticleKeys.detail(id!),
    queryFn: async (): Promise<NewsArticle> => {
      const response = await fetch(`/api/news-articles/${id}`);
      if (!response.ok) throw new Error("Failed to fetch news article");
      return response.json();
    },
    enabled: !!id,
  });
}

// POST /api/news-articles
export function useCreateNewsArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: NewNewsArticle): Promise<NewsArticle> => {
      const response = await fetch("/api/news-articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create news article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsArticleKeys.lists() });
    },
  });
}

// PUT /api/news-articles/[id]
export function useUpdateNewsArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: Partial<NewNewsArticle>;
    }): Promise<NewsArticle> => {
      const response = await fetch(`/api/news-articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update news article");
      return response.json();
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: newsArticleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: newsArticleKeys.detail(id) });
    },
  });
}

// DELETE /api/news-articles/[id]
export function useDeleteNewsArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number): Promise<{ message: string }> => {
      const response = await fetch(`/api/news-articles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete news article");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsArticleKeys.lists() });
    },
  });
}
