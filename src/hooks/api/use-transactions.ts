// @/hooks/api/use-transactions.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  TransactionsListResponse,
  TransactionResponse,
  TransactionsQueryParams,
  TransactionWithRelations,
} from '@/types/api';

/**
 * React Query hooks for Transactions API
 */

// Query Keys
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (params?: TransactionsQueryParams) => [...transactionKeys.lists(), params] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};

/**
 * Get paginated list of transactions
 */
export function useTransactions(params?: TransactionsQueryParams) {
  return useQuery({
    queryKey: transactionKeys.list(params),
    queryFn: async () => {
      const response = await api.get<TransactionsListResponse>('/admin/transactions', { params });
      return response.data;
    },
  });
}

/**
 * Get single transaction by ID
 */
export function useTransaction(id: string) {
  return useQuery({
    queryKey: transactionKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<TransactionResponse>(`/admin/transactions/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Delete transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
    },
  });
}
