'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user } = useAuth();
  const router = useRouter();

  // اگر کاربر قبلاً login کرده، به dashboard هدایت کن
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(phone, password);
      // بعد از login موفق، به dashboard redirect می‌شود
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'خطا در ورود');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100" dir="rtl">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* لوگو و عنوان */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">پنل مدیریت پیشرو</h1>
          <p className="mt-2 text-sm text-gray-600">وارد حساب کاربری خود شوید</p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* شماره تلفن */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              شماره تلفن
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-right shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              required
              disabled={isLoading}
              dir="ltr"
            />
          </div>

          {/* رمز عبور */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              رمز عبور
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور خود را وارد کنید"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-right shadow-sm focus:border-primary focus:outline-none focus:ring-primary"
              required
              disabled={isLoading}
            />
          </div>

          {/* نمایش خطا */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* دکمه ورود */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="ml-2 h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال ورود...
              </span>
            ) : (
              'ورود'
            )}
          </button>
        </form>

        {/* راهنما */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>برای ورود به پنل مدیریت، اطلاعات حساب کاربری خود را وارد کنید.</p>
        </div>
      </div>
    </div>
  );
}
