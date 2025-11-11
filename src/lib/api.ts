import axios from 'axios';

// ایجاد instance axios با تنظیمات پیش‌فرض
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://pishro-0.vercel.app',
  withCredentials: true, // 🔥 مهم: برای ارسال و دریافت cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor برای مدیریت خطاهای 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // اگر 401 دریافت شد، کاربر را به صفحه login هدایت کن
    if (error.response?.status === 401) {
      // فقط در client-side redirect کن
      if (typeof window !== 'undefined') {
        // اگر قبلاً در صفحه login نیستیم
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
