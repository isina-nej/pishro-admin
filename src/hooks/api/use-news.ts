// @/hooks/api/use-news.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  NewsListResponse,
  NewsResponse,
  CreateNewsRequest,
  UpdateNewsRequest,
  NewsQueryParams,
  NewsArticleWithRelations,
} from '@/types/api';

/**
 * React Query hooks for News API
 */

// Query Keys
export const newsKeys = {
  all: ['news'] as const,
  lists: () => [...newsKeys.all, 'list'] as const,
  list: (params?: NewsQueryParams) => [...newsKeys.lists(), params] as const,
  details: () => [...newsKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsKeys.details(), id] as const,
};

/**
 * Get paginated list of news articles
 */
export function useNews(params?: NewsQueryParams) {
  return useQuery({
    queryKey: newsKeys.list(params),
    queryFn: async () => {
      const response = await api.get<NewsListResponse>('/admin/news', { params });
      return response.data;
    },
  });
}

/**
 * Get single news article by ID
 */
export function useNewsArticle(id: string) {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<NewsResponse>(`/admin/news/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new news article
 */
export function useCreateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsRequest) => {
      const response = await api.post<NewsResponse>('/admin/news', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}

/**
 * Update existing news article
 */
export function useUpdateNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNewsRequest }) => {
      const response = await api.patch<NewsResponse>(`/admin/news/${id}`, data);
      return response.data as unknown as NewsResponse;
    },
    onSuccess: (response: NewsResponse) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: newsKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete news article
 */
export function useDeleteNews() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsKeys.lists() });
    },
  });
}
