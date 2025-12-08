import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type { AxiosResponse } from 'axios';

type UploadVars = { field: 'book' | 'audio' | 'cover'; file: File };

export function useUploadBookFiles() {
  const queryClient = useQueryClient();
  const mutationFn = async (data: UploadVars): Promise<AxiosResponse> => {
    const formData = new FormData();
    formData.append(data.field, data.file);

    const response: AxiosResponse = await api.post('/admin/books/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  };

  return useMutation<AxiosResponse, unknown, UploadVars, unknown>({
    mutationFn,
    onSuccess: () => {
      // invalidate books list and details if needed
      queryClient.invalidateQueries({ queryKey: ['books'] });
    },
  });
}

export default useUploadBookFiles;
