// @/lib/api-client.ts
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from './api-response';

/**
 * Base API Client using Axios
 * Centralized configuration for all API requests to external backend
 */

// Base URL configuration - connects directly to backend API
// CORS has been fixed on the backend, so we can make direct requests
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://pishro-0.vercel.app/api';

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for sending cookies
});

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

/**
 * Request Interceptor
 * Automatically adds authentication token to requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // Get token from localStorage
      const token = getAuthToken();

      if (token) {
        // Add authorization header if token exists
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token in request interceptor:', error);
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles errors and standardizes responses
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    // Handle specific error cases
    if (error.response) {
      const { status, data } = error.response;

      // Handle authentication errors
      if (status === 401) {
        console.error('Unauthorized - clearing token and redirecting to login');
        // Clear token from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          localStorage.removeItem('authUser');
          window.location.href = '/auth/signin';
        }
      }

      // Handle forbidden errors
      if (status === 403) {
        console.error('Forbidden - insufficient permissions');
      }

      // Handle not found errors
      if (status === 404) {
        console.error('Resource not found');
      }

      // Handle server errors
      if (status >= 500) {
        console.error('Server error:', data);
      }

      // Return standardized error
      return Promise.reject({
        status: data?.status || 'error',
        message: data?.message || 'An unexpected error occurred',
        code: (data as any)?.code,
        details: (data as any)?.details,
      });
    }

    // Handle network errors
    if (error.request) {
      console.error('Network error - no response received');
      return Promise.reject({
        status: 'error',
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    }

    // Handle other errors
    return Promise.reject({
      status: 'error',
      message: error.message || 'An unexpected error occurred',
      code: 'UNKNOWN_ERROR',
    });
  }
);

/**
 * API Client Methods
 * Type-safe wrapper methods for common HTTP operations
 */

export const api = {
  /**
   * GET request
   */
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data as T;
  },

  /**
   * POST request
   */
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data as T;
  },

  /**
   * PUT request
   */
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data as T;
  },

  /**
   * PATCH request
   */
  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data as T;
  },

  /**
   * DELETE request
   */
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data as T;
  },
};

export default apiClient;
