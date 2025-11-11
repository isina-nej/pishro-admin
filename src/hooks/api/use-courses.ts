// @/hooks/api/use-courses.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  CoursesListResponse,
  CourseResponse,
  CreateCourseRequest,
  UpdateCourseRequest,
  CoursesQueryParams,
  CourseWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Courses API
 */

// Query Keys
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (params?: CoursesQueryParams) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all, 'detail'] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
};

/**
 * Get paginated list of courses
 */
export function useCourses(params?: CoursesQueryParams) {
  return useQuery({
    queryKey: courseKeys.list(params),
    queryFn: async () => {
      const response = await api.get<CoursesListResponse>('/admin/courses', { params });
      return response.data;
    },
  });
}

/**
 * Get single course by ID
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<CourseResponse>(`/admin/courses/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCourseRequest) => {
      const response = await api.post<CourseResponse>('/admin/courses', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}

/**
 * Update existing course
 */
export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCourseRequest }) => {
      const response = await api.patch<CourseResponse>(`/admin/courses/${id}`, data);
      return response.data as unknown as CourseResponse;
    },
    onSuccess: (response: CourseResponse) => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/courses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    },
  });
}
