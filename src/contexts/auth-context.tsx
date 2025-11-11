'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, login as loginService, logout as logoutService, checkSession } from '@/lib/auth-service';

// تعریف نوع Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshSession: () => Promise<void>;
}

// ایجاد Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // بررسی session در بارگذاری اولیه
  useEffect(() => {
    refreshSession();
  }, []);

  // تابع بررسی و به‌روزرسانی session
  const refreshSession = async () => {
    try {
      const userData = await checkSession();
      setUser(userData);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // تابع login
  const login = async (phone: string, password: string) => {
    try {
      const userData = await loginService(phone, password);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  // تابع logout
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error('خطا در خروج:', error);
      // حتی اگر خطا داشتیم، کاربر را logout کن
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook برای استفاده از Context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext باید درون AuthProvider استفاده شود');
  }
  return context;
}
