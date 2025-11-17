"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useCertificates,
  useDeleteCertificate,
} from "@/hooks/api/use-about-page";
import { toast } from "sonner";
import type { Certificate } from "@/types/api";
import Image from "next/image";

const CertificatesTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useCertificates({
    page,
    limit: 10,
    search,
  });
  const deleteCertificate = useDeleteCertificate();

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این گواهینامه اطمینان دارید؟")) {
      try {
        await deleteCertificate.mutateAsync(id);
        toast.success("گواهینامه با موفقیت حذف شد");
      } catch (error) {
        toast.error("خطا در حذف گواهینامه");
        console.error(error);
      }
    }
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1">
        <p className="text-danger">خطا در بارگذاری گواهینامه‌ها</p>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-dark dark:text-white">
            گواهینامه‌ها و افتخارات (درباره ما)
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
              href="/certificates/create"
              className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
            >
              + افزودن گواهینامه
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
                    عنوان
                  </th>
                  <th className="min-w-[300px] px-4 py-4 font-medium text-dark dark:text-white">
                    توضیحات
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    تصویر
                  </th>
                  <th className="min-w-[80px] px-4 py-4 font-medium text-dark dark:text-white">
                    ترتیب
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>
                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map((cert: Certificate, index: number) => (
                  <tr key={cert.id}>
                    <td
                      className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                        index === data.items.length - 1
                          ? "border-b-0"
                          : "border-b"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {cert.image && (
                          <Image
                            src={cert.image}
                            alt={cert.title}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded object-cover"
                          />
                        )}
                        <h5 className="font-medium text-dark dark:text-white">
                          {cert.title}
                        </h5>
                      </div>
                    </td>

                    <td
                      className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                        index === data.items.length - 1
                          ? "border-b-0"
                          : "border-b"
                      }`}
                    >
                      <p className="line-clamp-2 text-dark dark:text-white">
                        {cert.description || "-"}
                      </p>
                    </td>

                    <td
                      className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                        index === data.items.length - 1
                          ? "border-b-0"
                          : "border-b"
                      }`}
                    >
                      <p className="text-body-sm text-dark dark:text-white">
                        {cert.image ? "✓" : "-"}
                      </p>
                    </td>

                    <td
                      className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${
                        index === data.items.length - 1
                          ? "border-b-0"
                          : "border-b"
                      }`}
                    >
                      <p className="text-dark dark:text-white">{cert.order}</p>
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
                          cert.published
                            ? "bg-[#219653]/[0.08] text-[#219653]"
                            : "bg-[#D34053]/[0.08] text-[#D34053]"
                        }`}
                      >
                        {cert.published ? "منتشر شده" : "پیش‌نویس"}
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
                          href={`/certificates/edit/${cert.id}`}
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
                          onClick={() => handleDelete(cert.id)}
                          className="hover:text-danger"
                          title="حذف"
                        >
                          <svg
                            className="fill-current"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                          >
                            <path d="M8.5 2C8.22386 2 8 2.22386 8 2.5V3H4.5C4.22386 3 4 3.22386 4 3.5C4 3.77614 4.22386 4 4.5 4H5V16C5 17.1046 5.89543 18 7 18H13C14.1046 18 15 17.1046 15 16V4H15.5C15.7761 4 16 3.77614 16 3.5C16 3.22386 15.7761 3 15.5 3H12V2.5C12 2.22386 11.7761 2 11.5 2H8.5ZM6 4H14V16C14 16.5523 13.5523 17 13 17H7C6.44772 17 6 16.5523 6 16V4ZM8 6C8 5.72386 8.22386 5.5 8.5 5.5C8.77614 5.5 9 5.72386 9 6V15C9 15.2761 8.77614 15.5 8.5 15.5C8.22386 15.5 8 15.2761 8 15V6ZM11 6C11 5.72386 11.2239 5.5 11.5 5.5C11.7761 5.5 12 5.72386 12 6V15C12 15.2761 11.7761 15.5 11.5 15.5C11.2239 15.5 11 15.2761 11 15V6Z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {data && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-body text-body-sm">
                  نمایش {data.items.length} از {data.pagination.total} گواهینامه
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

export default CertificatesTable;
