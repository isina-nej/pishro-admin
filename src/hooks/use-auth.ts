'use client';

import { useAuthContext } from '@/contexts/auth-context';

/**
 * Hook برای استفاده از احراز هویت در components
 * این hook فقط یک wrapper ساده برای AuthContext است
 *
 * استفاده:
 * const { user, loading, login, logout, isAuthenticated, isAdmin } = useAuth();
 */
export function useAuth() {
  return useAuthContext();
}
