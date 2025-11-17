// @/hooks/api/use-newsletter-subscribers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import type {
  NewsletterSubscribersListResponse,
  NewsletterSubscriberResponse,
  NewsletterSubscriber,
  PaginationParams,
  SearchParams,
} from '@/types/api';

/**
 * React Query hooks for Newsletter Subscribers API
 */

// Query Keys
export const newsletterSubscriberKeys = {
  all: ['newsletter-subscribers'] as const,
  lists: () => [...newsletterSubscriberKeys.all, 'list'] as const,
  list: (params?: NewsletterSubscribersQueryParams) => [...newsletterSubscriberKeys.lists(), params] as const,
  details: () => [...newsletterSubscriberKeys.all, 'detail'] as const,
  detail: (id: string) => [...newsletterSubscriberKeys.details(), id] as const,
};

// Query Parameters
export interface NewsletterSubscribersQueryParams extends PaginationParams, SearchParams {}

// Request Types
export type CreateNewsletterSubscriberRequest = {
  phone: string;
};

export type UpdateNewsletterSubscriberRequest = {
  phone: string;
};

export type BroadcastSMSRequest = {
  message: string;
};

/**
 * Get paginated list of newsletter subscribers
 */
export function useNewsletterSubscribers(params?: NewsletterSubscribersQueryParams) {
  return useQuery({
    queryKey: newsletterSubscriberKeys.list(params),
    queryFn: async () => {
      const response = await api.get<NewsletterSubscribersListResponse>('/admin/newsletter-subscribers', { params });
      return response.data;
    },
  });
}

/**
 * Get single newsletter subscriber by ID
 */
export function useNewsletterSubscriber(id: string) {
  return useQuery({
    queryKey: newsletterSubscriberKeys.detail(id),
    queryFn: async () => {
      const response = await api.get<NewsletterSubscriberResponse>(`/admin/newsletter-subscribers/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Create new newsletter subscriber
 */
export function useCreateNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateNewsletterSubscriberRequest) => {
      const response = await api.post<NewsletterSubscriberResponse>('/admin/newsletter-subscribers', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterSubscriberKeys.lists() });
    },
  });
}

/**
 * Update existing newsletter subscriber
 */
export function useUpdateNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateNewsletterSubscriberRequest }) => {
      const response = await api.patch<NewsletterSubscriberResponse>(`/admin/newsletter-subscribers/${id}`, data);
      return response.data as unknown as NewsletterSubscriberResponse;
    },
    onSuccess: (response: NewsletterSubscriberResponse) => {
      queryClient.invalidateQueries({ queryKey: newsletterSubscriberKeys.lists() });
      if (response.data && 'id' in response.data) {
        queryClient.invalidateQueries({ queryKey: newsletterSubscriberKeys.detail(response.data.id as string) });
      }
    },
  });
}

/**
 * Delete newsletter subscriber
 */
export function useDeleteNewsletterSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/newsletter-subscribers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterSubscriberKeys.lists() });
    },
  });
}

/**
 * Broadcast SMS to all active newsletter subscribers
 */
export function useBroadcastSMS() {
  return useMutation({
    mutationFn: async (data: BroadcastSMSRequest) => {
      const response = await api.post('/admin/newsletter-subscribers/broadcast-sms', data);
      return response.data;
    },
  });
}
