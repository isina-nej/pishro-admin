"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useSkyRoomClasses,
  useDeleteSkyRoomClass,
} from "@/hooks/api/use-skyroom-classes";
import type { SkyRoomClass } from "@/types/api";
import Image from "next/image";
import { toast } from "sonner";

const SkyRoomClassesTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useSkyRoomClasses({
    page,
    limit: 10,
    search,
  });
  const deleteSkyRoomClass = useDeleteSkyRoomClass();

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`آیا از حذف کلاس "${title}" اطمینان دارید؟`)) {
      try {
        await deleteSkyRoomClass.mutateAsync(id);
        toast.success("کلاس با موفقیت حذف شد");
      } catch (error) {
        toast.error("خطا در حذف کلاس");
        console.error(error);
      }
    }
  };

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <p className="text-danger">خطا در بارگذاری کلاس‌های Skyroom</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
      {/* Header with search and create button */}
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            لیست کلاس‌های Skyroom
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
              href="/skyroom-classes/create"
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              + افزودن کلاس جدید
            </Link>
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
                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    عنوان کلاس
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    مدرس
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    تاریخ شروع
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    مدت زمان
                  </th>

                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    ظرفیت
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    سطح
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    منتشر شده
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map((skyRoomClass: SkyRoomClass, index: number) => (
                  <tr key={skyRoomClass.id}>
                    <td
                      className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                        index === data.items.length - 1
                          ? "border-b-0"
                          : "border-b"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {skyRoomClass.thumbnail && (
                          <div className="h-12 w-12 overflow-hidden rounded">
                            <Image
                              src={skyRoomClass.thumbnail}
                              alt={skyRoomClass.title}
                              width={48}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        <div>
                          <h5 className="font-medium text-dark dark:text-white">
                            {skyRoomClass.title}
                          </h5>
                          {skyRoomClass.description && (
                            <p className="text-body text-body-sm line-clamp-1">
                              {skyRoomClass.description}
                            </p>
                          )}
                        </div>
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
                        {skyRoomClass.instructor || "-"}
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
                        {formatDate(skyRoomClass.startDate)}
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
                        {skyRoomClass.duration || "-"}
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
                        {skyRoomClass.capacity || "-"}
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
                        {skyRoomClass.level || "-"}
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
                          skyRoomClass.published
                            ? "bg-[#219653]/[0.08] text-[#219653]"
                            : "bg-[#D34053]/[0.08] text-[#D34053]"
                        }`}
                      >
                        {skyRoomClass.published ? "بله" : "خیر"}
                      </span>
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
                          href={`/skyroom-classes/edit/${skyRoomClass.id}`}
                          className="hover:text-primary"
                          title="ویرایش"
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
                              d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                              fill=""
                            />

                            <path
                              d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                              fill=""
                            />
                          </svg>
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(skyRoomClass.id, skyRoomClass.title)
                          }
                          className="hover:text-danger"
                          title="حذف"
                          disabled={deleteSkyRoomClass.isPending}
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
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {data && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} کلاس
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

export default SkyRoomClassesTable;
