'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100" dir="rtl">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">دسترسی غیرمجاز</h1>
          <p className="mt-2 text-gray-600">شما مجوز دسترسی به این صفحه را ندارید.</p>
          {user && (
            <p className="mt-4 text-sm text-gray-500">
              کاربر: {user.name} ({user.role})
            </p>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            بازگشت به صفحه اصلی
          </button>
          <button
            onClick={async () => {
              await logout();
              router.push('/login');
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            خروج و ورود مجدد
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>اگر فکر می‌کنید این یک اشتباه است، با مدیر سیستم تماس بگیرید.</p>
        </div>
      </div>
    </div>
  );
}
