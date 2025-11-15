"use client";

import React, { useState } from "react";

import Link from "next/link";

import { useMobileScrollerSteps, useUpdateMobileScrollerStep, useDeleteMobileScrollerStep } from "@/hooks/api";

import type { MobileScrollerStep } from "@/types/api";

const MobileScrollerStepsTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useMobileScrollerSteps({ page, limit: 10 });
  const updateStep = useUpdateMobileScrollerStep();
  const deleteStep = useDeleteMobileScrollerStep();

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    if (confirm(`آیا از ${currentStatus ? 'عدم انتشار' : 'انتشار'} این مرحله مطمئن هستید؟`)) {
      try {
        await updateStep.mutateAsync({ id, data: { published: !currentStatus } });
        alert("وضعیت با موفقیت تغییر یافت");
      } catch (error: any) {
        alert(error?.message || "خطا در تغییر وضعیت");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این مرحله مطمئن هستید؟ این عملیات قابل بازگشت نیست.")) {
      try {
        await deleteStep.mutateAsync(id);
        alert("مرحله با موفقیت حذف شد");
      } catch (error: any) {
        alert(error?.message || "خطا در حذف مرحله");
      }
    }
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4">
        <p className="text-danger">خطا در بارگذاری مراحل</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">لیست مراحل اسکرولر موبایل</h3>
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
                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    شماره
                  </th>

                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    عنوان
                  </th>

                  <th className="min-w-[250px] px-4 py-4 font-medium text-dark dark:text-white">
                    توضیحات
                  </th>

                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (step: MobileScrollerStep, index: number) => (
                    <tr key={step.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {step.stepNumber}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {step.title}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="line-clamp-2 text-dark dark:text-white">
                          {step.description}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${step.published ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-[#FFA70B]/[0.08] text-[#FFA70B]"}`}
                        >
                          {step.published ? "منتشر شده" : "پیش‌نویس"}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/home-landing/scroller/edit/${step.id}`}
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

                          <button
                            onClick={() => handleTogglePublish(step.id, step.published)}
                            className={step.published ? "hover:text-[#FFA70B]" : "hover:text-[#219653]"}
                            title={step.published ? "عدم انتشار" : "انتشار"}
                            disabled={updateStep.isPending}
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
                                d="M7.5 10L9.16667 11.6667L12.5 8.33333M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>

                          <button
                            onClick={() => handleDelete(step.id)}
                            className="hover:text-[#D34053]"
                            title="حذف"
                            disabled={deleteStep.isPending}
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
                                d="M8.5 3.5C8.5 3.22386 8.72386 3 9 3H11C11.2761 3 11.5 3.22386 11.5 3.5V4H8.5V3.5ZM7 4V3.5C7 2.39543 7.89543 1.5 9 1.5H11C12.1046 1.5 13 2.39543 13 3.5V4H16.5C16.7761 4 17 4.22386 17 4.5C17 4.77614 16.7761 5 16.5 5H15.9311L15.1305 16.1148C15.0645 17.1836 14.1696 18 13.0986 18H6.90135C5.83045 18 4.93546 17.1836 4.86949 16.1148L4.06888 5H3.5C3.22386 5 3 4.77614 3 4.5C3 4.22386 3.22386 4 3.5 4H7ZM8.5 7.5C8.77614 7.5 9 7.72386 9 8V14C9 14.2761 8.77614 14.5 8.5 14.5C8.22386 14.5 8 14.2761 8 14V8C8 7.72386 8.22386 7.5 8.5 7.5ZM11.5 7.5C11.7761 7.5 12 7.72386 12 8V14C12 14.2761 11.7761 14.5 11.5 14.5C11.2239 14.5 11 14.2761 11 14V8C11 7.72386 11.2239 7.5 11.5 7.5Z"
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

            {data && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} مرحله
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

export default MobileScrollerStepsTable;
