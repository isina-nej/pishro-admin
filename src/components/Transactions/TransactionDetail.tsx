"use client";

import React from "react";
import Link from "next/link";
import type { TransactionWithRelations } from "@/types/api";

interface TransactionDetailProps {
  transaction: TransactionWithRelations;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ transaction }) => {
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
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          جزئیات تراکنش #{transaction.id.slice(0, 8)}
        </h3>
      </div>

      <div className="p-7">
        <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
          {/* Transaction ID */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شناسه تراکنش
            </label>
            <p className="font-medium text-dark dark:text-white">
              #{transaction.id.slice(0, 8)}
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت
            </label>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${getStatusColor(transaction.status)}`}
            >
              {getStatusLabel(transaction.status)}
            </span>
          </div>

          {/* Type */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              نوع تراکنش
            </label>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${getTypeColor(transaction.type)}`}
            >
              {getTypeLabel(transaction.type)}
            </span>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              مبلغ
            </label>
            <p className="text-lg font-medium text-dark dark:text-white">
              {transaction.amount.toLocaleString("fa-IR")} تومان
            </p>
          </div>

          {/* User */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              کاربر
            </label>
            <div>
              <Link
                href={`/users/${transaction.userId}`}
                className="text-primary hover:underline"
              >
                {transaction.user?.firstName} {transaction.user?.lastName}
              </Link>
              {transaction.user?.phone && (
                <p className="text-body text-body-sm">{transaction.user.phone}</p>
              )}
              {transaction.user?.email && (
                <p className="text-body text-body-sm">{transaction.user.email}</p>
              )}
            </div>
          </div>

          {/* Order */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              سفارش مرتبط
            </label>
            {transaction.orderId ? (
              <Link
                href={`/orders/${transaction.orderId}`}
                className="text-primary hover:underline"
              >
                سفارش #{transaction.orderId.slice(0, 8)}
              </Link>
            ) : (
              <p className="text-body">-</p>
            )}
          </div>

          {/* Gateway */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              درگاه پرداخت
            </label>
            <p className="text-dark dark:text-white">
              {transaction.gateway || "-"}
            </p>
          </div>

          {/* Reference Number */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              شماره مرجع
            </label>
            <p className="text-dark dark:text-white">
              {transaction.refNumber || "-"}
            </p>
          </div>

          {/* Created At */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              تاریخ تراکنش
            </label>
            <p className="text-dark dark:text-white">
              {new Date(transaction.createdAt).toLocaleDateString("fa-IR")}
            </p>
            <p className="text-body text-body-sm">
              {new Date(transaction.createdAt).toLocaleTimeString("fa-IR")}
            </p>
          </div>
        </div>

        {/* Description */}
        {transaction.description && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              توضیحات
            </label>
            <p className="text-dark dark:text-white">
              {transaction.description}
            </p>
          </div>
        )}

        {/* Related Order Details */}
        {transaction.order && (
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              اطلاعات سفارش
            </label>
            <div className="rounded-[7px] border border-stroke p-4 dark:border-dark-3">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-body-sm text-body">شماره سفارش</p>
                  <Link
                    href={`/orders/${transaction.order.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    #{transaction.order.id.slice(0, 8)}
                  </Link>
                </div>
                <div>
                  <p className="text-body-sm text-body">مبلغ کل سفارش</p>
                  <p className="font-medium text-dark dark:text-white">
                    {transaction.order.total.toLocaleString("fa-IR")} تومان
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-body">وضعیت سفارش</p>
                  <p className="font-medium text-dark dark:text-white">
                    {transaction.order.status === "PAID"
                      ? "پرداخت شده"
                      : transaction.order.status === "PENDING"
                        ? "در انتظار پرداخت"
                        : "لغو شده"}
                  </p>
                </div>
                <div>
                  <p className="text-body-sm text-body">تاریخ سفارش</p>
                  <p className="font-medium text-dark dark:text-white">
                    {new Date(transaction.order.createdAt).toLocaleDateString(
                      "fa-IR",
                    )}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              {transaction.order.orderItems && transaction.order.orderItems.length > 0 && (
                <div className="mt-4">
                  <p className="mb-2 text-body-sm text-body">آیتم‌های سفارش</p>
                  <div className="rounded border border-stroke dark:border-dark-3">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                          <th className="px-3 py-2 text-body-sm font-medium text-dark dark:text-white">
                            محصول
                          </th>
                          <th className="px-3 py-2 text-body-sm font-medium text-dark dark:text-white">
                            قیمت
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {transaction.order.orderItems.map((item: any, index: number) => (
                          <tr
                            key={index}
                            className="border-t border-stroke dark:border-dark-3"
                          >
                            <td className="px-3 py-2 text-body-sm text-dark dark:text-white">
                              {item.course?.subject || `آیتم ${index + 1}`}
                            </td>
                            <td className="px-3 py-2 text-body-sm text-dark dark:text-white">
                              {item.price.toLocaleString("fa-IR")} تومان
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

        <div className="flex justify-end gap-3">
          <Link
            href="/transactions"
            className="inline-flex items-center gap-2 rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
          >
            بازگشت
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
