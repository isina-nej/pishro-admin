"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useOrder } from "@/hooks/api/use-orders";

const OrderDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: order, isLoading, error } = useOrder(id);

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات سفارش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !order) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="جزئیات سفارش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری سفارش</p>
        </div>
      </DefaultLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-[#219653]/[0.08] text-[#219653]";
      case "PENDING":
        return "bg-[#FFA70B]/[0.08] text-[#FFA70B]";
      case "CANCELLED":
        return "bg-[#D34053]/[0.08] text-[#D34053]";
      default:
        return "bg-gray/[0.08] text-body";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PAID":
        return "پرداخت شده";
      case "PENDING":
        return "در انتظار پرداخت";
      case "CANCELLED":
        return "لغو شده";
      default:
        return status;
    }
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="جزئیات سفارش" />

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-dark dark:text-white">
              اطلاعات سفارش #{order.id.slice(0, 8)}
            </h3>
            <Link
              href={`/orders/edit/${order.id}`}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
            >
              <svg
                className="fill-current"
                width="16"
                height="16"
                viewBox="0 0 20 20"
              >
                <path d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z" />
                <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" />
              </svg>
              ویرایش
            </Link>
          </div>
        </div>

        <div className="p-7">
          <div className="mb-5.5 grid grid-cols-1 gap-5.5 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                شماره سفارش
              </label>
              <p className="font-medium text-dark dark:text-white">
                #{order.id.slice(0, 8)}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                وضعیت
              </label>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-body-sm font-medium ${getStatusColor(order.status)}`}
              >
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                کاربر
              </label>
              <p className="text-dark dark:text-white">
                {order.user?.firstName} {order.user?.lastName}
              </p>
              {order.user?.phone && (
                <p className="text-body text-body-sm">{order.user.phone}</p>
              )}
              {order.user?.email && (
                <p className="text-body text-body-sm">{order.user.email}</p>
              )}
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                مبلغ کل
              </label>
              <p className="font-medium text-dark dark:text-white">
                {order.total.toLocaleString("fa-IR")} تومان
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                کد پرداخت
              </label>
              <p className="text-dark dark:text-white">
                {order.paymentRef || "-"}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تاریخ ایجاد
              </label>
              <p className="text-dark dark:text-white">
                {new Date(order.createdAt).toLocaleDateString("fa-IR")}
              </p>
            </div>
          </div>

          {order.orderItems && order.orderItems.length > 0 && (
            <div className="mb-5.5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                آیتم‌های سفارش
              </label>
              <div className="rounded-[7px] border border-stroke dark:border-dark-3">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        محصول
                      </th>
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        قیمت
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className="border-t border-stroke dark:border-dark-3"
                      >
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {item.course?.subject || `آیتم ${index + 1}`}
                        </td>
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {item.price.toLocaleString("fa-IR")} تومان
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {order.transactions && order.transactions.length > 0 && (
            <div className="mb-5.5">
              <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
                تراکنش‌ها
              </label>
              <div className="rounded-[7px] border border-stroke dark:border-dark-3">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F7F9FC] text-right dark:bg-dark-2">
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        نوع
                      </th>
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        مبلغ
                      </th>
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        وضعیت
                      </th>
                      <th className="px-4 py-3 font-medium text-dark dark:text-white">
                        تاریخ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.transactions.map((transaction: any) => (
                      <tr
                        key={transaction.id}
                        className="border-t border-stroke dark:border-dark-3"
                      >
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {transaction.type}
                        </td>
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {transaction.amount.toLocaleString("fa-IR")} تومان
                        </td>
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {transaction.status}
                        </td>
                        <td className="px-4 py-3 text-dark dark:text-white">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
            >
              بازگشت
            </Link>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default OrderDetailPage;
