"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout as logoutService } from "@/lib/auth-service";
import { removeAuthToken, removeAuthUser } from "@/lib/auth";

const LogoutPage: React.FC = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // 1. Call backend API to invalidate session on server
        await logoutService();
      } catch (error) {
        // Continue with client-side logout even if server request fails
        console.error("خطا در خروج از سمت سرور:", error);
      } finally {
        // 2. Clear client-side data (token and user)
        removeAuthToken();
        removeAuthUser();

        // 3. Redirect to login page
        setIsLoggingOut(false);
        router.push("/auth/signin");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-2 dark:bg-dark">
      <div className="rounded-[10px] bg-white p-10 shadow-1 dark:bg-gray-dark dark:shadow-card">
        {isLoggingOut ? (
          <div className="text-center">
            <div className="mb-4 inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
            <p className="text-lg font-medium text-dark dark:text-white">
              در حال خروج از حساب کاربری...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium text-dark dark:text-white">
              با موفقیت خارج شدید
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoutPage;
