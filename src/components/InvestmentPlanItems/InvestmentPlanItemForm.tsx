"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentPlanItem,
  useUpdateInvestmentPlanItem,
  useInvestmentPlanItem,
  useInvestmentPlans,
} from "@/hooks/api/use-investment-plans";
import type { CreateInvestmentPlanRequest } from "@/types/api";

interface InvestmentPlanItemFormProps {
  planId?: string;
  isEdit?: boolean;
}

const InvestmentPlanItemForm: React.FC<InvestmentPlanItemFormProps> = ({
  planId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createPlan = useCreateInvestmentPlanItem();
  const updatePlan = useUpdateInvestmentPlanItem();
  const { data: planData } = useInvestmentPlanItem(planId || "");
  const { data: investmentPlansData } = useInvestmentPlans();

  const [formData, setFormData] = useState<CreateInvestmentPlanRequest>({
    investmentPlansId: "",
    label: "",
    icon: "",
    description: "",
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && planData) {
      const plan = planData;
      setFormData({
        investmentPlansId: plan.investmentPlansId,
        label: plan.label,
        icon: plan.icon || "",
        description: plan.description || "",
        order: plan.order,
        published: plan.published,
      });
    } else if (!isEdit && investmentPlansData?.items?.[0]?.id) {
      setFormData((prev) => ({
        ...prev,
        investmentPlansId: investmentPlansData.items[0].id,
      }));
    }
  }, [isEdit, planData, investmentPlansData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && planId) {
        await updatePlan.mutateAsync({ id: planId, data: formData });
        alert("سبد سرمایه‌گذاری با موفقیت به‌روزرسانی شد");
      } else {
        await createPlan.mutateAsync(formData);
        alert("سبد سرمایه‌گذاری با موفقیت ایجاد شد");
      }
      router.push("/investment-plan-items");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره سبد سرمایه‌گذاری");
      console.error(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value) || 0
            : value,
    }));
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark">
      <div className="border-b border-stroke px-7 py-4 dark:border-dark-3">
        <h3 className="font-medium text-dark dark:text-white">
          {isEdit ? "ویرایش سبد سرمایه‌گذاری" : "افزودن سبد سرمایه‌گذاری جدید"}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="p-7">
        {/* Investment Plans Selection */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            صفحه سبدهای سرمایه‌گذاری <span className="text-red">*</span>
          </label>
          <select
            name="investmentPlansId"
            value={formData.investmentPlansId}
            onChange={handleChange}
            required
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            <option value="">انتخاب کنید</option>
            {investmentPlansData?.items?.map((page: any) => (
              <option key={page.id} value={page.id}>
                {page.title || page.id}
              </option>
            ))}
          </select>
        </div>

        {/* Label */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان سبد <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            required
            placeholder="مثال: ارز دیجیتال، بورس، ترکیبی"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-2">
          {/* Icon */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              آیکون
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon || ""}
              onChange={handleChange}
              placeholder="مثال: Bitcoin, LineChart, PieChart"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
            <p className="mt-1 text-body-xs text-dark-6">
              نام آیکون از Lucide React
            </p>
          </div>

          {/* Order */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              ترتیب نمایش
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-5.5 mt-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            توضیحات
          </label>
          <textarea
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows={4}
            placeholder="توضیحات درباره این نوع سبد سرمایه‌گذاری"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        {/* Published */}
        <div className="mb-5.5">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="sr-only"
            />
            <div
              className={`flex h-5 w-5 items-center justify-center rounded border ${
                formData.published
                  ? "border-primary bg-primary"
                  : "border-stroke dark:border-dark-3"
              }`}
            >
              {formData.published && (
                <svg
                  className="h-3.5 w-3.5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-body-sm font-medium text-dark dark:text-white">
              انتشار سبد
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createPlan.isPending || updatePlan.isPending}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isEdit ? "به‌روزرسانی" : "ایجاد"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/investment-plan-items")}
            className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentPlanItemForm;
