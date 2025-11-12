// @/hooks/api/use-faqs.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  FAQsListResponse,
  FAQResponse,
  CreateFAQRequest,
  UpdateFAQRequest,
  FAQsQueryParams,
} from '@/types/api';

/**
 * React Query hooks for FAQs API
 */

// Query Keys
export const faqsKeys = {
  all: ['faqs'] as const,
  lists: () => [...faqsKeys.all, 'list'] as const,
  list: (params?: FAQsQueryParams) => [...faqsKeys.lists(), params] as const,
  details: () => [...faqsKeys.all, 'detail'] as const,
  detail: (id: string) => [...faqsKeys.details(), id] as const,
};

/**
 * Get paginated list of FAQs
 */
export function useFAQs(params?: FAQsQueryParams) {
  return useQuery({
    queryKey: faqsKeys.list(params),
    queryFn: async () => {
      const response = await api.get<FAQsListResponse>('/admin/faqs', { params });
      return response.data;
    },
  });
}

/**
 * Get single FAQ by ID
 */
export function useFAQ(id: string) {
  return useQuery({
    queryKey: faqsKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<FAQResponse>(`/admin/faqs/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new FAQ
 */
export function useCreateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFAQRequest) => {
      const response = await api.post<FAQResponse>('/admin/faqs', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsKeys.lists() });
    },
  });
}

/**
 * Update existing FAQ
 */
export function useUpdateFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFAQRequest }) => {
      const response = await api.patch<FAQResponse>(`/admin/faqs/${id}`, data);
      return response.data as unknown as FAQResponse;
    },
    onSuccess: (response: FAQResponse) => {
      queryClient.invalidateQueries({ queryKey: faqsKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: faqsKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete FAQ
 */
export function useDeleteFAQ() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/faqs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: faqsKeys.lists() });
    },
  });
}
