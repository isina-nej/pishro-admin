import { api } from "./api-client";
import axios from "axios";

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

// Get base URL for auth endpoints (without /api prefix)
const getAuthBaseURL = (): string => {
  return process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://pishrosarmaye.com";
};

// Create a separate axios instance for auth endpoints
const authClient = axios.create({
  baseURL: getAuthBaseURL(),
  timeout: 30000,
  withCredentials: true,
});

// تابع login
export async function login(phone: string, password: string): Promise<User> {
  try {
    const response = await authClient.post<ApiResponse<LoginResponse>>("/api/auth/login", {
      phone,
      password,
    });

    if (response.data.status === "success") {
      // API returns structured data under response.data.data
      return response.data.data as unknown as User;
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
      await authClient.get<ApiResponse<SessionResponse>>("/auth/session");

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
      await authClient.post<ApiResponse<{ loggedOut: boolean }>>("/api/auth/logout");
    return response.data.status === "success";
  } catch (error) {
    console.error("خطا در خروج:", error);
    return false;
  }
}
