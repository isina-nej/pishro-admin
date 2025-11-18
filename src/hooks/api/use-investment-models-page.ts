// @/hooks/api/use-investment-models-page.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  InvestmentModelsPageListResponse,
  InvestmentModelsPageResponse,
  CreateInvestmentModelsPageRequest,
  UpdateInvestmentModelsPageRequest,
  InvestmentModelsPageQueryParams,
  InvestmentModelListResponse,
  InvestmentModelResponse,
  CreateInvestmentModelRequest,
  UpdateInvestmentModelRequest,
  InvestmentModelQueryParams,
} from '@/types/api';

/**
 * React Query hooks for Investment Models Page API
 */

// Query Keys
export const investmentModelsPageKeys = {
  all: ['investment-models-page'] as const,
  lists: () => [...investmentModelsPageKeys.all, 'list'] as const,
  list: (params?: InvestmentModelsPageQueryParams) => [...investmentModelsPageKeys.lists(), params] as const,
  details: () => [...investmentModelsPageKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentModelsPageKeys.details(), id] as const,
};

/**
 * Get paginated list of investment models pages
 */
export function useInvestmentModelsPages(params?: InvestmentModelsPageQueryParams) {
  return useQuery<InvestmentModelsPageListResponse>({
    queryKey: investmentModelsPageKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentModelsPageListResponse>('/admin/investment-models-page', { params });
      return response;
    },
  });
}

/**
 * Get single investment models page by ID
 */
export function useInvestmentModelsPage(id: string) {
  return useQuery<InvestmentModelsPageResponse>({
    queryKey: investmentModelsPageKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentModelsPageResponse>(`/admin/investment-models-page/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment models page
 */
export function useCreateInvestmentModelsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentModelsPageRequest) => {
      const response = await api.post<InvestmentModelsPageResponse>('/admin/investment-models-page', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.lists() });
    },
  });
}

/**
 * Update existing investment models page
 */
export function useUpdateInvestmentModelsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentModelsPageRequest }) => {
      const response = await api.patch<InvestmentModelsPageResponse>(`/admin/investment-models-page/${id}`, data);
      return response.data as unknown as InvestmentModelsPageResponse;
    },
    onSuccess: (response: InvestmentModelsPageResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment models page
 */
export function useDeleteInvestmentModelsPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-models-page/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.lists() });
    },
  });
}

/**
 * Investment Models Hooks
 */

export const investmentModelKeys = {
  all: ['investment-models'] as const,
  lists: () => [...investmentModelKeys.all, 'list'] as const,
  list: (params?: InvestmentModelQueryParams) => [...investmentModelKeys.lists(), params] as const,
  details: () => [...investmentModelKeys.all, 'detail'] as const,
  detail: (id: string) => [...investmentModelKeys.details(), id] as const,
};

/**
 * Get paginated list of investment models
 */
export function useInvestmentModels(params?: InvestmentModelQueryParams) {
  return useQuery<InvestmentModelListResponse>({
    queryKey: investmentModelKeys.list(params),
    queryFn: async () => {
      const response = await api.get<InvestmentModelListResponse>('/admin/investment-models', { params });
      return response;
    },
  });
}

/**
 * Get single investment model by ID
 */
export function useInvestmentModel(id: string) {
  return useQuery<InvestmentModelResponse>({
    queryKey: investmentModelKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<InvestmentModelResponse>(`/admin/investment-models/${id}`);
      return response;
    },
    enabled: !!id,
  });
}

/**
 * Create new investment model
 */
export function useCreateInvestmentModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateInvestmentModelRequest) => {
      const response = await api.post<InvestmentModelResponse>('/admin/investment-models', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.all });
    },
  });
}

/**
 * Update existing investment model
 */
export function useUpdateInvestmentModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInvestmentModelRequest }) => {
      const response = await api.patch<InvestmentModelResponse>(`/admin/investment-models/${id}`, data);
      return response.data as unknown as InvestmentModelResponse;
    },
    onSuccess: (response: InvestmentModelResponse) => {
      queryClient.invalidateQueries({ queryKey: investmentModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.all });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: investmentModelKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete investment model
 */
export function useDeleteInvestmentModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/investment-models/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: investmentModelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: investmentModelsPageKeys.all });
    },
  });
}
