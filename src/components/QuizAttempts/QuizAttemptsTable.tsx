"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuizAttempts, useDeleteQuizAttempt } from "@/hooks/api/use-quiz-attempts";
import type { QuizAttemptWithRelations } from "@/types/api";
import { toast } from "sonner";

const QuizAttemptsTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [quizId, setQuizId] = useState("");
  const [userId, setUserId] = useState("");
  const [passed, setPassed] = useState<boolean | undefined>(undefined);

  const { data, isLoading, error } = useQuizAttempts({
    page,
    limit: 10,
    quizId: quizId || undefined,
    userId: userId || undefined,
    passed
  });
  const deleteQuizAttempt = useDeleteQuizAttempt();

  const handleDelete = async (id: string, userName: string) => {
    if (window.confirm(`آیا از حذف تلاش "${userName}" اطمینان دارید؟`)) {
      try {
        await deleteQuizAttempt.mutateAsync(id);
        toast.success("تلاش با موفقیت حذف شد");
      } catch (error) {
        toast.error("خطا در حذف تلاش");
        console.error(error);
      }
    }
  };

  const handleClearFilters = () => {
    setQuizId("");
    setUserId("");
    setPassed(undefined);
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <p className="text-danger">خطا در بارگذاری تلاش‌های آزمون</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      {/* Header with filters */}
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex flex-col gap-4">
          <h3 className="font-medium text-dark dark:text-white">
            لیست تلاش‌های آزمون
          </h3>

          <div className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="شناسه آزمون..."
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              className="w-40 rounded border border-stroke bg-transparent px-3 py-1.5 outline-none focus:border-primary dark:border-dark-3"
            />

            <input
              type="text"
              placeholder="شناسه کاربر..."
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-40 rounded border border-stroke bg-transparent px-3 py-1.5 outline-none focus:border-primary dark:border-dark-3"
            />

            <select
              value={passed === undefined ? "" : passed.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setPassed(value === "" ? undefined : value === "true");
              }}
              className="rounded border border-stroke bg-transparent px-3 py-1.5 outline-none focus:border-primary dark:border-dark-3"
            >
              <option value="">همه وضعیت‌ها</option>
              <option value="true">قبول شده</option>
              <option value="false">قبول نشده</option>
            </select>

            {(quizId || userId || passed !== undefined) && (
              <button
                onClick={handleClearFilters}
                className="rounded bg-gray px-3 py-1.5 text-body-sm text-dark hover:bg-opacity-90 dark:bg-dark-2 dark:text-white"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="max-w-full overflow-x-auto p-4 sm:p-7.5">
        {isLoading ? (
          <div className="text-center">در حال بارگذاری...</div>
        ) : (
          <>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                  <th className="min-w-[180px] px-4 py-4 font-medium text-dark dark:text-white">
                    کاربر
                  </th>

                  <th className="min-w-[180px] px-4 py-4 font-medium text-dark dark:text-white">
                    آزمون
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    نمره
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    امتیاز
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    زمان صرف شده
                  </th>

                  <th className="min-w-[140px] px-4 py-4 font-medium text-dark dark:text-white">
                    تاریخ تکمیل
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (attempt: QuizAttemptWithRelations, index: number) => (
                    <tr key={attempt.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <div>
                          <h5 className="font-medium text-dark dark:text-white">
                            {attempt.user.firstName} {attempt.user.lastName}
                          </h5>
                          {attempt.user.email && (
                            <p className="text-body text-body-sm">
                              {attempt.user.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="font-medium text-dark dark:text-white">
                          {attempt.quiz.title}
                        </p>
                        {attempt.quiz.description && (
                          <p className="text-body text-body-sm line-clamp-1">
                            {attempt.quiz.description}
                          </p>
                        )}
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="font-medium text-dark dark:text-white">
                          {attempt.score.toFixed(1)}%
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="text-dark dark:text-white">
                          {attempt.totalPoints} / {attempt.maxPoints}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${
                            attempt.passed
                              ? "bg-[#219653]/[0.08] text-[#219653]"
                              : "bg-[#D34053]/[0.08] text-[#D34053]"
                          }`}
                        >
                          {attempt.passed ? "قبول" : "مردود"}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="text-dark dark:text-white">
                          {attempt.timeSpent
                            ? `${Math.floor(attempt.timeSpent / 60)} دقیقه ${attempt.timeSpent % 60} ثانیه`
                            : "-"}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="text-dark dark:text-white">
                          {attempt.completedAt
                            ? new Date(attempt.completedAt).toLocaleDateString("fa-IR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "-"}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/quiz-attempts/${attempt.id}`}
                            className="hover:text-primary"
                            title="مشاهده جزئیات"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M10 3.125C5.47969 3.125 2.10938 6.04688 1.25 10C2.10938 13.9531 5.47969 16.875 10 16.875C14.5203 16.875 17.8906 13.9531 18.75 10C17.8906 6.04688 14.5203 3.125 10 3.125ZM10 14.375C7.58594 14.375 5.625 12.4141 5.625 10C5.625 7.58594 7.58594 5.625 10 5.625C12.4141 5.625 14.375 7.58594 14.375 10C14.375 12.4141 12.4141 14.375 10 14.375ZM10 7.5C8.61719 7.5 7.5 8.61719 7.5 10C7.5 11.3828 8.61719 12.5 10 12.5C11.3828 12.5 12.5 11.3828 12.5 10C12.5 8.61719 11.3828 7.5 10 7.5Z"
                                fill=""
                              />
                            </svg>
                          </Link>

                          <button
                            onClick={() =>
                              handleDelete(
                                attempt.id,
                                `${attempt.user.firstName} ${attempt.user.lastName}`
                              )
                            }
                            className="hover:text-danger"
                            title="حذف"
                            disabled={deleteQuizAttempt.isPending}
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                                fill=""
                              />
                              <path
                                d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                                fill=""
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {data && data.items.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} تلاش
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="rounded bg-gray px-3 py-1 text-body-sm disabled:opacity-50"
                  >
                    قبلی
                  </button>

                  <span className="px-3 py-1">
                    صفحه {page} از {data.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.pagination.hasNextPage}
                    className="rounded bg-gray px-3 py-1 text-body-sm disabled:opacity-50"
                  >
                    بعدی
                  </button>
                </div>
              </div>
            )}

            {data && data.items.length === 0 && (
              <div className="text-center py-8">
                <p className="text-body">هیچ تلاشی یافت نشد</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizAttemptsTable;
