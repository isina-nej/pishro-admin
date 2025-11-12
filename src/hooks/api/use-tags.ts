// @/hooks/api/use-tags.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  TagsListResponse,
  TagResponse,
  CreateTagRequest,
  UpdateTagRequest,
  TagsQueryParams,
} from '@/types/api';

/**
 * React Query hooks for Tags API
 */

// Query Keys
export const tagsKeys = {
  all: ['tags'] as const,
  lists: () => [...tagsKeys.all, 'list'] as const,
  list: (params?: TagsQueryParams) => [...tagsKeys.lists(), params] as const,
  details: () => [...tagsKeys.all, 'detail'] as const,
  detail: (id: string) => [...tagsKeys.details(), id] as const,
};

/**
 * Get paginated list of tags
 */
export function useTags(params?: TagsQueryParams) {
  return useQuery({
    queryKey: tagsKeys.list(params),
    queryFn: async () => {
      const response = await api.get<TagsListResponse>('/admin/tags', { params });
      return response.data;
    },
  });
}

/**
 * Get single tag by ID
 */
export function useTag(id: string) {
  return useQuery({
    queryKey: tagsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TagResponse>(`/admin/tags/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagRequest) => {
      const response = await api.post<TagResponse>('/admin/tags', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
}

/**
 * Update existing tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTagRequest }) => {
      const response = await api.patch<TagResponse>(`/admin/tags/${id}`, data);
      return response.data as unknown as TagResponse;
    },
    onSuccess: (response: TagResponse) => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: tagsKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsKeys.lists() });
    },
  });
}
