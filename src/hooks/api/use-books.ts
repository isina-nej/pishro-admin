// @/hooks/api/use-books.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  BooksListResponse,
  BookResponse,
  CreateBookRequest,
  UpdateBookRequest,
  BooksQueryParams,
} from '@/types/api';

/**
 * React Query hooks for Digital Books API
 */

// Query Keys
export const booksKeys = {
  all: ['books'] as const,
  lists: () => [...booksKeys.all, 'list'] as const,
  list: (params?: BooksQueryParams) => [...booksKeys.lists(), params] as const,
  details: () => [...booksKeys.all, 'detail'] as const,
  detail: (id: string) => [...booksKeys.details(), id] as const,
};

/**
 * Get paginated list of digital books
 */
export function useBooks(params?: BooksQueryParams) {
  return useQuery({
    queryKey: booksKeys.list(params),
    queryFn: async () => {
      const response = await api.get<BooksListResponse>('/admin/books', { params });
      return response.data;
    },
  });
}

/**
 * Get single book by ID
 */
export function useBook(id: string) {
  return useQuery({
    queryKey: booksKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<BookResponse>(`/admin/books/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new book
 */
export function useCreateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBookRequest) => {
      const response = await api.post<BookResponse>('/admin/books', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}

/**
 * Update existing book
 */
export function useUpdateBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateBookRequest }) => {
      const response = await api.patch<BookResponse>(`/admin/books/${id}`, data);
      return response.data as unknown as BookResponse;
    },
    onSuccess: (response: BookResponse) => {
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: booksKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete book
 */
export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}
