// @/hooks/api/use-quizzes.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  QuizzesListResponse,
  QuizResponse,
  CreateQuizRequest,
  UpdateQuizRequest,
  QuizzesQueryParams,
  QuizWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Quizzes API
 */

// Query Keys
export const quizKeys = {
  all: ['quizzes'] as const,
  lists: () => [...quizKeys.all, 'list'] as const,
  list: (params?: QuizzesQueryParams) => [...quizKeys.lists(), params] as const,
  details: () => [...quizKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizKeys.details(), id] as const,
};

/**
 * Get paginated list of quizzes
 */
export function useQuizzes(params?: QuizzesQueryParams) {
  return useQuery({
    queryKey: quizKeys.list(params),
    queryFn: async () => {
      const response = await api.get<QuizzesListResponse>('/admin/quizzes', { params });
      return response.data;
    },
  });
}

/**
 * Get single quiz by ID
 */
export function useQuiz(id: string) {
  return useQuery({
    queryKey: quizKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<QuizResponse>(`/admin/quizzes/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new quiz
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuizRequest) => {
      const response = await api.post<QuizResponse>('/admin/quizzes', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}

/**
 * Update existing quiz
 */
export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateQuizRequest }) => {
      const response = await api.patch<QuizResponse>(`/admin/quizzes/${id}`, data);
      return response.data as unknown as QuizResponse;
    },
    onSuccess: (response: QuizResponse) => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: quizKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete quiz
 */
export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/quizzes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizKeys.lists() });
    },
  });
}
