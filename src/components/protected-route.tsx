'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Component برای محافظت از صفحات
 *
 * استفاده:
 * <ProtectedRoute>
 *   <YourComponent />
 * </ProtectedRoute>
 *
 * یا برای صفحات admin:
 * <ProtectedRoute requireAdmin={true}>
 *   <AdminComponent />
 * </ProtectedRoute>
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // منتظر بمان تا loading تمام شود
    if (loading) return;

    // اگر کاربر احراز هویت نشده، به login redirect کن
    if (!user) {
      router.push('/login');
      return;
    }

    // اگر نیاز به admin است ولی کاربر admin نیست
    if (requireAdmin && !isAdmin) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, isAdmin, requireAdmin, router]);

  // در حال بارگذاری
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  // کاربر احراز هویت نشده
  if (!user) {
    return null;
  }

  // نیاز به admin ولی کاربر admin نیست
  if (requireAdmin && !isAdmin) {
    return null;
  }

  // همه چیز OK است، نمایش محتوا
  return <>{children}</>;
}
