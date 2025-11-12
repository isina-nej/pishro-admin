"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import { useOrder, useUpdateOrder } from "@/hooks/api/use-orders";
import type { OrderStatus } from "@prisma/client";

const EditOrderPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { data: order, isLoading, error } = useOrder(id);
  const updateOrder = useUpdateOrder();

  const [formData, setFormData] = useState<{
    status: OrderStatus;
    paymentRef: string | null;
  }>({
    status: "PENDING",
    paymentRef: null,
  });

  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status,
        paymentRef: order.paymentRef || null,
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateOrder.mutateAsync({ id, data: formData });
      alert("سفارش با موفقیت به‌روزرسانی شد");
      router.push("/orders");
    } catch (error: any) {
      alert(error?.message || "خطا در به‌روزرسانی سفارش");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="ویرایش سفارش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p>در حال بارگذاری...</p>
        </div>
      </DefaultLayout>
    );
  }

  if (error || !order) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="ویرایش سفارش" />
        <div className="rounded-[10px] border border-stroke bg-white p-7">
          <p className="text-danger">خطا در بارگذاری سفارش</p>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="ویرایش سفارش" />

      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
        <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
          <h3 className="font-medium text-dark dark:text-white">
            ویرایش سفارش #{order.id.slice(0, 8)}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-7">
          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              وضعیت سفارش <span className="text-red">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as OrderStatus,
                }))
              }
              required
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            >
              <option value="PENDING">در انتظار پرداخت</option>
              <option value="PAID">پرداخت شده</option>
              <option value="CANCELLED">لغو شده</option>
            </select>
          </div>

          <div className="mb-5.5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              کد پرداخت
            </label>
            <input
              type="text"
              name="paymentRef"
              value={formData.paymentRef || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  paymentRef: e.target.value || null,
                }))
              }
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition focus:border-primary dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

          <div className="mb-5.5 rounded-[7px] border border-stroke bg-gray-2 p-5 dark:border-dark-3 dark:bg-dark-3">
            <h4 className="mb-3 font-medium text-dark dark:text-white">
              اطلاعات سفارش (فقط خواندنی)
            </h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-body-sm text-body">کاربر:</p>
                <p className="font-medium text-dark dark:text-white">
                  {order.user?.firstName} {order.user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-body-sm text-body">مبلغ کل:</p>
                <p className="font-medium text-dark dark:text-white">
                  {order.total.toLocaleString("fa-IR")} تومان
                </p>
              </div>
              <div>
                <p className="text-body-sm text-body">تاریخ ایجاد:</p>
                <p className="font-medium text-dark dark:text-white">
                  {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push("/orders")}
              className="rounded bg-gray px-6 py-2.5 font-medium text-dark hover:bg-opacity-90"
            >
              انصراف
            </button>

            <button
              type="submit"
              disabled={updateOrder.isPending}
              className="rounded bg-primary px-6 py-2.5 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
            >
              {updateOrder.isPending ? "در حال ذخیره..." : "ذخیره"}
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default EditOrderPage;
