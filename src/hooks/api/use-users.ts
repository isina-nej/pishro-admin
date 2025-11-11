// @/hooks/api/use-users.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  UsersListResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  UsersQueryParams,
  UserWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Users API
 */

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UsersQueryParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

/**
 * Get paginated list of users
 */
export function useUsers(params?: UsersQueryParams) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const response = await api.get<UsersListResponse>('/admin/users', { params });
      return response.data;
    },
  });
}

/**
 * Get single user by ID
 */
export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<UserResponse>(`/admin/users/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      const response = await api.post<UserResponse>('/admin/users', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

/**
 * Update existing user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateUserRequest }) => {
      const response = await api.patch<UserResponse>(`/admin/users/${id}`, data);
      return response.data as unknown as UserResponse;
    },
    onSuccess: (response: UserResponse) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: userKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}
