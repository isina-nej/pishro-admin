"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { Metadata } from "next";

interface RevalidatePath {
  path: string;
  description?: string;
}

interface RevalidatePathsResponse {
  status: string;
  data: {
    paths: RevalidatePath[];
  };
}

interface RevalidateResponse {
  status: string;
  message: string;
  data?: {
    revalidated: boolean;
    path: string;
  };
}

const RevalidatePage = () => {
  const [paths, setPaths] = useState<RevalidatePath[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPaths, setLoadingPaths] = useState(false);
  const [revalidatingPath, setRevalidatingPath] = useState<string | null>(null);
  const [pathsLoaded, setPathsLoaded] = useState(false);

  // Load available paths
  const loadPaths = async () => {
    setLoadingPaths(true);
    try {
      const response = await api.get<RevalidatePathsResponse>("/admin/revalidate");
      setPaths(response.data.paths || []);
      setPathsLoaded(true);
      toast.success("لیست مسیرها با موفقیت بارگذاری شد");
    } catch (error: any) {
      toast.error(error?.message || "خطا در بارگذاری لیست مسیرها");
      console.error(error);
    } finally {
      setLoadingPaths(false);
    }
  };

  // Trigger revalidation for a specific path
  const handleRevalidate = async (path: string) => {
    setRevalidatingPath(path);
    try {
      const response = await api.post<RevalidateResponse>("/admin/revalidate", {
        path,
      });
      toast.success(response.message || `کش مسیر ${path} با موفقیت بازنویسی شد`);
    } catch (error: any) {
      toast.error(error?.message || "خطا در بازنویسی کش");
      console.error(error);
    } finally {
      setRevalidatingPath(null);
    }
  };

  // Trigger revalidation for all paths
  const handleRevalidateAll = async () => {
    if (!paths.length) {
      toast.error("لطفاً ابتدا لیست مسیرها را بارگذاری کنید");
      return;
    }

    const confirmRevalidate = window.confirm(
      "آیا مطمئن هستید که می‌خواهید کش تمام مسیرها را بازنویسی کنید؟"
    );

    if (!confirmRevalidate) return;

    setLoading(true);
    let successCount = 0;
    let errorCount = 0;

    for (const { path } of paths) {
      try {
        await api.post<RevalidateResponse>("/admin/revalidate", { path });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to revalidate ${path}:`, error);
      }
    }

    setLoading(false);

    if (errorCount === 0) {
      toast.success(`کش ${successCount} مسیر با موفقیت بازنویسی شد`);
    } else {
      toast.warning(
        `${successCount} مسیر با موفقیت بازنویسی شد، ${errorCount} مسیر با خطا مواجه شد`
      );
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="بازنویسی کش (Revalidate)" />

      <div className="flex flex-col gap-6">
        {/* Info Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            درباره بازنویسی کش ISR
          </h3>
          <p className="text-body-sm text-dark dark:text-white">
            این ابزار به شما امکان می‌دهد کش صفحات Next.js (ISR - Incremental Static
            Regeneration) را به صورت دستی بازنویسی کنید. با استفاده از این قابلیت
            می‌توانید تغییرات را بدون نیاز به build مجدد پروژه، در صفحات استاتیک
            اعمال کنید.
          </p>
        </div>

        {/* Load Paths Section */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-dark dark:text-white">
              مسیرهای قابل بازنویسی
            </h3>
            <button
              onClick={loadPaths}
              disabled={loadingPaths}
              className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {loadingPaths ? "در حال بارگذاری..." : "بارگذاری لیست مسیرها"}
            </button>
          </div>

          {pathsLoaded && paths.length === 0 && (
            <div className="rounded-lg bg-warning/10 p-4 text-warning">
              هیچ مسیری برای بازنویسی یافت نشد
            </div>
          )}

          {paths.length > 0 && (
            <>
              <div className="mb-4">
                <button
                  onClick={handleRevalidateAll}
                  disabled={loading}
                  className="rounded bg-success px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? "در حال بازنویسی همه..." : "بازنویسی همه مسیرها"}
                </button>
              </div>

              <div className="overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-2 text-right dark:bg-dark-2">
                      <th className="px-4 py-4 font-medium text-dark dark:text-white">
                        مسیر
                      </th>
                      <th className="px-4 py-4 font-medium text-dark dark:text-white">
                        توضیحات
                      </th>
                      <th className="px-4 py-4 font-medium text-dark dark:text-white">
                        عملیات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paths.map((item, index) => (
                      <tr
                        key={index}
                        className="border-t border-stroke dark:border-dark-3"
                      >
                        <td className="px-4 py-4 font-mono text-sm text-dark dark:text-white">
                          {item.path}
                        </td>
                        <td className="px-4 py-4 text-sm text-dark dark:text-white">
                          {item.description || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleRevalidate(item.path)}
                            disabled={revalidatingPath === item.path || loading}
                            className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
                          >
                            {revalidatingPath === item.path
                              ? "در حال بازنویسی..."
                              : "بازنویسی"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default RevalidatePage;
