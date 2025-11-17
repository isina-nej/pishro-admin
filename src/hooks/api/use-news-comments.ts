// @/hooks/api/use-news-comments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  NewsCommentsListResponse,
  NewsCommentResponse,
  CreateNewsCommentRequest,
  UpdateNewsCommentRequest,
  NewsCommentsQueryParams,
  NewsCommentWithRelations,
} from '@/types/api';

/**
 * React Query hooks for News Comments API
 */

// Query Keys
export const newsCommentKeys = {
  all: ['news-comments'] as const,
  lists: () => [...newsCommentKeys.all, 'list'] as const,
  list: (params?: NewsCommentsQueryParams) => [...newsCommentKeys.lists(), params] as const,
  details: () => [...newsCommentKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsCommentKeys.details(), id] as const,
};

/**
 * Get paginated list of news comments
 */
export function useNewsComments(params?: NewsCommentsQueryParams) {
  return useQuery({
    queryKey: newsCommentKeys.list(params),
    queryFn: async () => {
      const response = await api.get<NewsCommentsListResponse>('/admin/news-comments', { params });
      return response.data;
    },
  });
}

/**
 * Get single news comment by ID
 */
export function useNewsComment(id: string) {
  return useQuery({
    queryKey: newsCommentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<NewsCommentResponse>(`/admin/news-comments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new news comment
 */
export function useCreateNewsComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsCommentRequest) => {
      const response = await api.post<NewsCommentResponse>('/admin/news-comments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsCommentKeys.lists() });
    },
  });
}

/**
 * Update existing news comment
 */
export function useUpdateNewsComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNewsCommentRequest }) => {
      const response = await api.patch<NewsCommentResponse>(`/admin/news-comments/${id}`, data);
      return response.data as unknown as NewsCommentResponse;
    },
    onSuccess: (response: NewsCommentResponse) => {
      queryClient.invalidateQueries({ queryKey: newsCommentKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: newsCommentKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete news comment
 */
export function useDeleteNewsComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/news-comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsCommentKeys.lists() });
    },
  });
}
