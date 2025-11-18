// @/hooks/api/use-images.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  ImagesListResponse,
  ImageResponse,
  UpdateImageRequest,
  ImagesQueryParams,
  ImageStatsResponse,
  ImageCategory,
} from '@/types/api';

/**
 * React Query hooks for Images API
 */

// Query Keys
export const imageKeys = {
  all: ['images'] as const,
  lists: () => [...imageKeys.all, 'list'] as const,
  list: (params?: ImagesQueryParams) => [...imageKeys.lists(), params] as const,
  details: () => [...imageKeys.all, 'detail'] as const,
  detail: (id: string) => [...imageKeys.details(), id] as const,
  stats: () => [...imageKeys.all, 'stats'] as const,
};

/**
 * Get paginated list of images
 */
export function useImages(params?: ImagesQueryParams) {
  return useQuery<ImagesListResponse>({
    queryKey: imageKeys.list(params),
    queryFn: async () => {
      const response = await api.get<ImagesListResponse>('/admin/images', { params });
      return response;
    },
  });
}

/**
 * Get single image by ID
 */
export function useImage(id: string) {
  return useQuery<ImageResponse>({
    queryKey: imageKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<ImageResponse>(`/admin/images/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

/**
 * Get image statistics
 */
export function useImageStats() {
  return useQuery({
    queryKey: imageKeys.stats(),
    queryFn: async () => {
      const response = await api.get<{ status: string; data: ImageStatsResponse }>('/admin/images/stats');
      return response.data;
    },
  });
}

/**
 * Upload new image
 */
export function useUploadImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      file: File;
      category: ImageCategory;
      title?: string;
      description?: string;
      alt?: string;
      tags?: string;
    }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('category', data.category);
      if (data.title) formData.append('title', data.title);
      if (data.description) formData.append('description', data.description);
      if (data.alt) formData.append('alt', data.alt);
      if (data.tags) formData.append('tags', data.tags);

      const response = await api.post<ImageResponse>('/admin/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    },
    onSuccess: () => {
      // Invalidate all image queries to refetch
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
  });
}

/**
 * Update image metadata
 */
export function useUpdateImage(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateImageRequest) => {
      const response = await api.patch<ImageResponse>(`/admin/images/${id}`, data);
      return response;
    },
    onSuccess: () => {
      // Invalidate specific image and list queries
      queryClient.invalidateQueries({ queryKey: imageKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: imageKeys.lists() });
    },
  });
}

/**
 * Delete image
 */
export function useDeleteImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/admin/images/${id}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all image queries
      queryClient.invalidateQueries({ queryKey: imageKeys.all });
    },
  });
}
