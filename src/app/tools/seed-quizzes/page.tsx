"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

interface SeedQuizzesResponse {
  status: string;
  message: string;
  data?: {
    quizzesCreated: number;
    questionsCreated: number;
    details?: {
      quizzes: Array<{
        id: string;
        title: string;
        questionCount: number;
      }>;
    };
  };
}

const SeedQuizzesPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedQuizzesResponse["data"] | null>(
    null
  );

  const handleSeedQuizzes = async () => {
    const confirmSeed = window.confirm(
      "آیا مطمئن هستید که می‌خواهید داده‌های تستی آزمون ایجاد کنید؟\n\nاین عملیات آزمون‌ها و سوالات نمونه ایجاد می‌کند."
    );

    if (!confirmSeed) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post<SeedQuizzesResponse>(
        "/admin/seed/quizzes"
      );
      setResult(response.data || null);
      toast.success(
        response.message || "داده‌های تستی آزمون با موفقیت ایجاد شدند"
      );
    } catch (error: any) {
      toast.error(error?.message || "خطا در ایجاد داده‌های تستی");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ایجاد داده‌های تستی آزمون" />

      <div className="flex flex-col gap-6">
        {/* Info Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            درباره ابزار Seed آزمون‌ها
          </h3>
          <p className="mb-3 text-body-sm text-dark dark:text-white">
            این ابزار برای ایجاد داده‌های تستی آزمون و سوالات استفاده می‌شود.
            با اجرای این ابزار، تعدادی آزمون نمونه به همراه سوالات و گزینه‌های
            آن‌ها در دیتابیس ایجاد می‌شود.
          </p>
          <div className="rounded-lg bg-warning/10 p-4">
            <p className="text-sm text-warning">
              <strong>توجه:</strong> این ابزار فقط برای محیط توسعه (Development)
              طراحی شده است. از اجرای آن در محیط production خودداری کنید.
            </p>
          </div>
        </div>

        {/* Action Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
          <h3 className="mb-4 text-xl font-semibold text-dark dark:text-white">
            اجرای عملیات
          </h3>

          <button
            onClick={handleSeedQuizzes}
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
                در حال ایجاد...
              </span>
            ) : (
              "ایجاد داده‌های تستی آزمون"
            )}
          </button>

          {/* Results */}
          {result && (
            <div className="mt-6 rounded-lg border border-stroke bg-success/10 p-4 dark:border-dark-3">
              <h4 className="mb-3 text-lg font-semibold text-success">
                نتایج عملیات
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-dark dark:text-white">
                    <strong>آزمون‌های ایجاد شده:</strong>{" "}
                    <span className="text-success">{result.quizzesCreated}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 text-success"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-dark dark:text-white">
                    <strong>سوالات ایجاد شده:</strong>{" "}
                    <span className="text-success">
                      {result.questionsCreated}
                    </span>
                  </p>
                </div>

                {result.details?.quizzes &&
                  result.details.quizzes.length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 font-medium text-dark dark:text-white">
                        لیست آزمون‌های ایجاد شده:
                      </p>
                      <div className="overflow-hidden rounded-lg border border-stroke dark:border-dark-3">
                        <table className="w-full table-auto">
                          <thead>
                            <tr className="bg-gray-2 text-right dark:bg-dark-2">
                              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                                عنوان
                              </th>
                              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                                تعداد سوالات
                              </th>
                              <th className="px-4 py-3 font-medium text-dark dark:text-white">
                                شناسه
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.details.quizzes.map((quiz) => (
                              <tr
                                key={quiz.id}
                                className="border-t border-stroke dark:border-dark-3"
                              >
                                <td className="px-4 py-3 text-dark dark:text-white">
                                  {quiz.title}
                                </td>
                                <td className="px-4 py-3 text-dark dark:text-white">
                                  {quiz.questionCount}
                                </td>
                                <td className="px-4 py-3 font-mono text-sm text-gray-5">
                                  {quiz.id}
                                </td>
                              </tr>
                            ))}
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

export default SeedQuizzesPage;
