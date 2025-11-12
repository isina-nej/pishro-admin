// @/hooks/api/use-dashboard.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  DashboardStatsResponse,
  PaymentsDataResponse,
  ProfitDataResponse,
  DevicesDataResponse,
  PaymentsQueryParams,
  ProfitQueryParams,
  DevicesQueryParams,
} from '@/types/api';

/**
 * React Query hooks for Dashboard API
 */

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  payments: (params?: PaymentsQueryParams) => [...dashboardKeys.all, 'payments', params] as const,
  profit: (params?: ProfitQueryParams) => [...dashboardKeys.all, 'profit', params] as const,
  devices: (params?: DevicesQueryParams) => [...dashboardKeys.all, 'devices', params] as const,
};

/**
 * Get dashboard statistics (total views, revenue, orders, users)
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: async () => {
      const response = await api.get<DashboardStatsResponse>('/dashboard/stats');
      return response.data;
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get monthly/yearly payments data
 */
export function useDashboardPayments(params?: PaymentsQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.payments(params),
    queryFn: async () => {
      const response = await api.get<PaymentsDataResponse>('/dashboard/payments/monthly', { params });
      return response.data;
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get weekly profit data
 */
export function useDashboardProfit(params?: ProfitQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.profit(params),
    queryFn: async () => {
      const response = await api.get<ProfitDataResponse>('/dashboard/profit/weekly', { params });
      return response.data;
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get devices analytics data
 */
export function useDashboardDevices(params?: DevicesQueryParams) {
  return useQuery({
    queryKey: dashboardKeys.devices(params),
    queryFn: async () => {
      const response = await api.get<DevicesDataResponse>('/dashboard/devices', { params });
      return response.data;
    },
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
