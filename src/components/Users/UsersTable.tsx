"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useUsers } from "@/hooks/api/use-users";

import type { UserWithRelations } from "@/types/api";

const UsersTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useUsers({ page, limit: 10, search });

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1">
        <p className="text-danger">خطا در بارگذاری کاربران</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            لیست کاربران
          </h3>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-60 rounded border border-stroke bg-transparent px-3 py-1.5 outline-none focus:border-primary dark:border-dark-3"
            />

            <Link
              href="/users/create"
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              + افزودن کاربر
            </Link>
          </div>
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
                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    نام کاربر
                  </th>

                  <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                    ایمیل
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    شماره موبایل
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    نقش
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    تعداد سفارشات
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (user: UserWithRelations, index: number) => (
                    <tr key={user.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <div>
                          <h5 className="font-medium text-dark dark:text-white">
                            {user.firstName} {user.lastName}
                          </h5>

                          <p className="text-body text-body-sm">
                            ID: {user.id.slice(0, 8)}...
                          </p>
                        </div>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === data.items.length - 1
                            ? "border-b-0"
                            : "border-b"
                        }`}
                      >
                        <p className="text-dark dark:text-white">
                          {user.email || "-"}
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
                          {user.phone}
                        </p>

                        {user.phoneVerified && (
                          <span className="text-success text-body-sm">
                            ✓ تایید شده
                          </span>
                        )}
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
                            user.role === "ADMIN"
                              ? "bg-[#D34053]/[0.08] text-[#D34053]"
                              : "bg-[#219653]/[0.08] text-[#219653]"
                          }`}
                        >
                          {user.role === "ADMIN" ? "ادمین" : "کاربر"}
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
                          {user._count?.orders || 0}
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
                            href={`/users/${user.id}`}
                            className="hover:text-primary"
                            title="مشاهده"
                          >
                            <svg
                              className="fill-current"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9.99935 6.87492C8.27346 6.87492 6.87435 8.27403 6.87435 9.99992C6.87435 11.7258 8.27346 13.1249 9.99935 13.1249C11.7252 13.1249 13.1243 11.7258 13.1243 9.99992C13.1243 8.27403 11.7252 6.87492 9.99935 6.87492ZM8.12435 9.99992C8.12435 8.96438 8.96382 8.12492 9.99935 8.12492C11.0349 8.12492 11.8743 8.96438 11.8743 9.99992C11.8743 11.0355 11.0349 11.8749 9.99935 11.8749C8.96382 11.8749 8.12435 11.0355 8.12435 9.99992Z"
                              />
                            </svg>
                          </Link>

                          <Link
                            href={`/users/edit/${user.id}`}
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
                  نمایش {data.items.length} از {data.pagination.total} کاربر
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

export default UsersTable;
