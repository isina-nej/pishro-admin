// @/hooks/api/use-quiz-attempts.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  QuizAttemptsListResponse,
  QuizAttemptResponse,
  QuizAttemptWithRelations,
  QuizAttemptsQueryParams,
} from '@/types/api';

/**
 * React Query hooks for Quiz Attempts API
 */

// Query Keys
export const quizAttemptKeys = {
  all: ['quiz-attempts'] as const,
  lists: () => [...quizAttemptKeys.all, 'list'] as const,
  list: (params?: QuizAttemptsQueryParams) => [...quizAttemptKeys.lists(), params] as const,
  details: () => [...quizAttemptKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizAttemptKeys.details(), id] as const,
};

/**
 * Get paginated list of quiz attempts
 */
export function useQuizAttempts(params?: QuizAttemptsQueryParams) {
  return useQuery({
    queryKey: quizAttemptKeys.list(params),
    queryFn: async () => {
      const response = await api.get<QuizAttemptsListResponse>('/admin/quiz-attempts', { params });
      return response.data;
    },
  });
}

/**
 * Get single quiz attempt by ID
 */
export function useQuizAttempt(id: string) {
  return useQuery({
    queryKey: quizAttemptKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<QuizAttemptResponse>(`/admin/quiz-attempts/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Delete quiz attempt
 */
export function useDeleteQuizAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/quiz-attempts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizAttemptKeys.lists() });
    },
  });
}
