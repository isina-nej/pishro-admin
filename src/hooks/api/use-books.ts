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
        // Try to parse JSON error body and throw a clear message
        const ct = res.headers.get('content-type') || '';
        let errText = `Upload URL request failed: ${res.status}`;
        try {
          if (ct.includes('application/json')) {
            const jsonErr = await res.json();
            errText = `Upload URL request failed: ${res.status} - ${jsonErr.message || JSON.stringify(jsonErr)}`;
          } else {
            const text = await res.text();
            errText = `Upload URL request failed: ${res.status} - ${text}`;
          }
        } catch (parseErr) {
          errText = `Upload URL request failed: ${res.status} - unable to read error body`;
        }
        throw new Error(errText);
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
    mutationFn: async ({ uploadUrl, file, onProgress, resourceType, title }: UploadFileToStorageRequest) => {
      // First, try the direct PUT to signed URL (recommended approach)
      const xhr = new XMLHttpRequest();

      const doServerFallbackUpload = (reason?: string) => {
        return new Promise<any>((resolve, reject) => {
          try {
            const fallbackXhr = new XMLHttpRequest();
            const fd = new FormData();
            fd.append('file', file, file.name);
            fd.append('fileName', file.name);
            fd.append('fileSize', String(file.size));
            fd.append('resourceType', resourceType ?? 'file');
            if (title) fd.append('title', title);

            fallbackXhr.upload.addEventListener('progress', (e) => {
              if (e.lengthComputable && onProgress) {
                const progress = Math.round((e.loaded * 100) / e.total);
                onProgress(progress);
              }
            });

            fallbackXhr.addEventListener('load', () => {
              if (fallbackXhr.status >= 200 && fallbackXhr.status < 300) {
                try {
                  const parsed = JSON.parse(fallbackXhr.responseText);
                  // If the server returns metadata, resolve with it
                  resolve(parsed.data || parsed);
                } catch (e) {
                  resolve(undefined);
                }
              } else {
                // forward server reason
                let msg = `Fallback upload failed with status ${fallbackXhr.status}`;
                try { msg = `${msg}: ${fallbackXhr.responseText}` } catch(e) {}
                reject(new Error(msg));
              }
            });

            fallbackXhr.addEventListener('error', () => {
              reject(new Error('Fallback upload failed'));
            });

            // Send Authorization header if we have auth token
            const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
            fallbackXhr.open('POST', '/api/admin/books/upload');
            // Send credentials (cookie based session) with request
            fallbackXhr.withCredentials = true;
            if (token) fallbackXhr.setRequestHeader('Authorization', `Bearer ${token}`);
            fallbackXhr.send(fd);
          } catch (e) {
            reject(e);
          }
        });
      };

      return new Promise<any>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable && onProgress) {
            const progress = Math.round((e.loaded * 100) / e.total);
            onProgress(progress);
          }
        });

        xhr.addEventListener('load', async () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            // direct PUT succeeded - resolve with undefined to indicate using already-known signed data
            resolve(undefined);
          } else {
            console.warn('[upload] PUT failed; attempting server-side fallback', { status: xhr.status, uploadUrl });
            // If PUT failed with a network error or non-2xx status, try server fallback
            try {
              const result = await doServerFallbackUpload(`PUT failed ${xhr.status}`);
              resolve(result);
            } catch (err) {
              reject(err instanceof Error ? err : new Error(String(err)));
            }
          }
        });

        xhr.addEventListener('error', async () => {
          // Network/CORS error: try fallback
          console.warn('[upload] Network/CORS error on direct PUT; attempting server-side fallback', { uploadUrl });
          try {
            const result = await doServerFallbackUpload('Network/CORS error');
            resolve(result);
          } catch (err) {
            reject(err instanceof Error ? err : new Error(String(err)));
          }
        });

        try {
          xhr.open('PUT', uploadUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        } catch (err) {
          // In case opening the request fails (invalid URL / invalid origin), try fallback via promise
          doServerFallbackUpload(String(err))
            .then(() => resolve(undefined))
            .catch((e) => reject(e instanceof Error ? e : new Error(String(e))));
        }
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
      const uploadResult = await uploadToStorage.mutateAsync({ uploadUrl: uploadUrlData.data.uploadUrl, file, resourceType, title, onProgress: (p: number) => onProgress?.('uploading', p) });

      onProgress?.('completed', 100);
      // If server fallback returned storage metadata, prefer it; otherwise return signed-data
      return uploadResult || uploadUrlData.data; // contains storagePath
    },
  });
}
