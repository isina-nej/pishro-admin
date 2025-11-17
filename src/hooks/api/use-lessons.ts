// @/hooks/api/use-lessons.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  LessonsListResponse,
  LessonResponse,
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonsQueryParams,
  LessonWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Lessons API
 */

// Query Keys
export const lessonKeys = {
  all: ['lessons'] as const,
  lists: () => [...lessonKeys.all, 'list'] as const,
  list: (params?: LessonsQueryParams) => [...lessonKeys.lists(), params] as const,
  details: () => [...lessonKeys.all, 'detail'] as const,
  detail: (id: string) => [...lessonKeys.details(), id] as const,
};

/**
 * Get paginated list of lessons
 */
export function useLessons(params?: LessonsQueryParams) {
  return useQuery({
    queryKey: lessonKeys.list(params),
    queryFn: async () => {
      const response = await api.get<LessonsListResponse>('/admin/lessons', { params });
      return response.data;
    },
  });
}

/**
 * Get single lesson by ID
 */
export function useLesson(id: string) {
  return useQuery({
    queryKey: lessonKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<LessonResponse>(`/admin/lessons/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new lesson
 */
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLessonRequest) => {
      const response = await api.post<LessonResponse>('/admin/lessons', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}

/**
 * Update existing lesson
 */
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLessonRequest }) => {
      const response = await api.patch<LessonResponse>(`/admin/lessons/${id}`, data);
      return response.data as unknown as LessonResponse;
    },
    onSuccess: (response: LessonResponse) => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: lessonKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete lesson
 */
export function useDeleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/lessons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonKeys.lists() });
    },
  });
}
