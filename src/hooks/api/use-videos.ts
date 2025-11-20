// @/hooks/api/use-videos.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  VideosListResponse,
  VideoResponse,
  VideoStatsResponse,
  VideosQueryParams,
  CreateVideoRequest,
  UpdateVideoRequest,
  RequestUploadUrlRequest,
  RequestUploadUrlResponse,
  UploadVideoToStorageRequest,
} from '@/types/api';

/**
 * React Query hooks for Videos API
 */

// Query Keys
export const videoKeys = {
  all: ['videos'] as const,
  lists: () => [...videoKeys.all, 'list'] as const,
  list: (params?: VideosQueryParams) => [...videoKeys.lists(), params] as const,
  details: () => [...videoKeys.all, 'detail'] as const,
  detail: (videoId: string) => [...videoKeys.details(), videoId] as const,
  stats: () => [...videoKeys.all, 'stats'] as const,
};

/**
 * Get paginated list of videos
 */
export function useVideos(params?: VideosQueryParams) {
  return useQuery<VideosListResponse>({
    queryKey: videoKeys.list(params),
    queryFn: async () => {
      const response = await api.get<VideosListResponse>('/admin/videos', { params });
      return response;
    },
    refetchInterval: (query) => {
      // اگر ویدیویی در حال پردازش است، هر 5 ثانیه refresh کن
      const hasProcessing = query.state.data?.data.items?.some(
        (v: any) =>
          v.processingStatus === 'UPLOADING' ||
          v.processingStatus === 'UPLOADED' ||
          v.processingStatus === 'PROCESSING',
      );
      return hasProcessing ? 5000 : false;
    },
  });
}

/**
 * Get single video by videoId
 */
export function useVideo(videoId: string) {
  return useQuery<VideoResponse>({
    queryKey: videoKeys.detail(videoId),
    queryFn: async () => {
      const response = await api.get<VideoResponse>(`/admin/videos/${videoId}`);
      return response;
    },
    enabled: !!videoId,
    refetchInterval: (query) => {
      // اگر ویدیو در حال پردازش است، هر 3 ثانیه refresh کن
      const isProcessing =
        query.state.data?.data?.processingStatus === 'UPLOADING' ||
        query.state.data?.data?.processingStatus === 'UPLOADED' ||
        query.state.data?.data?.processingStatus === 'PROCESSING';
      return isProcessing ? 3000 : false;
    },
  });
}

/**
 * Get video statistics
 */
export function useVideoStats() {
  return useQuery({
    queryKey: videoKeys.stats(),
    queryFn: async () => {
      const response = await api.get<{ status: string; data: VideoStatsResponse }>('/admin/videos/stats');
      return response.data;
    },
  });
}

/**
 * Request signed upload URL for video
 */
export function useRequestUploadUrl() {
  return useMutation({
    mutationFn: async (data: RequestUploadUrlRequest) => {
      const response = await api.post<RequestUploadUrlResponse>('/admin/videos/upload-url', data);
      return response;
    },
  });
}

/**
 * Upload video file to storage (direct PUT to signed URL)
 */
export function useUploadVideoToStorage() {
  return useMutation({
    mutationFn: async ({ uploadUrl, file, onProgress }: UploadVideoToStorageRequest) => {
      // این درخواست مستقیما به object storage میره نه به backend
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
 * Create video record in database (after upload)
 */
export function useCreateVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVideoRequest) => {
      const response = await api.post<VideoResponse>('/admin/videos', data);
      return response;
    },
    onSuccess: () => {
      // Invalidate all video queries to refetch
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
    },
  });
}

/**
 * Update video metadata
 */
export function useUpdateVideo(videoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateVideoRequest) => {
      const response = await api.put<VideoResponse>(`/admin/videos/${videoId}`, data);
      return response;
    },
    onSuccess: () => {
      // Invalidate specific video and list queries
      queryClient.invalidateQueries({ queryKey: videoKeys.detail(videoId) });
      queryClient.invalidateQueries({ queryKey: videoKeys.lists() });
    },
  });
}

/**
 * Delete video
 */
export function useDeleteVideo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const response = await api.delete(`/admin/videos/${videoId}`);
      return response;
    },
    onSuccess: () => {
      // Invalidate all video queries
      queryClient.invalidateQueries({ queryKey: videoKeys.all });
    },
  });
}

/**
 * Complete video upload workflow (all steps)
 */
export function useCompleteVideoUpload() {
  const requestUploadUrl = useRequestUploadUrl();
  const uploadToStorage = useUploadVideoToStorage();
  const createVideo = useCreateVideo();

  return useMutation({
    mutationFn: async ({
      file,
      title,
      description,
      onProgress,
    }: {
      file: File;
      title: string;
      description?: string;
      onProgress?: (stage: 'requesting_url' | 'uploading' | 'saving' | 'completed', progress: number) => void;
    }) => {
      // مرحله 1: درخواست Upload URL
      onProgress?.('requesting_url', 0);

      const fileExtension = file.name.split('.').pop() || 'mp4';

      const uploadUrlData = await requestUploadUrl.mutateAsync({
        fileName: file.name,
        fileSize: file.size,
        fileFormat: fileExtension,
        title,
        description,
      });

      // مرحله 2: آپلود فایل
      onProgress?.('uploading', 0);

      await uploadToStorage.mutateAsync({
        uploadUrl: uploadUrlData.data.uploadUrl,
        file,
        onProgress: (progress) => {
          onProgress?.('uploading', progress);
        },
      });

      // مرحله 3: ایجاد رکورد در دیتابیس
      onProgress?.('saving', 100);

      const videoRecord = await createVideo.mutateAsync({
        title,
        description,
        videoId: uploadUrlData.data.videoId,
        originalPath: uploadUrlData.data.storagePath,
        fileSize: file.size,
        fileFormat: fileExtension,
        startProcessing: true,
      });

      onProgress?.('completed', 100);

      return videoRecord;
    },
  });
}
