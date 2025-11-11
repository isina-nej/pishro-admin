// @/hooks/api/use-orders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  OrdersListResponse,
  OrderResponse,
  UpdateOrderRequest,
  OrdersQueryParams,
  OrderWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Orders API
 */

// Query Keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: OrdersQueryParams) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Get paginated list of orders
 */
export function useOrders(params?: OrdersQueryParams) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const response = await api.get<OrdersListResponse>('/admin/orders', { params });
      return response.data;
    },
  });
}

/**
 * Get single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<OrderResponse>(`/admin/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Update existing order (status, payment reference)
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOrderRequest }) => {
      const response = await api.patch<OrderResponse>(`/admin/orders/${id}`, data);
      return response.data as unknown as OrderResponse;
    },
    onSuccess: (response: OrderResponse) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(response.data.id as string) });
      }
    },
  });
}
