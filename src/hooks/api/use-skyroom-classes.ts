// @/hooks/api/use-skyroom-classes.ts
/**
 * React Query hooks for SkyRoom Classes API
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type {
  SkyRoomClassesListResponse,
  SkyRoomClassResponse,
  CreateSkyRoomClassRequest,
  UpdateSkyRoomClassRequest,
  SkyRoomClassesQueryParams,
} from "@/types/api";

/**
 * Query Keys for cache management
 */
export const skyRoomClassKeys = {
  all: ["skyroom-classes"] as const,
  lists: () => [...skyRoomClassKeys.all, "list"] as const,
  list: (params?: SkyRoomClassesQueryParams) =>
    [...skyRoomClassKeys.lists(), params] as const,
  details: () => [...skyRoomClassKeys.all, "detail"] as const,
  detail: (id: string) => [...skyRoomClassKeys.details(), id] as const,
};

/**
 * Fetch paginated list of SkyRoom classes
 */
export function useSkyRoomClasses(params?: SkyRoomClassesQueryParams) {
  return useQuery({
    queryKey: skyRoomClassKeys.list(params),
    queryFn: async () => {
      const response = await api.get<SkyRoomClassesListResponse>(
        "/admin/skyroom-classes",
        { params }
      );
      return response.data;
    },
  });
}

/**
 * Fetch a single SkyRoom class by ID
 */
export function useSkyRoomClass(id: string) {
  return useQuery({
    queryKey: skyRoomClassKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<SkyRoomClassResponse>(
        `/admin/skyroom-classes/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create a new SkyRoom class
 */
export function useCreateSkyRoomClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateSkyRoomClassRequest) => {
      const response = await api.post<SkyRoomClassResponse>(
        "/admin/skyroom-classes",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate list cache to refetch data
      queryClient.invalidateQueries({ queryKey: skyRoomClassKeys.lists() });
    },
  });
}

/**
 * Update an existing SkyRoom class
 */
export function useUpdateSkyRoomClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateSkyRoomClassRequest;
    }) => {
      const response = await api.patch<SkyRoomClassResponse>(
        `/admin/skyroom-classes/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (response: SkyRoomClassResponse) => {
      // Invalidate list cache
      queryClient.invalidateQueries({ queryKey: skyRoomClassKeys.lists() });

      // Invalidate specific item cache if we have the ID
      if (response.data && "id" in response.data) {
        queryClient.invalidateQueries({
          queryKey: skyRoomClassKeys.detail(response.data.id),
        });
      }
    },
  });
}

/**
 * Delete a SkyRoom class
 */
export function useDeleteSkyRoomClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/skyroom-classes/${id}`);
    },
    onSuccess: () => {
      // Invalidate list cache to refetch data
      queryClient.invalidateQueries({ queryKey: skyRoomClassKeys.lists() });
    },
  });
}
