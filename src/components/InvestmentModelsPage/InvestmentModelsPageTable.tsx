"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useInvestmentModelsPages, useDeleteInvestmentModelsPage } from "@/hooks/api/use-investment-models-page";
import { toast } from "sonner";

const InvestmentModelsPageTable: React.FC = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useInvestmentModelsPages({ page, limit: 10 });
  const deletePage = useDeleteInvestmentModelsPage();

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این صفحه اطمینان دارید؟ حذف این صفحه تمام مدل‌های مرتبط را نیز حذف می‌کند.")) {
      try {
        await deletePage.mutateAsync(id);
        toast.success("صفحه با موفقیت حذف شد");
      } catch (error) {
        toast.error("خطا در حذف صفحه");
        console.error(error);
      }
    }
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1">
        <p className="text-danger">خطا در بارگذاری صفحات مدل‌های سرمایه‌گذاری</p>
      </div>
    );
  }

  const pages = Array.isArray(data?.data) ? data.data : (data?.data?.items || []);
  const totalPages = data?.data?.pagination?.totalPages || 1;

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            صفحات مدل‌های سرمایه‌گذاری
          </h3>

          <Link
            href="/investment-models-page/create"
            className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
          >
            + افزودن صفحه
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
                  <th className="min-w-[200px] px-4 py-4 font-medium text-dark dark:text-white">
                    عنوان اطلاعات اضافی
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت انتشار
                  </th>
                  <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                    تاریخ ایجاد
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {pages.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center">
                      هیچ صفحه‌ای یافت نشد
                    </td>
                  </tr>
                ) : (
                  pages.map((pageItem: any, index: number) => (
                    <tr key={pageItem.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === pages.length - 1 ? "border-b-0" : "border-b"
                        }`}
                      >
                        <p className="text-dark dark:text-white">
                          {pageItem.additionalInfoTitle || "بدون عنوان"}
                        </p>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === pages.length - 1 ? "border-b-0" : "border-b"
                        }`}
                      >
                        <span
                          className={`inline-flex rounded px-2.5 py-0.5 text-sm ${
                            pageItem.published
                              ? "bg-success/10 text-success"
                              : "bg-warning/10 text-warning"
                          }`}
                        >
                          {pageItem.published ? "منتشر شده" : "پیش‌نویس"}
                        </span>
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === pages.length - 1 ? "border-b-0" : "border-b"
                        }`}
                      >
                        {new Date(pageItem.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                          index === pages.length - 1 ? "border-b-0" : "border-b"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/investment-models-page/edit/${pageItem.id}`}
                            className="text-primary hover:underline"
                          >
                            ویرایش
                          </Link>
                          <button
                            onClick={() => handleDelete(pageItem.id)}
                            className="text-danger hover:underline"
                            disabled={deletePage.isPending}
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded bg-gray px-3 py-1 text-sm disabled:opacity-50"
                >
                  قبلی
                </button>
                <span className="text-sm">
                  صفحه {page} از {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded bg-gray px-3 py-1 text-sm disabled:opacity-50"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvestmentModelsPageTable;
