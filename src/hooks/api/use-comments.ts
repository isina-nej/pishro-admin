// @/hooks/api/use-comments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  CommentsListResponse,
  CommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  CommentsQueryParams,
  CommentWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Comments API
 */

// Query Keys
export const commentKeys = {
  all: ['comments'] as const,
  lists: () => [...commentKeys.all, 'list'] as const,
  list: (params?: CommentsQueryParams) => [...commentKeys.lists(), params] as const,
  details: () => [...commentKeys.all, 'detail'] as const,
  detail: (id: string) => [...commentKeys.details(), id] as const,
};

/**
 * Get paginated list of comments
 */
export function useComments(params?: CommentsQueryParams) {
  return useQuery({
    queryKey: commentKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CommentsListResponse>('/admin/comments', { params });
      return response.data;
    },
  });
}

/**
 * Get single comment by ID
 */
export function useComment(id: string) {
  return useQuery({
    queryKey: commentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CommentResponse>(`/admin/comments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentRequest) => {
      const response = await api.post<CommentResponse>('/admin/comments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}

/**
 * Update existing comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCommentRequest }) => {
      const response = await api.patch<CommentResponse>(`/admin/comments/${id}`, data);
      return response.data as unknown as CommentResponse;
    },
    onSuccess: (response: CommentResponse) => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: commentKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.lists() });
    },
  });
}
