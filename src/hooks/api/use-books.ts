// @/hooks/api/use-books.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  BooksListResponse,
  BookResponse,
  CreateBookRequest,
  UpdateBookRequest,
  BooksQueryParams,
  RequestFileUploadUrlRequest,
  RequestFileUploadUrlResponse,
  UploadFileToStorageRequest,
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
      const response = await api.get<BooksListResponse>('/admin/books', { params });
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
      const response = await api.get<BookResponse>(`/admin/books/${id}`);
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

/**
 * Request signed upload URL for book resources (cover / file / audio)
 */
export function useRequestBookUploadUrl() {
  return useMutation({
    mutationFn: async (data: RequestFileUploadUrlRequest) => {
      // Use local Next.js API route as a proxy to the backend upload-url endpoint
      // This allows the frontend to avoid CORS issues and to fallback when backend doesn't implement the endpoint
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch('/api/admin/books/upload-url', {
        method: 'POST',
        headers,
        credentials: 'include', // send cookies to this local route if session is cookie-based
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload URL request failed: ${res.status} - ${text}`);
      }

      const json = await res.json();
      return json as RequestFileUploadUrlResponse;
    },
  });
}

/**
 * Upload file to storage (direct PUT to signed URL)
 */
export function useUploadFileToStorage() {
  return useMutation({
    mutationFn: async ({ uploadUrl, file, onProgress }: UploadFileToStorageRequest) => {
      const xhr = new XMLHttpRequest();

      return new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded * 100) / e.total);
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'));
        });

        xhr.open('PUT', uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });
    },
  });
}

/**
 * Short helper to perform the full upload flow (request URL + upload + return storage path)
 */
export function useCompleteBookUpload() {
  const requestUploadUrl = useRequestBookUploadUrl();
  const uploadToStorage = useUploadFileToStorage();

  return useMutation({
    mutationFn: async ({ file, resourceType, title, onProgress }: { file: File; resourceType: 'cover' | 'file' | 'audio'; title?: string; onProgress?: (stage: string, progress: number) => void }) => {
      onProgress?.('requesting_url', 0);

      const fileExtension = file.name.split('.').pop() || '';

      const uploadUrlData = await requestUploadUrl.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        fileFormat: fileExtension,
        resourceType,
        title,
      });

      onProgress?.('uploading', 0);
      await uploadToStorage.mutateAsync({ uploadUrl: uploadUrlData.data.uploadUrl, file, onProgress: (p: number) => onProgress?.('uploading', p) });

      onProgress?.('completed', 100);
      return uploadUrlData.data; // contains storagePath
    },
  });
}
