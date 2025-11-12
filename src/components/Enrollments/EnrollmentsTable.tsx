"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useEnrollments } from "@/hooks/api/use-enrollments";

import type { EnrollmentWithRelations } from "@/types/api";

const EnrollmentsTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useEnrollments({ page, limit: 10 });

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4">
        <p className="text-danger">خطا در بارگذاری ثبت‌نام‌ها</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            لیست ثبت‌نام‌ها
          </h3>

          <Link
            href="/enrollments/create"
            className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            + افزودن ثبت‌نام جدید
          </Link>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto p-4 sm:p-7.5">
        {isLoading ? (
          <div className="text-center">در حال بارگذاری...</div>
        ) : (
          <>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                  <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                    کاربر
                  </th>

                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    دوره
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    پیشرفت
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    تاریخ ثبت‌نام
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (enrollment: EnrollmentWithRelations, index: number) => (
                    <tr key={enrollment.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {enrollment.user.firstName} {enrollment.user.lastName}
                        </p>

                        <p className="text-body text-body-sm">
                          {enrollment.user.phone}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="font-medium text-dark dark:text-white">
                          {enrollment.course.subject}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 rounded-full bg-gray">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>

                          <span className="text-body-sm text-dark dark:text-white">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${
                            enrollment.completedAt
                              ? "bg-[#219653]/[0.08] text-[#219653]"
                              : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"
                          }`}
                        >
                          {enrollment.completedAt
                            ? "تکمیل شده"
                            : "در حال یادگیری"}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {new Date(enrollment.enrolledAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/enrollments/${enrollment.id}`}
                            className="hover:text-primary"
                            title="مشاهده"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                              />
                            </svg>
                          </Link>

                          <Link
                            href={`/enrollments/edit/${enrollment.id}`}
                            className="hover:text-primary"
                            title="ویرایش"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                            >
                              <path d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z" />
                              <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" />
                            </svg>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>

            {data && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} ثبت‌نام
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
          </>
        )}
      </div>
    </div>
  );
};

export default EnrollmentsTable;
