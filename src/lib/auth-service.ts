import { api } from "./api-client";

// تعریف نوع User بر اساس مستندات API
export interface User {
  id: string;
  phone: string;
  name: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
}

// تعریف نوع پاسخ API
interface ApiResponse<T> {
  status: "success" | "fail" | "error";
  message: string;
  data: T;
}

// پاسخ login
interface LoginResponse {
  id: string;
  phone: string;
  role: string;
  firstName?: string;
  lastName?: string;
  name: string;
  email?: string;
  phoneVerified?: boolean;
  avatarUrl?: string;
}

// پاسخ session
interface SessionResponse {
  user: User;
}

// تابع login
export async function login(phone: string, password: string): Promise<User> {
  try {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", {
      phone,
      password,
    });

    if (response.data.status === "success") {
      return response.data.data;
    }

    throw new Error(response.data.message || "خطا در ورود");
  } catch (error: any) {
    // مدیریت خطاهای axios
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error("خطا در برقراری ارتباط با سرور");
  }
}

// تابع بررسی session
export async function checkSession(): Promise<User | null> {
  try {
    const response =
      await api.get<ApiResponse<SessionResponse>>("/auth/session");

    if (response.data.status === "success") {
      return response.data.data.user;
    }

    return null;
  } catch (error) {
    // اگر 401 دریافت شد، یعنی کاربر احراز هویت نشده
    return null;
  }
}

// تابع logout
export async function logout(): Promise<boolean> {
  try {
    const response =
      await api.post<ApiResponse<{ loggedOut: boolean }>>("/auth/logout");
    return response.data.status === "success";
  } catch (error) {
    console.error("خطا در خروج:", error);
    return false;
  }
}
