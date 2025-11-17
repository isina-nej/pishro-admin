"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTransactions, useDeleteTransaction } from "@/hooks/api/use-transactions";
import type { TransactionWithRelations, TransactionType, TransactionStatus } from "@/types/api";

const TransactionsTable: React.FC = () => {
  const [page, setPage] = useState(1);
  const [userId, setUserId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "">("");
  const [type, setType] = useState<TransactionType | "">("");

  const { data, isLoading, error } = useTransactions({
    page,
    limit: 10,
    userId: userId || undefined,
    orderId: orderId || undefined,
    status: status || undefined,
    type: type || undefined,
  });

  const deleteTransaction = useDeleteTransaction();

  const handleDelete = async (id: string) => {
    if (window.confirm("آیا از حذف این تراکنش اطمینان دارید؟")) {
      try {
        await deleteTransaction.mutateAsync(id);
      } catch (error) {
        console.error("خطا در حذف تراکنش:", error);
      }
    }
  };

  if (error) {
    return (
      <div className="rounded-[10px] border border-stroke bg-white p-4">
        <p className="text-danger">خطا در بارگذاری تراکنش‌ها</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-[#219653]/[0.08] text-[#219653]";
      case "PENDING":
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
      case "FAILED":
        return "bg-[#D34053]/[0.08] text-[#D34053]";
      default:
        return "bg-gray/[0.08] text-body";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "موفق";
      case "PENDING":
        return "در انتظار";
      case "FAILED":
        return "ناموفق";
      default:
        return status;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "bg-[#3C50E0]/[0.08] text-[#3C50E0]";
      case "REFUND":
        return "bg-[#10B981]/[0.08] text-[#10B981]";
      case "WITHDRAWAL":
        return "bg-[#F59E0B]/[0.08] text-[#F59E0B]";
      default:
        return "bg-gray/[0.08] text-body";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PAYMENT":
        return "پرداخت";
      case "REFUND":
        return "بازگشت وجه";
      case "WITHDRAWAL":
        return "برداشت";
      default:
        return type;
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <h3 className="font-medium text-dark dark:text-white">لیست تراکنش‌ها</h3>
      </div>

      {/* Filters */}
      <div className="border-b border-stroke px-4 py-4 dark:border-dark-3 sm:px-7.5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              شناسه کاربر
            </label>
            <input
              type="text"
              placeholder="جستجو بر اساس شناسه کاربر"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full rounded border border-stroke bg-gray px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              شناسه سفارش
            </label>
            <input
              type="text"
              placeholder="جستجو بر اساس شناسه سفارش"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full rounded border border-stroke bg-gray px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TransactionStatus | "")}
              className="w-full rounded border border-stroke bg-gray px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">همه</option>
              <option value="SUCCESS">موفق</option>
              <option value="PENDING">در انتظار</option>
              <option value="FAILED">ناموفق</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-body-sm font-medium text-dark dark:text-white">
              نوع تراکنش
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType | "")}
              className="w-full rounded border border-stroke bg-gray px-4 py-2 text-dark outline-none focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="">همه</option>
              <option value="PAYMENT">پرداخت</option>
              <option value="REFUND">بازگشت وجه</option>
              <option value="WITHDRAWAL">برداشت</option>
            </select>
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
                  <th className="min-w-[150px] px-4 py-4 font-medium text-dark dark:text-white">
                    کاربر
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    سفارش
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    نوع
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    مبلغ
                  </th>

                  <th className="min-w-[100px] px-4 py-4 font-medium text-dark dark:text-white">
                    وضعیت
                  </th>

                  <th className="min-w-[120px] px-4 py-4 font-medium text-dark dark:text-white">
                    تاریخ تراکنش
                  </th>

                  <th className="px-4 py-4 font-medium text-dark dark:text-white">
                    عملیات
                  </th>
                </tr>
              </thead>

              <tbody>
                {data?.items?.map(
                  (transaction: TransactionWithRelations, index: number) => (
                    <tr key={transaction.id}>
                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {transaction.user?.firstName} {transaction.user?.lastName}
                        </p>
                        <p className="text-body text-body-sm">
                          {transaction.user?.phone}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        {transaction.orderId ? (
                          <Link
                            href={`/orders/${transaction.orderId}`}
                            className="text-primary hover:underline"
                          >
                            #{transaction.orderId.slice(0, 8)}
                          </Link>
                        ) : (
                          <span className="text-body">-</span>
                        )}
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${getTypeColor(transaction.type)}`}
                        >
                          {getTypeLabel(transaction.type)}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="font-medium text-dark dark:text-white">
                          {transaction.amount.toLocaleString("fa-IR")} تومان
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${getStatusColor(transaction.status)}`}
                        >
                          {getStatusLabel(transaction.status)}
                        </span>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <p className="text-dark dark:text-white">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </p>
                        <p className="text-body text-body-sm">
                          {new Date(transaction.createdAt).toLocaleTimeString(
                            "fa-IR",
                          )}
                        </p>
                      </td>

                      <td
                        className={`border-[#eee] px-4 py-4 dark:border-dark-3 ${index === data.items.length - 1 ? "border-b-0" : "border-b"}`}
                      >
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/transactions/${transaction.id}`}
                            className="hover:text-primary"
                            title="مشاهده جزئیات"
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

                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="hover:text-danger"
                            title="حذف"
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
                                d="M8.5 3.5C8.5 3.22386 8.72386 3 9 3H11C11.2761 3 11.5 3.22386 11.5 3.5V4H8.5V3.5ZM7 4V3.5C7 2.39543 7.89543 1.5 9 1.5H11C12.1046 1.5 13 2.39543 13 3.5V4H16C16.4142 4 16.75 4.33579 16.75 4.75C16.75 5.16421 16.4142 5.5 16 5.5H15.1667L14.4156 16.6156C14.3366 17.6746 13.4542 18.5 12.3934 18.5H7.60656C6.54583 18.5 5.66339 17.6746 5.58443 16.6156L4.83333 5.5H4C3.58579 5.5 3.25 5.16421 3.25 4.75C3.25 4.33579 3.58579 4 4 4H7ZM6.33851 5.5L7.08072 16.5385C7.10386 16.8211 7.33906 17 7.60656 17H12.3934C12.6609 17 12.8961 16.8211 12.9193 16.5385L13.6615 5.5H6.33851Z"
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
                  نمایش {data.items.length} از {data.pagination.total} تراکنش
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

export default TransactionsTable;
