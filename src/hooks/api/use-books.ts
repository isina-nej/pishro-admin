// @/hooks/api/use-books.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api as booksApiClient } from '@/lib/api-client';
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
  return useQuery<BooksListResponse>({
    queryKey: booksKeys.list(params),
    queryFn: async () => {
      const response = await booksApiClient.get<BooksListResponse>('/admin/books', { params });
      return response;
    },
  });
}

/**
 * Get single book by ID
 */
export function useBook(id: string) {
  return useQuery<BookResponse>({
    queryKey: booksKeys.detail(id),
    queryFn: async () => {
      const response = await booksApiClient.get<BookResponse>(`/admin/books/${id}`);
      return response;
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
      const response = await booksApiClient.post<BookResponse>('/admin/books', data);
      return response;
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
      const response = await booksApiClient.patch<BookResponse>(`/admin/books/${id}`, data);
      return response as unknown as BookResponse;
    },
    onSuccess: (response: BookResponse) => {
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
      if (response && 'id' in response) {
        queryClient.invalidateQueries({ queryKey: booksKeys.detail(response.id as string) });
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
      await booksApiClient.delete(`/admin/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: booksKeys.lists() });
    },
  });
}
