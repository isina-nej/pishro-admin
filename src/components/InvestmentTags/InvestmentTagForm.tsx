"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useCreateInvestmentTag,
  useUpdateInvestmentTag,
  useInvestmentTag,
  useInvestmentPlans,
} from "@/hooks/api/use-investment-plans";
import type { CreateInvestmentTagRequest } from "@/types/api";

interface InvestmentTagFormProps {
  tagId?: string;
  isEdit?: boolean;
}

const InvestmentTagForm: React.FC<InvestmentTagFormProps> = ({
  tagId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createTag = useCreateInvestmentTag();
  const updateTag = useUpdateInvestmentTag();
  const { data: tagData } = useInvestmentTag(tagId || "");
  const { data: investmentPlansData } = useInvestmentPlans();

  const [formData, setFormData] = useState<CreateInvestmentTagRequest>({
    investmentPlansId: "",
    title: "",
    color: "",
    icon: "",
    order: 0,
    published: true,
  });

  useEffect(() => {
    if (isEdit && tagData) {
      const tag = tagData;
      setFormData({
        investmentPlansId: tag.investmentPlansId,
        title: tag.title,
        color: tag.color || "",
        icon: tag.icon || "",
        order: tag.order,
        published: tag.published,
      });
    } else if (!isEdit && investmentPlansData?.items?.[0]?.id) {
      setFormData((prev) => ({
        ...prev,
        investmentPlansId: investmentPlansData.items[0].id,
      }));
    }
  }, [isEdit, tagData, investmentPlansData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && tagId) {
        await updateTag.mutateAsync({ id: tagId, data: formData });
        alert("تگ با موفقیت به‌روزرسانی شد");
      } else {
        await createTag.mutateAsync(formData);
        alert("تگ با موفقیت ایجاد شد");
      }
      router.push("/investment-tags");
    } catch (error: any) {
      alert(error?.message || "خطا در ذخیره تگ");
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
          {isEdit ? "ویرایش تگ سرمایه‌گذاری" : "افزودن تگ سرمایه‌گذاری جدید"}
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

        {/* Title */}
        <div className="mb-5.5">
          <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
            عنوان تگ <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="مثال: ریسک پایین، سود بالا"
            className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-5.5 md:grid-cols-3">
          {/* Color */}
          <div>
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              رنگ
            </label>
            <input
              type="text"
              name="color"
              value={formData.color || ""}
              onChange={handleChange}
              placeholder="مثال: #FF5733 یا bg-blue-500"
              className="w-full rounded-[7px] border-[1.5px] border-stroke bg-transparent px-5.5 py-3 text-dark outline-none transition placeholder:text-dark-6 focus:border-primary active:border-primary disabled:cursor-default dark:border-dark-3 dark:bg-dark-2 dark:text-white"
            />
          </div>

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
              placeholder="مثال: Check, Star, TrendingUp"
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

        {/* Color Preview */}
        {formData.color && (
          <div className="mb-5.5 mt-5">
            <label className="mb-3 block text-body-sm font-medium text-dark dark:text-white">
              پیش‌نمایش رنگ
            </label>
            <div
              className="h-12 w-24 rounded border border-stroke"
              style={{ background: formData.color }}
            />
          </div>
        )}

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
              انتشار تگ
            </span>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createTag.isPending || updateTag.isPending}
            className="flex justify-center rounded-[7px] bg-primary px-6 py-[7px] font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
          >
            {isEdit ? "به‌روزرسانی" : "ایجاد"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/investment-tags")}
            className="flex justify-center rounded-[7px] border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
          >
            انصراف
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestmentTagForm;
