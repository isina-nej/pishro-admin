// @/hooks/api/use-quiz-questions.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  QuizQuestionsListResponse,
  QuizQuestionResponse,
  CreateQuizQuestionRequest,
  UpdateQuizQuestionRequest,
  QuizQuestion,
} from '@/types/api';

/**
 * React Query hooks for Quiz Questions API
 */

// Query Keys
export const quizQuestionKeys = {
  all: ['quiz-questions'] as const,
  lists: () => [...quizQuestionKeys.all, 'list'] as const,
  list: (params?: { quizId?: string; page?: number; limit?: number }) => [...quizQuestionKeys.lists(), params] as const,
  details: () => [...quizQuestionKeys.all, 'detail'] as const,
  detail: (id: string) => [...quizQuestionKeys.details(), id] as const,
};

/**
 * Get paginated list of quiz questions
 */
export function useQuizQuestions(params?: { quizId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: quizQuestionKeys.list(params),
    queryFn: async () => {
      const response = await api.get<QuizQuestionsListResponse>('/admin/quiz-questions', { params });
      return response.data;
    },
  });
}

/**
 * Get single quiz question by ID
 */
export function useQuizQuestion(id: string) {
  return useQuery({
    queryKey: quizQuestionKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<QuizQuestionResponse>(`/admin/quiz-questions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new quiz question
 */
export function useCreateQuizQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuizQuestionRequest) => {
      const response = await api.post<QuizQuestionResponse>('/admin/quiz-questions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizQuestionKeys.lists() });
    },
  });
}

/**
 * Update existing quiz question
 */
export function useUpdateQuizQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateQuizQuestionRequest }) => {
      const response = await api.patch<QuizQuestionResponse>(`/admin/quiz-questions/${id}`, data);
      return response.data as unknown as QuizQuestionResponse;
    },
    onSuccess: (response: QuizQuestionResponse) => {
      queryClient.invalidateQueries({ queryKey: quizQuestionKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: quizQuestionKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete quiz question
 */
export function useDeleteQuizQuestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/quiz-questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quizQuestionKeys.lists() });
    },
  });
}
