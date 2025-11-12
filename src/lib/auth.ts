// @/lib/auth.ts
/**
 * Authentication utilities for token-based auth
 * Works with external backend API
 */

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export interface AuthUser {
  id: string;
  phone: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  avatarUrl?: string | null;
}

/**
 * Save auth token to localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Get auth token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

/**
 * Remove auth token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};

/**
 * Save user data to localStorage
 */
export const setAuthUser = (user: AuthUser): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

/**
 * Get user data from localStorage
 */
export const getAuthUser = (): AuthUser | null => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr) as AuthUser;
      } catch {
        return null;
      }
    }
  }
  return null;
};

/**
 * Remove user data from localStorage
 */
export const removeAuthUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  const user = getAuthUser();
  return user?.role === "ADMIN";
};

/**
 * Logout user
 */
export const logout = (): void => {
  removeAuthToken();
  removeAuthUser();
  if (typeof window !== "undefined") {
    window.location.href = "/auth/signin";
  }
};
