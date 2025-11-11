// @/hooks/api/use-categories.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  CategoriesListResponse,
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoriesQueryParams,
  CategoryWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Categories API
 */

// Query Keys
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: CategoriesQueryParams) => [...categoryKeys.lists(), params] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
};

/**
 * Get paginated list of categories
 */
export function useCategories(params?: CategoriesQueryParams) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CategoriesListResponse>('/admin/categories', { params });
      return response.data;
    },
  });
}

/**
 * Get single category by ID
 */
export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CategoryResponse>(`/admin/categories/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const response = await api.post<CategoryResponse>('/admin/categories', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}

/**
 * Update existing category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCategoryRequest }) => {
      const response = await api.patch<CategoryResponse>(`/admin/categories/${id}`, data);
      return response.data as unknown as CategoryResponse;
    },
    onSuccess: (response: CategoryResponse) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: categoryKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
}
