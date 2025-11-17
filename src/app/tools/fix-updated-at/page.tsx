"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface FixUpdatedAtResponse {
  status: string;
  message: string;
  data?: {
    fixed: number;
    details?: {
      [key: string]: number;
    };
  };
}

const FixUpdatedAtPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FixUpdatedAtResponse["data"] | null>(
    null
  );

  const handleFixUpdatedAt = async () => {
    const confirmFix = window.confirm(
      "آیا مطمئن هستید که می‌خواهید فیلد updatedAt تمام رکوردها را اصلاح کنید؟\n\nاین عملیات ممکن است چند دقیقه طول بکشد."
    );

    if (!confirmFix) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post<FixUpdatedAtResponse>(
        "/admin/fix-updatedAt"
      );
      setResult(response.data || null);
      toast.success(
        response.message || "فیلدهای updatedAt با موفقیت اصلاح شدند"
      );
    } catch (error: any) {
      toast.error(error?.message || "خطا در اصلاح فیلدهای updatedAt");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="اصلاح فیلد updatedAt" />

      <div className="flex flex-col gap-6">
        {/* Info Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            درباره ابزار اصلاح updatedAt
          </h3>
          <p className="mb-3 text-body-sm text-dark dark:text-white">
            این ابزار فیلد <code className="rounded bg-gray-2 px-2 py-1 dark:bg-dark-2">updatedAt</code> را
            برای رکوردهایی که این فیلد را ندارند یا به درستی تنظیم نشده است،
            اصلاح می‌کند.
          </p>
          <div className="rounded-lg bg-warning/10 p-4">
            <p className="text-sm text-warning">
              <strong>توجه:</strong> این عملیات ممکن است چند دقیقه طول بکشد و
              بر روی دیتابیس تاثیر می‌گذارد. لطفاً از backup گرفتن دیتابیس قبل
              از اجرای این عملیات اطمینان حاصل کنید.
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            اجرای عملیات
          </h3>

          <button
            onClick={handleFixUpdatedAt}
            disabled={loading}
            className="rounded bg-primary px-8 py-3 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin"
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
                در حال اصلاح...
              </span>
            ) : (
              "اصلاح فیلدهای updatedAt"
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-6 rounded-lg border border-stroke bg-success/10 p-4 dark:border-dark-3">
              <h4 className="mb-3 text-lg font-semibold text-success">
                نتایج عملیات
              </h4>
              <div className="space-y-2">
                <p className="text-dark dark:text-white">
                  <strong>تعداد کل رکوردهای اصلاح شده:</strong>{" "}
                  <span className="text-success">{result.fixed}</span>
                </p>

                {result.details && Object.keys(result.details).length > 0 && (
                  <div className="mt-4">
                    <p className="mb-2 font-medium text-dark dark:text-white">
                      جزئیات:
                    </p>
                    <div className="overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
                      <table className="w-full table-auto">
                        <thead>
                          <tr className="bg-gray-2 text-right dark:bg-dark-2">
                            <th className="px-4 py-3 font-medium text-dark dark:text-white">
                              مدل
                            </th>
                            <th className="px-4 py-3 font-medium text-dark dark:text-white">
                              تعداد
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(result.details).map(
                            ([model, count]) => (
                              <tr
                                key={model}
                                className="border-t border-stroke dark:border-dark-3"
                              >
                                <td className="px-4 py-3 text-dark dark:text-white">
                                  {model}
                                </td>
                                <td className="px-4 py-3 text-dark dark:text-white">
                                  {count}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default FixUpdatedAtPage;
