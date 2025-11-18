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
  return useQuery<SkyRoomClassesListResponse>({
    queryKey: skyRoomClassKeys.list(params),
    queryFn: async () => {
      // Clean up params - remove empty search parameter
      const cleanParams = { ...params };
      if (cleanParams.search === "" || cleanParams.search === undefined) {
        delete cleanParams.search;
      }

      const response = await api.get<any>(
        "/admin/skyroom-classes",
        { params: cleanParams }
      );

      // Transform API response to match expected PaginatedData format
      // The backend returns data as a direct array instead of PaginatedData structure
      const items = Array.isArray(response.data) ? response.data : [];
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const total = items.length; // Since backend doesn't provide total count
      const totalPages = Math.ceil(total / limit);

      return {
        status: response.status,
        data: {
          items,
          pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
        },
        message: response.message,
      } as SkyRoomClassesListResponse;
    },
  });
}

/**
 * Fetch a single SkyRoom class by ID
 */
export function useSkyRoomClass(id: string) {
  return useQuery<SkyRoomClassResponse>({
    queryKey: skyRoomClassKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<SkyRoomClassResponse>(
        `/admin/skyroom-classes/${id}`
      );
      return response;
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
      return response;
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
      return response;
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
