// @/hooks/api/use-enrollments.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  EnrollmentsListResponse,
  EnrollmentResponse,
  CreateEnrollmentRequest,
  UpdateEnrollmentRequest,
  EnrollmentsQueryParams,
  EnrollmentWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Enrollments API
 */

// Query Keys
export const enrollmentKeys = {
  all: ['enrollments'] as const,
  lists: () => [...enrollmentKeys.all, 'list'] as const,
  list: (params?: EnrollmentsQueryParams) => [...enrollmentKeys.lists(), params] as const,
  details: () => [...enrollmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...enrollmentKeys.details(), id] as const,
};

/**
 * Get paginated list of enrollments
 */
export function useEnrollments(params?: EnrollmentsQueryParams) {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: async () => {
      const response = await api.get<EnrollmentsListResponse>('/admin/enrollments', { params });
      return response.data;
    },
  });
}

/**
 * Get single enrollment by ID
 */
export function useEnrollment(id: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<EnrollmentResponse>(`/admin/enrollments/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new enrollment
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEnrollmentRequest) => {
      const response = await api.post<EnrollmentResponse>('/admin/enrollments', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
    },
  });
}

/**
 * Update existing enrollment
 */
export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEnrollmentRequest }) => {
      const response = await api.patch<EnrollmentResponse>(`/admin/enrollments/${id}`, data);
      return response.data as unknown as EnrollmentResponse;
    },
    onSuccess: (response: EnrollmentResponse) => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: enrollmentKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete enrollment
 */
export function useDeleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/enrollments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: enrollmentKeys.lists() });
    },
  });
}
